import type { Database } from "@/lib/database.types";
import { getSupabase } from "@/lib/supabase/client";
export type PrivateProfile = Database["public"]["Tables"]["musicians"]["Row"];
export type PublicProfile =
  Database["public"]["Views"]["public_musicians"]["Row"];
export type Lookup = { id: number; name: string };
export type Lookups = {
  genres: Lookup[];
  instruments: Lookup[];
  roles: Lookup[];
  subgenres: (Lookup & { genre_id: number })[];
  variants: (Lookup & { instrument_id: number })[];
  places: {
    id: number;
    city: string | null;
    country_name: string | null;
    country_code: string;
  }[];
};
export type Relations = {
  genres: number[];
  subgenres: number[];
  instruments: number[];
  variants: number[];
  roles: number[];
};
export type ProfileView = {
  profile: PublicProfile;
  genres: string[];
  instruments: string[];
  roles: string[];
  location: string;
};
let lookupPromise: Promise<Lookups> | undefined;
export function loadLookups(): Promise<Lookups> {
  if (!lookupPromise)
    lookupPromise = fetchLookups().catch((error) => {
      lookupPromise = undefined;
      throw error;
    });
  return lookupPromise;
}
async function fetchLookups(): Promise<Lookups> {
  const db = getSupabase();
  const [genres, instruments, roles, subgenres, variants, places] =
    await Promise.all([
      db.from("genres").select("id,name").order("name"),
      db.from("instruments").select("id,name").order("name"),
      db.from("roles").select("id,name").eq("is_active", true).order("name"),
      db.from("subgenres").select("id,name,genre_id").order("name"),
      db
        .from("instrument_variants")
        .select("id,name,instrument_id")
        .order("name"),
      db
        .from("places")
        .select("id,city,country_name,country_code")
        .order("city"),
    ]);
  for (const r of [genres, instruments, roles, subgenres, variants, places])
    if (r.error) throw r.error;
  return {
    genres: (genres.data ?? []).map((g) => ({
      ...g,
      name: g.name || "Unnamed genre",
    })),
    instruments: instruments.data ?? [],
    roles: roles.data ?? [],
    subgenres: subgenres.data ?? [],
    variants: variants.data ?? [],
    places: places.data ?? [],
  };
}
export function placeLabel(p: Lookups["places"][number]) {
  return [p.city, p.country_name || p.country_code].filter(Boolean).join(", ");
}
export async function loadOwnProfile(userId: string) {
  const db = getSupabase();
  const [profile, genres, subgenres, instruments, variants, roles] =
    await Promise.all([
      db.from("musicians").select("*").eq("user_id", userId).single(),
      db.from("musician_genres").select("genre_id").eq("musician_id", userId),
      db
        .from("musician_subgenres")
        .select("subgenre_id")
        .eq("musician_id", userId),
      db
        .from("musician_instruments")
        .select("instrument_id")
        .eq("musician_id", userId),
      db
        .from("musician_instrument_variants")
        .select("variant_id")
        .eq("musician_id", userId),
      db.from("musician_roles").select("role_id").eq("musician_id", userId),
    ]);
  for (const r of [profile, genres, subgenres, instruments, variants, roles])
    if (r.error) throw r.error;
  return {
    profile: profile.data!,
    relations: {
      genres: (genres.data ?? []).map((r) => r.genre_id),
      subgenres: (subgenres.data ?? []).map((r) => r.subgenre_id),
      instruments: (instruments.data ?? []).map((r) => r.instrument_id),
      variants: (variants.data ?? []).map((r) => r.variant_id),
      roles: (roles.data ?? []).map((r) => r.role_id),
    },
  };
}
export async function hydratePublicProfiles(
  profiles: PublicProfile[],
): Promise<ProfileView[]> {
  const valid = profiles.filter((p) => p.id !== null);
  if (!valid.length) return [];
  const db = getSupabase();
  const ids = valid.map((p) => p.id!);
  const [lookups, genres, instruments, roles] = await Promise.all([
    loadLookups(),
    db.from("public_musician_genres").select("*").in("musician_id", ids),
    db.from("public_musician_instruments").select("*").in("musician_id", ids),
    db.from("public_musician_roles").select("*").in("musician_id", ids),
  ]);
  for (const r of [genres, instruments, roles]) if (r.error) throw r.error;
  return valid.map((profile) => ({
    profile,
    genres: (genres.data ?? [])
      .filter((r) => r.musician_id === profile.id)
      .map((r) => lookups.genres.find((g) => g.id === r.genre_id)?.name)
      .filter((n): n is string => Boolean(n)),
    instruments: (instruments.data ?? [])
      .filter((r) => r.musician_id === profile.id)
      .map(
        (r) => lookups.instruments.find((g) => g.id === r.instrument_id)?.name,
      )
      .filter((n): n is string => Boolean(n)),
    roles: (roles.data ?? [])
      .filter((r) => r.musician_id === profile.id)
      .map((r) => lookups.roles.find((g) => g.id === r.role_id)?.name)
      .filter((n): n is string => Boolean(n)),
    location: lookups.places.some((p) => p.id === profile.place_id)
      ? placeLabel(lookups.places.find((p) => p.id === profile.place_id)!)
      : "Location not specified",
  }));
}
export function profileName(p: PublicProfile) {
  return (
    [p.firstname, p.lastname].filter(Boolean).join(" ") ||
    p.username ||
    "Musician"
  );
}
export function safeAvatarUrl(value: string | null) {
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/`;
  return value?.startsWith(prefix) ? value : null;
}
