-- Executed on production on 2026-11-08 after explicit user approval.
-- This records the existing schema; it does not replay the application baseline DDL.
BEGIN;
DO $$ BEGIN
 IF to_regclass('public.musicians') IS NULL OR to_regclass('public.public_musicians') IS NULL THEN RAISE EXCEPTION 'Expected existing MBF schema'; END IF;
END $$;
CREATE SCHEMA IF NOT EXISTS supabase_migrations;
CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
 version text PRIMARY KEY,
 statements text[],
 name text
);
REVOKE ALL ON SCHEMA supabase_migrations FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE supabase_migrations.schema_migrations FROM PUBLIC, anon, authenticated;
INSERT INTO supabase_migrations.schema_migrations (version,name)
VALUES ('20261108180000','mbf_baseline') ON CONFLICT (version) DO NOTHING;
COMMIT;
