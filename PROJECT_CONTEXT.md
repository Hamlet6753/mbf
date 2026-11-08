# MBF / MusicBandFinder - Project Context

Updated: 2026-11-08, Europe/Warsaw.
Purpose: hand off the ongoing browser ChatGPT conversation to Codex in VS Code.
This is a historical snapshot, not evidence of the current filesystem or live database state.
Inspect the local repository and relevant AGENTS.md before making changes.

## 1. User, collaboration and instructions

- Respond in Ukrainian or English. Never respond in Russian.
- Use plain ASCII punctuation, including straight quotes and ordinary hyphens.
- Explain work simply. The user is implementing the project with assistance and needs clear steps.
- Prefer doing authorized local work and checking results over asking the user to paste many commands.
- Do not claim access to browser tabs, Figma, Supabase or local files unless actually available.
- Do not request or expose passwords, access tokens, service-role keys or database passwords in chat.
- Read all applicable AGENTS.md files. The existing apps/web/AGENTS.md requires reading the relevant installed Next.js documentation before writing Next.js code.
- Do not overwrite or remove that generated AGENTS.md block merely to silence it.
- Do not assume pending tasks below were approved or completed.
- Keep existing uncommitted changes; inspect before editing. Do not force-push.
- The immediate task is restoring the local install, then continuing MBF development.

## 2. Product and agreed direction

MusicBandFinder (MBF) helps musicians find other musicians and bands.
Core concepts: musician profile, instruments, genres, roles, location, availability,
video portfolio, bands, members and roles a band is looking for.

The user explicitly requires eventual Android and iPhone applications.
The agreed working direction is:
- React + TypeScript for reusable client UI and product logic.
- Next.js for the web application and public pages.
- A separate client build packaged with Capacitor for Android/iOS.
- One shared Supabase backend.
- Shared packages for portable UI, data access and domain logic.

Important: this is a proposed architecture, not an implemented mobile application.
Do not promise that an SSR Next.js application can simply be bundled into a phone.
Keep portable screens independent of Next-specific server APIs, routing and cookies.
Authentication, storage and navigation need platform adapters.
Validate a mobile build early with the first working registration/profile flow.
A mobile application should not depend on a dev server URL.
The exact mobile bundler and workspace implementation have not yet been created.

## 3. Local project and Git

User's machine: Windows, PowerShell, VS Code.
Repository root:
C:\Users\ja\Desktop\mbf

Git remote:
https://github.com/Hamlet6753/mbf.git

Branch: main.
Confirmed initial commit: 7947e2f, "Initialize MBF web application".
That commit was successfully pushed, and origin/main was tracking correctly.
Subsequent workspace/override/lockfile changes have NOT been confirmed committed or pushed.
Inspect git status and diffs before doing anything else.

Observed local tool versions:
- Node.js v24.14.0
- npm 11.9.0

Structure already created:
- apps/web: generated Next.js application
- root package.json: later added for npm workspaces
- root .gitignore: added and committed initially

