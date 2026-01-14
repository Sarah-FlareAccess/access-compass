-- =====================================================
-- ACCESS COMPASS - SECURITY ENHANCEMENTS
-- =====================================================
-- Migration: 004b_security_enhancements.sql
-- Run AFTER 004a_enum_updates.sql has been committed
-- =====================================================

-- =====================================================
-- 1. ROLE HELPER FUNCTIONS
-- =====================================================

-- Role hierarchy for permission checks
-- owner > admin > approver > editor > member > viewer
CREATE OR REPLACE FUNCTION get_role_level(p_role org_role)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE p_role
    WHEN 'owner' THEN 100
    WHEN 'admin' THEN 80
    WHEN 'approver' THEN 60
    WHEN 'editor' THEN 40
    WHEN 'member' THEN 20
    WHEN 'viewer' THEN 10
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Check if user has at least a certain role level
CREATE OR REPLACE FUNCTION user_has_role_level(
  p_user_id UUID,
  p_org_id UUID,
  p_min_role org_role
)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_role org_role;
BEGIN
  SELECT role INTO v_user_role
  FROM organisation_memberships
  WHERE user_id = p_user_id
    AND organisation_id = p_org_id
    AND (status IS NULL OR status = 'active');

  IF v_user_role IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN get_role_level(v_user_role) >= get_role_level(p_min_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. SCHEMA UPDATES
-- =====================================================

-- Add status column to memberships
ALTER TABLE organisation_memberships
  ADD COLUMN IF NOT EXISTS status membership_status DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS suspended_reason TEXT,
  ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES auth.users(id);

-- Add security settings to organisations
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS require_approval BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS allowed_ip_ranges TEXT[],
  ADD COLUMN IF NOT EXISTS session_timeout_minutes INTEGER DEFAULT 480,
  ADD COLUMN IF NOT EXISTS require_mfa BOOLEAN DEFAULT false;

-- =====================================================
-- 3. INVITE CODES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS organisation_invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- Security settings
  expires_at TIMESTAMPTZ,
  max_uses INTEGER DEFAULT 1,
  times_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  -- Restrictions
  allowed_email_domains TEXT[],
  allowed_roles org_role[] DEFAULT ARRAY['member']::org_role[],

  -- Metadata
  label TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON organisation_invite_codes(code) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_invite_codes_org ON organisation_invite_codes(organisation_id);

-- Migrate existing invite codes (use 'admin' which exists)
INSERT INTO organisation_invite_codes (organisation_id, code, created_by, max_uses, allowed_roles)
SELECT
  o.id,
  o.invite_code,
  (SELECT user_id FROM organisation_memberships WHERE organisation_id = o.id AND role = 'admin' LIMIT 1),
  NULL,
  ARRAY['member']::org_role[]
FROM organisations o
WHERE o.invite_code IS NOT NULL
  AND (SELECT user_id FROM organisation_memberships WHERE organisation_id = o.id AND role = 'admin' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM organisation_invite_codes ic WHERE ic.code = o.invite_code
  )
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 4. AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  organisation_id UUID REFERENCES organisations(id),
  action audit_action NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  previous_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 years')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON audit_logs(organisation_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- =====================================================
-- 5. AUDIT LOG FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id UUID,
  p_organisation_id UUID,
  p_action audit_action,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}',
  p_previous_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_user_email TEXT;
