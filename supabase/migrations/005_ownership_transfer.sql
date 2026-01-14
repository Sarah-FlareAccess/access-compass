-- =====================================================
-- ACCESS COMPASS - OWNERSHIP MANAGEMENT
-- =====================================================
-- Migration: 005_ownership_transfer.sql
-- Run AFTER 004a and 004b
-- - Upgrades org creators to owner role
-- - Adds ownership transfer functionality
-- =====================================================

-- =====================================================
-- 1. UPGRADE EXISTING ORG CREATORS TO OWNER
-- =====================================================

-- Find the earliest admin in each org and make them owner
-- (This assumes the first admin was the creator)
UPDATE organisation_memberships m
SET role = 'owner'
FROM (
  SELECT DISTINCT ON (organisation_id) id
  FROM organisation_memberships
  WHERE role = 'admin'
  ORDER BY organisation_id, joined_at ASC
) first_admins
WHERE m.id = first_admins.id;

-- =====================================================
-- 2. UPDATE ORG CREATION TO USE OWNER ROLE
-- =====================================================

CREATE OR REPLACE FUNCTION create_organisation_with_admin(
  p_name TEXT,
  p_size business_size_tier,
  p_contact_email TEXT,
  p_contact_name TEXT,
  p_creator_user_id UUID
)
RETURNS TABLE (
  organisation_id UUID,
  organisation_name TEXT,
  organisation_slug TEXT,
  invite_code TEXT,
  max_members INTEGER,
  domain_auto_join_enabled BOOLEAN
) AS $$
DECLARE
  v_org_id UUID;
  v_slug TEXT;
  v_invite_code TEXT;
  v_email_domain TEXT;
  v_allowed_domains TEXT[];
  v_domain_auto_join BOOLEAN;
  v_max_members INTEGER;
