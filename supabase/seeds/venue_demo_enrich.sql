-- =====================================================
-- Enrich the convention-centre demo
-- =====================================================
-- Makes the venue org as rich as the council when you drill in:
--   Part A: real question responses on every completed module, copied from
--           the Redgum council seed (same modules => same questions => valid).
--   Part B: a fleshed-out DIAP — varied categories, responsible role/team,
--           priorities, timeframes and due dates (some overdue, some upcoming).
-- Run AFTER venue_demo_seed + the duplicate-org cleanup. Idempotent.
-- =====================================================
do $$
declare
  v_conv    uuid;
  v_council uuid;
  v_user    uuid;
  v_resp    int;
  v_diap    int;
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
  if v_council is null then raise exception 'Redgum Shire Council not found (needed as the response source)'; end if;

  alter table diap_items drop constraint if exists diap_items_category_check;

  -- ---- Part A: real question responses (copied from the council) ----
  drop table if exists _council_resp;
  create temp table _council_resp on commit drop as
    select distinct on (module_id, question_id)
      module_id, question_id, answer, notes, partial_description, multi_select_values
    from module_responses
    where organisation_id = v_council
    order by module_id, question_id, updated_at desc nulls last;

  insert into module_responses
    (session_id, module_id, question_id, answer, notes, partial_description, multi_select_values,
     organisation_id, site_id, user_id)
  select
    'seed-venue-resp-' || mp.site_id || '-' || cr.module_id,
    cr.module_id, cr.question_id, cr.answer, cr.notes, cr.partial_description, cr.multi_select_values,
    v_conv, mp.site_id, v_user
  from module_progress mp
  join _council_resp cr on cr.module_id = mp.module_id
  where mp.organisation_id = v_conv and mp.status = 'completed'
  on conflict do nothing;

  -- ---- Part B: enrich the DIAP with a range of allocations + due dates ----
  with ranked as (
    select id, status, (row_number() over (order by created_at, id))::int as rn
    from diap_items where organisation_id = v_conv
  )
  update diap_items d set
    category = (array['physical-access','information-communication-marketing','customer-service','operations-policy-procedure','people-culture'])[1 + (r.rn % 5)],
    responsible_role = (array['Facilities Manager','Events Coordinator','Marketing Lead','Front of House Manager','People & Culture Partner','Venue Operations Manager'])[1 + (r.rn % 6)],
    responsible_team = (array['Facilities','Events','Marketing & Comms','Guest Services','People & Culture','Operations'])[1 + (r.rn % 6)],
    priority = (array['high','medium','low'])[1 + (r.rn % 3)],
    timeframe = (array['0-30 days','30-90 days','3-12 months','Ongoing'])[1 + (r.rn % 4)],
    due_date = case when r.status = 'achieved' then null
                    else current_date + (((r.rn % 10) - 2) * 21) end
  from ranked r
  where d.id = r.id;

  select count(*) into v_resp from module_responses where organisation_id = v_conv;
  select count(*) into v_diap from diap_items where organisation_id = v_conv;
  raise notice 'Done. Convention question responses: %, DIAP items enriched: %.', v_resp, v_diap;
end $$;
