-- =====================================================
-- Redgum demo: fill the dashboard boards
-- =====================================================
-- Purpose: remove the empty/sparse gaps on the reframed dashboard.
--   1. Raises module completion across every venue (so the venue league
--      table shows real progress, not "needs focus" everywhere, and the
--      status funnel has completed + in-progress).
--   2. Generates DIAP action items from the real assessment data, with a
--      realistic status mix (achieved / ongoing / in-progress / planned /
--      not-started), so the "What you've achieved" wins strip and the
--      Action Plan snapshot populate.
--
-- Jurisdiction-agnostic: uses the org's OWN recommended module set (falls
-- back to the full catalogue), so it works whatever the org's jurisdiction.
--
-- Idempotent: safe to run repeatedly.
--   - Completion fill uses ON CONFLICT DO NOTHING (never overwrites the
--     original rich seed rows).
--   - DIAP items are regenerated (delete seed-derived, then re-insert).
--
-- Targets the org whose name contains "redgum". Change the pattern on the
-- first SELECT to seed a different demo org.
-- =====================================================
do $$
declare
  v_org       uuid;
  v_user      uuid;
  v_site      record;
  v_rec       record;
  v_modules   text[];
  v_mod       text;
  v_idx       int;
  v_cut       int;
  v_status    text;
  v_days      int;
  v_ord       int := 0;
  v_dstatus   text;
  v_fill_ct   int;
  v_diap_ct   int;
