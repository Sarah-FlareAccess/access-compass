-- =====================================================
-- Major Venue demo: Partner Venue Program (fifth program)
-- =====================================================
-- Adds a Partner Venue Program to the convention-centre demo org, alongside the
-- four in venue_demo_programs.sql. These are the offsite and satellite venues
-- the centre programs events into: pavilions, halls, studios and function rooms
-- it does not own but does put delegates through.
--
-- Commercially this is the most useful of the five to demo, because it is the
-- shape a festival or a council recognises: a host organisation with a network
-- of independent venues it can influence but not manage.
--
-- TWO THINGS THIS DOES DIFFERENTLY TO venue_demo_programs.sql
--
-- 1. Confidence is assigned from a per-venue readiness profile, not the
--    `v_mi % 3` rotation used previously. That rotation gave every venue an
--    identical strong/mixed/needs-work cycle, so the module readiness meter
--    showed the same figure for every module and no venue was distinguishable
--    from another. Real cohorts have strong venues and struggling ones. Each
--    venue here gets a tier, and its bands are drawn from that tier with
--    variation by module, so the cohort produces a genuine spread.
--
-- 2. Bands follow the CORRECTED banding (see backfill_confidence_snapshot.sql),
--    so this data is consistent with what the app now computes.
--
-- PREREQUISITE: venue_demo_programs.sql must have run (it creates the org as an
-- authority and defines the shared content map). Idempotent; safe to re-run.
-- =====================================================
do $$
declare
  v_org       uuid;
  v_prog_id   uuid;
  v_prog_mods text[];
  v_child     uuid;
  v_slug      text;
  v_rec       record;
  v_days      int;
  v_enrolled  timestamptz;
  v_submitted timestamptz;
  v_completed timestamptz;
  v_mod       text;
  v_mi        int;
  v_mcount    int;
  v_mstatus   text;
  v_conf      text;
  v_mc        jsonb;
  v_roll      int;
  -- Module-specific findings, same shape as venue_demo_programs.sql so the
  -- cohort report and the per-business panel read as real content.
  v_content jsonb := jsonb_build_object(
    '3.1', jsonb_build_object('priority','high','action','Provide a choice of seating heights with armrests and keep circulation routes at least 1200mm wide in all public areas.','strengths',jsonb_build_array('Clear space is kept between furniture so mobility-aid users can move through freely.','A mix of seating with and without armrests is offered in waiting areas.'),'explore','Whether floor-to-furniture colour contrast is strong enough for people with low vision.'),
    '4.2', jsonb_build_object('priority','high','action','Run disability-awareness and communication-access training so front-line staff can confidently assist a range of access needs.','strengths',jsonb_build_array('Staff offer assistance without waiting to be asked.','Team members are comfortable using plain language and assistive devices.'),'explore','How to support customers who are non-speaking or have communication disability.'),
    '6.2', jsonb_build_object('priority','high','action','Audit the accessible path of travel from drop-off and parking to the event space and keep it clear of cables, signage and furniture on the day.','strengths',jsonb_build_array('Accessible parking and a step-free entrance are available.','Accessible toilets are within easy reach of the event space.'),'explore','Whether temporary event layouts keep the accessible path of travel clear.'),
    '6.4', jsonb_build_object('priority','medium','action','Offer a hearing augmentation system and a quiet or low-sensory space, and test AV captioning before doors open.','strengths',jsonb_build_array('A hearing loop is available in the main space.','Lighting and sound can be adjusted for sensory comfort.'),'explore','Whether hearing augmentation coverage reaches the whole space.'),
    '6.5', jsonb_build_object('priority','medium','action','Brief all event staff and volunteers on the access features and the location of accessible facilities before doors open.','strengths',jsonb_build_array('A staffed help point is available for attendees.','Accessible facilities are signed and kept clear during the event.'),'explore','Whether all casual event staff receive the access briefing.'),
    '7.1', jsonb_build_object('priority','medium','action','Publish a consistent accessible wayfinding scheme across all venues and shared spaces in the precinct.','strengths',jsonb_build_array('Accessible routes between venues are mapped.','Wayfinding signage is coordinated across the precinct.'),'explore','Whether wayfinding is consistent across every venue in the precinct.')
  );
