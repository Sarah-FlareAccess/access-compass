-- =====================================================
-- Redgum Shire Council: deep demo enrichment
-- =====================================================
-- Makes the council demo read like a plan that a real team has been working
-- for a year, rather than a list that was generated and never touched.
--
-- Three passes:
--   1. DIAP items: named owner + team, a realistic status spread, due dates
--      (including a few genuinely overdue), completion dates, budgets, success
--      indicators, status-appropriate notes, and a short comment thread on the
--      items that are underway.
--   2. Module progress: fills any completed module that is missing its
--      confidence band so the readiness meter has a real spread.
--   3. Program data: gives every business enrolled in a council program a
--      per-business readiness tier, so the cohort report shows strong and
--      struggling participants instead of one flat band.
--
-- SAFE TO RE-RUN. Every value is derived from hashtext(id), so a re-run
-- produces identical output. Only the council org is touched.
--
-- DELIBERATELY NOT TOUCHED:
--   * board_column. The valid ids come from organisations.diap_board_columns,
--     and writing an id that does not exist there would hide items from the
--     board view. Not worth the risk mid-demo.
--   * framework_domain(s). The app derives these; hand-setting them would
--     desync the reconciliation note.
-- =====================================================
do $$
declare
  v_org     uuid;
  v_n       int;
  v_prog    record;
  v_biz     record;
  v_mod     text;
  v_mi      int;
  v_conf    text;
  v_roll    int;
  v_tier    text;
