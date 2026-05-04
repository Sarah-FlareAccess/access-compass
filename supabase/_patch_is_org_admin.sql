-- Patch: create missing single-arg is_org_admin(uuid) function
-- Used by migration 019 (module_carryover)

CREATE OR REPLACE FUNCTION is_org_admin(p_org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM organisation_memberships
    WHERE user_id = auth.uid()
      AND organisation_id = p_org_id
      AND status = 'active'
      AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
