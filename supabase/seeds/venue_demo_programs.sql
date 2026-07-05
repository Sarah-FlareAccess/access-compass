-- =====================================================
-- Major Venue demo: partner programs for the convention centre
-- =====================================================
-- Layers Authority-Portal "programs" onto the existing convention-centre
-- demo org ("Redgum Convention & Exhibition Centre", the MCEC stand-in) so a
-- major venue sees how it runs accessibility programs for the businesses in
-- its orbit: the clients who book events, the suppliers it procures from, the
-- hospitality tenants on site, and the major-event partners it delivers with.
--
-- Seeds FOUR programs, each with realistic-but-not-real partner businesses at
-- a spread of completion stages (enrolled / in progress / submitted /
-- completed / withdrawn), plus module_progress for the businesses that have
-- started so the cohort report populates.
--
-- PREREQUISITE: the convention org must already exist (run venue_demo_seed.sql
-- first). This script flips that org to org_type='authority' so the Authority
-- Portal nav appears for its owner/admin — it keeps its own venue assessment
-- and dashboard (those read module_progress, independent of org_type).
--
-- Idempotent. Targets the org by name; does NOT touch Redgum Shire Council.
-- Run it, then sign out and back in on the convention-centre demo account.
-- =====================================================
do $$
declare
  v_org      uuid;
  v_name     text;
  v_prog_id  uuid;
  v_prog_mods text[];
  v_child    uuid;
  v_slug     text;
  v_rec      record;
  v_days     int;
  v_enrolled timestamptz;
  v_submitted timestamptz;
  v_completed  timestamptz;
  v_mod      text;
  v_mi       int;
  v_mcount   int;
  v_mstatus  text;
  v_conf     text;
  v_progs    int;
  v_biz      int;
  v_mp       int;