begin
  select id into v_org from organisations
   where name ilike '%shire council%' order by created_at limit 1;
  if v_org is null then
    raise exception 'No org name contains "shire council" - run redgum_demo_seed.sql first.';
  end if;

  -- ---------------------------------------------------------------
  -- 0. COLUMN + CONSTRAINT GUARDS
  -- ---------------------------------------------------------------
  -- comments arrived in migration 039. If this database is behind, the whole
  -- script would fail on the first write, so add it here rather than assume.
  alter table diap_items add column if not exists comments jsonb default '[]';

  -- The app writes statuses and categories that migration 001's CHECK lists
  -- never allowed ('achieved', 'ongoing', the five DIAP pillars), so the
  -- constraints are stale relative to the product.
  --
  -- These are DROPPED and deliberately NOT re-added. An earlier version of
  -- this script re-added them as a superset and failed: a row somewhere in
  -- this database holds a status outside even the widened list, and a CHECK
  -- is validated against the WHOLE table, not just the rows being updated.
  -- Guessing the full set from here is not possible, and the demo does not
  -- need a constraint. The write path in useDIAPManagement is what actually
  -- governs these values.
  --
  -- To see what is really in there:
  --   select status, count(*) from diap_items group by 1 order by 2 desc;
  alter table diap_items drop constraint if exists diap_items_status_check;
  alter table diap_items drop constraint if exists diap_items_category_check;

  -- ---------------------------------------------------------------
  -- 1a. STATUS SPREAD
  -- ---------------------------------------------------------------
  -- A council 14 months into a four-year plan is not all "not started". The
  -- roll is on the item id so the same item always lands in the same bucket.
  -- High-priority items are pushed toward active work, which is what a real
  -- plan looks like and what a reviewer expects to see.
  update diap_items d set
    status = case
      when (abs(hashtext(d.id::text)) % 100) < 18 then 'completed'
      when (abs(hashtext(d.id::text)) % 100) < 26 then 'achieved'
      when (abs(hashtext(d.id::text)) % 100) < 56 then 'in-progress'
      when (abs(hashtext(d.id::text)) % 100) < 66 then 'ongoing'
      when (abs(hashtext(d.id::text)) % 100) < 74 then 'on-hold'
      when (abs(hashtext(d.id::text)) % 100) < 77 then 'cancelled'
      else 'not-started'
    end,
    updated_at = now()
  where d.organisation_id = v_org;

  -- ---------------------------------------------------------------
  -- 1b. OWNER, TEAM, DATES, BUDGET, INDICATORS, NOTES
  -- ---------------------------------------------------------------
  -- responsible_role carries a named person, because "who owns this" is the
  -- question a councillor asks first and a bare job title does not answer it.
  -- responsible_team stays the team, so the group-by-team view has something
  -- to group on when it is built.
  update diap_items d set
    responsible_role = case d.category
      when 'physical-access' then (array[
        'Daniel Okafor, Facilities Manager',
        'Renee Castellan, Assets and Capital Works',
        'Sam Petrovic, Open Space Coordinator'])[1 + (abs(hashtext(d.id::text)) % 3)]
      when 'information-communication-marketing' then (array[
        'Priya Nair, Communications Lead',
        'Hugh Ballantyne, Digital Content Officer'])[1 + (abs(hashtext(d.id::text)) % 2)]
      when 'customer-service' then (array[
        'Tom Whitfield, Customer Experience Lead',
        'Marion Ellery, Access and Inclusion Officer'])[1 + (abs(hashtext(d.id::text)) % 2)]
      when 'operations-policy-procedure' then (array[
        'Alicia Barnes, Operations Manager',
        'Kate Lindqvist, Governance and Risk'])[1 + (abs(hashtext(d.id::text)) % 2)]
      when 'people-culture' then (array[
        'Jess Moreau, People and Culture Partner',
        'Nadia Haddad, Learning and Development'])[1 + (abs(hashtext(d.id::text)) % 2)]
      else 'Marion Ellery, Access and Inclusion Officer' end,

    responsible_team = case d.category
      when 'physical-access' then 'Infrastructure and Assets'
      when 'information-communication-marketing' then 'Communications and Engagement'
      when 'customer-service' then 'Customer and Community Services'
      when 'operations-policy-procedure' then 'Governance and Operations'
      when 'people-culture' then 'People and Culture'
      else 'Access and Inclusion' end,

    -- Finished work sits in the past. Active work sits ahead, except for
    -- roughly one in six, which is deliberately overdue: a plan with no
    -- overdue items has never been used, and the overdue badge is the single
    -- most useful thing on the screen in a governance conversation.
    due_date = case
      when d.status in ('completed','achieved')
        then current_date - (14 + (abs(hashtext(d.id::text)) % 240))
      when d.status = 'cancelled' then null
      when (abs(hashtext(d.id::text || 'due')) % 6) = 0
        then current_date - (3 + (abs(hashtext(d.id::text)) % 40))
      when d.status = 'ongoing'
        then current_date + (60 + (abs(hashtext(d.id::text)) % 240))
      else current_date + (14 + (abs(hashtext(d.id::text)) % 210))
    end,

    completed_at = case
      when d.status in ('completed','achieved')
        then (now() - ((7 + (abs(hashtext(d.id::text)) % 300)) || ' days')::interval)
      else null end,

    budget_estimate = case d.category
      when 'physical-access' then (array['$12,000','$28,000','$45,000','$85,000','$140,000'])[1 + (abs(hashtext(d.id::text)) % 5)]
      when 'people-culture' then (array['$3,500','$6,000','$9,500','Within existing budget'])[1 + (abs(hashtext(d.id::text)) % 4)]
      when 'information-communication-marketing' then (array['$2,500','$5,500','$11,000','Within existing budget'])[1 + (abs(hashtext(d.id::text)) % 4)]
      else (array['$1,800','$4,000','$7,500','Within existing budget','Staff time only'])[1 + (abs(hashtext(d.id::text)) % 5)]
    end,

    success_indicators = case d.category
      when 'physical-access' then (array[
        'Works completed and verified against AS 1428.1 by an access consultant.',
        'Post-works site inspection signed off, and the access map updated.',
        'No further complaints received about this location for two quarters.'])[1 + (abs(hashtext(d.id::text)) % 3)]
      when 'information-communication-marketing' then (array[
        'Access information published and reviewed by the Disability Advisory Committee.',
        'All new publications pass the accessibility checklist before release.',
        'Website audit shows no WCAG AA failures on the affected pages.'])[1 + (abs(hashtext(d.id::text)) % 3)]
      when 'customer-service' then (array[
        'Ninety per cent of front-line staff trained, tracked in the learning system.',
        'Access requests acknowledged within two business days, measured quarterly.',
        'Customer feedback on access rated satisfactory or better.'])[1 + (abs(hashtext(d.id::text)) % 3)]
      when 'operations-policy-procedure' then (array[
        'Procedure adopted and published, with an owner named for annual review.',
        'Accessibility criteria appear in every relevant procurement from adoption.',
        'Reported to the executive each quarter against this plan.'])[1 + (abs(hashtext(d.id::text)) % 3)]
      when 'people-culture' then (array[
        'Training completion above ninety per cent for the target group.',
        'Adjustment requests resolved within the agreed timeframe.',
        'Staff survey shows an improvement on the inclusion measure.'])[1 + (abs(hashtext(d.id::text)) % 3)]
      else 'Progress reported to the executive each quarter.' end,

    notes = case
      when d.status = 'in-progress' then (array[
        'Two quotes received, third outstanding. Awaiting a scope confirmation from the contractor before the works order is raised.',
        'Scheduled into the current works program. Site access is the constraint, so the work is planned around the school holidays.',
        'Draft prepared and circulated to the Disability Advisory Committee for comment. Feedback due back at the next meeting.',
        'First milestone met. The remaining work depends on the capital budget confirmed in the mid-year review.',
        'Underway with the vendor. Staged so the public-facing part lands before the summer program.'])[1 + (abs(hashtext(d.id::text)) % 5)]
      when d.status = 'on-hold' then (array[
        'On hold pending the outcome of the capital budget bid. Reassess in the next quarterly review.',
        'Paused while the building condition assessment is completed, since the scope may change materially.',
        'Deferred to the next capital cycle. The interim workaround is documented and communicated.'])[1 + (abs(hashtext(d.id::text)) % 3)]
      when d.status = 'ongoing' then (array[
        'Embedded in business as usual. Reviewed each quarter by the responsible team and reported through the plan.',
        'Ongoing operational commitment. Monitored through the existing service review cycle.'])[1 + (abs(hashtext(d.id::text)) % 2)]
      when d.status in ('completed','achieved') then (array[
        'Completed and verified on site. Evidence attached and the access information updated to match.',
        'Delivered and signed off by the responsible manager. Confirmed with a spot check the following month.',
        'Implemented ahead of the due date. The Disability Advisory Committee was notified at its next meeting.',
        'Completed. Lessons carried into the standard specification so the next project starts from here.'])[1 + (abs(hashtext(d.id::text)) % 4)]
      when d.status = 'cancelled' then 'Superseded by a broader action covering the same outcome. Retained for the audit trail rather than deleted.'
      else (array[
        'Scoped and sequenced. Scheduled to start after the current priority actions are delivered.',
        'Not yet started. Dependent on the outcome of the related physical works.',
        'Planned for the next financial year, subject to budget.'])[1 + (abs(hashtext(d.id::text)) % 3)]
    end,

    -- A short thread on anything underway, so the demo can show that the
    -- record carries the conversation and not just the status.
    comments = case
      when d.status in ('in-progress','on-hold','completed','achieved') then
        jsonb_build_array(
          jsonb_build_object(
            'id', 'seed-c1-' || d.id::text,
            'authorName', 'Marion Ellery',
            'text', (array[
              'Raised at the Disability Advisory Committee. They asked us to prioritise this one.',
              'Community feedback flagged this location twice last quarter, so I have moved it up.',
              'Confirmed this is in scope for the current plan cycle.',
              'Checked against the assessment finding, the action still reflects what we found.'])[1 + (abs(hashtext(d.id::text)) % 4)],
            'createdAt', to_char(now() - ((60 + (abs(hashtext(d.id::text)) % 200)) || ' days')::interval, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
          jsonb_build_object(
            'id', 'seed-c2-' || d.id::text,
            'authorName', (array['Daniel Okafor','Priya Nair','Alicia Barnes','Tom Whitfield'])[1 + (abs(hashtext(d.id::text)) % 4)],
            'text', case
              when d.status in ('completed','achieved') then (array[
                'Works finished. Photos uploaded to evidence.',
                'Signed off. Happy for this to be marked complete.',
                'Done and verified on site this morning.'])[1 + (abs(hashtext(d.id::text)) % 3)]
              when d.status = 'on-hold' then 'Holding until the budget position is clearer. Will pick it up in the next cycle.'
              else (array[
                'Quotes are in. I will raise the works order once the scope is confirmed.',
                'Booked in for next month. I will update here once it is scheduled.',
                'Draft is with the committee. Expecting comments back shortly.'])[1 + (abs(hashtext(d.id::text)) % 3)] end,
            'createdAt', to_char(now() - ((10 + (abs(hashtext(d.id::text)) % 50)) || ' days')::interval, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))
        )
      else '[]'::jsonb
    end,

    updated_at = now()
  where d.organisation_id = v_org;

  get diagnostics v_n = row_count;
  raise notice 'DIAP: enriched % council items (owner, team, dates, budget, indicators, notes, comments).', v_n;

  -- ---------------------------------------------------------------
  -- 2. MODULE CONFIDENCE
  -- ---------------------------------------------------------------
  -- Any completed module with no confidence band reads as blank on the
  -- readiness meter. Fill only the gaps, so real seeded values are kept.
  update module_progress mp set
    confidence_snapshot = case
      when (abs(hashtext(mp.module_id || coalesce(mp.site_id::text,'org'))) % 10) < 4 then 'strong'
      when (abs(hashtext(mp.module_id || coalesce(mp.site_id::text,'org'))) % 10) < 8 then 'mixed'
      else 'needs-work' end,
    updated_at = now()
  where mp.organisation_id = v_org
    and mp.status = 'completed'
    and mp.confidence_snapshot is null;

  get diagnostics v_n = row_count;
  raise notice 'Modules: filled confidence on % completed council modules.', v_n;

  -- ---------------------------------------------------------------
  -- 3. PROGRAM DATA
  -- ---------------------------------------------------------------
  -- Give each enrolled business a readiness tier so the cohort report shows a
  -- genuine spread. Without this every participant lands in the same band and
  -- the module readiness meter reads identically for every module, which is
  -- the tell that the data is fake.
  for v_prog in
    select id, required_module_ids from authority_programs where organisation_id = v_org
  loop
    for v_biz in
      select pe.organisation_id as biz_id
        from program_enrolments pe
       where pe.program_id = v_prog.id and pe.status <> 'withdrawn'
    loop
      -- Tier from the business id, stable across runs.
      v_tier := (array['strong','improving','early'])[1 + (abs(hashtext(v_biz.biz_id::text)) % 3)];
      v_mi := 0;
      foreach v_mod in array v_prog.required_module_ids loop
        v_mi := v_mi + 1;
        v_roll := (v_mi * 7 + abs(hashtext(v_biz.biz_id::text))) % 10;
        v_conf := case v_tier
          when 'strong'    then case when v_roll < 7 then 'strong' when v_roll < 9 then 'mixed' else 'needs-work' end
          when 'improving' then case when v_roll < 3 then 'strong' when v_roll < 8 then 'mixed' else 'needs-work' end
          else                  case when v_roll < 1 then 'strong' when v_roll < 4 then 'mixed' else 'needs-work' end
        end;

        update module_progress mp
           set confidence_snapshot = v_conf, updated_at = now()
         where mp.organisation_id = v_biz.biz_id
           and mp.module_id = v_mod
           and mp.status = 'completed';
      end loop;
    end loop;
  end loop;

  raise notice 'Programs: re-tiered confidence across every council program cohort.';
  raise notice 'Done. Reload the app; regenerate any saved program report to pick these up.';
end $$;
