SELECT json_build_object(
'genres',(SELECT json_agg(t ORDER BY id) FROM public.genres t),
'instruments',(SELECT json_agg(t ORDER BY id) FROM public.instruments t),
'roles',(SELECT json_agg(t ORDER BY id) FROM public.roles t),
'places',(SELECT json_agg(t ORDER BY id) FROM public.places t),
'video_tag_categories',(SELECT json_agg(t ORDER BY id) FROM public.video_tag_categories t),
'subgenres',(SELECT json_agg(t ORDER BY id) FROM public.subgenres t),
'instrument_variants',(SELECT json_agg(t ORDER BY id) FROM public.instrument_variants t),
'video_tags',(SELECT json_agg(t ORDER BY id) FROM public.video_tags t)
) AS dictionaries;
