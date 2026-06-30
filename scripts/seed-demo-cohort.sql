-- =====================================================
-- Demo cohort seed for Authority Portal demo
-- =====================================================
-- Populates an existing authority organisation with 4 demo programs,
-- ~42 businesses, enrolments, and module_progress rows with realistic
-- confidence bands and summary jsonb. Used to show populated dashboards
-- and program reports during sales demos.
--
-- USAGE:
--   1. Edit v_authority below with the UUID of your authority org.
--      (Find it with: SELECT id, name FROM organisations
--                     WHERE org_type = 'authority';)
--   2. Run the whole file in Supabase SQL Editor.
--   3. Visit /authority to see populated dashboards.
--   4. Click into each program and click "Generate report" to fill
--      the dashboard's Cohort Snapshot from real program_reports rows.
--
-- IDEMPOTENT: Re-running wipes the prior demo data first
-- (identified by slugs prefixed 'demo-') and re-seeds fresh.
--
-- Programs created:
--   - Tourism Grant Round 2026                (5 modules, 12 businesses)
--   - Event Partner Onboarding 2026           (8 modules, 8 businesses)
--   - Amplify Access for Better Business      (10 modules, 15 businesses)
--   - Designing Accessible Experiences        (7 modules, 7 businesses)
-- =====================================================

