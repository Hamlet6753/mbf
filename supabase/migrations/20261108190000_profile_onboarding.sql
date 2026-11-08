-- Atomic save for the web/mobile onboarding journey. Existing overloads stay intact.
CREATE OR REPLACE FUNCTION public.save_my_musician_profile(
 p_profile jsonb,
 p_genres bigint[], p_subgenres bigint[], p_roles bigint[],
 p_instruments bigint[], p_variants bigint[], p_publish boolean DEFAULT false
) RETURNS public.musicians
LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $$
DECLARE v_user uuid := auth.uid(); v_old public.musicians; v_result public.musicians;
 v_username text := nullif(lower(btrim(p_profile->>'username')), '');
 v_firstname text := nullif(btrim(p_profile->>'firstname'), '');
 v_complete boolean;
BEGIN
 IF v_user IS NULL THEN RAISE EXCEPTION 'Sign in to save your profile' USING ERRCODE='42501'; END IF;
 SELECT * INTO v_old FROM public.musicians WHERE user_id=v_user FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Your musician profile is not ready. Please sign in again.'; END IF;
 IF v_username IS NOT NULL AND v_username !~ '^[a-z0-9_]{3,30}$' THEN RAISE EXCEPTION 'Username must contain 3-30 lowercase letters, numbers or underscores'; END IF;
 IF char_length(coalesce(p_profile->>'firstname',''))>80 OR char_length(coalesce(p_profile->>'lastname',''))>80 OR char_length(coalesce(p_profile->>'bio',''))>3000 OR char_length(coalesce(p_profile->>'experience',''))>1000 THEN RAISE EXCEPTION 'A profile field is too long'; END IF;
 IF cardinality(p_genres)>20 OR cardinality(p_subgenres)>50 OR cardinality(p_roles)>20 OR cardinality(p_instruments)>20 OR cardinality(p_variants)>50 THEN RAISE EXCEPTION 'Too many selected profile options'; END IF;
 v_complete := v_firstname IS NOT NULL AND v_username IS NOT NULL AND nullif(p_profile->>'place_id','') IS NOT NULL AND coalesce(cardinality(p_genres),0)>0 AND coalesce(cardinality(p_instruments),0)>0 AND coalesce(cardinality(p_roles),0)>0;
 IF p_publish AND NOT v_complete THEN RAISE EXCEPTION 'Add your first name, username, location, a genre, an instrument and a role before publishing'; END IF;
 IF EXISTS (SELECT 1 FROM public.subgenres s WHERE s.id=ANY(p_subgenres) AND NOT s.genre_id=ANY(p_genres)) THEN RAISE EXCEPTION 'Choose a parent genre for each subgenre'; END IF;
 IF EXISTS (SELECT 1 FROM public.instrument_variants v WHERE v.id=ANY(p_variants) AND NOT v.instrument_id=ANY(p_instruments)) THEN RAISE EXCEPTION 'Choose a parent instrument for each variant'; END IF;
 UPDATE public.musicians SET firstname=v_firstname, lastname=nullif(btrim(p_profile->>'lastname'),''), username=v_username,
 place_id=nullif(p_profile->>'place_id','')::bigint, bio=nullif(btrim(p_profile->>'bio'),''), experience=nullif(btrim(p_profile->>'experience'),''),
 available=coalesce((p_profile->>'available')::boolean,false), in_search=coalesce((p_profile->>'in_search')::boolean,false), is_onboarded=v_complete
 WHERE user_id=v_user;
 PERFORM public.update_musician_profile(v_user,v_old.background_picture,v_old.has_musical_education,v_old.musical_education_details,v_old.custom_genre,coalesce(p_publish,false),p_genres,p_subgenres,p_roles,p_instruments,p_variants);
 SELECT * INTO v_result FROM public.musicians WHERE user_id=v_user;
 RETURN v_result;
END;
$$;
REVOKE ALL ON FUNCTION public.save_my_musician_profile(jsonb,bigint[],bigint[],bigint[],bigint[],bigint[],boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.save_my_musician_profile(jsonb,bigint[],bigint[],bigint[],bigint[],bigint[],boolean) TO authenticated;
