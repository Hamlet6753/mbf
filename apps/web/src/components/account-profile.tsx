"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { ProfileAvatar } from "@/components/live-musician-card";
import { getSupabase } from "@/lib/supabase/client";
import {
  loadLookups,
  loadOwnProfile,
  placeLabel,
  type Lookups,
  type PrivateProfile,
  type Relations,
  type Lookup,
} from "@/lib/musicians";
import {
  validateAvatar,
  validateProfile,
  type ProfileDraft,
} from "@/lib/profile-validation";
import { readableError } from "@/lib/auth-errors";
function MultiSelect({
  title,
  options,
  selected,
  onChange,
  disabled,
}: {
  title: string;
  options: Lookup[];
  selected: number[];
  onChange: (ids: number[]) => void;
  disabled: boolean;
}) {
  return (
    <fieldset className="option-group" disabled={disabled}>
      <legend>{title}</legend>
      {options.length ? (
        <div className="option-checks">
          {options.map((o) => (
            <label key={o.id}>
              <input
                type="checkbox"
                checked={selected.includes(o.id)}
                onChange={(e) =>
                  onChange(
                    e.target.checked
                      ? [...selected, o.id]
                      : selected.filter((id) => id !== o.id),
                  )
                }
              />
              {o.name}
            </label>
          ))}
        </div>
      ) : (
        <p className="small muted">
          Select a parent option above to see choices.
        </p>
      )}
    </fieldset>
  );
}
export function AccountProfile() {
  const params = useSearchParams();
  const { user, loading: authLoading, error: authError } = useAuth();
  const [profile, setProfile] = useState<PrivateProfile | null>(null);
  const [lookups, setLookups] = useState<Lookups | null>(null);
  const [draft, setDraft] = useState<ProfileDraft>({
    firstname: "",
    lastname: "",
    username: "",
    place_id: "",
    bio: "",
    experience: "",
    available: false,
    in_search: false,
  });
  const [relations, setRelations] = useState<Relations>({
    genres: [],
    subgenres: [],
    instruments: [],
    variants: [],
    roles: [],
  });
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    let active = true;
    void Promise.all([loadOwnProfile(userId), loadLookups()])
      .then(([own, options]) => {
        if (!active) return;
        setLoadedUserId(userId);
        setProfile(own.profile);
        setRelations(own.relations);
        setLookups(options);
        const p = own.profile;
        setDraft({
          firstname: p.firstname ?? "",
          lastname: p.lastname ?? "",
          username: p.username ?? "",
          place_id: p.place_id?.toString() ?? "",
          bio: p.bio ?? "",
          experience: p.experience ?? "",
          available: p.available ?? false,
          in_search: p.in_search ?? false,
        });
        setError("");
        setLoading(false);
      })
      .catch((error) => {
        if (active) {
          setLoadedUserId(userId);
          setProfile(null);
          setError(readableError(error));
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [userId, reload]);
  async function save(publish: boolean) {
    const invalid = validateProfile(
      draft,
      relations.genres,
      relations.instruments,
      relations.roles,
      publish,
    );
    if (invalid) {
      setError(invalid);
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { data, error } = await getSupabase().rpc(
        "save_my_musician_profile",
        {
          p_profile: { ...draft, place_id: draft.place_id || null },
          p_genres: relations.genres,
          p_subgenres: relations.subgenres,
          p_roles: relations.roles,
          p_instruments: relations.instruments,
          p_variants: relations.variants,
          p_publish: publish,
        },
      );
      if (error) throw error;
      if (!data) throw new Error("Profile was not returned");
      setProfile(data);
      setMessage(
        publish
          ? "Profile saved and published. It is now visible in the musician directory."
          : "Profile saved privately. It is hidden from the public directory.",
      );
    } catch (error) {
      setError(readableError(error));
    } finally {
      setBusy(false);
    }
  }
  async function uploadAvatar(file: File) {
    const invalid = validateAvatar(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    if (!user) return;
    setUploading(true);
    setError("");
    setMessage("");
    try {
      const ext = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      }[file.type];
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const db = getSupabase();
      const { error: uploadError } = await db.storage
        .from("avatars")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = db.storage.from("avatars").getPublicUrl(path);
      const { data, error } = await db
        .from("musicians")
        .update({ picture: publicUrl })
        .eq("user_id", user.id)
        .select("*")
        .single();
      if (error) throw error;
      setProfile(data);
      setMessage("Avatar uploaded and saved.");
    } catch (error) {
      setError(readableError(error));
    } finally {
      setUploading(false);
    }
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void save(profile?.is_published ?? false);
  }
  if (authLoading)
    return (
      <p className="loading-state" role="status">
        Checking your session...
      </p>
    );
  if (!user)
    return (
      <div className="empty-state">
        <h1>Your Musician Profile</h1>
        <p>
          {authError || "Sign in to create and manage your private profile."}
        </p>
        <Link className="button primary" href="/login">
          Sign In
        </Link>
      </div>
    );
  if (loading || loadedUserId !== user.id)
    return (
      <p className="loading-state" role="status">
        Loading your musician profile...
      </p>
    );
  if (!profile || !lookups)
    return (
      <div className="empty-state">
        <p className="form-error" role="alert">
          {error || "Your profile could not be loaded. Please try again."}
        </p>
        <button
          className="button secondary"
          onClick={() => {
            setLoading(true);
            setReload(reload + 1);
          }}
        >
          Retry
        </button>
      </div>
    );
  const disabled = busy || uploading;
  return (
    <>
      {params.get("password") === "updated" && (
        <p className="form-message" role="status">
          Password updated successfully.
        </p>
      )}
      <div className="account-heading">
        <div>
          <p className="eyebrow">YOUR SOUND. YOUR STORY.</p>
          <h1>
            {profile.is_onboarded
              ? "Edit Your Profile"
              : "Build Your Musician Profile"}
          </h1>
          <p>Your email stays private. Choose when to publish your profile.</p>
        </div>
        <span
          className={`publication-status ${profile.is_published ? "is-published" : ""}`}
        >
          {profile.is_published ? "Published" : "Private Draft"}
        </span>
      </div>
      <div className="profile-editor-layout">
        <form className="panel profile-form" onSubmit={submit}>
          <h2>About You</h2>
          <fieldset disabled={disabled} className="profile-fields">
            <div className="form-two-columns">
              <label>
                First name
                <input
                  value={draft.firstname}
                  maxLength={80}
                  onChange={(e) =>
                    setDraft({ ...draft, firstname: e.target.value })
                  }
                  autoComplete="given-name"
                />
              </label>
              <label>
                Last name
                <input
                  value={draft.lastname}
                  maxLength={80}
                  onChange={(e) =>
                    setDraft({ ...draft, lastname: e.target.value })
                  }
                  autoComplete="family-name"
                />
              </label>
            </div>
            <label>
              Username
              <input
                value={draft.username}
                maxLength={30}
                onChange={(e) =>
                  setDraft({ ...draft, username: e.target.value.toLowerCase() })
                }
                autoComplete="username"
              />
              <small>
                3-30 lowercase letters, numbers or underscores. Must be unique.
              </small>
            </label>
            <label>
              Location
              <select
                value={draft.place_id}
                onChange={(e) =>
                  setDraft({ ...draft, place_id: e.target.value })
                }
              >
                <option value="">Choose your location</option>
                {lookups.places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {placeLabel(p)}
                  </option>
                ))}
              </select>
              <small>
                Locations currently come from the shared dictionary.
              </small>
            </label>
            <label>
              Biography
              <textarea
                rows={5}
                value={draft.bio}
                maxLength={3000}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                placeholder="Tell musicians about your sound and the projects you want to join."
              />
            </label>
            <label>
              Experience
              <textarea
                rows={3}
                value={draft.experience}
                maxLength={1000}
                onChange={(e) =>
                  setDraft({ ...draft, experience: e.target.value })
                }
                placeholder="Your live or studio experience and musical background."
              />
            </label>
            <label className="inline-checkbox">
              <input
                type="checkbox"
                checked={draft.available}
                onChange={(e) =>
                  setDraft({ ...draft, available: e.target.checked })
                }
              />
              Available for projects
            </label>
            <label className="inline-checkbox">
              <input
                type="checkbox"
                checked={draft.in_search}
                onChange={(e) =>
                  setDraft({ ...draft, in_search: e.target.checked })
                }
              />
              Looking for a band
            </label>
          </fieldset>
          <MultiSelect
            title="Instruments"
            options={lookups.instruments}
            selected={relations.instruments}
            disabled={disabled}
            onChange={(ids) =>
              setRelations({
                ...relations,
                instruments: ids,
                variants: relations.variants.filter((id) =>
                  lookups.variants.some(
                    (v) => v.id === id && ids.includes(v.instrument_id),
                  ),
                ),
              })
            }
          />
          <MultiSelect
            title="Instrument Variants"
            options={lookups.variants.filter((v) =>
              relations.instruments.includes(v.instrument_id),
            )}
            selected={relations.variants}
            disabled={disabled}
            onChange={(ids) => setRelations({ ...relations, variants: ids })}
          />
          <MultiSelect
            title="Roles"
            options={lookups.roles}
            selected={relations.roles}
            disabled={disabled}
            onChange={(ids) => setRelations({ ...relations, roles: ids })}
          />
          <MultiSelect
            title="Genres"
            options={lookups.genres}
            selected={relations.genres}
            disabled={disabled}
            onChange={(ids) =>
              setRelations({
                ...relations,
                genres: ids,
                subgenres: relations.subgenres.filter((id) =>
                  lookups.subgenres.some(
                    (s) => s.id === id && ids.includes(s.genre_id),
                  ),
                ),
              })
            }
          />
          <MultiSelect
            title="Subgenres"
            options={lookups.subgenres.filter((s) =>
              relations.genres.includes(s.genre_id),
            )}
            selected={relations.subgenres}
            disabled={disabled}
            onChange={(ids) => setRelations({ ...relations, subgenres: ids })}
          />
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
          <div className="profile-save-actions">
            <button
              className="button primary"
              type="submit"
              disabled={disabled}
            >
              {busy ? "Saving..." : "Save Changes"}
            </button>
            {profile.is_published ? (
              <button
                className="button secondary"
                type="button"
                disabled={disabled}
                onClick={() => void save(false)}
              >
                Save &amp; Unpublish
              </button>
            ) : (
              <button
                className="button secondary"
                type="button"
                disabled={disabled}
                onClick={() => void save(true)}
              >
                Save &amp; Publish
              </button>
            )}
          </div>
        </form>
        <aside className="panel profile-sidebar">
          <h2>Your Profile</h2>
          <ProfileAvatar
            className="editor-avatar"
            picture={profile.picture}
            name={draft.firstname || draft.username || "Musician"}
          />
          <label className="avatar-upload">
            {uploading ? "Uploading..." : "Upload Avatar"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={disabled}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadAvatar(file);
                e.currentTarget.value = "";
              }}
            />
          </label>
          <p className="small muted">
            JPEG, PNG or WebP, up to 5 MiB. This is a public image bucket: only
            upload a photo you want to share.
          </p>
          <hr />
          <h3>Ready to publish?</h3>
          <p className="small muted">
            Add a first name, username, location, at least one genre, instrument
            and role. Publishing makes your profile discoverable.
          </p>
          {profile.is_published && (
            <Link
              className="button secondary full-width"
              href={`/musicians/${profile.id}`}
            >
              View Public Profile
            </Link>
          )}
          <Link className="text-link" href="/auth/reset-password">
            Change Password
          </Link>
        </aside>
      </div>
    </>
  );
}
