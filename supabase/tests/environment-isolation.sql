-- Run ONLY against mbf-dev. Every fixture is rolled back.
BEGIN;
INSERT INTO auth.users (id,email) VALUES ('7302827e-2125-480b-8077-4eb6e4376531','mbf-isolation-check@example.invalid');
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM public.musicians WHERE user_id='7302827e-2125-480b-8077-4eb6e4376531' AND NOT is_published AND NOT is_onboarded) THEN RAISE EXCEPTION 'Signup profile defaults failed'; END IF;
END $$;
SELECT set_config('mbf.test.profile_id',(SELECT id::text FROM public.musicians WHERE user_id='7302827e-2125-480b-8077-4eb6e4376531'),true);
SET LOCAL ROLE anon;
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM public.public_musicians WHERE id=current_setting('mbf.test.profile_id')::bigint) THEN RAISE EXCEPTION 'Private profile leaked'; END IF;
 IF (SELECT count(*) FROM public.genres) <> 37 THEN RAISE EXCEPTION 'Lookup read failed'; END IF;
 IF EXISTS (SELECT 1 FROM public.search_musicians() WHERE id=current_setting('mbf.test.profile_id')::bigint) THEN RAISE EXCEPTION 'Unpublished profile appears in search'; END IF;
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','7302827e-2125-480b-8077-4eb6e4376531',true);
SET LOCAL ROLE authenticated;
UPDATE public.musicians SET username='mbf_isolation_fixture',is_published=true WHERE user_id=auth.uid();
INSERT INTO public.bands (name) VALUES ('MBF isolation fixture');
DO $$ DECLARE v_band_id bigint; denied boolean := false; BEGIN
 SELECT b.id INTO v_band_id FROM public.bands b WHERE b.name='MBF isolation fixture';
 IF NOT EXISTS (SELECT 1 FROM public.band_members bm JOIN public.musicians m ON m.id=bm.musician_id WHERE bm.band_id=v_band_id AND m.user_id=auth.uid() AND bm.member_role='owner') THEN RAISE EXCEPTION 'Creator owner assignment failed'; END IF;
 BEGIN PERFORM public.leave_band(v_band_id); EXCEPTION WHEN OTHERS THEN denied := true; END;
 IF NOT denied THEN RAISE EXCEPTION 'Last owner was allowed to leave'; END IF;
END $$;
RESET ROLE;
SET LOCAL ROLE anon;
DO $$ BEGIN
 IF (SELECT count(*) FROM public.search_musicians(p_query=>'mbf_isolation_fixture')) <> 1 THEN RAISE EXCEPTION 'Published profile search failed'; END IF;
END $$;
RESET ROLE;
ROLLBACK;
SELECT 'PASS: signup, publication, guest search, lookups, band ownership, last-owner protection; fixtures rolled back' AS result;
