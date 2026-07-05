-- =====================================================
-- Major Venue demo: saved program_reports snapshots
-- =====================================================
-- Generates ONE cohort report snapshot for EVERY program on the convention-
-- centre demo org. This is what powers:
--   * Authority Portal > Overview "Cohort snapshot" (maturity donut, top
--     priorities, strengths, areas to explore, module heatmap) - it reads the
--     latest program_reports row per program and shows an empty state until
--     each program has one.
--   * Authority Portal > Programs > <program> > Reports (the full report).
--
-- Each snapshot payload is computed from the ACTUAL seeded enrolments +
-- module_progress (same logic as the in-app RPCs), so every figure is
-- internally consistent.
--
-- PREREQUISITE: run venue_demo_programs.sql first (creates the programs, the
-- partner businesses and their module_progress). Idempotent: replaces any
-- existing snapshot of the same name per program. Targets the org by name.
-- =====================================================
do $$
declare
  v_org        uuid;
  v_name       text;
  v_user       uuid;
  v_prog       record;
  v_total int; v_completed int; v_submitted int; v_inprog int; v_enrolled int;
  v_enrol      jsonb;
  v_modaggs    jsonb;
  v_prios      jsonb;
  v_strengths  jsonb;
  v_payload    jsonb;
  v_gen_at     timestamptz := now() - interval '3 days';
  v_report_name text;
  v_count      int := 0;
  v_methodology text :=
    'Program reports aggregate completion and confidence bands across enrolled businesses. '
    || 'Priority actions and strengths are generated narrative from each business assessment, not raw question responses. '
    || 'Individual responses, evidence files, and DIAP details remain private to each business.';
begin
  select id, name into v_org, v_name from organisations
   where name ilike '%convention%' order by created_at limit 1;
  if v_org is null then
    raise exception 'No org name contains "convention" — run venue_demo_seed.sql and venue_demo_programs.sql first.';
  end if;

  select user_id into v_user from organisation_memberships
   where organisation_id = v_org and status = 'active' order by created_at limit 1;

  for v_prog in
    select id, name, description, access_level, required_module_ids
      from authority_programs where organisation_id = v_org order by created_at
  loop
    v_report_name := v_prog.name || ' - cohort report';

    -- Enrolment counts (mirrors useProgramReport EnrolmentCounts)
    select count(*),
           count(*) filter (where status = 'completed'),
           count(*) filter (where status = 'submitted'),
           count(*) filter (where status = 'in_progress'),
           count(*) filter (where status = 'enrolled')
      into v_total, v_completed, v_submitted, v_inprog, v_enrolled
      from program_enrolments where program_id = v_prog.id;

    v_enrol := jsonb_build_object(
      'total', v_total, 'completed', v_completed, 'submitted', v_submitted,
      'in_progress', v_inprog, 'enrolled', v_enrolled);

    -- Per-module aggregates (mirrors get_program_module_aggregates)
    select coalesce(jsonb_agg(x order by (x->>'module_id')), '[]'::jsonb)
      into v_modaggs
      from (
        select jsonb_build_object(
          'module_id', m.module_id,
          'total_enrolments', v_total,
          'completed', count(distinct mp.organisation_id) filter (where mp.status = 'completed'),
          'in_progress', count(distinct mp.organisation_id) filter (where mp.status = 'in-progress'),
          'not_started', v_total - count(distinct mp.organisation_id) filter (where mp.status in ('completed', 'in-progress')),
          'confidence_strong', count(*) filter (where mp.confidence_snapshot = 'strong'),
          'confidence_mixed', count(*) filter (where mp.confidence_snapshot = 'mixed'),
          'confidence_needs_work', count(*) filter (where mp.confidence_snapshot = 'needs-work')
        ) as x
        from unnest(v_prog.required_module_ids) as m(module_id)
        left join program_enrolments pe on pe.program_id = v_prog.id
        left join module_progress mp
          on mp.organisation_id = pe.organisation_id and mp.module_id = m.module_id
        group by m.module_id
      ) sub;

    -- Top priority actions across the cohort (mirrors aggregateCohortSummaries)
    select coalesce(jsonb_agg(
             jsonb_build_object('action', action, 'count', cnt, 'priority', priority, 'moduleIds', module_ids)
             order by cnt desc, action), '[]'::jsonb)
      into v_prios
      from (
        select act.value->>'action' as action,
               max(act.value->>'priority') as priority,
               count(*) as cnt,
               jsonb_agg(distinct mp.module_id) as module_ids
          from module_progress mp
          join program_enrolments pe
            on pe.organisation_id = mp.organisation_id and pe.program_id = v_prog.id
          cross join lateral jsonb_array_elements(coalesce(mp.summary->'priorityActions', '[]'::jsonb)) as act(value)
         where mp.module_id = any(v_prog.required_module_ids)
         group by act.value->>'action'
      ) t;

    -- Top strengths across the cohort
    select coalesce(jsonb_agg(
             jsonb_build_object('text', txt, 'count', cnt, 'moduleIds', module_ids)
             order by cnt desc, txt), '[]'::jsonb)
      into v_strengths
      from (
        select sw.value as txt,
               count(*) as cnt,
               jsonb_agg(distinct mp.module_id) as module_ids
          from module_progress mp
          join program_enrolments pe
            on pe.organisation_id = mp.organisation_id and pe.program_id = v_prog.id
          cross join lateral jsonb_array_elements_text(coalesce(mp.summary->'doingWell', '[]'::jsonb)) as sw(value)
         where mp.module_id = any(v_prog.required_module_ids)
         group by sw.value
      ) t;

    -- Assemble the ProgramReportPayload. outcomes is omitted (optional) — the
    -- report page hides the statutory-framework section when it is absent.
    v_payload := jsonb_build_object(
      'generatedAt', to_char(v_gen_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'program', jsonb_build_object(
        'id', v_prog.id, 'name', v_prog.name, 'description', v_prog.description,
        'accessLevel', v_prog.access_level, 'moduleIds', to_jsonb(v_prog.required_module_ids)),
      'authority', jsonb_build_object('id', v_org, 'name', v_name),
      'enrolment', v_enrol,
      'moduleAggregates', v_modaggs,
      'topPriorityActions', v_prios,
      'topStrengths', v_strengths,
      'topAreasToExplore', '[]'::jsonb,
      'methodology', v_methodology
    );

    -- Idempotent: replace any prior snapshot of the same name for this program
    delete from program_reports where program_id = v_prog.id and name = v_report_name;

    insert into program_reports
      (program_id, organisation_id, name, generated_by_user_id, generated_at,
       access_level, module_ids_snapshot, enrolment_count, completed_count,
       submitted_count, in_progress_count, snapshot_data)
    values
      (v_prog.id, v_org, v_report_name, v_user, v_gen_at,
       v_prog.access_level, v_prog.required_module_ids, v_total, v_completed,
       v_submitted, v_inprog, v_payload);

    v_count := v_count + 1;
  end loop;

  raise notice 'Done. Saved % cohort report(s) for %. Refresh Authority Portal > Overview to see the Cohort snapshot populate.', v_count, v_name;
end $$;
