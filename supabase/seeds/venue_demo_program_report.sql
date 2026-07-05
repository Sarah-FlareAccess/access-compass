-- =====================================================
-- Major Venue demo: a saved program_reports snapshot
-- =====================================================
-- Adds ONE cohort report snapshot to the "Supplier & Procurement Partner
-- Program" so the convention-centre demo shows a saved board-style report,
-- not just an empty "Generate report" state.
--
-- The snapshot payload is computed from the ACTUAL seeded enrolments +
-- module_progress (same logic as the in-app RPCs), so the donuts, module
-- heatmap, priority actions and strengths are all internally consistent.
--
-- PREREQUISITE: run venue_demo_programs.sql first (it creates the programs,
-- the partner businesses and their module_progress). Idempotent: replaces any
-- existing snapshot of the same name. Targets the org by name.
-- =====================================================
do $$
declare
  v_org        uuid;
  v_name       text;
  v_user       uuid;
  v_prog_id    uuid;
  v_prog_name  text;
  v_prog_desc  text;
  v_prog_level access_level;
  v_prog_mods  text[];
  v_total int; v_completed int; v_submitted int; v_inprog int; v_enrolled int;
  v_enrol      jsonb;
  v_modaggs    jsonb;
  v_prios      jsonb;
  v_strengths  jsonb;
  v_payload    jsonb;
  v_gen_at     timestamptz := now() - interval '3 days';
  v_report_name text := 'Supplier & Procurement Partner Program - Q3 2026 review';
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

  select id, name, description, access_level, required_module_ids
    into v_prog_id, v_prog_name, v_prog_desc, v_prog_level, v_prog_mods
    from authority_programs where organisation_id = v_org and slug = 'procurement-partner';
  if v_prog_id is null then
    raise exception 'Program "procurement-partner" not found — run venue_demo_programs.sql first.';
  end if;

  -- Enrolment counts (mirrors useProgramReport EnrolmentCounts)
  select count(*),
         count(*) filter (where status = 'completed'),
         count(*) filter (where status = 'submitted'),
         count(*) filter (where status = 'in_progress'),
         count(*) filter (where status = 'enrolled')
    into v_total, v_completed, v_submitted, v_inprog, v_enrolled
    from program_enrolments where program_id = v_prog_id;

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
      from unnest(v_prog_mods) as m(module_id)
      left join program_enrolments pe on pe.program_id = v_prog_id
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
          on pe.organisation_id = mp.organisation_id and pe.program_id = v_prog_id
        cross join lateral jsonb_array_elements(coalesce(mp.summary->'priorityActions', '[]'::jsonb)) as act(value)
       where mp.module_id = any(v_prog_mods)
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
          on pe.organisation_id = mp.organisation_id and pe.program_id = v_prog_id
        cross join lateral jsonb_array_elements_text(coalesce(mp.summary->'doingWell', '[]'::jsonb)) as sw(value)
       where mp.module_id = any(v_prog_mods)
       group by sw.value
    ) t;

  -- Assemble the ProgramReportPayload. outcomes is omitted (optional) — the
  -- report page hides the statutory-framework section when it is absent.
  v_payload := jsonb_build_object(
    'generatedAt', to_char(v_gen_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'program', jsonb_build_object(
      'id', v_prog_id, 'name', v_prog_name, 'description', v_prog_desc,
      'accessLevel', v_prog_level, 'moduleIds', to_jsonb(v_prog_mods)),
    'authority', jsonb_build_object('id', v_org, 'name', v_name),
    'enrolment', v_enrol,
    'moduleAggregates', v_modaggs,
    'topPriorityActions', v_prios,
    'topStrengths', v_strengths,
    'topAreasToExplore', '[]'::jsonb,
    'methodology', v_methodology
  );

  -- Idempotent: replace any prior snapshot of the same name
  delete from program_reports where program_id = v_prog_id and name = v_report_name;

  insert into program_reports
    (program_id, organisation_id, name, generated_by_user_id, generated_at,
     access_level, module_ids_snapshot, enrolment_count, completed_count,
     submitted_count, in_progress_count, snapshot_data)
  values
    (v_prog_id, v_org, v_report_name, v_user, v_gen_at,
     v_prog_level, v_prog_mods, v_total, v_completed,
     v_submitted, v_inprog, v_payload);

  raise notice 'Done. Saved report "%" for % (% businesses, % completed). Open Authority Portal > Programs > Supplier & Procurement Partner Program > Report.',
    v_report_name, v_prog_name, v_total, v_completed;
end $$;
