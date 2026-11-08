"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadLookups, placeLabel, type Lookups } from "@/lib/musicians";
export function QuickSearch() {
  const [options, setOptions] = useState<Lookups | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    void loadLookups()
      .then((data) => {
        if (active) setOptions(data);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);
  if (failed)
    return (
      <div className="quick-search">
        <p>Quick search could not load.</p>
        <Link href="/musicians" className="text-link">
          Open Musician Directory
        </Link>
      </div>
    );
  return (
    <form className="quick-search" action="/musicians">
      <label>
        GENRE
        <select name="genre" defaultValue="" disabled={!options}>
          <option value="">All Genres</option>
          {options?.genres.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        INSTRUMENT
        <select name="instrument" defaultValue="" disabled={!options}>
          <option value="">All Instruments</option>
          {options?.instruments.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        LOCATION
        <select name="place" defaultValue="" disabled={!options}>
          <option value="">Any Location</option>
          {options?.places.map((p) => (
            <option key={p.id} value={p.id}>
              {placeLabel(p)}
            </option>
          ))}
        </select>
      </label>
      <label>
        AVAILABILITY
        <select name="available" defaultValue="">
          <option value="">Any Availability</option>
          <option value="true">Available for Projects</option>
        </select>
      </label>
      <button
        className="button primary search-submit"
        type="submit"
        disabled={!options}
      >
        Search <span aria-hidden="true">⌕</span>
      </button>
    </form>
  );
}
