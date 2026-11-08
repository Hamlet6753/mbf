import Image from "next/image";
import Link from "next/link";
import { MusicianCard, SectionTitle } from "@/components/site";
import { demoMusicians } from "@/lib/demo-data";

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero">
        <Image
          className="hero-photo"
          src="/images/concert.jpg"
          alt="Crowd and stage lights at a live concert"
          fill
          sizes="100vw"
          priority
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">YOUR NEXT CHAPTER STARTS WITH A CONNECTION</p>
          <h1>Find Your Next Bandmate</h1>
          <p>
            Search musicians by genre, instrument, role and location. Discover
            bands looking for new members. Let your music do the talking.
          </p>
          <div className="actions">
            <Link href="/musicians" className="button primary">
              Explore Musicians <span aria-hidden="true">↗</span>
            </Link>
            <a href="#how-it-works" className="button secondary">
              How It Works
            </a>
          </div>
        </div>
      </section>
      <div className="page-container home-content">
        <form className="quick-search" action="/musicians">
          <label>
            GENRE
            <select name="genre" defaultValue="">
              <option value="">All Genres</option>
              {["Metalcore", "Jazz", "Electronic", "Funk", "Progressive"].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </label>
          <label>
            INSTRUMENT
            <select name="instrument" defaultValue="">
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
          <label>
            LOCATION
            <input name="query" placeholder="City or country" />
          </label>
          <label>
            AVAILABILITY
            <select name="available" defaultValue="">
              <option value="">Any Availability</option>
              <option value="true">Available for Projects</option>
            </select>
          </label>
          <button className="button primary search-submit" type="submit">
            Search <span aria-hidden="true">⌕</span>
          </button>
        </form>
        <div className="value-strip">
          <div>
            <span>01</span>
            <h3>Find your sound</h3>
            <p>Discover musicians who share your style.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Build your band</h3>
            <p>Make room for your next collaboration.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Take the stage</h3>
            <p>Turn a connection into something real.</p>
          </div>
        </div>
        <section className="section">
          <div className="section-heading">
            <SectionTitle eyebrow="DISCOVER YOUR NEXT COLLABORATOR">
              Featured Musicians
            </SectionTitle>
            <Link className="text-link" href="/musicians">
              View all musicians <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <p className="demo-notice">
            Design preview: these are sample profiles, with illustrative photos.
            They are not real members.
          </p>
          <div className="musician-grid featured-grid">
            {demoMusicians.slice(0, 4).map((m) => (
              <MusicianCard musician={m} key={m.id} />
            ))}
          </div>
        </section>
        <section className="section" id="bands">
          <SectionTitle eyebrow="MAKE YOUR NEXT MOVE">
            Bands Currently Hiring
          </SectionTitle>
          <div className="band-rows">
            {[
              {
                name: "Tesseract Horizon",
                style: "Modern Progressive Metal",
                city: "Manchester, UK",
                roles: "Keyboardist, Vocalist",
                initials: "TH",
              },
              {
                name: "Sunset Grid",
                style: "Synthwave / Outrun",
                city: "Paris, FR",
                roles: "Lead Guitarist",
                initials: "SG",
              },
              {
                name: "The Velvet Lounge",
                style: "Neo-Soul / Jazz",
                city: "Chicago, USA",
                roles: "Saxophonist, Double Bassist",
                initials: "VL",
              },
            ].map((b) => (
              <article className="band-row" key={b.name}>
                <span className="band-avatar" aria-hidden="true">
                  {b.initials}
                </span>
                <div>
                  <h3>{b.name}</h3>
                  <p>
                    <span className="role">{b.style}</span>
                    <span className="separator">·</span>
                    {b.city}
                  </p>
                </div>
                <div className="hiring">
                  <span className="eyebrow">DEMO OPEN POSITION</span>
                  <p>{b.roles}</p>
                </div>
                <Link className="button secondary" href="/musicians">
                  Find collaborators <span aria-hidden="true">↗</span>
                </Link>
              </article>
            ))}
          </div>
          <p className="muted small">
            Sample bands from the design. Live band listings will appear after
            the backend is connected.
          </p>
        </section>
        <section className="section" id="how-it-works">
          <div className="center-heading">
            <SectionTitle eyebrow="THE PROCESS">
              How MusicBandFinder Works
            </SectionTitle>
          </div>
          <div className="steps">
            {[
              {
                title: "Create Profile",
                text: "Tell your story. Share your instruments, genres, experience and location.",
                icon: "♧",
              },
              {
                title: "Upload Portfolio",
                text: "Give your sound a home with links to your performances and recordings.",
                icon: "↥",
              },
              {
                title: "Find Musicians",
                text: "Explore musicians by instrument, musical style and availability.",
                icon: "⌕",
              },
              {
                title: "Start Playing",
                text: "Meet your next collaborators and bring your musical ideas to life.",
                icon: "♫",
              },
            ].map((s, i) => (
              <article className="step" key={s.title}>
                <div>
                  <span className="step-icon" aria-hidden="true">
                    {s.icon}
                  </span>
                  <span className="step-number">0{i + 1}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section" id="showcase">
          <SectionTitle eyebrow="LET YOUR MUSIC SPEAK">
            Community Performance Showcase
          </SectionTitle>
          <div className="showcase-grid">
            {[
              {
                image: "drums",
                title: "Live sessions. Real connection.",
                text: "Find the people behind the performance.",
              },
              {
                image: "guitar",
                title: "A sound worth sharing.",
                text: "Make your next musical connection.",
              },
              {
                image: "keys",
                title: "Your next collaboration starts here.",
                text: "Explore musicians across genres.",
              },
            ].map((item) => (
              <Link
                href="/musicians"
                className="showcase-card"
                key={item.image}
              >
                <div className="showcase-image">
                  <Image
                    src={`/images/${item.image}.jpg`}
                    alt=""
                    fill
                    sizes="(max-width: 600px) 90vw, 33vw"
                  />
                  <span className="media-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="cta-section section" id="roles">
          <p className="eyebrow">FIND YOUR PEOPLE</p>
          <h2>Ready to Start Playing?</h2>
          <p>
            Discover your next bandmate, session player or creative partner.
            <br />
            Something great starts with playing together.
          </p>
          <Link href="/musicians" className="button primary">
            Explore Musicians <span aria-hidden="true">↗</span>
          </Link>
          <p className="small muted">
            Profile registration and live open roles are coming next.
          </p>
        </section>
      </div>
    </main>
  );
}
