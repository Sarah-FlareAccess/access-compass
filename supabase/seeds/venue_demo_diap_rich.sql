-- =====================================================
-- Rebuild the convention-centre DIAP with rich, varied content
-- =====================================================
-- Replaces the generic "module X follow-up" venue DIAP with the council seed's
-- REAL, varied actions, spread across all 5 categories, 6 owners/teams, four
-- timeframes, three priorities, and a range of due dates (some overdue). Keeps
-- the council's status mix (progress), assigned round-robin across venue sites.
-- Underway items (status <> 'not-started') also get an owner+team, due date,
-- budget and status-matched notes, so this rebuild is self-sufficient (no
-- separate enrich pass needed); not-started items stay bare on purpose.
-- Run after venue_demo_seed. Idempotent (rebuilds from scratch each run).
-- =====================================================
do $$
declare
  v_conv    uuid;
  v_council uuid;
  v_user    uuid;
  v_sites   uuid[];
  v_n       int;
begin
  select o.id into v_conv from organisations o
   where o.name ilike '%convention%'
     and exists (select 1 from module_progress mp where mp.organisation_id = o.id)
   order by o.created_at limit 1;
  if v_conv is null then raise exception 'No populated convention org'; end if;

  select user_id into v_user from organisation_memberships
   where organisation_id = v_conv and status = 'active' order by created_at limit 1;

  select id into v_council from organisations
   where name ilike '%shire council%' order by created_at limit 1;
  if v_council is null then raise exception 'Redgum Shire Council not found (DIAP source)'; end if;

  alter table diap_items drop constraint if exists diap_items_category_check;
  alter table diap_items drop constraint if exists diap_items_status_check;

  select array_agg(id order by name) into v_sites from sites where organisation_id = v_conv;
  if v_sites is null then raise exception 'Convention org has no sites'; end if;

  delete from diap_items where organisation_id = v_conv;

  insert into diap_items
    (id, session_id, site_id, organisation_id, objective, action, category, priority,
     timeframe, responsible_role, responsible_team, status, module_source, question_source,
     impact_statement, due_date, budget_estimate, notes, created_at, updated_at, completed_at, user_id)
  select
    gen_random_uuid(),
    'seed-venue-diap-' || x.rn,
    v_sites[1 + (x.rn % array_length(v_sites, 1))],
    v_conv,
    x.objective, x.action,
    (array['physical-access','information-communication-marketing','customer-service','operations-policy-procedure','people-culture'])[1 + (x.rn % 5)],
    (array['high','medium','low'])[1 + (x.rn % 3)],
    (array['0-30 days','30-90 days','3-12 months','Ongoing'])[1 + (x.rn % 4)],
    -- Owner + team, due, budget and notes are set only for items that are
    -- underway (status <> 'not-started'); not-started items stay bare because
    -- nothing has been actioned on them yet.
    case when x.status = 'not-started' then null else (array['Facilities Manager','Events Coordinator','Marketing Lead','Front of House Manager','People & Culture Partner','Venue Operations Manager'])[1 + (x.rn % 6)] end,
    case when x.status = 'not-started' then null else (array['Facilities','Events','Marketing & Comms','Guest Services','People & Culture','Operations'])[1 + (x.rn % 6)] end,
    x.status, x.module_source, x.question_source, x.impact_statement,
    case when x.status in ('not-started','achieved') then null else current_date + (((x.rn % 10) - 2) * 21) end,
    case when x.status = 'not-started' then null else case (x.rn % 5)
      when 0 then (array['$8,000','$15,000','$25,000','$40,000'])[1 + (x.rn % 4)]
      when 4 then (array['$2,500','$4,000','$6,000'])[1 + (x.rn % 3)]
      else (array['$1,200','$2,500','$4,500','$7,500'])[1 + (x.rn % 4)]
    end end,
    case
      when x.status = 'not-started' then null
      when x.status = 'in-progress' then (array['Quotes in progress.','Works scheduled with the contractor.','Underway; first milestone met.','Draft prepared and in review.'])[1 + (x.rn % 4)]
      when x.status = 'on-hold' then (array['On hold pending budget approval.','Paused awaiting a council decision.','Deferred to the next capital cycle.'])[1 + (x.rn % 3)]
      when x.status = 'ongoing' then (array['Embedded in business as usual; reviewed each quarter.','Ongoing; monitored by the responsible team.'])[1 + (x.rn % 2)]
      when x.status in ('completed','achieved') then (array['Completed and verified.','Delivered and signed off.','Implemented; confirmed with a spot check.'])[1 + (x.rn % 3)]
      when x.status = 'cancelled' then 'Superseded by a related action.'
      else 'In planning.'
    end,
    now() - interval '40 days', now() - interval '5 days',
    case when x.status = 'achieved' then now() - interval '7 days' else null end,
    v_user
  from (
    select d.objective, d.action, d.status, d.module_source, d.question_source, d.impact_statement,
           (row_number() over (order by d.id))::int as rn
    from diap_items d
    where d.organisation_id = v_council
  ) x;

  -- Lead with Pulse Check (not Deep Dive) timing for this demo.
  update discovery_data set review_mode = 'pulse-check', updated_at = now()
   where organisation_id = v_conv;

  select count(*) into v_n from diap_items where organisation_id = v_conv;
  raise notice 'Venue DIAP rebuilt (% items), review mode set to Pulse Check.', v_n;
end $$;
