-- =====================================================
-- Enrich underway DIAP items in the two demo accounts
-- =====================================================
-- So the DIAP + program reports reflect REAL application of the plan, every item
-- that is underway (status <> 'not-started') in the Redgum Shire Council and the
-- convention-centre demos is given an Owner, a Due Date, a Budget and Notes.
-- (Module is already populated from module_source; not-started items are left
-- bare on purpose - nothing has been actioned on them yet.)
--
-- Values are deterministic per item (hash of id) so a re-run is stable, and only
-- EMPTY fields are filled (coalesce), so this is idempotent and never clobbers
-- data the seeds already set. Run after the demo seeds.
--
-- Note: the convention-centre rebuild (venue_demo_diap_rich.sql) now sets these
-- fields itself, so in practice this pass mainly enriches the COUNCIL DIAP; it
-- remains a harmless safety net for the venue (coalesce fills nothing there).
-- =====================================================
do $$
declare
  v_council uuid;
  v_conv    uuid;
  v_n       int;
begin
  select id into v_council from organisations where name ilike '%shire council%' order by created_at limit 1;
  select id into v_conv    from organisations where name ilike '%convention%'    order by created_at limit 1;
  if v_council is null and v_conv is null then
    raise exception 'Neither demo org (council / convention) found';
  end if;

  update diap_items d set
    -- Owner + team, by category (fills gaps only)
    responsible_role = coalesce(d.responsible_role, case d.category
      when 'physical-access' then 'Facilities Manager'
      when 'information-communication-marketing' then 'Communications Lead'
      when 'customer-service' then 'Customer Experience Lead'
      when 'operations-policy-procedure' then 'Operations Manager'
      when 'people-culture' then 'People & Culture Partner'
      else 'Accessibility Lead' end),
    responsible_team = coalesce(d.responsible_team, case d.category
      when 'physical-access' then 'Facilities'
      when 'information-communication-marketing' then 'Marketing & Comms'
      when 'customer-service' then 'Guest Services'
      when 'operations-policy-procedure' then 'Operations'
      when 'people-culture' then 'People & Culture'
      else 'Operations' end),
    -- Due date: past for finished work, future for active, none for cancelled
    due_date = coalesce(d.due_date, case
      when d.status in ('completed','achieved') then current_date - (7 + (abs(hashtext(d.id::text)) % 60))
      when d.status = 'cancelled' then null
      else current_date + (30 + (abs(hashtext(d.id::text)) % 300))
      end),
    -- Budget (TEXT), heavier for physical works, lighter for training/other
    budget_estimate = coalesce(nullif(d.budget_estimate, ''), case d.category
      when 'physical-access' then (array['$8,000','$15,000','$25,000','$40,000'])[1 + (abs(hashtext(d.id::text)) % 4)]
      when 'people-culture' then (array['$2,500','$4,000','$6,000'])[1 + (abs(hashtext(d.id::text)) % 3)]
      else (array['$1,200','$2,500','$4,500','$7,500'])[1 + (abs(hashtext(d.id::text)) % 4)]
      end),
    -- Notes, phrased to match the status
    notes = coalesce(nullif(d.notes, ''), case
      when d.status = 'in-progress' then (array['Quotes in progress.','Works scheduled with the contractor.','Underway; first milestone met.','Draft prepared and in review.'])[1 + (abs(hashtext(d.id::text)) % 4)]
      when d.status = 'on-hold' then (array['On hold pending budget approval.','Paused awaiting a council decision.','Deferred to the next capital cycle.'])[1 + (abs(hashtext(d.id::text)) % 3)]
      when d.status = 'ongoing' then (array['Embedded in business as usual; reviewed each quarter.','Ongoing; monitored by the responsible team.'])[1 + (abs(hashtext(d.id::text)) % 2)]
      when d.status in ('completed','achieved') then (array['Completed and verified.','Delivered and signed off.','Implemented; confirmed with a spot check.'])[1 + (abs(hashtext(d.id::text)) % 3)]
      when d.status = 'cancelled' then 'Superseded by a related action.'
      else 'In planning.'
      end),
    updated_at = now()
  where d.organisation_id in (v_council, v_conv)
    and d.status <> 'not-started';

  get diagnostics v_n = row_count;
  raise notice 'Enriched % underway DIAP items across the council + convention demos.', v_n;
end $$;
