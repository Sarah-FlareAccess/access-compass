-- Cleans the Convention Centre Riverside to a full showcase and applies the
-- three curated partials with notes, matching the council seed. Safe to re-run.
do $$
declare v_org uuid; v_site uuid;
begin
  select id into v_org from organisations where name = 'Redgum Convention & Exhibition Centre' order by created_at limit 1;
  if v_org is null then raise exception 'Convention Centre org not found'; end if;
  select id into v_site from sites where organisation_id = v_org and name = 'Riverside Theatre';
  if v_site is null then raise exception 'Riverside Theatre not found in the Convention Centre org'; end if;

  update module_responses set answer = 'yes', partial_description = null
    where organisation_id = v_org and site_id = v_site and answer = 'partially';

  update module_responses set answer = 'partially', partial_description = 'Handrails are on one side of the entrance steps, not both.', multi_select_values = null
    where organisation_id = v_org and site_id = v_site and question_id = '2.2-D-23';
  update module_responses set answer = 'partially', partial_description = 'Grab rails are on one side of the accessible toilet.', multi_select_values = null
    where organisation_id = v_org and site_id = v_site and question_id = '3.2-D-8';
  update module_responses set answer = 'partially', partial_description = 'Most shows can be booked online; a few still need a quick phone call.', multi_select_values = null
    where organisation_id = v_org and site_id = v_site and question_id = '4.3-D-1';

  raise notice 'Riverside cleaned and curated partials applied for Convention Centre.';
end $$;
