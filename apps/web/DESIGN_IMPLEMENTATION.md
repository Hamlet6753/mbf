# MBF interface preview

Implemented from the user-supplied Figma CSS export and eight reference screenshots.

## Run locally

From the repository root:

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. For a production check, run `npm run build`, then `npm run start --workspace=apps/web`.

## Current scope

- `/`: responsive homepage, directory search form, featured musicians, illustrative hiring bands, process, showcase and footer.
- `/musicians`: client-side filtering by text/location, genre, instrument and availability; sort by name/availability; grid/list views; mobile filter disclosure; empty state and reset.
- `/musicians/demo?profile=sena-park`: sample profile detail. Profile IDs are defined in `src/lib/demo-data.ts`.
- Shared navigation, musician cards, buttons, typography, colors, focus treatment and responsive layouts.
- Demo fixtures are explicitly labeled. No fabricated ratings, user counts, testimonials or verification badges are presented as real.

## Pending

Supabase is not connected. Registration, authentication, live search, real portfolios, band detail pages, applications, messaging and account actions are not implemented. Homepage band/open-role navigation currently leads to in-page preview sections. No Supabase data or schema was changed.

Stock photos are illustrative replacements, not extracted Figma assets. Layout and colors follow the supplied design, but this is not a pixel-perfect reproduction. Automated browser interaction and visual screenshot QA have not yet been performed. Filters require client JavaScript.

## Image sources

Downloaded locally from Unsplash, with no browser-time dependency on the image host:

- concert.jpg: https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee
- guitar.jpg: https://images.unsplash.com/photo-1510915361894-db8b60106cb1
- keys.jpg: https://images.unsplash.com/photo-1520523839897-bd0b52f945a0
- vocal.jpg: https://images.unsplash.com/photo-1516280440614-37939bbacd81
- drums.jpg: https://images.unsplash.com/photo-1519892300165-cb5542fb47c7

Replace these files with exported assets when available; do not imply these images identify real members.
