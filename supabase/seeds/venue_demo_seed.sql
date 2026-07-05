-- =====================================================
-- Major Venue demo: "Southgate Convention & Exhibition Centre"
-- =====================================================
-- Seeds a venue-shaped demo org so a convention/exhibition centre sees itself:
-- internal spaces AND on-site F&B tenants as sites, a completed assessment
-- (incl. events modules), a DIAP with real statuses, and the session +
-- discovery rows for restore.
--
-- SEPARATE LOGIN: create the org via the app first, under its OWN demo account
-- (so Southgate and Redgum are two independent logins, no org-switching):
--   1. Sign up a fresh demo account (new email + password) in the app.
--   2. In onboarding, create an org named "Southgate Convention & Exhibition
--      Centre" (any name containing "southgate"), reach the dashboard.
--   3. Run THIS script, then sign out and back in on that demo account.
--
-- Idempotent. Targets the Southgate org by name; does NOT touch Redgum.
-- =====================================================
do $$
declare
  v_org   uuid;
  v_user  uuid;
  v_sites text[] := array[
    'Grand Plenary', 'Exhibition Hall A', 'Exhibition Hall B',
    'Riverview Foyer & Wayfinding', 'Meeting & Function Suites',
    'The Atrium Cafe', 'Southbank Restaurant', 'Terrace Bar'
  ];
  v_site    text;
  v_site_id uuid;
  v_modules text[] := array[
    '1.1','1.2','1.3','1.4','1.5','1.6',
    '2.1','2.2','2.3','2.4',
    '3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8','3.9','3.10','3.11','3.12',
    '4.1','4.2','4.3','4.4','4.5','4.6','4.7',
    '5.1','5.3','5.4','5.5','5.6','5.7','5.8','5.9','5.10',
    '6.1','6.2','6.3','6.4','6.5',
    '7.1','7.2','7.3','7.4','7.5','7.6','7.7'
  ];
  v_mod     text;
  v_idx     int;
  v_cut     int;
  v_status  text;
  v_days    int;
  v_rec     record;
  v_ord     int := 0;
  v_dstatus text;
  v_name    text;
  v_fill    int;
  v_diap    int;
begin
  select id, name into v_org, v_name from organisations
   where name ilike '%southgate%' order by created_at limit 1;
  if v_org is null then
    raise exception 'No org name contains "southgate" — sign up the demo account and create the org via onboarding first, then re-run.';
  end if;
  select user_id into v_user from organisation_memberships
   where organisation_id = v_org and status = 'active' order by created_at limit 1;
  if v_user is null then raise exception 'Southgate org has no active member'; end if;

  update organisations set jurisdiction = 'AU-VIC' where id = v_org;
  alter table diap_items drop constraint if exists diap_items_status_check;

  -- Sites: internal spaces + on-site F&B tenants
  foreach v_site in array v_sites loop
    insert into sites (organisation_id, name) values (v_org, v_site)
    on conflict (organisation_id, name) do nothing;
  end loop;

  -- Completed assessment across every site (varied 60/70/80%)
  for v_site_id, v_site in
    select id, name from sites where organisation_id = v_org
  loop
    v_cut := 6 + (length(v_site) % 3);
    v_idx := 0;
    foreach v_mod in array v_modules loop
      v_idx := v_idx + 1;
      if (v_idx % 10) < v_cut then
        v_status := 'completed';
      elsif (v_idx % 10) < 9 then
        v_status := 'in-progress';
      else
        continue;
      end if;
      v_days := 5 + ((v_idx * 7 + length(v_site)) % 80);

      insert into module_progress
        (session_id, module_id, module_code, status, confidence_snapshot, summary,
         started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)
      values
        ('seed-venue-' || v_site_id || '-' || v_mod, v_mod, v_mod, v_status, 'mixed',
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
                 'action', 'Address the priority items identified in module ' || v_mod || ' and confirm they meet the relevant standard.',
                 'priority', 'medium',
                 'timeframe', '30-90 days')),
             'areasToExplore', jsonb_build_array(),
             'professionalReview', jsonb_build_array())
         else null end,
         now() - (v_days || ' days')::interval - interval '2 days',
         case when v_status = 'completed' then now() - (v_days || ' days')::interval else null end,
         v_org, v_site_id, v_user, v_user)
      on conflict (organisation_id, site_id, module_id) do nothing;
    end loop;
  end loop;

  -- DIAP items from the completed assessments (valid statuses only)
  delete from diap_items where organisation_id = v_org and session_id like 'seed-venue-%';

  for v_rec in
    select mp.site_id as site_id, mp.session_id as session_id, mp.module_id as module_id, act.value as action
      from module_progress mp
      cross join lateral jsonb_array_elements(coalesce(mp.summary->'priorityActions', '[]'::jsonb)) with ordinality as act(value, ord)
     where mp.organisation_id = v_org and mp.status = 'completed'
     order by mp.site_id, mp.module_id, act.ord
  loop
    v_ord := v_ord + 1;
    v_dstatus := case (v_ord % 10)
      when 0 then 'achieved' when 1 then 'achieved'
      when 2 then 'ongoing'
      when 3 then 'in-progress' when 4 then 'in-progress' when 5 then 'in-progress'
      else 'not-started'
    end;
    insert into diap_items
      (id, session_id, site_id, organisation_id, objective, action, category, priority,
       timeframe, status, module_source, question_source, created_at, updated_at, completed_at, user_id)
    values
      (gen_random_uuid(), v_rec.session_id, v_rec.site_id, v_org,
       coalesce(v_rec.action->>'questionText', v_rec.action->>'action'),
       coalesce(v_rec.action->>'action', v_rec.action->>'questionText'),
       'other',
       coalesce(v_rec.action->>'priority', 'medium'),
       coalesce(v_rec.action->>'timeframe', '30-90 days'),
       v_dstatus, v_rec.module_id, v_rec.action->>'questionId',
       now() - interval '40 days', now() - interval '5 days',
       case when v_dstatus = 'achieved' then now() - interval '7 days' else null end,
       v_user);
  end loop;

  -- Session + discovery so the demo account restores on sign-in
  insert into sessions (session_id, organisation_id, user_id, business_snapshot, selected_modules, created_at, updated_at)
  values ('seed-venue-org-session', v_org, v_user,
    jsonb_build_object('organisation_name', v_name, 'organisation_size', 'large',
      'business_types', jsonb_build_array('venue'), 'user_role', 'owner',
      'has_physical_venue', true, 'has_online_presence', true,
      'serves_public_customers', true, 'has_online_services', true),
    v_modules, now() - interval '60 days', now())
  on conflict (session_id) do update
    set organisation_id = excluded.organisation_id, user_id = excluded.user_id,
        business_snapshot = excluded.business_snapshot, selected_modules = excluded.selected_modules,
        updated_at = now();

  if exists (select 1 from discovery_data where organisation_id = v_org) then
    update discovery_data set recommended_modules = v_modules, review_mode = coalesce(nullif(review_mode, ''), 'deep-dive'), updated_at = now()
     where organisation_id = v_org;
  else
    insert into discovery_data (organisation_id, user_id, recommended_modules, review_mode, created_at, updated_at)
    values (v_org, v_user, v_modules, 'deep-dive', now() - interval '60 days', now());
  end if;

  select count(*) into v_fill from module_progress where organisation_id = v_org;
  select count(*) into v_diap from diap_items where organisation_id = v_org;
  raise notice 'Done. % — module_progress rows: %, DIAP items: %. Sign out and back in on the demo account.', v_name, v_fill, v_diap;
end $$;