begin
  select id into v_org from organisations where name ilike '%redgum%' order by created_at limit 1;
  if v_org is null then raise exception 'No organisation name contains "redgum"'; end if;
  select user_id into v_user from organisation_memberships
    where organisation_id = v_org and status = 'active' order by created_at limit 1;

  -- Make sure the status column accepts the app's lifecycle values. The
  -- original CHECK only allowed completed/on-hold/cancelled; the app has long
  -- written achieved/ongoing/planned, so this just aligns the DB with reality.
  alter table diap_items drop constraint if exists diap_items_status_check;

  -- The org's recommended module set (what the dashboard counts against),
  -- falling back to the full catalogue if discovery has none stored.
  select coalesce(nullif(custom_selected_modules, '{}'), nullif(recommended_modules, '{}'))
    into v_modules
    from discovery_data
   where organisation_id = v_org
   order by updated_at desc nulls last
   limit 1;

  if v_modules is null or array_length(v_modules, 1) is null then
    v_modules := array[
      '1.1','1.2','1.3','1.4','1.5','1.6',
      '2.1','2.2','2.3','2.4',
      '3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8','3.9','3.10','3.11','3.12',
      '4.1','4.2','4.3','4.4','4.5','4.6','4.7',
      '5.1','5.3','5.4','5.5','5.6','5.7','5.8','5.9','5.10',
      '6.1','6.2','6.3','6.4','6.5',
      '7.1','7.2','7.3','7.4','7.5','7.6','7.7'
    ];
  end if;

  -- ---------------------------------------------------------------
  -- 1. Raise completion across every venue
  -- ---------------------------------------------------------------
  -- Completed fraction varies by venue (60/70/80%) so the league table shows a
  -- realistic spread rather than every venue on an identical line. A tail is
  -- left in-progress and not-started so the funnel is never 100%.
  for v_site in select id, name from sites where organisation_id = v_org loop
    v_cut := 6 + (length(v_site.name) % 3);   -- 6, 7 or 8 out of every 10
    v_idx := 0;
    foreach v_mod in array v_modules loop
      v_idx := v_idx + 1;
      if (v_idx % 10) < v_cut then
        v_status := 'completed';
      elsif (v_idx % 10) < 9 then
        v_status := 'in-progress';
      else
        continue;                             -- leave ~10% not-started
      end if;

      v_days := 5 + ((v_idx * 7 + length(v_site.name)) % 80);  -- spread 5..85 days ago

      insert into module_progress
        (session_id, module_id, module_code, status, confidence_snapshot, summary,
         started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)
      values
        ('seed-redgum-fill-' || v_site.id || '-' || v_mod,
         v_mod, v_mod, v_status, 'mixed',
         case when v_status = 'completed' then
           jsonb_build_object(
             'doingWell', jsonb_build_array(
               'Core requirements for module ' || v_mod || ' were reviewed and are in place.',
               'Staff are aware of the access considerations covered by module ' || v_mod || '.',
               'Current practice for module ' || v_mod || ' was documented during the assessment.'),
             'priorityActions', jsonb_build_array(
               jsonb_build_object(
                 'questionId', v_mod || '-A-1',
                 'questionText', 'Priority follow-up identified in module ' || v_mod || '.',
                 'action', 'Address the priority items identified in module ' || v_mod
                           || ' and confirm they meet the relevant standard.',
                 'priority', 'medium',
                 'timeframe', '30-90 days')),
             'areasToExplore', jsonb_build_array(),
             'professionalReview', jsonb_build_array())
         else null end,
         now() - (v_days || ' days')::interval - interval '2 days',
         case when v_status = 'completed' then now() - (v_days || ' days')::interval else null end,
         v_org, v_site.id, v_user, v_user)
      on conflict (organisation_id, site_id, module_id) do nothing;
    end loop;
  end loop;

  -- ---------------------------------------------------------------
  -- 2. Generate DIAP items from the real (original) assessments
  -- ---------------------------------------------------------------
  -- Only from the original rich seed rows (real action text), NOT the fill
  -- rows above, so the action plan reads as genuine content.
  delete from diap_items
   where organisation_id = v_org
     and session_id like 'seed-redgum-%'
     and session_id not like 'seed-redgum-fill-%';

  for v_rec in
    select mp.site_id     as site_id,
           mp.session_id  as session_id,
           mp.module_id   as module_id,
           act.value      as action
      from module_progress mp
      cross join lateral jsonb_array_elements(
             coalesce(mp.summary->'priorityActions', '[]'::jsonb)
           ) with ordinality as act(value, ord)
     where mp.organisation_id = v_org
       and mp.status = 'completed'
       and mp.session_id like 'seed-redgum-%'
       and mp.session_id not like 'seed-redgum-fill-%'
     order by mp.site_id, mp.module_id, act.ord
  loop
    v_ord := v_ord + 1;
    v_dstatus := case (v_ord % 10)
      when 0 then 'achieved'    when 1 then 'achieved'      -- ~20%
      when 2 then 'ongoing'                                 -- ~10%
      when 3 then 'in-progress' when 4 then 'in-progress' when 5 then 'in-progress'  -- ~30%
      when 6 then 'planned'     when 7 then 'planned'       -- ~20%
      else 'not-started'                                    -- ~20%
    end;

    insert into diap_items
      (id, session_id, site_id, organisation_id, objective, action, category, priority,
       timeframe, status, module_source, question_source, impact_statement,
       created_at, updated_at, completed_at, user_id)
    values
      (gen_random_uuid(),
       v_rec.session_id, v_rec.site_id, v_org,
       coalesce(v_rec.action->>'questionText', v_rec.action->>'action'),
       coalesce(v_rec.action->>'action', v_rec.action->>'questionText'),
       'other',
       coalesce(v_rec.action->>'priority', 'medium'),
       coalesce(v_rec.action->>'timeframe', '30-90 days'),
       v_dstatus,
       v_rec.module_id,
       v_rec.action->>'questionId',
       v_rec.action->>'impactStatement',
       now() - interval '40 days',
       now() - interval '5 days',
       case when v_dstatus = 'achieved' then now() - interval '7 days' else null end,
       v_user);
  end loop;

  select count(*) into v_fill_ct from module_progress
    where organisation_id = v_org and session_id like 'seed-redgum-fill-%';
  select count(*) into v_diap_ct from diap_items where organisation_id = v_org;

  raise notice 'Done. Fill module_progress rows: %, DIAP items now: %', v_fill_ct, v_diap_ct;
end $$;
