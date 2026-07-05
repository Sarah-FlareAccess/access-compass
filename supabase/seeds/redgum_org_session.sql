-- =====================================================
-- Redgum demo: create the org session + discovery rows in Supabase
-- =====================================================
-- Why: the cross-device restore (restoreFromCloud) reads two rows on sign-in:
--   - sessions        -> business profile + selected modules
--   - discovery_data  -> recommended modules + review mode
-- The Redgum demo was seeded straight into the answer tables (module_progress,
-- responses, DIAP) and never got these two rows, so signing in on a cleared or
-- different device dead-ends on "select your modules again". Real orgs get
-- these rows automatically via useSupabaseSession; this backfills them for the
-- directly-seeded demo so it restores like a real cross-device account.
--
-- Idempotent. Change the name pattern on the first SELECT for a different org.
-- =====================================================
do $$
declare
  v_org  uuid;
  v_user uuid;
  v_mods text[];
begin
  select id into v_org from organisations where name ilike '%redgum%' order by created_at limit 1;
  if v_org is null then raise exception 'No organisation name contains "redgum"'; end if;
  select user_id into v_user from organisation_memberships
    where organisation_id = v_org and status = 'active' order by created_at limit 1;

  -- The modules the org has actually assessed drive the dashboard's module set.
  select array_agg(distinct module_id order by module_id)
    into v_mods
    from module_progress
   where organisation_id = v_org;
  if v_mods is null then v_mods := array[]::text[]; end if;

  -- 1. Org-level session: business profile + selected modules (what restore
  --    reads first; a missing session is what triggers the dead-end screen).
  insert into sessions
    (session_id, organisation_id, user_id, business_snapshot, selected_modules, created_at, updated_at)
  values (
    'seed-redgum-org-session', v_org, v_user,
    jsonb_build_object(
      'organisation_name',      'Redgum Shire Council',
      'organisation_size',      'large',
      'business_types',         jsonb_build_array('local-government'),
      'user_role',              'owner',
      'has_physical_venue',     true,
      'has_online_presence',    true,
      'serves_public_customers',true,
      'has_online_services',    true
    ),
    v_mods, now() - interval '60 days', now()
  )
  on conflict (session_id) do update
    set organisation_id   = excluded.organisation_id,
        user_id           = excluded.user_id,
        business_snapshot  = excluded.business_snapshot,
        selected_modules   = excluded.selected_modules,
        updated_at         = now();

  -- 2. Discovery row: recommended modules + review mode. Update in place if the
  --    org already has one, otherwise insert.
  if exists (select 1 from discovery_data where organisation_id = v_org) then
    update discovery_data
       set recommended_modules = v_mods,
           review_mode         = coalesce(nullif(review_mode, ''), 'deep-dive'),
           updated_at          = now()
     where organisation_id = v_org;
  else
    insert into discovery_data
      (organisation_id, user_id, recommended_modules, review_mode, created_at, updated_at)
    values
      (v_org, v_user, v_mods, 'deep-dive', now() - interval '60 days', now());
  end if;

  raise notice 'Done. Redgum session + discovery seeded with % modules. Sign out and back in to restore.', array_length(v_mods, 1);
end $$;
