# Email authentication and musician profiles

Implemented locally on the dev branch against mbf-dev (gawblqkuodzuerzirsyr).

## User journey

1. `/signup`: email/password signup. Password is entered only by the user. Supabase sends the confirmation email.
2. `/auth/callback`: one-time PKCE code exchange, then `/account`. Open the link on the same origin/browser/device that requested it. `localhost` and `127.0.0.1` are different origins; do not switch between them mid-flow.
3. `/login`: password sign-in; confirmation resend is available. Header supports sign-out.
4. `/forgot-password`: requests a recovery email. Callback is allowlisted to `/auth/reset-password`, which updates the signed-in user's password, then redirects to `/account?password=updated` with a success notice. Recovery messages do not disclose whether an email is registered.
5. `/account`: own private profile from the existing signup trigger; editable names, username, dictionary location, biography, experience, availability, instruments/variants, roles, genres/subgenres.
6. Save privately or explicitly Save & Publish. Publishing requires a first name, valid unique username, location, genre, instrument and role. Published users may save changes or Save & Unpublish.
7. `/musicians`: live search RPC with name/username, genre, instrument, role, place and availability filters; cursor pagination; empty/loading/error states; grid/list modes.
8. `/musicians/<numeric-id>`: public profile from the safe view and public relation views. Email, account UUID and birthdate are not queried or rendered here. Homepage featured musicians are live; band listings remain labeled design examples.

## Architecture

- Pinned `@supabase/supabase-js` 2.119.0 and generated Database types.
- Browser auth uses PKCE and browser session storage, with token refresh. Client sessions are not shared across SSR requests. RLS and server-validated Supabase access tokens enforce data access; the client UI's account gate is not the authorization boundary.
- Public pages currently load live data after hydration; server-rendered profile SEO/metadata and SSR cookie sessions are not implemented in this milestone.
- `AuthProvider` observes session changes and validates an initial user via `getUser`. SDK session events are used for UI state only.
- Core forms and data access can be reused in a future client build; Capacitor still needs platform storage, navigation and deep-link adapters and a device test.
- `save_my_musician_profile` is SECURITY INVOKER, derives ownership from auth.uid, locks the own profile, validates publication and calls the existing array overload of update_musician_profile. Basic fields and all relation writes commit or roll back together. The mixed bigint/UUID relation contract is preserved.
- Avatar uploads use `avatars/<user-uuid>/<random-filename>` (bucket-relative key is `<uuid>/<filename>`), JPEG/PNG/WebP and at most 5 MiB. The client never uploads with upsert and never deletes previous images. Public bucket visibility is explained beside the uploader. Replaced/orphaned images are retained; cleanup is not implemented or authorized.
- Only public keys enter browser config. No service-role key is used by the application.

## Database deployment state

Migration `20261108190000_profile_onboarding.sql` is applied ONLY to dev. Production does not yet have the new RPC: do not deploy this feature to prod before reviewing/applying its migration there. Existing production data and settings were not changed during this feature work.

Dev Auth redirect allowlist includes localhost/127.0.0.1 callbacks and the exact recovery callback query. Email confirmation remains enabled. Supabase's default email service has recipient/rate restrictions; a custom SMTP provider has not been configured.

## Verification

- `npm run test:onboarding`: publication requirements, field limits, avatar types/sizes, callback open-redirect prevention and sanitized auth errors.
- `npm run test:env`: existing dev/prod isolation checks.
- `npm run db:test:onboarding:dev`: real PostgreSQL transaction with rollback; own-profile save, UUID relations, atomic failure, completeness, published search, privacy, outsider denial and unpublication.
- lint, dev production build and npm audit passed (0 findings).
- Local HTTP 200 checked for auth, account and directory pages.
- User reported successful signup/email confirmation, profile completion, avatar upload and saving. Read-only dev checks independently confirmed confirmed email, onboarded private profile, saved relations and one avatar object. Guest view/search correctly returned no private profile.
- User subsequently reported the publication, directory, logout/login and recovery flow worked, and requested a redirect after updating the password. Implemented redirect to the account page with a success notice. The final redirect change was validated by lint/build and code review; it has not been independently exercised through a second recovery email.
- Guest API checks independently confirmed the actual published dev profile, combined genre/instrument/role/place filtering, cursor behavior, omission of private columns and HTTP image availability.
- Both SQL rollback suites passed after updating the original isolation suite to check only its fixture instead of assuming an empty directory. No claim of automated browser E2E coverage is made.
- Automatic review rejected a proposed service-role test that would create permanent synthetic accounts and credentials. That command did not execute; no synthetic accounts/files or credential artifacts were created. Used rollback SQL and the user's manual flow instead.

The old `scripts/verify-environments.mjs` is a historical empty-dev/baseline comparison from the environment bootstrap; its zero-row and identical-schema assumptions are no longer applicable after real accounts and forward dev migrations. Use the commands above for this milestone.
