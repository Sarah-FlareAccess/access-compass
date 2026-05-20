-- =====================================================
-- 020. FIX get_org_members AND get_pending_members EMAIL CAST
-- =====================================================
-- Both functions declare `user_email TEXT` in their TABLE return type,
-- but select `u.email` from `auth.users` which Supabase stores as
-- `character varying(255)`. Postgres rejects this with
-- "structure of query does not match function result type" (42804),
-- which surfaces in the app as a broken Organisation Settings panel.
--
-- Fix by casting `u.email::text` in the SELECT so the return type
-- matches the declared TABLE signature.
-- =====================================================

CREATE OR REPLACE FUNCTION get_pending_members(p_org_id UUID)
RETURNS TABLE (membership_id UUID, user_id UUID, user_email TEXT, requested_at TIMESTAMPTZ, role org_role) AS $$
BEGIN
  IF NOT user_has_role_level(auth.uid(), p_org_id, 'approver') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT m.id, m.user_id, u.email::text, m.joined_at, m.role
  FROM organisation_memberships m
  JOIN auth.users u ON u.id = m.user_id
  WHERE m.organisation_id = p_org_id AND m.status = 'pending'
  ORDER BY m.joined_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_org_members(p_org_id UUID)
RETURNS TABLE (
  membership_id UUID, user_id UUID, user_email TEXT, role org_role,
  status membership_status, joined_at TIMESTAMPTZ, approved_at TIMESTAMPTZ
) AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM organisation_memberships
    WHERE organisation_id = p_org_id AND user_id = auth.uid() AND status = 'active'
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
GRANT EXECUTE ON FUNCTION get_pending_members TO authenticated;