DO $seed$
DECLARE
  v_authority UUID := '00000000-0000-0000-0000-000000000000'::UUID;  -- <-- EDIT THIS
  v_now TIMESTAMPTZ := NOW();

  v_prog_grants UUID;
  v_prog_events UUID;
  v_prog_business UUID;
  v_prog_experiences UUID;

  v_biz_id UUID;
  v_biz_name TEXT;
  v_biz_slug TEXT;
  v_mod_id TEXT;
  v_status TEXT;
  v_confidence TEXT;
  v_summary JSONB;
  v_enrol_status TEXT;
  i INTEGER;

  -- Generic business names (no real businesses per project memory)
  c_biz_grants TEXT[] := ARRAY[
    'Sunrise Cafe', 'Riverside Bakery', 'Main Street Books', 'Lakeside Gallery',
    'Northern Plant Nursery', 'Old Mill Brewery', 'Coastal Wines', 'Heritage Tea Rooms',
    'Sunset Souvenirs', 'Village Honey Co', 'Foothills Pottery', 'Harbour Fish Co'
  ];
  -- Partner businesses (stallholders, vendors, performers attending events)
  c_biz_events TEXT[] := ARRAY[
    'Wood-Fired Pizza Van', 'Stone Lane Coffee Cart', 'Brushstrokes Face Painting',
    'Sound Garden Acoustic Duo', 'Trinket Market Stall', 'Mountain Honey Co',
    'Roving Stilts Performers', 'Sweetbox Donut Truck'
  ];
  -- Mixed industries: health, retail, food, services, education, wellbeing
  c_biz_business TEXT[] := ARRAY[
    'Northside General Practice',     -- health
    'Cornerstone Dental',             -- health
    'Mountain View Physiotherapy',    -- health
    'Riverbank Pharmacy',             -- health / retail
    'Lighthouse Optometry',           -- health
    'Brookside Veterinary',           -- health-adjacent
    'Movement Yoga Studio',           -- wellbeing
    'Bluestone Bakery',               -- food
    'Honest Joe Cafe',                -- food
    'Anchor Hardware',                -- retail
    'Patchwork Boutique',             -- retail (fashion)
    'Field Notes Bookshop',           -- retail
    'Highland Music School',          -- education
    'Foundry Coworking',              -- services
    'Cornerstone Hair Salon'          -- services
  ];
  c_biz_experiences TEXT[] := ARRAY[
    'Heritage Town Museum', 'Wetlands Discovery Centre', 'Botanical Walk',
    'Coastal Heritage Trail', 'Childrens Adventure Park', 'Indigenous Cultural Centre',
    'Maritime Heritage Site'
  ];

  -- Module sets for each program
  c_modules_grants TEXT[] := ARRAY['1.1','1.5','2.1','4.1','4.5'];
  -- Partner-facing: arrival/setup, customer interaction, core event modules.
  -- Drops organiser-only 7.1 (precinct coord) and 7.2 (programming).
  c_modules_events TEXT[] := ARRAY['2.1','4.1','6.1','6.2','6.3','6.4','6.5','7.6'];
  c_modules_business TEXT[] := ARRAY['1.1','2.1','3.1','3.3','3.7','4.1','4.5','5.4','5.5','5.7'];
  c_modules_experiences TEXT[] := ARRAY['3.1','3.2','3.3','3.4','3.7','3.9','3.12'];

  -- Priority actions library (generic, realistic)
  c_priorities TEXT[] := ARRAY[
    'Install a ramp at the main entrance',
    'Add a clear accessibility information page to your website',
    'Train customer-facing staff in disability awareness',
    'Provide menus and key documents in large print',
    'Audit your booking system against WCAG 2.2 AA',
    'Install hearing loops at service counters',
    'Designate accessible parking spaces with clear signage',
    'Review signage for high-contrast readability',
    'Add Auslan interpretation for major announcements',
    'Provide quiet hours or sensory-friendly sessions',
    'Update emergency evacuation plans to cover visitors with disability',
    'Create an Easy Read version of your visitor information',
    'Survey customers with disability after their visit',
    'Add captioning to all video content',
    'Stock assistive listening devices at reception',
    'Map step-free routes through the venue',
    'Train booking staff to record access requirements',
    'Add a Companion Card option at the point of sale',
    'Establish a disability advisory group with paid lived experience input',
    'Audit your website against WCAG 2.2 AA',
    'Provide a portable hearing loop for ad hoc events',
    'Review counter heights for wheelchair users',
    'Install tactile ground surface indicators on key routes',
    'Publish photographs of accessibility features on your website'
  ];

  -- Strengths library
  c_strengths TEXT[] := ARRAY[
    'Step-free access to the main service area',
    'Accessible toilet available and well maintained',
    'Booking system accepts the Companion Card',
    'Staff have completed disability awareness training',
    'Clear high-contrast signage at key decision points',
    'Quiet space available on request',
    'Designated accessible parking near the entrance',
    'Service animals welcome with no restrictions',
    'Website includes a clear accessibility statement',
    'Hearing loop installed and signposted at counter',
    'Large-print menus available on request',
    'Wheelchair-accessible counter at point of sale',
    'Multiple booking channels (online, phone, in person)',
    'Lighting suitable for low-vision customers',
    'Captions available on all visitor-facing video',
    'Information published in plain language'
  ];

  -- Areas to explore library
  c_areas TEXT[] := ARRAY[
    'Whether all customer-facing technology meets WCAG 2.2 AA',
    'How accessible the emergency evacuation procedure is',
    'Whether visitor information is available in alternative formats',
    'Whether staff training covers hidden disabilities',
    'Whether feedback channels are accessible to all customers',
    'How the booking system handles access requirements',
    'Whether car park markings meet AS or NZS 2890.6',
    'Whether tactile wayfinding meets sector best practice'
  ];

  -- Realistic enrolment-status distribution
  c_enrol_statuses TEXT[] := ARRAY[
    'completed','completed','completed',
    'submitted','submitted',
    'in_progress','in_progress','in_progress','in_progress',
    'enrolled'
  ];