begin
  select id into v_org from organisations
   where name ilike '%convention%' order by created_at limit 1;
  if v_org is null then
    raise exception 'No org name contains "convention" - run venue_demo_seed.sql then venue_demo_programs.sql first.';
  end if;

  -- ---------------------------------------------------------------
  -- 1. THE PROGRAM
  -- ---------------------------------------------------------------
  insert into authority_programs
    (organisation_id, name, slug, description, required_module_ids, access_level,
     starts_at, ends_at, allow_self_enrol, is_active, funding_model,
     license_price_cents, enrol_message)
  values
    (v_org,
     'Partner Venue Program',
     'partner-venue',
     'Accessibility assessment for the offsite and satellite venues the centre programs events into. Covers getting to and into the space, moving around it, sensory and hearing access, and how the venue runs on the day.',
     array['6.2','3.1','6.4','7.1','4.2','6.5'],
     'pulse',
     now() - interval '100 days', now() + interval '265 days',
     true, true, 'authority_funded',
     null,
     'Redgum Convention & Exhibition Centre asks partner venues to complete this accessibility assessment once a year. It takes about 25 minutes. You keep your assessment and can reuse it, and the centre sees your progress and a summary of your strengths and opportunities, not your individual answers.')
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

  select id, required_module_ids into v_prog_id, v_prog_mods
    from authority_programs where organisation_id = v_org and slug = 'partner-venue';

  -- ---------------------------------------------------------------
  -- 2. PARTNER VENUES
  -- ---------------------------------------------------------------
  -- tier drives the readiness profile:
  --   'strong'     mostly strong, occasional mixed
  --   'improving'  mixed with some strong
  --   'early'      mostly needs-work, occasional mixed
  -- All names are invented. None is a real venue.
  for v_rec in
    select * from (values
      ('Wattle Grove Pavilion',            'completed',   96, 'strong'),
      ('Riverbend Arts Centre',            'completed',   88, 'improving'),
      ('Foreshore Function Rooms',         'completed',   74, 'strong'),
      ('The Old Mill Event Space',         'submitted',   61, 'early'),
      ('Northgate Sports Hall',            'submitted',   52, 'improving'),
      ('Harbourlight Studios',             'in_progress', 38, 'strong'),
      ('Cedar Park Community Hall',        'in_progress', 27, 'early'),
      ('Terrace Room at the Botanic Gardens','enrolled',   16, 'improving'),
      ('Saltbush Woolshed',                'enrolled',     9, 'improving'),
      ('Kingfisher Lakeside Marquee',      'withdrawn',   130, 'early')
    ) as t(biz_name, enrol_status, days_ago, tier)
  loop
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

    -- ---------------------------------------------------------------
    -- 3. MODULE PROGRESS
    -- ---------------------------------------------------------------
    if v_rec.enrol_status in ('completed', 'submitted', 'in_progress') then
      v_mcount := array_length(v_prog_mods, 1);
      v_mi := 0;
      foreach v_mod in array v_prog_mods loop
        v_mi := v_mi + 1;
        if v_rec.enrol_status in ('completed', 'submitted') then
          v_mstatus := 'completed';
        else
          if v_mi <= ceil(v_mcount::numeric / 2) then
            v_mstatus := 'completed';
          elsif v_mi < v_mcount then
            v_mstatus := 'in-progress';
          else
            v_mstatus := null;
          end if;
        end if;
        if v_mstatus is null then continue; end if;

        -- Deterministic per (venue, module) so re-running is stable, but varied
        -- enough that a venue is not uniform across its own modules.
        v_roll := (v_mi * 7 + length(v_rec.biz_name)) % 10;
        v_conf := case v_rec.tier
          when 'strong'    then case when v_roll < 7 then 'strong' when v_roll < 9 then 'mixed' else 'needs-work' end
          when 'improving' then case when v_roll < 3 then 'strong' when v_roll < 8 then 'mixed' else 'needs-work' end
          else                  case when v_roll < 1 then 'strong' when v_roll < 4 then 'mixed' else 'needs-work' end
        end;

        v_mc := v_content -> v_mod;

        insert into module_progress
          (session_id, module_id, module_code, status, confidence_snapshot, summary,
           started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)
        values
          ('seed-pv-' || v_child || '-' || v_mod, v_mod, v_mod, v_mstatus,
           case when v_mstatus = 'completed' then v_conf else null end,
           case when v_mstatus = 'completed' and v_mc is not null then
             jsonb_build_object(
               'doingWell', v_mc -> 'strengths',
               'priorityActions', jsonb_build_array(
                 jsonb_build_object(
                   'questionId', v_mod || '-A-1',
                   'questionText', v_mc ->> 'action',
                   'action', v_mc ->> 'action',
                   'priority', v_mc ->> 'priority',
                   'timeframe', '30-90 days')),
               'areasToExplore', jsonb_build_array(v_mc ->> 'explore'),
               'professionalReview', jsonb_build_array())
           else null end,
           v_enrolled,
           case when v_mstatus = 'completed' then coalesce(v_completed, v_submitted, now() - interval '5 days') else null end,
           v_child, null, null, null)
        -- Arbiter is (organisation_id, site_id, module_id), which is NULLS NOT
        -- DISTINCT since migration 032, so a null site_id still dedupes. Using
        -- (session_id, module_id) would miss a collision on that index.
        on conflict (organisation_id, site_id, module_id) do update
          set status = excluded.status,
              confidence_snapshot = excluded.confidence_snapshot,
              summary = excluded.summary,
              completed_at = excluded.completed_at,
              updated_at = now();
      end loop;
    end if;
  end loop;

  -- ---------------------------------------------------------------
  -- 4. CORRECT A NOW-INACCURATE ENROLMENT PROMISE
  -- ---------------------------------------------------------------
  -- The supplier program told enrolees "we only see your completion status".
  -- That is no longer true: the host also sees a summary of strengths and
  -- opportunities. The guarantee that still holds is about answers, evidence
  -- and the action plan, so say that instead.
  update authority_programs
     set enrol_message = 'Completing this accessibility assessment is a requirement of joining the Redgum Convention & Exhibition Centre preferred-supplier panel. The centre sees your progress and a summary of your strengths and opportunities. Your individual answers, your evidence and your action plan stay private to you.',
         updated_at = now()
   where organisation_id = v_org
     and slug = 'procurement-partner'
     and enrol_message like '%only see your completion status%';

  raise notice 'Partner Venue Program seeded with 10 partner venues.';
end $$;
