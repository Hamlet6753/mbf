"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";
import {
  hydratePublicProfiles,
  loadLookups,
  placeLabel,
  type Lookups,
  type Lookup,
  type ProfileView,
} from "@/lib/musicians";
import { LiveMusicianCard } from "@/components/live-musician-card";
import { readableError } from "@/lib/auth-errors";
import type { Database } from "@/lib/database.types";
const pageSize = 20;
function lookupId(value: string | null, options: Lookup[]) {
  return options.find(
    (o) =>
      String(o.id) === value || o.name.toLowerCase() === value?.toLowerCase(),
  )?.id;
}
function argsFor(
  params: URLSearchParams,
  lookups: Lookups,
): Database["public"]["Functions"]["search_musicians"]["Args"] {
  const genre = lookupId(params.get("genre"), lookups.genres);
  const instrument = lookupId(params.get("instrument"), lookups.instruments);
  const role = lookupId(params.get("role"), lookups.roles);
  const place = lookups.places.find(
    (p) => String(p.id) === params.get("place"),
  )?.id;
  return {
    ...(params.get("query")
      ? { p_query: params.get("query")!.slice(0, 200) }
      : {}),
    ...(genre ? { p_genre_ids: [genre] } : {}),
    ...(instrument ? { p_instrument_ids: [instrument] } : {}),
    ...(role ? { p_role_ids: [role] } : {}),
    ...(place ? { p_place_id: place } : {}),
    ...(params.get("available") === "true" ? { p_available: true } : {}),
    p_limit: pageSize + 1,
  };
}
export function MusicianDirectory() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.toString();
  const generation = useRef(0);
  const [lookups, setLookups] = useState<Lookups | null>(null);
  const [results, setResults] = useState<ProfileView[]>([]);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    generation.current += 1;
    async function run() {
      try {
        const options = await loadLookups();
        if (!active) return;
        setLookups(options);
        setLoading(true);
        setMoreLoading(false);
        setError("");
        const { data, error } = await getSupabase().rpc(
          "search_musicians",
          argsFor(new URLSearchParams(query), options),
        );
        if (error) throw error;
        const hydrated = await hydratePublicProfiles(
          (data ?? []).slice(0, pageSize),
        );
        if (active) {
          setResults(hydrated);
          setHasMore((data ?? []).length > pageSize);
        }
      } catch (error) {
        if (active) {
          setError(readableError(error));
          setResults([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void run();
    return () => {
      active = false;
    };
  }, [query, retry]);
  async function loadMore() {
    const requestGeneration = generation.current;
    if (!lookups || !results.length) return;
    setMoreLoading(true);
    setError("");
    try {
      const { data, error } = await getSupabase().rpc("search_musicians", {
        ...argsFor(new URLSearchParams(query), lookups),
        p_after_id: results.at(-1)!.profile.id!,
      });
      if (error) throw error;
      const rows = await hydratePublicProfiles((data ?? []).slice(0, pageSize));
      if (requestGeneration !== generation.current) return;
      setResults((old) => [...old, ...rows]);
      setHasMore((data ?? []).length > pageSize);
    } catch (error) {
      if (requestGeneration === generation.current)
        setError(readableError(error));
    } finally {
      if (requestGeneration === generation.current) setMoreLoading(false);
    }
  }
  function apply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = new URLSearchParams();
    for (const name of ["query", "genre", "instrument", "role", "place"]) {
      const value = String(data.get(name) || "").trim();
      if (value) next.set(name, value);
    }
    if (data.get("available")) next.set("available", "true");
    setFiltersOpen(false);
    router.push(`/musicians${next.size ? `?${next}` : ""}`);
  }
  function reset() {
    router.push("/musicians");
    setFiltersOpen(false);
  }
  return (
    <>
      <div className="directory-intro">
        <p className="eyebrow">FIND YOUR PEOPLE</p>
        <h1>Search Musicians &amp; Artists</h1>
        <p>
          Discover musicians by their sound, instruments, roles and
          availability.
        </p>
      </div>
      <button
        className="button secondary mobile-filter-toggle"
        aria-expanded={filtersOpen}
        aria-controls="directory-filters"
        onClick={() => setFiltersOpen(!filtersOpen)}
      >
        Filters {filtersOpen ? "−" : "+"}
      </button>
      <div className="directory-layout">
        <aside
          className={`filters-panel ${filtersOpen ? "is-open" : ""}`}
          id="directory-filters"
        >
          <form key={query + (lookups ? "ready" : "loading")} onSubmit={apply}>
            <div className="filter-heading">
              <h2>Filters</h2>
              <button type="button" className="text-link" onClick={reset}>
                Clear All
              </button>
            </div>
            <label className="filter-label">
              NAME OR USERNAME
              <input
                name="query"
                defaultValue={params.get("query") ?? ""}
                maxLength={200}
                placeholder="Search musicians"
              />
            </label>
            {lookups && (
              <>
                <label className="filter-label">
                  GENRE
                  <select
                    name="genre"
                    defaultValue={
                      lookupId(params.get("genre"), lookups.genres) ?? ""
                    }
                  >
                    <option value="">All Genres</option>
                    {lookups.genres.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="filter-label">
                  INSTRUMENT
                  <select
                    name="instrument"
                    defaultValue={
                      lookupId(params.get("instrument"), lookups.instruments) ??
                      ""
                    }
                  >
                    <option value="">All Instruments</option>
                    {lookups.instruments.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="filter-label">
                  ROLE
                  <select
                    name="role"
                    defaultValue={
                      lookupId(params.get("role"), lookups.roles) ?? ""
                    }
                  >
                    <option value="">All Roles</option>
                    {lookups.roles.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="filter-label">
                  LOCATION
                  <select name="place" defaultValue={params.get("place") ?? ""}>
                    <option value="">Any Location</option>
                    {lookups.places.map((p) => (
                      <option key={p.id} value={p.id}>
                        {placeLabel(p)}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
            <label className="availability-filter">
              <span>
                <span className="filter-caption">AVAILABILITY</span>Available
                for Projects
              </span>
              <input
                name="available"
                type="checkbox"
                role="switch"
                defaultChecked={params.get("available") === "true"}
              />
            </label>
            <button
              className="button primary full-width"
              type="submit"
              disabled={loading || !lookups}
            >
              Apply Filters
            </button>
          </form>
        </aside>
        <section aria-label="Musician results">
          <div className="results-toolbar">
            <p role="status" aria-live="polite">
              {loading
                ? "Searching..."
                : `${results.length}${hasMore ? "+" : ""} published ${results.length === 1 ? "musician" : "musicians"} loaded`}
            </p>
            <div className="view-controls" aria-label="Result layout">
              <button
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
              >
                ▦
              </button>
              <button
                aria-label="List view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                ☰
              </button>
            </div>
          </div>
          {error && (
            <div className="form-error" role="alert">
              <p>{error}</p>
              <button className="text-link" onClick={() => setRetry(retry + 1)}>
                Try Again
              </button>
            </div>
          )}
          {loading ? (
            <p className="loading-state" role="status">
              Loading musicians...
            </p>
          ) : results.length ? (
            <>
              <div
                className={`musician-grid results-grid ${view === "list" ? "list-view" : ""}`}
              >
                {results.map((r) => (
                  <LiveMusicianCard key={r.profile.id} view={r} />
                ))}
              </div>
              {hasMore && (
                <button
                  className="button secondary load-more"
                  disabled={moreLoading}
                  onClick={() => void loadMore()}
                >
                  {moreLoading ? "Loading..." : "Load More"}
                </button>
              )}
            </>
          ) : (
            !error && (
              <div className="empty-state">
                <span aria-hidden="true">♫</span>
                <h2>No musicians found yet</h2>
                <p>Try other filters, or publish your own musician profile.</p>
                <div className="actions">
                  <button className="button secondary" onClick={reset}>
                    Clear Filters
                  </button>
                  <Link className="button primary" href="/account">
                    Create Your Profile
                  </Link>
                </div>
              </div>
            )
          )}
        </section>
      </div>
    </>
  );
}