BEGIN
  -- =====================================================
  -- 0. Sanity check: authority org exists and is authority type
  -- =====================================================
  IF NOT EXISTS (SELECT 1 FROM organisations WHERE id = v_authority AND org_type = 'authority') THEN
    RAISE EXCEPTION 'Authority org % not found or not of type authority. Edit v_authority at the top of this script.', v_authority;
  END IF;

  -- =====================================================
  -- 1. Clean up existing demo data for this authority
  -- =====================================================
  RAISE NOTICE 'Cleaning up prior demo data...';

  DELETE FROM module_progress
    WHERE organisation_id IN (
      SELECT id FROM organisations
      WHERE parent_org_id = v_authority AND slug LIKE 'demo-%'
    );

  DELETE FROM program_reports
    WHERE organisation_id = v_authority
    AND program_id IN (
      SELECT id FROM authority_programs
      WHERE organisation_id = v_authority AND slug LIKE 'demo-%'
    );

  -- enrolments cascade from program delete, child orgs cascade from org delete
  DELETE FROM authority_programs
    WHERE organisation_id = v_authority AND slug LIKE 'demo-%';

  DELETE FROM organisations
    WHERE parent_org_id = v_authority AND slug LIKE 'demo-%';

  -- =====================================================
  -- 2. Create the 4 programs
  -- =====================================================
  RAISE NOTICE 'Creating programs...';

  INSERT INTO authority_programs (organisation_id, name, slug, description, required_module_ids, access_level, allow_self_enrol, is_active, funding_model)
    VALUES (v_authority, 'Tourism Grant Round 2026', 'demo-tourism-grant-2026',
      'Accessibility assessment required for businesses receiving a 2026 tourism grant.',
      c_modules_grants, 'pulse', true, true, 'authority_funded')
    RETURNING id INTO v_prog_grants;

  INSERT INTO authority_programs (organisation_id, name, slug, description, required_module_ids, access_level, allow_self_enrol, is_active, funding_model)
    VALUES (v_authority, 'Event Partner Onboarding 2026', 'demo-event-partner-onboarding-2026',
      'Onboarding modules that businesses must complete to participate as a partner (stallholder, vendor, performer, exhibitor) at council-supported events in 2026.',
      c_modules_events, 'deep_dive', true, true, 'authority_funded')
    RETURNING id INTO v_prog_events;

  INSERT INTO authority_programs (organisation_id, name, slug, description, required_module_ids, access_level, allow_self_enrol, is_active, funding_model)
    VALUES (v_authority, 'Amplify Access for Better Business', 'demo-amplify-access-for-better-business',
      'Capacity-building program for local SMEs across health, retail, food and services to build inclusive customer experiences end-to-end.',
      c_modules_business, 'pulse', true, true, 'authority_funded')
    RETURNING id INTO v_prog_business;

  INSERT INTO authority_programs (organisation_id, name, slug, description, required_module_ids, access_level, allow_self_enrol, is_active, funding_model)
    VALUES (v_authority, 'Designing Accessible Experiences', 'demo-designing-accessible-experiences',
      'Deep dive for venues and cultural sites designing the visitor experience for inclusion.',
      c_modules_experiences, 'deep_dive', false, true, 'co_funded')
    RETURNING id INTO v_prog_experiences;

  -- =====================================================
  -- 3. Seed businesses + enrolments + module_progress per program
  -- =====================================================
  RAISE NOTICE 'Seeding businesses + module progress...';

  -- ---- Grants program ----
  FOR i IN 1..array_length(c_biz_grants, 1) LOOP
    v_biz_name := c_biz_grants[i];
    v_biz_slug := 'demo-grants-' || regexp_replace(lower(v_biz_name), '[^a-z0-9]+', '-', 'g') || '-' || i;

    INSERT INTO organisations (name, slug, org_type, parent_org_id, max_members)
      VALUES (v_biz_name, v_biz_slug, 'standard', v_authority, 10)
      RETURNING id INTO v_biz_id;

    v_enrol_status := c_enrol_statuses[1 + floor(random() * array_length(c_enrol_statuses, 1))::int];
    INSERT INTO program_enrolments (program_id, organisation_id, status, enrolled_at, submitted_at, completed_at)
      VALUES (
        v_prog_grants, v_biz_id, v_enrol_status,
        v_now - (random() * interval '60 days'),
        CASE WHEN v_enrol_status IN ('submitted','completed') THEN v_now - (random() * interval '30 days') ELSE NULL END,
        CASE WHEN v_enrol_status = 'completed' THEN v_now - (random() * interval '14 days') ELSE NULL END
      );

    FOREACH v_mod_id IN ARRAY c_modules_grants LOOP
      v_status := CASE
        WHEN random() < 0.20 THEN 'not-started'
        WHEN random() < 0.50 THEN 'in-progress'
        ELSE 'completed'
      END;
      v_confidence := CASE
        WHEN random() < 0.40 THEN 'strong'
        WHEN random() < 0.78 THEN 'mixed'
        ELSE 'needs-work'
      END;
      v_summary := jsonb_build_object(
        'doingWell', (SELECT jsonb_agg(c_strengths[1 + floor(random() * array_length(c_strengths, 1))::int])
                      FROM generate_series(1, 2 + floor(random() * 3)::int)),
        'priorityActions', (SELECT jsonb_agg(jsonb_build_object(
                              'action', c_priorities[1 + floor(random() * array_length(c_priorities, 1))::int],
                              'priority', CASE WHEN random() < 0.3 THEN 'high' WHEN random() < 0.7 THEN 'medium' ELSE 'low' END
                            )) FROM generate_series(1, 2 + floor(random() * 3)::int)),
        'areasToExplore', (SELECT jsonb_agg(c_areas[1 + floor(random() * array_length(c_areas, 1))::int])
                           FROM generate_series(1, 1 + floor(random() * 2)::int))
      );
      INSERT INTO module_progress (organisation_id, session_id, module_id, module_code, status, started_at, completed_at, confidence_snapshot, summary)
        VALUES (
          v_biz_id, 'demo-' || v_biz_id::text || '-' || v_mod_id, v_mod_id, v_mod_id,
          v_status,
          v_now - (random() * interval '30 days'),
          CASE WHEN v_status = 'completed' THEN v_now - (random() * interval '14 days') ELSE NULL END,
          CASE WHEN v_status = 'completed' THEN v_confidence ELSE NULL END,
          CASE WHEN v_status <> 'not-started' THEN v_summary ELSE NULL END
        );
    END LOOP;
  END LOOP;

  -- ---- Events program ----
  FOR i IN 1..array_length(c_biz_events, 1) LOOP
    v_biz_name := c_biz_events[i];
    v_biz_slug := 'demo-events-' || regexp_replace(lower(v_biz_name), '[^a-z0-9]+', '-', 'g') || '-' || i;

    INSERT INTO organisations (name, slug, org_type, parent_org_id, max_members)
      VALUES (v_biz_name, v_biz_slug, 'standard', v_authority, 10)
      RETURNING id INTO v_biz_id;

    v_enrol_status := c_enrol_statuses[1 + floor(random() * array_length(c_enrol_statuses, 1))::int];
    INSERT INTO program_enrolments (program_id, organisation_id, status, enrolled_at, submitted_at, completed_at)
      VALUES (
        v_prog_events, v_biz_id, v_enrol_status,
        v_now - (random() * interval '60 days'),
        CASE WHEN v_enrol_status IN ('submitted','completed') THEN v_now - (random() * interval '30 days') ELSE NULL END,
        CASE WHEN v_enrol_status = 'completed' THEN v_now - (random() * interval '14 days') ELSE NULL END
      );

    FOREACH v_mod_id IN ARRAY c_modules_events LOOP
      v_status := CASE
        WHEN random() < 0.25 THEN 'not-started'
        WHEN random() < 0.55 THEN 'in-progress'
        ELSE 'completed'
      END;
      v_confidence := CASE
        WHEN random() < 0.30 THEN 'strong'
        WHEN random() < 0.72 THEN 'mixed'
        ELSE 'needs-work'
      END;
      v_summary := jsonb_build_object(
        'doingWell', (SELECT jsonb_agg(c_strengths[1 + floor(random() * array_length(c_strengths, 1))::int])
                      FROM generate_series(1, 2 + floor(random() * 3)::int)),
        'priorityActions', (SELECT jsonb_agg(jsonb_build_object(
                              'action', c_priorities[1 + floor(random() * array_length(c_priorities, 1))::int],
                              'priority', CASE WHEN random() < 0.3 THEN 'high' WHEN random() < 0.7 THEN 'medium' ELSE 'low' END
                            )) FROM generate_series(1, 2 + floor(random() * 4)::int)),
        'areasToExplore', (SELECT jsonb_agg(c_areas[1 + floor(random() * array_length(c_areas, 1))::int])
                           FROM generate_series(1, 1 + floor(random() * 2)::int))
      );
      INSERT INTO module_progress (organisation_id, session_id, module_id, module_code, status, started_at, completed_at, confidence_snapshot, summary)
        VALUES (
          v_biz_id, 'demo-' || v_biz_id::text || '-' || v_mod_id, v_mod_id, v_mod_id,
          v_status,
          v_now - (random() * interval '30 days'),
          CASE WHEN v_status = 'completed' THEN v_now - (random() * interval '14 days') ELSE NULL END,
          CASE WHEN v_status = 'completed' THEN v_confidence ELSE NULL END,
          CASE WHEN v_status <> 'not-started' THEN v_summary ELSE NULL END
        );
    END LOOP;
  END LOOP;

  -- ---- Accessibility in Business program ----
  FOR i IN 1..array_length(c_biz_business, 1) LOOP
    v_biz_name := c_biz_business[i];
    v_biz_slug := 'demo-business-' || regexp_replace(lower(v_biz_name), '[^a-z0-9]+', '-', 'g') || '-' || i;

    INSERT INTO organisations (name, slug, org_type, parent_org_id, max_members)
      VALUES (v_biz_name, v_biz_slug, 'standard', v_authority, 10)
      RETURNING id INTO v_biz_id;

    v_enrol_status := c_enrol_statuses[1 + floor(random() * array_length(c_enrol_statuses, 1))::int];
    INSERT INTO program_enrolments (program_id, organisation_id, status, enrolled_at, submitted_at, completed_at)
      VALUES (
        v_prog_business, v_biz_id, v_enrol_status,
        v_now - (random() * interval '90 days'),
        CASE WHEN v_enrol_status IN ('submitted','completed') THEN v_now - (random() * interval '30 days') ELSE NULL END,
        CASE WHEN v_enrol_status = 'completed' THEN v_now - (random() * interval '14 days') ELSE NULL END
      );

    FOREACH v_mod_id IN ARRAY c_modules_business LOOP
      -- Targets ~28% completed across 15 biz x 10 modules = ~42 completed.
      v_status := CASE
        WHEN random() < 0.30 THEN 'not-started'
        WHEN random() < 0.60 THEN 'in-progress'
        ELSE 'completed'
      END;
      -- Varied: ~35% strong, ~46% mixed, ~19% needs-work
      v_confidence := CASE
        WHEN random() < 0.35 THEN 'strong'
        WHEN random() < 0.70 THEN 'mixed'
        ELSE 'needs-work'
      END;
      v_summary := jsonb_build_object(
        'doingWell', (SELECT jsonb_agg(c_strengths[1 + floor(random() * array_length(c_strengths, 1))::int])
                      FROM generate_series(1, 2 + floor(random() * 3)::int)),
        'priorityActions', (SELECT jsonb_agg(jsonb_build_object(
                              'action', c_priorities[1 + floor(random() * array_length(c_priorities, 1))::int],
                              'priority', CASE WHEN random() < 0.3 THEN 'high' WHEN random() < 0.7 THEN 'medium' ELSE 'low' END
                            )) FROM generate_series(1, 2 + floor(random() * 3)::int)),
        'areasToExplore', (SELECT jsonb_agg(c_areas[1 + floor(random() * array_length(c_areas, 1))::int])
                           FROM generate_series(1, 1 + floor(random() * 2)::int))
      );
      INSERT INTO module_progress (organisation_id, session_id, module_id, module_code, status, started_at, completed_at, confidence_snapshot, summary)
        VALUES (
          v_biz_id, 'demo-' || v_biz_id::text || '-' || v_mod_id, v_mod_id, v_mod_id,
          v_status,
          v_now - (random() * interval '60 days'),
          CASE WHEN v_status = 'completed' THEN v_now - (random() * interval '21 days') ELSE NULL END,
          CASE WHEN v_status = 'completed' THEN v_confidence ELSE NULL END,
          CASE WHEN v_status <> 'not-started' THEN v_summary ELSE NULL END
        );
    END LOOP;
  END LOOP;

  -- ---- Designing Accessible Experiences program ----
  FOR i IN 1..array_length(c_biz_experiences, 1) LOOP
    v_biz_name := c_biz_experiences[i];
    v_biz_slug := 'demo-experiences-' || regexp_replace(lower(v_biz_name), '[^a-z0-9]+', '-', 'g') || '-' || i;

    INSERT INTO organisations (name, slug, org_type, parent_org_id, max_members)
      VALUES (v_biz_name, v_biz_slug, 'standard', v_authority, 10)
      RETURNING id INTO v_biz_id;

    v_enrol_status := c_enrol_statuses[1 + floor(random() * array_length(c_enrol_statuses, 1))::int];
    INSERT INTO program_enrolments (program_id, organisation_id, status, enrolled_at, submitted_at, completed_at)
      VALUES (
        v_prog_experiences, v_biz_id, v_enrol_status,
        v_now - (random() * interval '120 days'),
        CASE WHEN v_enrol_status IN ('submitted','completed') THEN v_now - (random() * interval '45 days') ELSE NULL END,
        CASE WHEN v_enrol_status = 'completed' THEN v_now - (random() * interval '21 days') ELSE NULL END
      );

    FOREACH v_mod_id IN ARRAY c_modules_experiences LOOP
      v_status := CASE
        WHEN random() < 0.15 THEN 'not-started'
        WHEN random() < 0.45 THEN 'in-progress'
        ELSE 'completed'
      END;
      v_confidence := CASE
        WHEN random() < 0.45 THEN 'strong'
        WHEN random() < 0.82 THEN 'mixed'
        ELSE 'needs-work'
      END;
      v_summary := jsonb_build_object(
        'doingWell', (SELECT jsonb_agg(c_strengths[1 + floor(random() * array_length(c_strengths, 1))::int])
                      FROM generate_series(1, 3 + floor(random() * 3)::int)),
        'priorityActions', (SELECT jsonb_agg(jsonb_build_object(
                              'action', c_priorities[1 + floor(random() * array_length(c_priorities, 1))::int],
                              'priority', CASE WHEN random() < 0.3 THEN 'high' WHEN random() < 0.7 THEN 'medium' ELSE 'low' END
                            )) FROM generate_series(1, 2 + floor(random() * 4)::int)),
        'areasToExplore', (SELECT jsonb_agg(c_areas[1 + floor(random() * array_length(c_areas, 1))::int])
                           FROM generate_series(1, 1 + floor(random() * 2)::int))
      );
      INSERT INTO module_progress (organisation_id, session_id, module_id, module_code, status, started_at, completed_at, confidence_snapshot, summary)
        VALUES (
          v_biz_id, 'demo-' || v_biz_id::text || '-' || v_mod_id, v_mod_id, v_mod_id,
          v_status,
          v_now - (random() * interval '90 days'),
          CASE WHEN v_status = 'completed' THEN v_now - (random() * interval '30 days') ELSE NULL END,
          CASE WHEN v_status = 'completed' THEN v_confidence ELSE NULL END,
          CASE WHEN v_status <> 'not-started' THEN v_summary ELSE NULL END
        );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Demo seed complete. Visit /authority to see populated dashboards.';
  RAISE NOTICE 'For each program, click Generate report to populate the Cohort Snapshot.';
END $seed$;
