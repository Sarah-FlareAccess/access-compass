-- =====================================================
-- 021. FIX get_org_members AMBIGUOUS user_id REFERENCE
-- =====================================================
-- get_org_members' RETURNS TABLE declares OUT parameters user_id and
-- status. The inner IF NOT EXISTS subquery references both unqualified
-- (WHERE ... AND user_id = auth.uid() AND status = 'active'), which
-- Postgres rejects with "column reference 'user_id' is ambiguous"
-- because the names clash with the OUT parameters.
--
-- Qualify the column references with the table name, and add the
-- #variable_conflict use_column directive so any future references
-- in this function resolve to columns over OUT params.
-- =====================================================

CREATE OR REPLACE FUNCTION get_org_members(p_org_id UUID)
RETURNS TABLE (
  membership_id UUID, user_id UUID, user_email TEXT, role org_role,
  status membership_status, joined_at TIMESTAMPTZ, approved_at TIMESTAMPTZ
) AS $$
#variable_conflict use_column
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM organisation_memberships om
    WHERE om.organisation_id = p_org_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
  ) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT m.id, m.user_id, u.email::text, m.role, m.status, m.joined_at, m.approved_at
  FROM organisation_memberships m
  JOIN auth.users u ON u.id = m.user_id
  WHERE m.organisation_id = p_org_id
  ORDER BY CASE m.status WHEN 'pending' THEN 0 WHEN 'active' THEN 1 ELSE 2 END, m.joined_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_org_members TO authenticated;
