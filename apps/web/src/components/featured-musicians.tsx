"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";
import { hydratePublicProfiles, type ProfileView } from "@/lib/musicians";
import { LiveMusicianCard } from "@/components/live-musician-card";
import { readableError } from "@/lib/auth-errors";
export function FeaturedMusicians() {
  const [profiles, setProfiles] = useState<ProfileView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data, error } = await getSupabase().rpc("search_musicians", {
          p_limit: 4,
        });
        if (error) throw error;
        const rows = await hydratePublicProfiles(data ?? []);
        if (active) setProfiles(rows);
      } catch (error) {
        if (active) setError(readableError(error));
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);
  if (loading) return <p role="status">Loading published musicians...</p>;
  if (error)
    return (
      <div className="empty-state">
        <p>{error}</p>
        <Link className="text-link" href="/musicians">
          Open Musician Directory
        </Link>
      </div>
    );
  if (!profiles.length)
    return (
      <div className="empty-state">
        <h3>Your Next Bandmate Could Be Here</h3>
        <p>
          No musician profiles have been published yet. Create yours and share
          your sound.
        </p>
        <Link className="button primary" href="/account">
          Build Your Profile
        </Link>
      </div>
    );
  return (
    <div className="musician-grid featured-grid">
      {profiles.map((view) => (
        <LiveMusicianCard key={view.profile.id} view={view} />
      ))}
    </div>
  );
}
