-- =====================================================
-- ACCESS COMPASS - PRE-REGISTERED EMAIL INVITES
-- =====================================================
-- Migration: 006_pre_registered_emails.sql
-- Adds pre-registered email validation for org invites
-- Only users whose emails are pre-registered can join
-- =====================================================

-- =====================================================
-- ALLOWED EMAILS TABLE
-- =====================================================
-- Stores pre-registered emails that can join an organisation

CREATE TABLE IF NOT EXISTS organisation_allowed_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ, -- When someone actually joined with this email
  used_by UUID REFERENCES auth.users(id), -- The user who joined
  notes TEXT, -- Optional notes about this person

  -- Ensure email is unique per organisation
  UNIQUE(organisation_id, email)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_allowed_emails_org ON organisation_allowed_emails(organisation_id);
CREATE INDEX IF NOT EXISTS idx_allowed_emails_email ON organisation_allowed_emails(LOWER(email));

-- =====================================================
-- ADD REQUIRE_EMAIL_PREREGISTRATION FLAG TO ORGS
-- =====================================================

ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS require_email_preregistration BOOLEAN DEFAULT true;

-- =====================================================
-- CHECK IF EMAIL IS ALLOWED TO JOIN
-- =====================================================

CREATE OR REPLACE FUNCTION is_email_allowed_to_join(
  p_org_id UUID,
  p_email TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_require_preregistration BOOLEAN;
  v_email_allowed BOOLEAN;
BEGIN
  -- Check if org requires pre-registration
  SELECT require_email_preregistration INTO v_require_preregistration
  FROM organisations
  WHERE id = p_org_id;

  -- If pre-registration not required, allow anyone
  IF v_require_preregistration = false THEN
    RETURN true;
  END IF;

  -- Check if email is in allowed list (case-insensitive)
  SELECT EXISTS(
    SELECT 1 FROM organisation_allowed_emails
    WHERE organisation_id = p_org_id
    AND LOWER(email) = LOWER(p_email)
    AND used_at IS NULL -- Not already used
  ) INTO v_email_allowed;

  RETURN v_email_allowed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VALIDATE AND JOIN WITH INVITE CODE
-- =====================================================
-- Returns validation result and org info if valid

CREATE OR REPLACE FUNCTION validate_invite_code_for_email(
  p_invite_code TEXT,
  p_email TEXT
)
RETURNS TABLE (
  is_valid BOOLEAN,
  error_code TEXT,
  error_message TEXT,
  organisation_id UUID,
  organisation_name TEXT,
  organisation_slug TEXT
) AS $$
DECLARE
  v_org RECORD;
  v_email_allowed BOOLEAN;
BEGIN
  -- Find organisation by invite code
  SELECT o.id, o.name, o.slug, o.require_email_preregistration
  INTO v_org
  FROM organisations o
  WHERE UPPER(o.invite_code) = UPPER(p_invite_code);

  -- Check if invite code exists
  IF v_org IS NULL THEN
    RETURN QUERY SELECT
      false::BOOLEAN as is_valid,
      'INVALID_CODE'::TEXT as error_code,
      'Invalid invite code. Please check and try again.'::TEXT as error_message,
      NULL::UUID as organisation_id,
      NULL::TEXT as organisation_name,
      NULL::TEXT as organisation_slug;
    RETURN;
  END IF;

  -- Check if email is allowed
  v_email_allowed := is_email_allowed_to_join(v_org.id, p_email);

  IF NOT v_email_allowed THEN
    RETURN QUERY SELECT
      false::BOOLEAN as is_valid,
      'EMAIL_NOT_REGISTERED'::TEXT as error_code,
      'Your email address has not been registered for this organisation. Please contact your organisation administrator.'::TEXT as error_message,
      v_org.id as organisation_id,
      v_org.name as organisation_name,
      v_org.slug as organisation_slug;
    RETURN;
  END IF;

  -- Check member limit
  IF NOT can_org_add_member(v_org.id) THEN
    RETURN QUERY SELECT
      false::BOOLEAN as is_valid,
      'ORG_FULL'::TEXT as error_code,
      'This organisation has reached its member limit.'::TEXT as error_message,
      v_org.id as organisation_id,
      v_org.name as organisation_name,
      v_org.slug as organisation_slug;
    RETURN;
  END IF;

  -- All checks passed
  RETURN QUERY SELECT
    true::BOOLEAN as is_valid,
    NULL::TEXT as error_code,
    NULL::TEXT as error_message,
    v_org.id as organisation_id,
    v_org.name as organisation_name,
    v_org.slug as organisation_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MARK EMAIL AS USED WHEN JOINING
-- =====================================================

CREATE OR REPLACE FUNCTION mark_allowed_email_as_used(
  p_org_id UUID,
  p_email TEXT,
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE organisation_allowed_emails
  SET
    used_at = NOW(),
    used_by = p_user_id
  WHERE organisation_id = p_org_id
  AND LOWER(email) = LOWER(p_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ADD ALLOWED EMAILS TO ORGANISATION
-- =====================================================

CREATE OR REPLACE FUNCTION add_allowed_emails(
  p_org_id UUID,
  p_emails TEXT[], -- Array of email addresses
  p_added_by UUID
)
RETURNS TABLE (
  added_count INTEGER,
  skipped_count INTEGER,
  skipped_emails TEXT[]
) AS $$
DECLARE
  v_email TEXT;
  v_added INTEGER := 0;
  v_skipped INTEGER := 0;
  v_skipped_emails TEXT[] := ARRAY[]::TEXT[];
BEGIN
  FOREACH v_email IN ARRAY p_emails
  LOOP
    -- Skip empty emails
    IF v_email IS NULL OR TRIM(v_email) = '' THEN
      CONTINUE;
    END IF;

    -- Try to insert (skip if already exists)
    BEGIN
      INSERT INTO organisation_allowed_emails (
        organisation_id,
        email,
        added_by
      ) VALUES (
        p_org_id,
        LOWER(TRIM(v_email)),
        p_added_by
      );
      v_added := v_added + 1;
    EXCEPTION WHEN unique_violation THEN
      v_skipped := v_skipped + 1;
      v_skipped_emails := array_append(v_skipped_emails, v_email);
    END;
  END LOOP;

  RETURN QUERY SELECT v_added, v_skipped, v_skipped_emails;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GET ALLOWED EMAILS FOR ORGANISATION
-- =====================================================

CREATE OR REPLACE FUNCTION get_allowed_emails(p_org_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  added_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  is_used BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ae.id,
    ae.email,
    ae.added_at,
    ae.used_at,
    (ae.used_at IS NOT NULL) as is_used
  FROM organisation_allowed_emails ae
  WHERE ae.organisation_id = p_org_id
  ORDER BY ae.added_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- REMOVE ALLOWED EMAIL
-- =====================================================

CREATE OR REPLACE FUNCTION remove_allowed_email(
  p_org_id UUID,
  p_email_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_deleted BOOLEAN;
BEGIN
  DELETE FROM organisation_allowed_emails
  WHERE id = p_email_id
  AND organisation_id = p_org_id
  AND used_at IS NULL; -- Can't remove if already used

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- UPDATE ORG CREATION TO INCLUDE ALLOWED EMAILS
-- =====================================================

CREATE OR REPLACE FUNCTION create_organisation_with_admin_and_emails(
  p_name TEXT,
  p_size business_size_tier,
  p_contact_email TEXT,
  p_contact_name TEXT,
  p_creator_user_id UUID,
  p_allowed_emails TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS TABLE (
  organisation_id UUID,
  organisation_name TEXT,
  organisation_slug TEXT,
  invite_code TEXT,
  max_members INTEGER,
  domain_auto_join_enabled BOOLEAN,
  emails_added INTEGER
) AS $$
DECLARE
  v_org_id UUID;
  v_slug TEXT;
  v_invite_code TEXT;
  v_email_domain TEXT;
  v_allowed_domains TEXT[];
  v_domain_auto_join BOOLEAN;
  v_max_members INTEGER;
  v_emails_added INTEGER := 0;
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

  -- Create organisation with pre-registration required by default
  INSERT INTO organisations (
    name,
    slug,
    size,
    contact_email,
    contact_name,
    invite_code,
    allowed_email_domains,
    allow_domain_auto_join,
    max_members,
    require_email_preregistration
  ) VALUES (
    p_name,
    v_slug,
    p_size,
    p_contact_email,
    p_contact_name,
    v_invite_code,
    v_allowed_domains,
    v_domain_auto_join,
    v_max_members,
    true -- Require pre-registration by default
  ) RETURNING id INTO v_org_id;

  -- Create admin membership for creator
  INSERT INTO organisation_memberships (
    organisation_id,
    user_id,
    role,
    joined_at,
    invite_accepted_at
  ) VALUES (
    v_org_id,
    p_creator_user_id,
    'admin',
    NOW(),
    NOW()
  );

  -- Add allowed emails if provided
  IF array_length(p_allowed_emails, 1) > 0 THEN
    SELECT added_count INTO v_emails_added
    FROM add_allowed_emails(v_org_id, p_allowed_emails, p_creator_user_id);
  END IF;

  -- Return created organisation details
  RETURN QUERY
  SELECT
    v_org_id as organisation_id,
    p_name as organisation_name,
    v_slug as organisation_slug,
    v_invite_code as invite_code,
    v_max_members as max_members,
    v_domain_auto_join as domain_auto_join_enabled,
    v_emails_added as emails_added;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS POLICIES FOR ALLOWED EMAILS
-- =====================================================

ALTER TABLE organisation_allowed_emails ENABLE ROW LEVEL SECURITY;

-- Org admins can view allowed emails for their org
CREATE POLICY "Org admins can view allowed emails"
  ON organisation_allowed_emails FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organisation_memberships om
      WHERE om.organisation_id = organisation_allowed_emails.organisation_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'owner')
    )
  );

-- Org admins can insert allowed emails
CREATE POLICY "Org admins can add allowed emails"
  ON organisation_allowed_emails FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organisation_memberships om
      WHERE om.organisation_id = organisation_allowed_emails.organisation_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'owner')
    )
  );

-- Org admins can delete unused allowed emails
CREATE POLICY "Org admins can remove unused allowed emails"
  ON organisation_allowed_emails FOR DELETE
  USING (
    used_at IS NULL
    AND EXISTS (
      SELECT 1 FROM organisation_memberships om
      WHERE om.organisation_id = organisation_allowed_emails.organisation_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'owner')
    )
  );

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT SELECT, INSERT, DELETE ON organisation_allowed_emails TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