BEGIN
  -- Generate slug from name
  v_slug := lower(regexp_replace(p_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := regexp_replace(v_slug, '^-|-$', '', 'g');

  -- Make slug unique by appending random chars if needed
  IF EXISTS (SELECT 1 FROM organisations WHERE slug = v_slug) THEN
    v_slug := v_slug || '-' || substr(md5(random()::text), 1, 6);
  END IF;

  -- Generate unique invite code
  LOOP
    v_invite_code := generate_invite_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM organisations WHERE organisations.invite_code = v_invite_code);
  END LOOP;

  -- Extract email domain
  v_email_domain := split_part(p_contact_email, '@', 2);

  -- Only enable domain auto-join for non-common domains
  IF is_common_email_domain(v_email_domain) THEN
    v_allowed_domains := NULL;
    v_domain_auto_join := false;
  ELSE
    v_allowed_domains := ARRAY[v_email_domain];
    v_domain_auto_join := true;
  END IF;

  -- Get max members for size
  v_max_members := get_max_members_for_size(p_size);

  -- Create organisation
  INSERT INTO organisations (
    name,
    slug,
    size,
    contact_email,
    contact_name,
    invite_code,
    allowed_email_domains,
    allow_domain_auto_join,
    max_members
  ) VALUES (
    p_name,
    v_slug,
    p_size,
    p_contact_email,
    p_contact_name,
    v_invite_code,
    v_allowed_domains,
    v_domain_auto_join,
    v_max_members
  ) RETURNING id INTO v_org_id;

  -- Create OWNER membership for creator (not just admin)
  INSERT INTO organisation_memberships (
    organisation_id,
    user_id,
    role,
    status,
    joined_at,
    invite_accepted_at
  ) VALUES (
    v_org_id,
    p_creator_user_id,
    'owner',  -- Changed from 'admin' to 'owner'
    'active',
    NOW(),
    NOW()
  );

  -- Return created organisation details
  RETURN QUERY
  SELECT
    v_org_id as organisation_id,
    p_name as organisation_name,
    v_slug as organisation_slug,
    v_invite_code as invite_code,
    v_max_members as max_members,
    v_domain_auto_join as domain_auto_join_enabled;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. TRANSFER OWNERSHIP FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION transfer_ownership(
  p_org_id UUID,
  p_new_owner_user_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_current_user_id UUID;
  v_current_membership organisation_memberships%ROWTYPE;
  v_new_owner_membership organisation_memberships%ROWTYPE;
BEGIN
  v_current_user_id := auth.uid();

  -- Get current user's membership
  SELECT * INTO v_current_membership
  FROM organisation_memberships
  WHERE organisation_id = p_org_id
    AND user_id = v_current_user_id
    AND status = 'active';

  -- Must be current owner to transfer
  IF v_current_membership IS NULL OR v_current_membership.role != 'owner' THEN
    RETURN QUERY SELECT false, 'Only the current owner can transfer ownership';
    RETURN;
  END IF;

  -- Can't transfer to yourself
  IF p_new_owner_user_id = v_current_user_id THEN
    RETURN QUERY SELECT false, 'You are already the owner';
    RETURN;
  END IF;

  -- Get new owner's membership
  SELECT * INTO v_new_owner_membership
  FROM organisation_memberships
  WHERE organisation_id = p_org_id
    AND user_id = p_new_owner_user_id
    AND status = 'active';

  -- New owner must be an existing active member
  IF v_new_owner_membership IS NULL THEN
    RETURN QUERY SELECT false, 'New owner must be an active member of the organisation';
    RETURN;
  END IF;

  -- New owner should be at least an admin (prevent transferring to viewer/member)
  IF get_role_level(v_new_owner_membership.role) < get_role_level('admin') THEN
    RETURN QUERY SELECT false, 'New owner must be an admin or higher role';
    RETURN;
  END IF;

  -- Perform the transfer
  -- 1. Demote current owner to admin
  UPDATE organisation_memberships
  SET role = 'admin'
  WHERE id = v_current_membership.id;

  -- 2. Promote new owner
  UPDATE organisation_memberships
  SET role = 'owner'
  WHERE id = v_new_owner_membership.id;

  -- 3. Audit log
  PERFORM create_audit_log(
    v_current_user_id,
    p_org_id,
    'member_role_changed',
    'ownership_transfer',
    p_new_owner_user_id::TEXT,
    jsonb_build_object(
      'previous_owner', v_current_user_id,
      'new_owner', p_new_owner_user_id,
      'transferred_at', NOW()
    )
  );

  RETURN QUERY SELECT true, 'Ownership transferred successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. LEAVE ORGANISATION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION leave_organisation(p_org_id UUID)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_current_user_id UUID;
  v_membership organisation_memberships%ROWTYPE;
  v_member_count INTEGER;
BEGIN
  v_current_user_id := auth.uid();

  -- Get membership
  SELECT * INTO v_membership
  FROM organisation_memberships
  WHERE organisation_id = p_org_id
    AND user_id = v_current_user_id;

  IF v_membership IS NULL THEN
    RETURN QUERY SELECT false, 'You are not a member of this organisation';
    RETURN;
  END IF;

  -- Owners cannot leave - must transfer first
  IF v_membership.role = 'owner' THEN
    -- Check if there are other members
    SELECT COUNT(*) INTO v_member_count
    FROM organisation_memberships
    WHERE organisation_id = p_org_id
      AND status = 'active';

    IF v_member_count > 1 THEN
      RETURN QUERY SELECT false, 'As the owner, you must transfer ownership before leaving. Go to Settings > Members to transfer ownership to another admin.';
      RETURN;
    ELSE
      -- Owner is the only member - delete the org entirely
      DELETE FROM organisations WHERE id = p_org_id;
      RETURN QUERY SELECT true, 'Organisation deleted as you were the only member';
      RETURN;
    END IF;
  END IF;

  -- Non-owners can leave freely
  DELETE FROM organisation_memberships WHERE id = v_membership.id;

  -- Audit log
  PERFORM create_audit_log(
    v_current_user_id,
    p_org_id,
    'member_removed',
    'membership',
    v_membership.id::TEXT,
    jsonb_build_object('left_voluntarily', true)
  );

  RETURN QUERY SELECT true, 'You have left the organisation';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. GET ORG OWNER FUNCTION (helper)
-- =====================================================

CREATE OR REPLACE FUNCTION get_org_owner(p_org_id UUID)
RETURNS TABLE (
  user_id UUID,
  user_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.user_id, u.email
  FROM organisation_memberships m
  JOIN auth.users u ON u.id = m.user_id
  WHERE m.organisation_id = p_org_id
    AND m.role = 'owner'
    AND m.status = 'active'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. CHECK IF USER IS OWNER
-- =====================================================

CREATE OR REPLACE FUNCTION is_org_owner(p_org_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(p_user_id, auth.uid());

  RETURN EXISTS (
    SELECT 1 FROM organisation_memberships
    WHERE organisation_id = p_org_id
      AND user_id = v_user_id
      AND role = 'owner'
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. GRANTS
-- =====================================================

GRANT EXECUTE ON FUNCTION transfer_ownership TO authenticated;
GRANT EXECUTE ON FUNCTION leave_organisation TO authenticated;
GRANT EXECUTE ON FUNCTION get_org_owner TO authenticated;
GRANT EXECUTE ON FUNCTION is_org_owner TO authenticated;

-- =====================================================
-- 8. SUPERADMIN OVERRIDE FUNCTIONS
-- =====================================================
-- These functions are for support staff to handle
-- edge cases like abandoned organisations or
-- unreachable owners. They require service_role access.
-- =====================================================

-- Check if current caller is service role (for admin operations)
CREATE OR REPLACE FUNCTION is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
  -- Service role has no auth.uid() but has full access
  -- Regular users always have auth.uid()
  RETURN auth.uid() IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin override: Force reassign ownership
-- Only callable via service_role (backend/admin panel)
CREATE OR REPLACE FUNCTION admin_reassign_ownership(
  p_org_id UUID,
  p_new_owner_user_id UUID,
  p_reason TEXT,
  p_support_ticket_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_current_owner_id UUID;
  v_current_owner_membership_id UUID;
  v_new_owner_membership organisation_memberships%ROWTYPE;
BEGIN
  -- Verify service role access
  IF NOT is_service_role() THEN
    RETURN QUERY SELECT false, 'This function requires service role access. Contact system administrator.';
    RETURN;
  END IF;

  -- Reason is required for audit trail
  IF p_reason IS NULL OR trim(p_reason) = '' THEN
    RETURN QUERY SELECT false, 'A reason is required for admin override actions';
    RETURN;
  END IF;

  -- Get current owner
  SELECT m.user_id, m.id INTO v_current_owner_id, v_current_owner_membership_id
  FROM organisation_memberships m
  WHERE m.organisation_id = p_org_id
    AND m.role = 'owner'
    AND m.status = 'active'
  LIMIT 1;

  -- Get new owner's membership
  SELECT * INTO v_new_owner_membership
  FROM organisation_memberships
  WHERE organisation_id = p_org_id
    AND user_id = p_new_owner_user_id
    AND status = 'active';

  -- New owner must be an existing active member
  IF v_new_owner_membership IS NULL THEN
    RETURN QUERY SELECT false, 'New owner must be an active member of the organisation';
    RETURN;
  END IF;

  -- Perform the transfer
  -- 1. Demote current owner to admin (if exists and different from new owner)
  IF v_current_owner_id IS NOT NULL AND v_current_owner_id != p_new_owner_user_id THEN
    UPDATE organisation_memberships
    SET role = 'admin'
    WHERE id = v_current_owner_membership_id;
  END IF;

  -- 2. Promote new owner
  UPDATE organisation_memberships
  SET role = 'owner'
  WHERE id = v_new_owner_membership.id;

  -- 3. Create detailed audit log for admin action
  INSERT INTO audit_logs (
    organisation_id,
    user_id,
    action,
    entity_type,
    entity_id,
    metadata
  ) VALUES (
    p_org_id,
    NULL, -- No user_id for service role actions
    'member_role_changed',
    'admin_override',
    v_new_owner_membership.id::TEXT,
    jsonb_build_object(
      'override_type', 'ownership_reassignment',
      'previous_owner', v_current_owner_id,
      'new_owner', p_new_owner_user_id,
      'reason', p_reason,
      'support_ticket_id', p_support_ticket_id,
      'performed_at', NOW(),
      'performed_by', 'service_role'
    )
  );

  RETURN QUERY SELECT true, 'Ownership reassigned successfully via admin override';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin override: Auto-promote longest-serving admin
-- Use when owner is completely gone and you need to restore access
CREATE OR REPLACE FUNCTION admin_auto_promote_owner(
  p_org_id UUID,
  p_reason TEXT,
  p_support_ticket_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  new_owner_user_id UUID,
  new_owner_email TEXT
) AS $$
DECLARE
  v_current_owner_exists BOOLEAN;
  v_new_owner RECORD;
BEGIN
  -- Verify service role access
  IF NOT is_service_role() THEN
    RETURN QUERY SELECT false, 'This function requires service role access', NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Reason is required
  IF p_reason IS NULL OR trim(p_reason) = '' THEN
    RETURN QUERY SELECT false, 'A reason is required for admin override actions', NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Check if org already has an active owner
  SELECT EXISTS (
    SELECT 1 FROM organisation_memberships
    WHERE organisation_id = p_org_id
      AND role = 'owner'
      AND status = 'active'
  ) INTO v_current_owner_exists;

  IF v_current_owner_exists THEN
    RETURN QUERY SELECT false, 'Organisation already has an active owner. Use admin_reassign_ownership instead.', NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Find longest-serving admin
  SELECT m.id, m.user_id, u.email
  INTO v_new_owner
  FROM organisation_memberships m
  JOIN auth.users u ON u.id = m.user_id
  WHERE m.organisation_id = p_org_id
    AND m.role = 'admin'
    AND m.status = 'active'
  ORDER BY m.joined_at ASC
  LIMIT 1;

  -- If no admin found, try longest-serving active member of any role
  IF v_new_owner IS NULL THEN
    SELECT m.id, m.user_id, u.email
    INTO v_new_owner
    FROM organisation_memberships m
    JOIN auth.users u ON u.id = m.user_id
    WHERE m.organisation_id = p_org_id
      AND m.status = 'active'
    ORDER BY m.joined_at ASC
    LIMIT 1;
  END IF;

  IF v_new_owner IS NULL THEN
    RETURN QUERY SELECT false, 'No eligible members found to promote', NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Promote to owner
  UPDATE organisation_memberships
  SET role = 'owner'
  WHERE id = v_new_owner.id;

  -- Audit log
  INSERT INTO audit_logs (
    organisation_id,
    user_id,
    action,
    entity_type,
    entity_id,
    metadata
  ) VALUES (
    p_org_id,
    NULL,
    'member_role_changed',
    'admin_override',
    v_new_owner.id::TEXT,
    jsonb_build_object(
      'override_type', 'auto_promote_owner',
      'new_owner', v_new_owner.user_id,
      'new_owner_email', v_new_owner.email,
      'reason', p_reason,
      'support_ticket_id', p_support_ticket_id,
      'performed_at', NOW(),
      'performed_by', 'service_role'
    )
  );

  RETURN QUERY SELECT true, 'New owner promoted successfully', v_new_owner.user_id, v_new_owner.email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin: Get organisation status for support
CREATE OR REPLACE FUNCTION admin_get_org_status(p_org_id UUID)
RETURNS TABLE (
  org_name TEXT,
  org_slug TEXT,
  created_at TIMESTAMPTZ,
  member_count BIGINT,
  has_owner BOOLEAN,
  owner_email TEXT,
  admin_count BIGINT,
  pending_count BIGINT
) AS $$
BEGIN
  -- Verify service role access
  IF NOT is_service_role() THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    o.name,
    o.slug,
    o.created_at,
    (SELECT COUNT(*) FROM organisation_memberships WHERE organisation_id = p_org_id AND status = 'active'),
    EXISTS (SELECT 1 FROM organisation_memberships WHERE organisation_id = p_org_id AND role = 'owner' AND status = 'active'),
    (SELECT u.email FROM organisation_memberships m JOIN auth.users u ON u.id = m.user_id WHERE m.organisation_id = p_org_id AND m.role = 'owner' AND m.status = 'active' LIMIT 1),
    (SELECT COUNT(*) FROM organisation_memberships WHERE organisation_id = p_org_id AND role = 'admin' AND status = 'active'),
    (SELECT COUNT(*) FROM organisation_memberships WHERE organisation_id = p_org_id AND status = 'pending')
  FROM organisations o
  WHERE o.id = p_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: These admin functions are NOT granted to authenticated users
-- They can only be called via service_role key from your backend/admin panel