Planned, not confirmed created:
- apps/mobile
- packages/*
- supabase/* migration workflow

Initial root .gitignore:
```gitignore
node_modules/
.next/
out/
dist/
.env*
!.env.example
*.log
.DS_Store
```

## 4. Package configuration

Latest root package.json supplied to and confirmed partly by the user:
```json
{
  "name": "mbf",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=apps/web",
    "build": "npm run build --workspace=apps/web",
    "lint": "npm run lint --workspace=apps/web"
  },
  "overrides": {
    "@typescript-eslint/typescript-estree": {
      "minimatch": "11.0.1"
    }
  }
}
```

User explicitly verified that npm pkg get overrides returns the override above.

Last supplied apps/web/package.json:
```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.4.5",
    "react": "19.3.0",
    "react-dom": "19.3.0"
  },
  "devDependencies": {
    "@tailwindcss/turbopack": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.4.5",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

Read the actual files; do not silently substitute different dependency names or versions.
Build output indicated Cache Components and Partial Prefetching enabled.
Before the most recent failed reinstall, lint and production build both passed.
The only generated application pages were / and /_not-found.
The browser displayed the unmodified Next.js starter page at localhost:3000.
There is no implemented MBF frontend yet.

## 5. CURRENT BLOCKER: partially installed dependencies and Windows file locks

This is the point where work stopped.

Original npm audit:
- 8 moderate findings, all from the minimatch dependency chain used by TypeScript ESLint.
- Vulnerable installed version: minimatch 10.2.6 under @typescript-eslint/typescript-estree.
- Advisory: https://github.com/advisories/GHSA-g3hv-75wg-m249
- The advisory fetched during this conversation stated the fix is 11.0.1.
- npm audit fix --force proposed downgrading eslint-config-next to 15.5.29.
- That downgrade was NOT performed.
- A targeted root override was added instead. It is a temporary cross-major override;
  verify actual installed resolution and compatibility rather than assuming success.

The user then:
1. Deleted apps/web/package-lock.json to use one root lockfile.
2. Backed up the old root lockfile to:
   $env:TEMP\mbf-package-lock-before-reinstall.json
3. Attempted removal of apps/web/node_modules and root node_modules.
4. Deleted the root lockfile and ran npm install.

That install reported 0 vulnerabilities, but Windows could not delete loaded native files.
A later npm ci failed with EPERM while removing a leftover SWC native binary.
This left dependencies partially removed:
- npm run lint: 'eslint' is not recognized
- npm run build: 'next' is not recognized
- npm audit still reported 0 vulnerabilities, which does NOT prove a working installation.

Observed locked files included:
- apps/web/node_modules/@next/.swc-win32-x64-msvc-aEmHwuVT/next-swc.win32-x64-msvc.node
- next-swc.win32-x64-msvc.node in the normal SWC package folder
- tailwindcss-oxide.win32-x64-msvc.node
- lightningcss.win32-x64-msvc.node

A running Next/Node process is a likely cause, not a proven diagnosis.
Do not assume permissions are wrong solely from EPERM.
Do not disable antivirus, take ownership broadly or kill every node.exe indiscriminately.

Last advice to user:
- Save work and reboot Windows to release file handles.
- Open VS Code without starting npm run dev.
- Retry removal of the leftover apps/web/node_modules.
- Run npm ci using the NEW root package-lock.json.
- Only after successful install, run lint and build.

The user has NOT confirmed reboot or a successful reinstall.
They instead installed the official OpenAI Codex VS Code extension to continue with direct file access.

### First actions for the receiving Codex agent

1. Read git status, root package.json, apps/web/package.json and applicable AGENTS.md.
2. Check the current lockfile(s), installed dependencies and any project-specific Node processes.
3. Resolve the file lock using the least disruptive available method.
   Do not keep repeating failing deletion/install commands blindly.
4. Preserve the current root package-lock.json. Do not regenerate it unless a specific issue requires it.
5. Run npm ci from the root after releasing the lock.
6. Verify npm ls minimatch, npm audit, npm run lint and npm run build.
7. Confirm the override is actually effective and not incompatible.
8. Only then continue feature work and create a reviewed Git checkpoint.

Do not run npm audit fix --force.
Do not upgrade/downgrade Next.js, React or ESLint wholesale to solve this one issue without a reason.
An ESLint 9.39.5 deprecation notice also appeared; it was not the cause of EPERM.

## 6. Next.js repository instructions

apps/web/AGENTS.md contains a generated warning that this installed version has
breaking changes and that guides in node_modules/next/dist/docs/ must be read
before writing relevant Next.js code.

In a workspace, next may be hoisted to the root node_modules.
Resolve its actual package location before locating documentation.
The unusual "aEUR" style characters in the user's pasted AGENTS.md appeared to
be a terminal encoding issue; the actual file encoding has not been inspected.

Do not implement auth routes, cookie handling or cache behavior from memory
before consulting the installed version's relevant guides.

## 7. Figma design

Figma file:
https://www.figma.com/design/znVdgwgKGmdKB4HpK0jFM3/Yoobelong

Observed file URL when browsing:
https://www.figma.com/design/znVdgwgKGmdKB4HpK0jFM3/Yoobelong?node-id=3210-25688

The MBF design is inside this otherwise unrelated Yoobelong file:
- Page: Builder and blog
- Parent frame: MBF
- The URL's node ID was observed, but was NOT verified to be the MBF frame itself.

Only work on MBF, not neighboring Yoobelong designs.
Browser access in the previous ChatGPT session does not automatically carry into VS Code.

Observed child frame names:
- musicbandfinder-homepage
- musician-profile (two variants)
- band-profile (two variants)
- search-page
- open-roles-page
- screens-flow
- ui-components

Observed visual style:
- Near-black/dark background (homepage fill observed as #0B0B0D).
- Dark cards, light typography, blue/purple accent buttons.
- Large concert/performance cover images.
- Musician cards, filter sidebar, musician and band profile layouts, video cards.
- Desktop frames observed at width 1440.
- Homepage includes featured musicians, hiring bands and a performance showcase.
- Search includes location/instrument/genre/availability-style filters.
- Profile mockups include contact/invitation actions, ratings/counters, experience,
  portfolios and band links.
- Band mockups include members, discography and other planned content.

Do not claim a complete design/token/mobile audit was performed.
Authentication, onboarding, editing, responsive states and error/empty states
still need to be checked/designed.
Use the visual direction faithfully, but do not turn mockup numbers into real metrics.

## 8. Supabase backend

Project ID: cjzrnyvyhhkqircmehbi
Dashboard:
https://supabase.com/dashboard/project/cjzrnyvyhhkqircmehbi

The project ID is an identifier, not a secret.
No Supabase keys, database passwords or credentials are in this handoff.
No Supabase environment configuration in the frontend has been confirmed.

This is an existing project with data and substantial schema.
Do not create a replacement backend or reset it.
The previous agent applied SQL through the authenticated Supabase dashboard.
Database changes described below were actually applied, but should be verified
against the current live state before further changes.

### Applied remediation

- RLS enabled on all 22 public base tables.
- Removed unsafe blanket profile UPDATE and redundant/recursive band-member policies.
- musicians is private to its owner via user_id = auth.uid().
- Public profiles are exposed through public_musicians, restricted to is_published=true.
- That public view omits email, birthdate, user_id and is_onboarded.
- The view intentionally runs with owner privileges to expose only the safe projection.
  Do not automatically change it to security_invoker without understanding the access model.
- Public relation views expose numeric musician IDs, not account UUIDs.
- Read policies added for lookup tables.
- Profile relation writes restricted to the owner.
- Video and tag access follows profile publication and ownership.
- Added musicians.updated_at and an automatic touch trigger.
- Fixed both overloads of update_musician_profile: ownership validation,
  SECURITY INVOKER and correct UUID relation usage.
- Hardened add_band_member, update_band_member_role and leave_band.
- Added remove_band_member.
- Direct client writes to band_members are revoked; use controlled RPCs.
- Band creation inserts the creator as owner in the same transaction.
- Last owner cannot leave, be demoted or be removed through client RPCs.
- Admins cannot promote themselves to owner or manage privileged members.
- Membership changes lock the bands row to serialize relevant RPC operations.
- History records role changes and leaving/removal; unchanged upserts preserve joined_at.
- Added search_musicians and search_bands with filters and ID cursor pagination.
- Added indexes for relevant FK/filter paths.
- Storage writes restricted by uploader ownership.
- New uploads must use a path beginning with the user's UUID.
- Both image buckets remain public.
- Allowed image MIME types: image/jpeg, image/png, image/webp.
- avatars limit: 5 MiB. musician_backgrounds limit: 10 MiB.
- Email OTP reduced from 7200 to 1800 seconds.
- Email confirmation remains enabled.
- Added 53 previously missing, unpublished profiles for existing Auth users.
- At last check: 61 Auth accounts, 61 musician profiles, no missing profiles.
- Added a trigger preventing the 10-video-tag limit being bypassed by UPDATE video_id.
- Administrative client table privileges such as TRUNCATE were revoked.
- Original policy/function/grant/bucket configuration and change journal are stored
  in app_private.audit_migrations. That table has RLS and is not a data backup.

### Important identifiers

musicians.id is bigint.
musicians.user_id is UUID, linked to auth.users.id.

These existing private relation tables use musician_id UUID -> musicians.user_id:
- musician_genres
- musician_subgenres
- musician_roles
- musician_instruments
- musician_instrument_variants

These use numeric musician_id -> musicians.id:
- band_members
- band_member_history
- musician_videos

The mixed naming was checked; foreign keys are valid.
Do not "standardize" types blindly and break the existing API.
Public relation views use bigint musician_id consistently for public rendering.

### Data access contract

| Feature | Table/view/RPC |
| --- | --- |
| Own private profile | musicians |
| Published profiles | public_musicians |
| Public genres | public_musician_genres |
| Public subgenres | public_musician_subgenres |
| Public roles | public_musician_roles |
| Public instruments | public_musician_instruments |
| Public instrument variants | public_musician_instrument_variants |
| Musician search | search_musicians |
| Band search | search_bands |
| Band creation | INSERT bands; owner trigger runs |
| Add/upsert member | add_band_member |
| Update member role | update_band_member_role |
| Remove member | remove_band_member |
| Leave band | leave_band |
| Musician video portfolio | musician_videos, musician_video_tags |
| Band video portfolio | band_videos |
| Roles a band seeks | band_search_roles |

search_musicians parameters:
p_query, p_place_id, p_genre_ids, p_subgenre_ids, p_instrument_ids,
p_role_ids, p_available, p_in_search, p_after_id, p_limit.

search_bands parameters:
p_query, p_hiring, p_subgenre_ids, p_role_ids, p_after_id, p_limit.

Search behavior:
- ANY within each selected ID array; AND between different filters.
- Order by id ASC.
- Next page uses the last returned id as p_after_id.
- Default limit 20, bounded to 1-100.
- Text search uses ILIKE; no performance/load benchmark was completed.

The two update_musician_profile overloads retain different argument names/types:
- Array-based form includes p_is_published and bigint[] relation lists.
- JSON-based form retains existing publication state and accepts jsonb lists.
Consult actual SQL definitions rather than guessing PostgREST argument names.

Lookup tables:
genres, subgenres, instruments, instrument_variants, roles, places,
video_tags, video_tag_categories.
They are readable by guests/authenticated users, not writable by normal clients.

### What was tested

Three SQL regression suites passed:
1. Authorization: guest, own profile, outsider, member, admin and owner scenarios;
   both profile RPC overloads; band creation and last-owner checks.
2. Media/search: foreign-video write denial, controlled member removal,
   publication visibility, search filters/cursor/limits and Storage metadata policies.
3. Auth-user insertion trigger creates an unpublished/non-onboarded profile;
   10 tags accepted, 11th insertion and movement rejected, source preserved.

All test fixtures were in transactions and rolled back.
Sequence gaps from rolled-back inserts are expected.

These were PostgreSQL SET LOCAL ROLE/JWT-claim tests, not end-to-end HTTP tests.
Not yet verified:
- Actual signup/signin and email delivery.
- Real token refresh and mobile/web callback flows.
- Actual Storage API upload, MIME rejection and device media selection.
- PostgREST embedding behavior against public views.
- UI behavior, responsive layouts and concurrent-session testing.

Do not equate SQL PASS results with release readiness.

## 9. Backend migration package

Existing downloadable package:
MusicBandFinder_backend_changes.zip

Link:
https://chatgpt.com/library?file_id=libfile_c8cd00bfa6648191aa4be263fe24fe80&account_id=personal

The receiving agent may not have access to this URL.
Ask the user to download/extract it into the repository if needed.

Latest verified archive version: 1, size 18932 bytes.
Contains:
- README.md
- migrations/202611080001_security.sql
- migrations/202611080002_rpc.sql
- migrations/202611080003_search.sql
- migrations/202611080004_history.sql
- migrations/202611080005_backfill.sql
- migrations/202611080006_privileges.sql
- migrations/202611080007_video_tag_move_guard.sql
- tests/01_authorization.sql
- tests/02_media_search.sql
- tests/03_registration_video_tags.sql
- tests/04_cleanup_preview.sql

All seven migration batches were already applied to the existing project.
The files are deltas, not a complete baseline or full database dump.
Some CREATE TRIGGER statements are one-time and not idempotent.
Do NOT run the whole migration directory again against the live project.
Do NOT mark them as new/unapplied Supabase CLI migrations and blindly push them.
app_private.audit_migrations is a custom journal, NOT supabase_migrations.schema_migrations.
Supabase CLI baseline/history reconciliation and CI deployment remain unfinished.
The package was not confirmed added to the user's Git repository.

## 10. PENDING CLEANUP - NOT AUTHORIZED FOR EXECUTION YET

User requested removal of old test data.
We inspected and prepared a preview, then asked for the exact scope and confirmation.
The user switched to frontend/setup work without answering.
NO OLD TEST DATA OR FILES WERE DELETED.

Last inventory:
| Data | Count |
| --- | ---: |
| Auth application accounts | 61 |
| Musician profiles | 61 |
| Bands | 2 |
| Band video links | 2 |
| Musician genre links | 2 |
| Musician subgenre links | 7 |
| Band subgenre links | 3 |
| Band search-role links | 5 |
| Storage files | 8 |

The 17 relation rows are 2 + 7 + 3 + 5.
Band members/history, musician videos/video tags and other musician relation tables were empty.

Storage files: 5 in avatars, 3 in musician_backgrounds.
Bands: New Band (id 1), My First Band (id 2), both without members.
Some profiles have clearly test-looking names; others include marharyta and andrii565.
Do not infer every account is disposable.

Dictionaries to preserve:
37 genres, 135 subgenres, 12 instruments, 49 variants, 45 roles,
1 place, 30 video tags, 6 video-tag categories.

Preserve schema, RLS, functions, dictionaries and migration history during any approved cleanup.
Actual file deletion must use supported Storage operations, not just delete storage.objects
metadata and leave the blobs behind.
Deleting Auth users must account for their sessions/identities and linked data.
For browser actions, permanent deletion requires action-time confirmation.
This handoff is not that confirmation.

## 11. Unfinished backend/product work

- Production web domain and redirect URLs: unknown, not configured.
- Existing callback: musicmatcher://auth/callback, preserved.
- Development auth redirect URLs also need explicit, correct setup when frontend auth begins.
- Free plan had no managed project backups; no paid upgrade was authorized/performed.
- No restored-backup test or external backup pipeline.
- Repository now exists, but database baseline/history/CI are not integrated.
- Invitations, applications, messaging, saved profiles and full job listings are not implemented.
- Ratings, view counters, gigs, discography and related mockup features are not backed by schema.
- Edge Functions were not deployed during this work.
- Do not present fake ratings, online state, activity timestamps or counters as real data.

No frontend existed before this session; the current frontend is only a generated starter.
An older Android project was mentioned in past conversations but no code was supplied
or integrated into this repository. Do not assume it is available or usable.

## 12. Intended next feature work after environment recovery

1. Create a reviewed Git checkpoint for the workspace/lockfile fix.
2. Read installed Next.js guides relevant to planned configuration/auth changes.
3. Set up actual shared packages incrementally, avoiding unnecessary tooling.
4. Add Supabase client/config with correctly scoped environment variables.
   Public publishable/anon key may be used by the client with RLS.
   Never expose service-role credentials in NEXT_PUBLIC_* or client bundles.
5. Build reusable visual foundations from MBF: tokens, buttons, forms, cards,
   layouts, loading/empty/error states and responsive navigation.
6. Deliver first real user journey:
   register -> confirm email -> fill profile -> publish -> find in search -> open profile.
7. Validate client UI/auth assumptions in an early Capacitor build.
8. Add band creation/management and hiring-role search.
9. Define models and permissions for invitations/applications/messages before implementing them.
10. Perform actual HTTP/Auth/Storage integration and device testing.

This list is a development roadmap, not a command to perform destructive cleanup,
purchase services, publish an application or invent missing credentials.

## 13. Suggested first response/action in VS Code

Read this file and AGENTS.md. Inspect actual local state.
Resolve the Windows native-module file lock and restore npm ci successfully.
Then verify lint/build/audit and explain the result in Ukrainian.
Proceed with small, reviewable changes toward the agreed MBF implementation.


## 14. Local recovery verified by Codex - 2026-11-08

This section supersedes the historical installation blocker in section 5.

- Read PROJECT_CONTEXT.md and the applicable apps/web/AGENTS.md. No ancestor or root AGENTS.md was found.
- Git remains on main, tracking origin/main at 7947e2f. Existing workspace changes are uncommitted: root package.json and package-lock.json are untracked; apps/web/package-lock.json is deleted. This context file is also untracked. No commit or push was performed.
- Found the MBF Next dev process (PID 24744) and its server child (PID 3632). Stopped only those project-specific Node processes. Other Node processes were preserved.
- Removed the leftover apps/web/node_modules and successfully ran root npm ci: 362 packages installed. No EPERM remained.
- Root package-lock.json was preserved byte-for-byte. SHA256: 97DB3357603C7A32221EDEF35E629954BD6FA42EDF11FEF3209F5AEB05FC23D7.
- npm run lint passed.
- The first npm run build failed with ENOSPC / Windows error 112. C: had about 12 MB free. Removed only the generated apps/web/.next directory, then npm run build passed, including TypeScript and static generation for / and /_not-found.
- Native SWC, Tailwind Oxide and Lightning CSS modules loaded successfully in Node.
- npm audit initially failed certificate verification. Retried with NODE_USE_SYSTEM_CA=1 for the command process: 0 vulnerabilities, exit 0. TLS verification was not disabled; no persistent npm or system setting was changed.
- npm ls minimatch resolves 11.0.1 under typescript-estree, but exits ELSPROBLEMS because that dependency declares ^10.2.2. The intentional root cross-major override remains. Lint/build pass, but this does not prove full cross-major compatibility. Do not describe the dependency tree as entirely clean.
- npm emitted the existing eslint@9.39.5 deprecation warning. No dependency versions were changed.
- git diff --check passed. No application source changes were made.
- C: had only 57,389,056 bytes free after the successful build. Free additional disk space before substantial development or another installation. No files outside project-generated dependency/build directories were cleaned.
- Supabase was not accessed or modified. Pending data cleanup remains unauthorized.

## 15. Initial interface implementation - 2026-11-08

- User provided the Figma CSS export and eight screenshots covering homepage, musician/band variants, search, open roles and UI kit.
- Replaced the Next.js starter with a responsive MBF homepage. Added /musicians and /musicians/demo?profile=<demo-id>.
- Added shared site components, Inter font, dark design tokens and responsive styles, directory filters/sorting/grid-list/empty state and a demo profile view.
- All fixture profiles and band listings are explicitly identified as samples. No mock ratings, verification claims or invented membership statistics are shown as live data.
- Images are local illustrative Unsplash downloads, not the original Figma images. Sources and implementation limitations are recorded in apps/web/DESIGN_IMPLEMENTATION.md.
- Lint and production build passed. Temporary production server HTTP checks returned 200 for the three routes, a filtered directory URL and all five images. Homepage sections were checked in rendered HTML. Client interaction and browser visual QA remain unverified.
- Supabase MCP OAuth setup is still blocked by malformed HTTP response framing during discovery. No Supabase reads, writes or cleanup occurred.
- Existing workspace/lockfile changes remain preserved and uncommitted. No commit or push performed.

## 16. Dev/prod separation - 2026-11-08

- User explicitly chose: existing cjzrnyvyhhkqircmehbi remains prod; new separate hosted mbf-dev. User confirmed organization is on Free.
- Installed pinned Supabase CLI 3.0.0 in root devDependencies. Existing CLI authentication worked with NODE_USE_SYSTEM_CA=1; no MCP connection or new credential entry was required. This supersedes the earlier assumption that no Supabase access is available.
- Created mbf-dev: gawblqkuodzuerzirsyr, eu-central-1, organization rhjjbbwbmdxfvxdmzpmq. No paid upgrade selected.
- Created root ignored .env.dev.local and .env.prod.local with their separate URLs/refs/publishable keys, retrieved per-project. No server secrets were put into NEXT_PUBLIC variables. New dev database password is in ignored .env.supabase.dev.local. Never print these files.
- Standard prod db dump failed initializing CLI login role (permission error); no password/ownership/role fix was attempted. Used read-only system-catalog queries instead. Source schemas, ACLs including 18 column-level entries, functions, views/options, policies, indexes/constraints, sequences and auth trigger are captured under supabase/baseline. Snapshots contain metadata, not user records.
- Applied schema-only baseline to the NEW dev in a transaction. Copied eight lookup dictionaries only. Configured two empty image buckets with matching MIME/size restrictions and dev Auth callbacks/OTP expiry 1800. Production Auth config was not changed.
- Dev migration baseline 20261108180000 is applied and recorded. Final metadata comparison matched all 15 captured categories, including column ACLs. Initial failed baseline/test transactions were rolled back. Dev rollback test passes: signup unpublished/non-onboarded defaults, guest privacy/search, lookup reads, publication, automatic band owner and last-owner protection.
- Final dev counts: 0 users, 0 musician profiles, 0 bands, 0 Storage objects. Prod counts remain 61 users, 61 musician profiles, 2 bands, 8 Storage objects. NO user data or files were deleted or copied into dev.
- PRODUCTION BASELINE HISTORY REGISTRATION IS PENDING USER APPROVAL. Auto-review rejected the proposed creation of supabase_migrations/schema_migrations, privilege revocation and baseline ledger insertion because the user had not explicitly approved that specific prod mutation. No workaround was attempted. supabase/baseline/register-existing-production.sql is prepared LOCALLY ONLY and was not executed. Final read-only check confirms production migration-history table is still absent. Do not replay the initial baseline on prod or deploy new prod migrations until this is reconciled.
- Switched local working branch to new develop, preserving all pre-existing uncommitted work. main/origin/main unchanged, no commit/push.
- Root web launcher selects dev/prod explicitly, validates project refs, prevents dev->prod, and isolates .next-dev/.next-prod. Start checks a hash manifest matching build-time public env. Normal npm run build targets dev; build:prod/start:prod are explicit. Dev displays DEV badge; prod does not.
- Added dev-only database plan/migrate/test/types scripts and public TypeScript database types. Added CI validation only, no deployment or production database writes.
- Passed: 8 env tests; lint; build:dev; build:prod; dev migration dry-run (up to date); dev SQL rollback regression; guest REST lookup/private-profile/public-view checks and search RPC; npm audit (0 vulnerabilities); secret-file Git ignore checks; simultaneous local dev/prod HTTP 200 and correct DEV badge behavior. Temporary preview servers were stopped afterward.
- Web UI still uses clearly labeled demo fixtures. Env configuration does not yet wire live Supabase queries/auth. No production hosting/domain deployment configured.
- Detailed commands, boundaries and remaining production gate: docs/ENVIRONMENTS.md.

## 17. Production baseline approved and registered - 2026-11-08

- User explicitly approved execution of production baseline registration in message item 5.
- Executed ONLY supabase/baseline/register-existing-production.sql against cjzrnyvyhhkqircmehbi. Created the protected migration ledger and recorded version 20261108180000 / mbf_baseline. Did not replay application schema DDL or the old remediation migrations.
- Verified baseline entry and preserved production counts: 61 users, 61 profiles, 2 bands, 8 Storage objects.
- This supersedes the pending-approval gate in section 16 and docs/ENVIRONMENTS.md. Production deployment still requires a reviewed future migration plan.
- Rechecked both hosted Supabase projects: mbf-dev gawblqkuodzuerzirsyr and existing prod cjzrnyvyhhkqircmehbi are ACTIVE_HEALTHY. They are separate projects, not Supabase Branching environments. No switch to local Docker dev was made.
- Git is still local develop with uncommitted changes. User asked whether to publish to GitHub, not explicitly to push; no commit/push performed in this turn.

## 18. Local email auth and musician journey - 2026-11-08

- User requested all five steps: typed dev Supabase connection; signup/confirmation/login/logout/recovery; onboarding; avatar/publication; real public directory/profile. User explicitly chose to continue locally, with no hosting deployment.
- Added pinned @supabase/supabase-js 2.119.0, a browser PKCE client and AuthProvider. UI authorization is backed by existing RLS; no SSR cookies/proxy or service-role client was introduced.
- Added /signup, /login, /forgot-password, /auth/callback, /auth/reset-password and /account, header account actions, friendly auth failures and same-browser PKCE guidance. Recovery redirects are strictly allowlisted; callback codes are not echoed in errors.
- Added atomic SECURITY INVOKER save_my_musician_profile wrapper via dev-only migration 20261108190000_profile_onboarding.sql. It calls the existing array-based update_musician_profile, validates publication and preserves the mixed ID contract. Generated dev types refreshed. PROD DOES NOT HAVE THIS NEW RPC YET. Do not deploy the feature to prod without its reviewed migration.
- /account edits basic fields and dictionary relations; saves privately, publishes or unpublishes. Avatar upload uses own UUID path, unique name, allowed image types and 5 MiB validation. No images/accounts were deleted. Existing image bucket public visibility is explained in UI.
- Replaced primary demo directory and featured cards with live search_musicians/public views and public relation views. Added /musicians/[id], cursor Load More and real empty/loading/error states. /musicians/demo remains an explicitly separate example route. Band examples remain labeled mock content.
- Dev Auth callback allowlist extended with exact password-reset callback queries for localhost and 127.0.0.1. No production settings changed.
- User supplied a test email in chat, then reported successful registration/confirmation, profile filling, avatar and saving. Independent read-only verification found dev profile numeric ID 5, confirmed email, onboarded=true, is_published=false, 2 genres, 1 instrument, 2 roles and one avatar object. Guest public view/search returned zero records, correctly hiding the private profile. Do not republish the user's profile automatically.
- Asked user to manually test Save & Publish, directory visibility, logout/login and recovery email. Result pending. Never ask for passwords or email token links.
- Passed so far: 5 onboarding unit tests, 8 env tests, lint, dev production build, SQL onboarding regression with fixture rollback, npm audit (0 vulnerabilities), local HTTP 200 for all seven auth/account/directory routes checked.
- Auto-review rejected a proposed persistent service-role integration fixture setup because creating synthetic accounts and retaining credentials lacked explicit approval. The entire command was not executed, and no script/credentials/fixture accounts were written. No workaround was attempted. Used rollback SQL and user-driven browser tests instead.
- New docs: docs/AUTH_PROFILE.md. Initial historical verify-environments.mjs assumes empty identical schemas and is no longer the appropriate regression runner after forward migrations/user accounts.
- Changes remain local on dev; no commit/push or hosting deployment performed by the agent.

## 19. User verified journey and recovery redirect - 2026-11-08

- User reported successful Save & Publish/directory/logout/login/password recovery, with one UX issue: after the new password was saved they remained on the password form.
- Implemented router.replace('/account?password=updated') after successful password update. Account displays 'Password updated successfully.' The account route now wraps its search-param reader in Suspense. Lint and build pass for this adjustment; a second recovery-email browser run was not required/performed by the agent.
- Read-only guest API independently confirmed actual published dev profile ID 5, combined genre/instrument/role/place search, ID cursor exclusion, absence of email/user_id/birthdate, and successful image HEAD response. No user's profile was published by the agent; user chose the publish action.
- Existing environment-isolation rollback test initially assumed the entire directory was empty and failed after the user published. Corrected it to inspect ONLY its own temporary fixture by numeric ID. Both original isolation and new onboarding rollback suites then passed. The failure did not indicate a real profile privacy leak.
- Final checks: lint, dev build, 5 onboarding tests + 8 environment tests, both SQL rollback suites, guest API/profile/image checks, and npm audit (0 vulnerabilities). Generated database types restored to generator formatting, with only the 42-line new RPC diff.
- No persistent synthetic test accounts or credential files were created; rejected service-role test command was not executed. Old Supabase cleanup remains unapproved and no user data/files were deleted.
- Updated docs/AUTH_PROFILE.md and environment documentation. Work remains uncommitted on local dev; no push or hosting deployment. Prod schema/settings/data unchanged during this feature work; migration 20261108190000 is DEV ONLY.