begin
  select id, name into v_org, v_name from organisations
   where name ilike '%convention%' order by created_at limit 1;
  if v_org is null then
    raise exception 'No org name contains "convention" — run venue_demo_seed.sql first (create the convention-centre demo org via onboarding), then re-run this.';
  end if;

  -- Make the venue an authority so it can host partner programs.
  -- (chk_authority_no_parent is satisfied: the convention org has no parent.)
  update organisations set org_type = 'authority' where id = v_org;

  -- ---------------------------------------------------------------
  -- 1. PROGRAMS (upsert by (organisation_id, slug))
  -- ---------------------------------------------------------------
  insert into authority_programs
    (organisation_id, name, slug, description, required_module_ids, access_level,
     starts_at, ends_at, allow_self_enrol, is_active, funding_model,
     license_price_cents, enrol_message)
  values
    (v_org,
     'Event Partner Accessibility Program',
     'event-partner-accessibility',
     'A pre-event accessibility checklist for clients booking and running events at the centre. Covers event promotion, registration, on-the-day access and support so every guest can take part.',
     array['6.1','6.2','6.3','6.4','6.5','3.1','3.4','4.1','4.2'],
     'pulse',
     now() - interval '120 days', now() + interval '300 days',
     true, true, 'authority_funded',
     null,
     'Redgum Convention & Exhibition Centre asks event partners to complete this short accessibility checklist as part of confirming your event. It takes about 20 minutes and helps us support your delegates on the day.'),

    (v_org,
     'Supplier & Procurement Partner Program',
     'procurement-partner',
     'Accessibility assessment for suppliers and contractors on the centre''s preferred-supplier panel — catering, audiovisual, staffing, security, cleaning and stand builders. Part of supplier onboarding and panel review.',
     array['4.1','4.2','4.3','4.4','4.5','5.1','5.7'],
     'deep_dive',
     now() - interval '150 days', null,
     false, true, 'business_funded',
     49900,
     'Completing this accessibility assessment is a requirement of joining the Redgum Convention & Exhibition Centre preferred-supplier panel. Your results stay private; we only see your completion status.'),

    (v_org,
     'On-Site Hospitality Partner Program',
     'hospitality-tenant',
     'An accessibility check-in for the cafes, restaurants, bars and kiosks operating inside the centre. Focuses on getting served, menus and staff awareness so hospitality is accessible to every visitor.',
     array['3.1','3.4','4.1','4.2','4.3'],
     'pulse',
     now() - interval '90 days', null,
     false, true, 'co_funded',
     19900,
     'A quick accessibility check-in for hospitality partners trading within Redgum Convention & Exhibition Centre. We share the cost of your assessment with you.'),

    (v_org,
     'Major Event Delivery Program',
     'major-event-delivery',
     'Full accessibility planning for large-scale flagship events — congresses, expos and festivals — delivered with the centre. Covers the major-events planning modules end to end.',
     array['7.1','7.2','7.3','7.4','7.5','7.6','7.7','6.1','6.2'],
     'deep_dive',
     now() - interval '200 days', null,
     false, true, 'authority_funded',
     null,
     'Major events at Redgum Convention & Exhibition Centre complete a full accessibility plan with our events team. This assessment is the starting point.')
  on conflict (organisation_id, slug) do update
    set name = excluded.name,
        description = excluded.description,
        required_module_ids = excluded.required_module_ids,
        access_level = excluded.access_level,
        starts_at = excluded.starts_at,
        ends_at = excluded.ends_at,
        allow_self_enrol = excluded.allow_self_enrol,
        is_active = excluded.is_active,
        funding_model = excluded.funding_model,
        license_price_cents = excluded.license_price_cents,
        enrol_message = excluded.enrol_message,
        updated_at = now();

  -- ---------------------------------------------------------------
  -- 2. ENROLLED PARTNER BUSINESSES (child orgs + enrolments)
  --    Spread across enrolled / in_progress / submitted / completed
  --    / withdrawn. days = how long ago they enrolled.
  -- ---------------------------------------------------------------
  for v_rec in
    select * from (values
      -- Event Partner Accessibility Program
      ('event-partner-accessibility', 'Meridian Conference Group',            'completed',    74),
      ('event-partner-accessibility', 'Southern Cross Event Management',      'submitted',    51),
      ('event-partner-accessibility', 'TechFront Expo Group',                 'in_progress',  33),
      ('event-partner-accessibility', 'Australian Renewable Energy Forum',    'in_progress',  40),
      ('event-partner-accessibility', 'Horizon Association Management',       'enrolled',     12),
      ('event-partner-accessibility', 'Coral Coast Conventions',             'enrolled',      6),
      ('event-partner-accessibility', 'Lumen Exhibitions',                   'withdrawn',    88),
      -- Supplier & Procurement Partner Program
      ('procurement-partner',         'Sterling Catering Co',                'completed',    96),
      ('procurement-partner',         'BrightStage AV Solutions',            'completed',    80),
      ('procurement-partner',         'Peppercorn Event Staffing',           'submitted',    45),
      ('procurement-partner',         'Guardian Event Security',             'in_progress',  29),
      ('procurement-partner',         'FabriStand Exhibitions',              'in_progress',  22),
      ('procurement-partner',         'CleanSweep Facility Services',        'enrolled',      9),
      ('procurement-partner',         'Aurora Floral & Styling',             'enrolled',      4),
      -- On-Site Hospitality Partner Program
      ('hospitality-tenant',          'Riverbend Coffee Co',                 'completed',    60),
      ('hospitality-tenant',          'Golden Wattle Catering',              'submitted',    38),
      ('hospitality-tenant',          'The Terrace Bar Group',               'in_progress',  20),
      ('hospitality-tenant',          'Atrium Dining Co',                    'enrolled',      7),
      -- Major Event Delivery Program
      ('major-event-delivery',        'Wattlebank Community Festival',       'completed',   110),
      ('major-event-delivery',        'Australian Gaming & Entertainment Expo','submitted',   58),
      ('major-event-delivery',        'National Sports Medicine Congress',   'in_progress',  31),
      ('major-event-delivery',        'Pacific Motor Show',                  'enrolled',     14)
    ) as t(prog_slug, biz_name, enrol_status, days_ago)
  loop
    select id, required_module_ids into v_prog_id, v_prog_mods
      from authority_programs where organisation_id = v_org and slug = v_rec.prog_slug;
    if v_prog_id is null then continue; end if;

    -- Child org: reuse if this partner already exists under this authority.
    select id into v_child from organisations
     where parent_org_id = v_org and name = v_rec.biz_name limit 1;
    if v_child is null then
      v_slug := regexp_replace(lower(v_rec.biz_name), '[^a-z0-9]+', '-', 'g');
      v_slug := regexp_replace(v_slug, '(^-|-$)', '', 'g') || '-rcec';
      insert into organisations
        (name, slug, org_type, parent_org_id, contact_email, allow_domain_auto_join, max_members)
      values
        (v_rec.biz_name, v_slug, 'standard', v_org,
         'access@' || regexp_replace(regexp_replace(lower(v_rec.biz_name), '[^a-z0-9]+', '', 'g'), '(^-|-$)', '', 'g') || '.com.au',
         false, 10)
      returning id into v_child;
    end if;

    v_days := v_rec.days_ago;
    v_enrolled := now() - (v_days || ' days')::interval;
    if v_rec.enrol_status = 'completed' then
      v_submitted := now() - (greatest(v_days / 3, 4) || ' days')::interval;
      v_completed := now() - (greatest(v_days / 5, 2) || ' days')::interval;
    elsif v_rec.enrol_status = 'submitted' then
      v_submitted := now() - (greatest(v_days / 3, 4) || ' days')::interval;
      v_completed := null;
    else
      v_submitted := null;
      v_completed := null;
    end if;

    insert into program_enrolments
      (program_id, organisation_id, status, enrolled_at, submitted_at, completed_at)
    values
      (v_prog_id, v_child, v_rec.enrol_status, v_enrolled, v_submitted, v_completed)
    on conflict (program_id, organisation_id) do update
      set status = excluded.status,
          enrolled_at = excluded.enrolled_at,
          submitted_at = excluded.submitted_at,
          completed_at = excluded.completed_at,
          updated_at = now();

    -- module_progress for partners who have started, so the cohort report
    -- shows real per-module completion + confidence. site_id NULL (no sites).
    if v_rec.enrol_status in ('completed', 'submitted', 'in_progress') then
      v_mcount := array_length(v_prog_mods, 1);
      v_mi := 0;
      foreach v_mod in array v_prog_mods loop
        v_mi := v_mi + 1;
        if v_rec.enrol_status in ('completed', 'submitted') then
          v_mstatus := 'completed';
        else
          -- in_progress: first half done, next in progress, last untouched
          if v_mi <= ceil(v_mcount::numeric / 2) then
            v_mstatus := 'completed';
          elsif v_mi < v_mcount then
            v_mstatus := 'in-progress';
          else
            v_mstatus := null;
          end if;
        end if;
        if v_mstatus is null then continue; end if;

        v_conf := case (v_mi % 3) when 0 then 'strong' when 1 then 'mixed' else 'needs-work' end;

        insert into module_progress
          (session_id, module_id, module_code, status, confidence_snapshot, summary,
           started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)
        values
          ('seed-prog-' || v_child || '-' || v_mod, v_mod, v_mod, v_mstatus, v_conf,
           case when v_mstatus = 'completed' then
             jsonb_build_object(
               'doingWell', jsonb_build_array(
                 'Core requirements for module ' || v_mod || ' were reviewed and are in place.',
                 'Staff are aware of the access considerations covered by module ' || v_mod || '.'),
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
           v_enrolled + interval '1 day',
           case when v_mstatus = 'completed' then coalesce(v_completed, v_submitted, now() - interval '3 days') else null end,
           v_child, null, null, null)
        on conflict (organisation_id, site_id, module_id) do nothing;
      end loop;
    end if;
  end loop;

  select count(*) into v_progs from authority_programs where organisation_id = v_org;
  select count(*) into v_biz from organisations where parent_org_id = v_org;
  select count(*) into v_mp from module_progress mp
    where mp.organisation_id in (select id from organisations where parent_org_id = v_org);
  raise notice 'Done. % — programs: %, partner businesses: %, partner module_progress rows: %. Sign out and back in on the convention-centre demo account to see the Authority Portal.', v_name, v_progs, v_biz, v_mp;
end $$;
