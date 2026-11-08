-- DEV ONLY: atomic onboarding and access regression; every fixture rolls back.
BEGIN;
INSERT INTO auth.users(id,email) VALUES ('d85b9fe3-77ca-41b2-9c22-eac547242d4c','onboarding-rollback@example.invalid');
SELECT set_config('request.jwt.claim.sub','d85b9fe3-77ca-41b2-9c22-eac547242d4c',true);
SET LOCAL ROLE authenticated;
DO $$
DECLARE v_profile public.musicians; v_genre bigint; v_instrument bigint; v_role bigint; v_place bigint;
 v_payload jsonb; v_denied boolean;
BEGIN
 SELECT id INTO v_genre FROM public.genres ORDER BY id LIMIT 1;
 SELECT id INTO v_instrument FROM public.instruments ORDER BY id LIMIT 1;
 SELECT id INTO v_role FROM public.roles WHERE is_active ORDER BY id LIMIT 1;
 SELECT id INTO v_place FROM public.places ORDER BY id LIMIT 1;
 v_payload:=jsonb_build_object('firstname','Onboarding fixture','lastname','Rollback','username','mbf_onboarding_rollback','bio','Private test','experience','Tests','place_id',v_place,'available',true,'in_search',true);
 SELECT * INTO v_profile FROM public.save_my_musician_profile(v_payload,ARRAY[v_genre],'{}',ARRAY[v_role],ARRAY[v_instrument],'{}',false);
 IF v_profile.is_published OR NOT v_profile.is_onboarded THEN RAISE EXCEPTION 'Private onboarding state failed'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.musician_genres WHERE musician_id=auth.uid() AND genre_id=v_genre) THEN RAISE EXCEPTION 'UUID relation save failed'; END IF;
 v_denied:=false;
 BEGIN PERFORM public.save_my_musician_profile(v_payload||'{"firstname":"Must roll back"}'::jsonb,ARRAY[9223372036854775806::bigint],'{}',ARRAY[v_role],ARRAY[v_instrument],'{}',false); EXCEPTION WHEN foreign_key_violation THEN v_denied:=true; END;
 IF NOT v_denied THEN RAISE EXCEPTION 'Invalid genre accepted'; END IF;
 IF (SELECT firstname FROM public.musicians WHERE user_id=auth.uid())<>'Onboarding fixture' THEN RAISE EXCEPTION 'Atomic rollback failed'; END IF;
 v_denied:=false;
 BEGIN PERFORM public.save_my_musician_profile(v_payload,ARRAY[v_genre],'{}',ARRAY[v_role],'{}','{}',true); EXCEPTION WHEN raise_exception THEN v_denied:=true; END;
 IF NOT v_denied THEN RAISE EXCEPTION 'Incomplete publication accepted'; END IF;
 PERFORM public.save_my_musician_profile(v_payload,ARRAY[v_genre],'{}',ARRAY[v_role],ARRAY[v_instrument],'{}',true);
END $$;
RESET ROLE;
SET LOCAL ROLE anon;
DO $$ BEGIN
 IF (SELECT count(*) FROM public.search_musicians(p_query=>'mbf_onboarding_rollback',p_available=>true))<>1 THEN RAISE EXCEPTION 'Published search failed'; END IF;
 IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='public_musicians' AND column_name IN ('email','user_id','birthdate')) THEN RAISE EXCEPTION 'Private fields exposed'; END IF;
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','ee43d680-842e-42b1-90ed-177239e8f1e5',true);
SET LOCAL ROLE authenticated;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM public.musicians WHERE username='mbf_onboarding_rollback') THEN RAISE EXCEPTION 'Outsider read succeeded'; END IF;
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','d85b9fe3-77ca-41b2-9c22-eac547242d4c',true);
SET LOCAL ROLE authenticated;
UPDATE public.musicians SET is_published=false WHERE user_id=auth.uid();
RESET ROLE;
SET LOCAL ROLE anon;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM public.search_musicians(p_query=>'mbf_onboarding_rollback')) THEN RAISE EXCEPTION 'Unpublished profile still visible'; END IF;
END $$;
RESET ROLE;
ROLLBACK;
SELECT 'PASS: private onboarding, UUID relations, atomic rollback, completeness, publication/search, private fields, outsider denial, unpublication' AS result;
