-- =========================================================================
-- Migration 024: Tighten sites INSERT policy to admin-only
-- =========================================================================
-- Sites represent structural org config: physical locations the customer is
-- assessing. Migration 023 allowed any active org member to INSERT a site,
-- which is inconsistent with UPDATE/DELETE (admin-only). A determined
-- non-admin could spam the sites list. The UI already gates the form behind
-- a role check, but RLS is the real boundary.
-- =========================================================================

BEGIN;

DROP POLICY IF EXISTS sites_insert_org_members ON sites;

CREATE POLICY sites_insert_org_admins ON sites
  FOR INSERT WITH CHECK (
    user_has_role_level(auth.uid(), organisation_id, 'admin')
  );

COMMIT;