BEGIN
  SELECT email INTO v_user_email FROM auth.users WHERE id = p_user_id;

  INSERT INTO audit_logs (
    user_id, user_email, organisation_id, action, resource_type,
    resource_id, details, previous_values, new_values, ip_address, user_agent
  ) VALUES (
    p_user_id, v_user_email, p_organisation_id, p_action, p_resource_type,
    p_resource_id, p_details, p_previous_values, p_new_values, p_ip_address, p_user_agent
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. INVITE CODE FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION create_invite_code(
  p_org_id UUID,
  p_expires_in_days INTEGER DEFAULT 30,
  p_max_uses INTEGER DEFAULT NULL,
  p_allowed_roles org_role[] DEFAULT ARRAY['member']::org_role[],
  p_allowed_email_domains TEXT[] DEFAULT NULL,
  p_label TEXT DEFAULT NULL
)
RETURNS TABLE (invite_code TEXT, expires_at TIMESTAMPTZ) AS $$
DECLARE
  v_code TEXT;
  v_expires TIMESTAMPTZ;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  IF NOT user_has_role_level(v_user_id, p_org_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied: requires admin role';
  END IF;

  LOOP
    v_code := generate_invite_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM organisation_invite_codes WHERE code = v_code);
  END LOOP;

  v_expires := CASE WHEN p_expires_in_days IS NOT NULL
    THEN NOW() + (p_expires_in_days || ' days')::INTERVAL ELSE NULL END;

  INSERT INTO organisation_invite_codes (
    organisation_id, code, created_by, expires_at, max_uses,
    allowed_roles, allowed_email_domains, label
  ) VALUES (
    p_org_id, v_code, v_user_id, v_expires, p_max_uses,
    p_allowed_roles, p_allowed_email_domains, p_label
  );

  PERFORM create_audit_log(v_user_id, p_org_id, 'invite_created', 'invite_code', v_code,
    jsonb_build_object('expires_at', v_expires, 'max_uses', p_max_uses, 'label', p_label));

  RETURN QUERY SELECT v_code, v_expires;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION use_invite_code(p_invite_code TEXT, p_user_email TEXT)
RETURNS TABLE (
  success BOOLEAN,
  organisation_id UUID,
  organisation_name TEXT,
  assigned_role org_role,
  requires_approval BOOLEAN,
  error_message TEXT
) AS $$
DECLARE
  v_invite organisation_invite_codes%ROWTYPE;
  v_org organisations%ROWTYPE;
  v_user_id UUID;
  v_email_domain TEXT;
  v_membership_status membership_status;
BEGIN
  v_user_id := auth.uid();
  v_email_domain := split_part(p_user_email, '@', 2);

  SELECT * INTO v_invite FROM organisation_invite_codes
  WHERE code = UPPER(p_invite_code) AND is_active = true;

  IF v_invite IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::org_role, false, 'Invalid invite code';
    RETURN;
  END IF;

  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < NOW() THEN
    UPDATE organisation_invite_codes SET is_active = false WHERE id = v_invite.id;
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::org_role, false, 'Invite code has expired';
    RETURN;
  END IF;

  IF v_invite.max_uses IS NOT NULL AND v_invite.times_used >= v_invite.max_uses THEN
    UPDATE organisation_invite_codes SET is_active = false WHERE id = v_invite.id;
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::org_role, false, 'Invite code has reached its usage limit';
    RETURN;
  END IF;

  IF v_invite.allowed_email_domains IS NOT NULL
     AND array_length(v_invite.allowed_email_domains, 1) > 0
     AND NOT (v_email_domain = ANY(v_invite.allowed_email_domains)) THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::org_role, false, 'Your email domain is not allowed';
    RETURN;
  END IF;

  SELECT * INTO v_org FROM organisations WHERE id = v_invite.organisation_id;

  IF EXISTS (SELECT 1 FROM organisation_memberships WHERE organisation_id = v_org.id AND user_id = v_user_id) THEN
    RETURN QUERY SELECT false, v_org.id, v_org.name, NULL::org_role, false, 'Already a member';
    RETURN;
  END IF;

  IF NOT can_org_add_member(v_org.id) THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::org_role, false, 'Organisation member limit reached';
    RETURN;
  END IF;

  v_membership_status := CASE WHEN v_org.require_approval THEN 'pending' ELSE 'active' END;

  INSERT INTO organisation_memberships (
    organisation_id, user_id, role, status, joined_at, invite_accepted_at
  ) VALUES (
    v_org.id, v_user_id, v_invite.allowed_roles[1], v_membership_status, NOW(), NOW()
  );

  UPDATE organisation_invite_codes SET times_used = times_used + 1, updated_at = NOW() WHERE id = v_invite.id;

  PERFORM create_audit_log(v_user_id, v_org.id, 'invite_used', 'invite_code', v_invite.code,
    jsonb_build_object('role', v_invite.allowed_roles[1], 'status', v_membership_status));

  RETURN QUERY SELECT true, v_org.id, v_org.name, v_invite.allowed_roles[1], v_org.require_approval;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION revoke_invite_code(p_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_invite organisation_invite_codes%ROWTYPE;
BEGIN
  SELECT * INTO v_invite FROM organisation_invite_codes WHERE code = UPPER(p_code);
  IF v_invite IS NULL THEN RETURN false; END IF;

  IF NOT user_has_role_level(auth.uid(), v_invite.organisation_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE organisation_invite_codes SET is_active = false, updated_at = NOW() WHERE id = v_invite.id;
  PERFORM create_audit_log(auth.uid(), v_invite.organisation_id, 'invite_revoked', 'invite_code', v_invite.code);
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. MEMBER MANAGEMENT FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION get_pending_members(p_org_id UUID)
RETURNS TABLE (membership_id UUID, user_id UUID, user_email TEXT, requested_at TIMESTAMPTZ, role org_role) AS $$
BEGIN
  IF NOT user_has_role_level(auth.uid(), p_org_id, 'approver') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT m.id, m.user_id, u.email, m.joined_at, m.role
  FROM organisation_memberships m
  JOIN auth.users u ON u.id = m.user_id
  WHERE m.organisation_id = p_org_id AND m.status = 'pending'
  ORDER BY m.joined_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION approve_member(p_membership_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_membership organisation_memberships%ROWTYPE;
BEGIN
  SELECT * INTO v_membership FROM organisation_memberships WHERE id = p_membership_id;
  IF v_membership IS NULL THEN RAISE EXCEPTION 'Membership not found'; END IF;

  IF NOT user_has_role_level(auth.uid(), v_membership.organisation_id, 'approver') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE organisation_memberships
  SET status = 'active', approved_by = auth.uid(), approved_at = NOW()
  WHERE id = p_membership_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reject_member(p_membership_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_membership organisation_memberships%ROWTYPE;
BEGIN
  SELECT * INTO v_membership FROM organisation_memberships WHERE id = p_membership_id;
  IF v_membership IS NULL THEN RAISE EXCEPTION 'Membership not found'; END IF;

  IF NOT user_has_role_level(auth.uid(), v_membership.organisation_id, 'approver') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE organisation_memberships
  SET status = 'rejected', suspended_reason = p_reason, suspended_by = auth.uid(), suspended_at = NOW()
  WHERE id = p_membership_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION suspend_member(p_membership_id UUID, p_reason TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_membership organisation_memberships%ROWTYPE;
BEGIN
  SELECT * INTO v_membership FROM organisation_memberships WHERE id = p_membership_id;
  IF v_membership IS NULL THEN RAISE EXCEPTION 'Membership not found'; END IF;

  IF NOT user_has_role_level(auth.uid(), v_membership.organisation_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  IF v_membership.role = 'owner' THEN
    RAISE EXCEPTION 'Cannot suspend owner';
  END IF;

  UPDATE organisation_memberships
  SET status = 'suspended', suspended_reason = p_reason, suspended_by = auth.uid(), suspended_at = NOW()
  WHERE id = p_membership_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reactivate_member(p_membership_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_membership organisation_memberships%ROWTYPE;
BEGIN
  SELECT * INTO v_membership FROM organisation_memberships WHERE id = p_membership_id;
  IF v_membership IS NULL OR v_membership.status != 'suspended' THEN
    RAISE EXCEPTION 'Membership not found or not suspended';
  END IF;

  IF NOT user_has_role_level(auth.uid(), v_membership.organisation_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE organisation_memberships
  SET status = 'active', suspended_reason = NULL, suspended_by = NULL, suspended_at = NULL,
      approved_by = auth.uid(), approved_at = NOW()
  WHERE id = p_membership_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION change_member_role(p_membership_id UUID, p_new_role org_role)
RETURNS BOOLEAN AS $$
DECLARE
  v_membership organisation_memberships%ROWTYPE;
  v_current_user_role_level INTEGER;
  v_target_role_level INTEGER;
  v_new_role_level INTEGER;
BEGIN
  SELECT * INTO v_membership FROM organisation_memberships WHERE id = p_membership_id;
  IF v_membership IS NULL THEN RAISE EXCEPTION 'Membership not found'; END IF;

  SELECT get_role_level(role) INTO v_current_user_role_level
  FROM organisation_memberships
  WHERE user_id = auth.uid() AND organisation_id = v_membership.organisation_id AND status = 'active';

  v_target_role_level := get_role_level(v_membership.role);
  v_new_role_level := get_role_level(p_new_role);

  IF v_current_user_role_level < get_role_level('admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  IF v_target_role_level >= v_current_user_role_level AND v_current_user_role_level < get_role_level('owner') THEN
    RAISE EXCEPTION 'Cannot change role of member with equal or higher role';
  END IF;

  IF v_new_role_level > v_current_user_role_level AND v_current_user_role_level < get_role_level('owner') THEN
    RAISE EXCEPTION 'Cannot assign role higher than your own';
  END IF;

  UPDATE organisation_memberships SET role = p_new_role WHERE id = p_membership_id;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. SECURITY & DATA FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION get_org_security_settings(p_org_id UUID)
RETURNS TABLE (
  require_approval BOOLEAN, require_mfa BOOLEAN,
  session_timeout_minutes INTEGER, has_ip_restrictions BOOLEAN, pending_member_count BIGINT
) AS $$
BEGIN
  IF NOT user_has_role_level(auth.uid(), p_org_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT o.require_approval, o.require_mfa, o.session_timeout_minutes,
    (o.allowed_ip_ranges IS NOT NULL AND array_length(o.allowed_ip_ranges, 1) > 0),
    (SELECT COUNT(*) FROM organisation_memberships m WHERE m.organisation_id = p_org_id AND m.status = 'pending')
  FROM organisations o WHERE o.id = p_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_org_security_settings(
  p_org_id UUID,
  p_require_approval BOOLEAN DEFAULT NULL,
  p_require_mfa BOOLEAN DEFAULT NULL,
  p_session_timeout_minutes INTEGER DEFAULT NULL,
  p_allowed_ip_ranges TEXT[] DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT user_has_role_level(auth.uid(), p_org_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE organisations SET
    require_approval = COALESCE(p_require_approval, require_approval),
    require_mfa = COALESCE(p_require_mfa, require_mfa),
    session_timeout_minutes = COALESCE(p_session_timeout_minutes, session_timeout_minutes),
    allowed_ip_ranges = COALESCE(p_allowed_ip_ranges, allowed_ip_ranges),
    updated_at = NOW()
  WHERE id = p_org_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_audit_log_summary(p_org_id UUID, p_days INTEGER DEFAULT 30, p_limit INTEGER DEFAULT 100)
RETURNS TABLE (id UUID, user_email TEXT, action audit_action, resource_type TEXT, details JSONB, created_at TIMESTAMPTZ) AS $$
BEGIN
  IF NOT user_has_role_level(auth.uid(), p_org_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT a.id, a.user_email, a.action, a.resource_type, a.details, a.created_at
  FROM audit_logs a
  WHERE a.organisation_id = p_org_id AND a.created_at > NOW() - (p_days || ' days')::INTERVAL
  ORDER BY a.created_at DESC LIMIT p_limit;
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
  SELECT m.id, m.user_id, u.email, m.role, m.status, m.joined_at, m.approved_at
  FROM organisation_memberships m
  JOIN auth.users u ON u.id = m.user_id
  WHERE m.organisation_id = p_org_id
  ORDER BY CASE m.status WHEN 'pending' THEN 0 WHEN 'active' THEN 1 ELSE 2 END, m.joined_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION export_user_data(p_org_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  v_target_user UUID;
  v_result JSONB;
BEGIN
  v_target_user := COALESCE(p_user_id, auth.uid());

  IF v_target_user != auth.uid() THEN
    IF NOT user_has_role_level(auth.uid(), p_org_id, 'admin') THEN
      RAISE EXCEPTION 'Permission denied';
    END IF;
  END IF;

  SELECT jsonb_build_object(
    'exported_at', NOW(),
    'user_id', v_target_user,
    'organisation_id', p_org_id,
    'membership', (SELECT jsonb_agg(row_to_json(m)) FROM organisation_memberships m WHERE m.user_id = v_target_user AND m.organisation_id = p_org_id),
    'sessions', (SELECT jsonb_agg(row_to_json(s)) FROM sessions s WHERE s.user_id = v_target_user),
    'audit_logs', (SELECT jsonb_agg(row_to_json(a)) FROM audit_logs a WHERE a.user_id = v_target_user AND a.organisation_id = p_org_id)
  ) INTO v_result;

  PERFORM create_audit_log(auth.uid(), p_org_id, 'data_exported', 'user_data', v_target_user::TEXT, jsonb_build_object('exported_by', auth.uid()));
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION request_data_deletion(p_org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  PERFORM create_audit_log(v_user_id, p_org_id, 'data_deleted', 'user_data', v_user_id::TEXT, jsonb_build_object('requested_at', NOW()));

  DELETE FROM organisation_memberships WHERE user_id = v_user_id AND organisation_id = p_org_id;

  UPDATE audit_logs SET user_email = 'deleted_user', details = details - 'email' - 'name'
  WHERE user_id = v_user_id AND organisation_id = p_org_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE organisation_invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view org invite codes" ON organisation_invite_codes;
CREATE POLICY "Admins can view org invite codes" ON organisation_invite_codes FOR SELECT
  USING (user_has_role_level(auth.uid(), organisation_id, 'admin'));

DROP POLICY IF EXISTS "Admins can insert invite codes" ON organisation_invite_codes;
CREATE POLICY "Admins can insert invite codes" ON organisation_invite_codes FOR INSERT
  WITH CHECK (user_has_role_level(auth.uid(), organisation_id, 'admin'));

DROP POLICY IF EXISTS "Admins can update invite codes" ON organisation_invite_codes;
CREATE POLICY "Admins can update invite codes" ON organisation_invite_codes FOR UPDATE
  USING (user_has_role_level(auth.uid(), organisation_id, 'admin'));

DROP POLICY IF EXISTS "Admins can view org audit logs" ON audit_logs;
CREATE POLICY "Admins can view org audit logs" ON audit_logs FOR SELECT
  USING (user_has_role_level(auth.uid(), organisation_id, 'admin') OR user_id = auth.uid());

-- =====================================================
-- 10. GRANTS
-- =====================================================

GRANT EXECUTE ON FUNCTION user_has_role_level TO authenticated;
GRANT EXECUTE ON FUNCTION get_role_level TO authenticated;
GRANT EXECUTE ON FUNCTION create_invite_code TO authenticated;
GRANT EXECUTE ON FUNCTION use_invite_code TO authenticated;
GRANT EXECUTE ON FUNCTION revoke_invite_code TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_members TO authenticated;
GRANT EXECUTE ON FUNCTION approve_member TO authenticated;
GRANT EXECUTE ON FUNCTION reject_member TO authenticated;
GRANT EXECUTE ON FUNCTION suspend_member TO authenticated;
GRANT EXECUTE ON FUNCTION reactivate_member TO authenticated;
GRANT EXECUTE ON FUNCTION change_member_role TO authenticated;
GRANT EXECUTE ON FUNCTION export_user_data TO authenticated;
GRANT EXECUTE ON FUNCTION request_data_deletion TO authenticated;
GRANT EXECUTE ON FUNCTION get_org_security_settings TO authenticated;
GRANT EXECUTE ON FUNCTION update_org_security_settings TO authenticated;
GRANT EXECUTE ON FUNCTION get_audit_log_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_org_members TO authenticated;
