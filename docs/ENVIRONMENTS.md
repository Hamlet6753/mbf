# MBF: dev and prod

## Environment map

| | Development | Production |
| --- | --- | --- |
| Git branch | develop | main |
| Supabase project | mbf-dev | existing MBF project, unchanged |
| Project ref | gawblqkuodzuerzirsyr | cjzrnyvyhhkqircmehbi |
| Region | eu-central-1 | eu-central-1 |
| Local env file | .env.dev.local | .env.prod.local |
| Build output | apps/web/.next-dev | apps/web/.next-prod |

The new dev project was created in the existing Free organization. Public client settings are configured separately in the ignored local env files. Its generated database password is stored only in `.env.supabase.dev.local`, also ignored. Do not commit these files or send their contents in chat.

## Web commands (from repository root)

```powershell
npm run dev
npm run build:dev
npm run start:dev
npm run build:prod
npm run start:prod
npm run env:check:dev
npm run env:check:prod
```

`npm run build` is an alias for `build:dev`: an optimized Next.js build targeting the development backend. Both builds use normal Next.js NODE_ENV behavior; MBF_ENV selects the backend, not NODE_ENV. For simultaneous previews use `npm run start:dev -- --port 3100` and `npm run start:prod -- --port 3200`.

Root `.env.dev.local` / `.env.prod.local` are selected explicitly. Values in the selected local file take precedence over shell values. On CI/hosting, omit those files and provide the three Supabase variables from the corresponding hosting environment. The launchers supply MBF_ENV and NEXT_PUBLIC_APP_ENV. Do not put credentials in apps/web/.env* files: mixed dotenv loading is refused by the launcher. Do not invoke Next.js workspace scripts directly; use the root launchers.

NEXT_PUBLIC variables are frozen into each build. Dev and prod artifacts must be built separately. The start launcher checks an environment fingerprint against the build manifest, so changing the backend or publishable key requires rebuilding. These are guardrails for the supported commands, not an access-control boundary against someone manually invoking other tooling.

`validateEnvironment` refuses swapped project refs/URLs, partial configuration and public server-secret variables. An opaque publishable key cannot be matched to its project offline; configured values were retrieved from each project's own API. No service-role key is placed in the browser configuration.

The application still renders the clearly labeled design fixtures. Configuring a backend does not yet implement live Supabase queries or authentication. A production build is a verification artifact; no website was deployed.

## Supabase development

The dev project contains the existing application schema (22 public tables, 7 views, 15 custom functions, 34 policies, 6 custom triggers, 18 column ACL entries), plus the empty private audit table. Both image buckets are empty, with the original MIME/size restrictions. Eight lookup dictionaries were copied with stable IDs. Auth users, musician profiles, bands, media metadata, Storage objects and audit journal rows were not copied.

Auth is isolated: dev uses localhost as its site URL, explicit localhost/127.0.0.1 callback URLs, email confirmation and an OTP lifetime of 1800 seconds. Production Auth URLs/settings were not changed. Mobile development callback URLs still need to be chosen when the mobile app is implemented.

```powershell
npm run db:plan:dev
npm run db:migrate:dev
npm run db:test:dev
npm run db:types:dev
```

These scripts pin the remote to mbf-dev. The rollback test verifies signup defaults, guest privacy/search, lookup reads, automatic band ownership and last-owner protection. Rolled-back tests can leave sequence gaps, but no fixture rows.

For new schema changes, create a new timestamped SQL migration in `supabase/migrations`, review it, plan/apply it on dev and run the regression tests. Do not edit already-released migrations. Do not use remote reset commands. No automatic database deployment is configured.

## Baseline and production gate

`20261108180000_mbf_baseline.sql` reconstructs the current schema for a NEW empty database; it refuses an existing application schema. It was applied to dev and recorded in dev's migration history. It is not the old seven-delta archive from PROJECT_CONTEXT.md and must never be replayed on existing prod.

The baseline was generated from read-only catalogs because standard `db dump` failed while initializing its temporary CLI role on prod. Column-level ACLs, schema grants, function ACLs, security-barrier/invoker view options, auth signup trigger and storage policies are included. Source catalog snapshots contain schema metadata, not user records. The snapshots are not a data backup or a complete project backup.

**Production baseline registration completed on 2026-11-08 after explicit user approval.** The reviewed `supabase/baseline/register-existing-production.sql` created the protected migration ledger and recorded version `20261108180000` / `mbf_baseline`. Application baseline DDL was not replayed. The existing `app_private.audit_migrations` journal was preserved. Verification found the ledger entry and unchanged counts: 61 Auth users, 61 musician profiles, 2 bands and 8 Storage objects. Future production migration plans still require review before deployment.

## Git and CI

Current local development is on develop. Main and origin/main were not changed or pushed. Work is still uncommitted. `.github/workflows/ci.yml` validates dependency installation, env isolation, lint and the dev-target build for pull requests and pushes to develop/main. It does not deploy web hosting or modify databases. Production hosting/domain and GitHub environment protections still need to be configured before release.

Official references:
- https://supabase.com/docs/guides/deployment/managing-environments
- https://supabase.com/docs/guides/local-development/cli-workflows
