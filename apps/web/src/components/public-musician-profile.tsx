"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";
import {
  hydratePublicProfiles,
  profileName,
  type ProfileView,
} from "@/lib/musicians";
import { ProfileAvatar } from "@/components/live-musician-card";
import { readableError } from "@/lib/auth-errors";
export function PublicMusicianProfile() {
  const { id } = useParams<{ id: string }>();
  const [view, setView] = useState<ProfileView | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id))) return;
        const { data, error } = await getSupabase()
          .from("public_musicians")
          .select("*")
          .eq("id", Number(id))
          .maybeSingle();
        if (error) throw error;
        const rows = await hydratePublicProfiles(data ? [data] : []);
        if (active) {
          setView(rows[0] ?? null);
          setError("");
        }
      } catch (error) {
        if (active) setError(readableError(error));
      } finally {
        if (active) {
          setLoadedId(id);
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [id, retry]);
  if (
    (loading || loadedId !== id) &&
    /^\d+$/.test(id) &&
    Number.isSafeInteger(Number(id))
  )
    return (
      <p className="page-container loading-state" role="status">
        Loading musician profile...
      </p>
    );
  if (error)
    return (
      <div className="page-container empty-state">
        <p className="form-error" role="alert">
          {error}
        </p>
        <button
          className="button secondary"
          onClick={() => setRetry(retry + 1)}
        >
          Try Again
        </button>
      </div>
    );
  if (!view || !/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)))
    return (
      <div className="page-container empty-state">
        <h1>Profile Not Available</h1>
        <p>This profile does not exist or has not been published.</p>
        <Link className="button primary" href="/musicians">
          Back to Musicians
        </Link>
      </div>
    );
  const p = view.profile;
  const name = profileName(p);
  return (
    <div className="page-container public-profile-page">
      <Link href="/musicians" className="text-link">
        ← Back to Musicians
      </Link>
      <div className="profile-heading">
        <ProfileAvatar
          className="public-profile-avatar"
          picture={p.picture}
          name={name}
        />
        <div>
          <p className="eyebrow">MUSICIAN PROFILE</p>
          <h1>{name}</h1>
          {p.username && <p>@{p.username}</p>}
          <p>{view.location}</p>
          <div className="tags">
            {view.genres.map((g) => (
              <span key={g}>{g}</span>
            ))}
          </div>
        </div>
        {p.available && (
          <span className="publication-status is-published">
            Available for Projects
          </span>
        )}
      </div>
      <div className="profile-columns">
        <section className="panel">
          <p className="eyebrow">ARTIST OVERVIEW</p>
          <h2>About {p.firstname || name}</h2>
          <p className="preserve-lines">
            {p.bio || "This musician has not added a biography yet."}
          </p>
          {p.experience && (
            <>
              <h3>Experience</h3>
              <p className="preserve-lines">{p.experience}</p>
            </>
          )}
        </section>
        <aside className="panel">
          <p className="eyebrow">INSTRUMENTS &amp; ROLES</p>
          <h3>Instruments</h3>
          <div className="tags">
            {view.instruments.map((i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
          <h3>Roles</h3>
          <div className="tags">
            {view.roles.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>
          {p.in_search && <p className="role">Looking for a band</p>}
        </aside>
      </div>
    </div>
  );
}
