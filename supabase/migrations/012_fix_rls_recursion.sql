-- =====================================================
-- MIGRATION 012: Fix infinite recursion in organisation_memberships RLS
-- =====================================================
-- The "Users can view org member list" and "Admins can update memberships"
-- policies query organisation_memberships from within organisation_memberships
-- RLS, causing infinite recursion. Fix: use a SECURITY DEFINER function
-- that bypasses RLS for the lookup.

-- 1. Drop the recursive policies
DROP POLICY IF EXISTS "Users can view org member list" ON organisation_memberships;
DROP POLICY IF EXISTS "Admins can update memberships" ON organisation_memberships;

-- 2. Create SECURITY DEFINER functions (bypass RLS, no recursion)
CREATE OR REPLACE FUNCTION get_user_org_ids(p_user_id UUID)
RETURNS SETOF UUID AS $$
  SELECT organisation_id FROM organisation_memberships
  WHERE user_id = p_user_id AND status = 'active';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_org_admin(p_user_id UUID, p_org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM organisation_memberships
    WHERE user_id = p_user_id
      AND organisation_id = p_org_id
      AND role IN ('admin', 'owner')
      AND status = 'active'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Recreate policies using safe functions
CREATE POLICY "Users can view org member list" ON organisation_memberships
  FOR SELECT USING (
    organisation_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Admins can update memberships" ON organisation_memberships
  FOR UPDATE USING (
    is_org_admin(auth.uid(), organisation_id)
  );
