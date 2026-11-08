"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MusicianCard } from "@/components/site";
import { demoMusicians } from "@/lib/demo-data";

type Filters = {
  query: string;
  genre: string;
  instrument: string;
  available: boolean;
};
const emptyFilters: Filters = {
  query: "",
  genre: "",
  instrument: "",
  available: false,
};

export function MusicianDirectory() {
  const params = useSearchParams();
  const initial = {
    query: params.get("query") ?? "",
    genre: params.get("genre") ?? "",
    instrument: params.get("instrument") ?? "",
    available: params.get("available") === "true",
  };
  const [draft, setDraft] = useState<Filters>(initial);
  const [filters, setFilters] = useState<Filters>(initial);
  const [sort, setSort] = useState("default");
  const [view, setView] = useState("grid");
  const [mobileFilters, setMobileFilters] = useState(false);
  const results = demoMusicians
    .filter((m) => {
      const text =
        `${m.name} ${m.role} ${m.location} ${m.genres.join(" ")}`.toLowerCase();
      return (
        text.includes(filters.query.trim().toLowerCase()) &&
        (!filters.genre || m.genres.includes(filters.genre)) &&
        (!filters.instrument || m.instrument === filters.instrument) &&
        (!filters.available || m.available)
      );
    })
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "available"
          ? Number(b.available) - Number(a.available)
          : 0,
    );
  function reset() {
    setDraft(emptyFilters);
    setFilters(emptyFilters);
    window.history.replaceState(null, "", "/musicians");
  }
  return (
    <>
      <div className="directory-intro">
        <p className="eyebrow">FIND YOUR PEOPLE</p>
        <h1>Search Musicians &amp; Artists</h1>
        <p>
          Discover session players and your next bandmates, on your wavelength.
        </p>
        <p className="demo-notice">
          Design preview · Search works with {demoMusicians.length} sample
          profiles. Live Supabase data is not connected.
        </p>
      </div>
      <button
        className="button secondary mobile-filter-toggle"
        aria-expanded={mobileFilters}
        aria-controls="directory-filters"
        onClick={() => setMobileFilters(!mobileFilters)}
      >
        Filters {mobileFilters ? "−" : "+"}
      </button>
      <div className="directory-layout">
        <aside
          className={`filters-panel ${mobileFilters ? "is-open" : ""}`}
          id="directory-filters"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFilters(draft);
              setMobileFilters(false);
              const p = new URLSearchParams();
              if (draft.query) p.set("query", draft.query);
              if (draft.genre) p.set("genre", draft.genre);
              if (draft.instrument) p.set("instrument", draft.instrument);
              if (draft.available) p.set("available", "true");
              window.history.replaceState(
                null,
                "",
                `/musicians${p.size ? `?${p}` : ""}`,
              );
            }}
          >
            <div className="filter-heading">
              <h2>Filters</h2>
              <button type="button" className="text-link" onClick={reset}>
                Clear All
              </button>
            </div>
            <label className="filter-label">
              NAME OR LOCATION
              <input
                value={draft.query}
                onChange={(e) => setDraft({ ...draft, query: e.target.value })}
                placeholder="Name, city or country"
              />
            </label>
            <fieldset className="genre-filters">
              <legend>POPULAR GENRES</legend>
              <div className="filter-chips">
                {[
                  "Metalcore",
                  "Jazz",
                  "Electronic",
                  "Progressive",
                  "Funk",
                  "Acoustic",
                ].map((g) => (
                  <button
                    type="button"
                    key={g}
                    aria-pressed={draft.genre === g}
                    className={draft.genre === g ? "selected" : ""}
                    onClick={() =>
                      setDraft({ ...draft, genre: draft.genre === g ? "" : g })
                    }
                  >
                    {g}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="filter-label">
              INSTRUMENT
              <select
                value={draft.instrument}
                onChange={(e) =>
                  setDraft({ ...draft, instrument: e.target.value })
                }
              >
                <option value="">All Instruments</option>
                {[
                  "Electric Guitar",
                  "Keyboard",
                  "Bass Guitar",
                  "Vocals",
                  "Drums",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="availability-filter">
              <span>
                <span className="filter-caption">AVAILABILITY</span>Available
                for Projects
              </span>
              <input
                type="checkbox"
                role="switch"
                checked={draft.available}
                onChange={(e) =>
                  setDraft({ ...draft, available: e.target.checked })
                }
              />
            </label>
            <button className="button primary full-width" type="submit">
              Apply Filters
            </button>
          </form>
        </aside>
        <section aria-label="Musician results">
          <div className="results-toolbar">
            <p role="status" aria-live="polite">
              <strong>{results.length}</strong> demo{" "}
              {results.length === 1 ? "musician" : "musicians"} found
            </p>
            <div className="toolbar-controls">
              <label>
                Sort by:
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="default">Featured</option>
                  <option value="name">Name A-Z</option>
                  <option value="available">Availability</option>
                </select>
              </label>
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
          </div>
          {results.length ? (
            <div
              className={`musician-grid results-grid ${view === "list" ? "list-view" : ""}`}
            >
              {results.map((m) => (
                <MusicianCard key={m.id} musician={m} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">♫</span>
              <h2>No musicians found</h2>
              <p>Try another instrument, genre or location.</p>
              <button className="button secondary" onClick={reset}>
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
