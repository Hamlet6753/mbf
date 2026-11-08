import Link from "next/link";
import Image from "next/image";
import type { Musician } from "@/lib/demo-data";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="MusicBandFinder home">
      <span className="brand-mark" aria-hidden="true">
        ♫
      </span>
      <span>MusicBandFinder</span>
      {process.env.NEXT_PUBLIC_APP_ENV !== "prod" && (
        <span className="environment-badge">DEV</span>
      )}
    </Link>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <Brand />
      <nav aria-label="Main navigation">
        <Link href="/musicians">Find Musicians</Link>
        <Link href="/#bands">Find Bands</Link>
        <Link href="/#roles">Open Roles</Link>
        <Link href="/#how-it-works">How It Works</Link>
      </nav>
      <Link className="button primary header-cta" href="/musicians">
        Explore Musicians
      </Link>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Brand />
          <p>
            Find your people. Make your music.
            <br />A space for musicians and bands to connect.
          </p>
        </div>
        <div>
          <h3>DIRECTORY</h3>
          <Link href="/musicians">Find Musicians</Link>
          <Link href="/#bands">Find Bands</Link>
          <Link href="/#roles">Open Roles</Link>
        </div>
        <div>
          <h3>DISCOVER</h3>
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/#showcase">Performance Showcase</Link>
        </div>
        <div className="footer-note">
          <h3>LET US BUILD SOMETHING</h3>
          <p>Your next bandmate could be one connection away.</p>
          <Link href="/musicians" className="text-link">
            Explore the directory <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 MusicBandFinder</span>
        <span>Design preview · Demo profiles and illustrative photography</span>
      </div>
    </footer>
  );
}

export function SectionTitle({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-title">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{children}</h2>
    </div>
  );
}

export function MusicianCard({ musician }: { musician: Musician }) {
  return (
    <article className="musician-card">
      <div className="card-image">
        <Image
          src={`/images/${musician.image}.jpg`}
          alt={`Illustrative ${musician.instrument.toLowerCase()} photograph`}
          fill
          sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw"
        />
        <span className={`status ${musician.available ? "available" : ""}`}>
          <span aria-hidden="true" />
          {musician.available ? "Available" : "Busy"}
        </span>
      </div>
      <div className="card-body">
        <h3>{musician.name}</h3>
        <p className="role">{musician.role}</p>
        <p className="location">{musician.location}</p>
        <div className="tags">
          {musician.genres.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </div>
      </div>
      <Link
        className="card-link"
        href={`/musicians/demo?profile=${musician.id}`}
      >
        View Demo Profile <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
