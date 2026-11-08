"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { demoMusicians } from "@/lib/demo-data";
export function DemoProfile() {
  const params = useSearchParams();
  const musician = demoMusicians.find((m) => m.id === params.get("profile"));
  if (!musician)
    return (
      <div className="page-container empty-state">
        <h1>Demo profile not found</h1>
        <Link className="button primary" href="/musicians">
          Back to musicians
        </Link>
      </div>
    );
  return (
    <>
      <div className="profile-cover">
        <Image
          src="/images/concert.jpg"
          alt="Concert stage and audience"
          fill
          sizes="100vw"
          priority
        />
        <div className="hero-shade" />
      </div>
      <div className="page-container profile-content">
        <Link className="text-link" href="/musicians">
          ← Back to musicians
        </Link>
        <div className="profile-heading">
          <div className="profile-avatar">
            <Image
              src={`/images/${musician.image}.jpg`}
              alt={`Illustrative ${musician.instrument.toLowerCase()} photo`}
              fill
              sizes="140px"
            />
          </div>
          <div>
            <p className="eyebrow">DEMONSTRATION PROFILE</p>
            <h1>{musician.name}</h1>
            <p>
              {musician.location} <span className="separator">·</span>
              <span className="role">{musician.role}</span>
            </p>
            <div className="tags">
              {musician.genres.map((g) => (
                <span key={g}>{g}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="demo-notice">
          This is a fictional profile from the design. Photography is
          illustrative. Contact and invitations are not available in this
          preview.
        </p>
        <div className="profile-columns">
          <section className="panel">
            <p className="eyebrow">ARTIST OVERVIEW</p>
            <h2>About {musician.name.split(" ")[0]}</h2>
            <p>
              A sample {musician.role.toLowerCase()} profile showcasing the
              MusicBandFinder layout. Published member biographies and
              portfolios will appear here when live profiles are connected.
            </p>
            <h3>Musical styles</h3>
            <div className="tags">
              {musician.genres.map((g) => (
                <span key={g}>{g}</span>
              ))}
            </div>
          </section>
          <aside className="panel">
            <p className="eyebrow">INSTRUMENTS & ROLES</p>
            <h3>Instrument</h3>
            <div className="tags">
              <span>{musician.instrument}</span>
            </div>
            <h3>Primary Role</h3>
            <p className="role">{musician.role}</p>
            <h3>Sample Availability</h3>
            <p>
              {musician.available ? "Available for Projects" : "Currently Busy"}
            </p>
          </aside>
        </div>
        <section className="section">
          <p className="eyebrow">LIVE SHOWCASE</p>
          <h2>Performance Portfolio</h2>
          <div className="empty-state">
            <h3>No performances in this preview</h3>
            <p>Real members will be able to showcase their music here.</p>
          </div>
        </section>
      </div>
    </>
  );
}
