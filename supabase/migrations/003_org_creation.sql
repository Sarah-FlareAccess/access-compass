-- =====================================================
-- ACCESS COMPASS - ORGANISATION CREATION
-- =====================================================
-- Migration: 003_org_creation.sql
-- Adds organisation creation functionality and size-based limits
-- =====================================================

-- Add size column to organisations table
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS size business_size_tier DEFAULT 'small';

-- =====================================================
-- COMMON EMAIL DOMAINS (exclude from auto-join)
-- =====================================================
-- These domains should never be used for domain auto-join

CREATE OR REPLACE FUNCTION is_common_email_domain(p_domain TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN LOWER(p_domain) = ANY(ARRAY[
    'gmail.com', 'googlemail.com',
    'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'yahoo.com', 'yahoo.co.uk', 'yahoo.com.au',
    'icloud.com', 'me.com', 'mac.com',
    'aol.com',
    'protonmail.com', 'proton.me',
    'mail.com', 'email.com',
    'zoho.com',
    'yandex.com',
    'gmx.com', 'gmx.net',
    'fastmail.com',
    'tutanota.com',
    'inbox.com',
    'mail.ru'
  ]);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- INVITE CODE GENERATOR
-- =====================================================

CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Exclude confusing chars (0,O,1,I)
  code TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MAX MEMBERS BY SIZE TIER
-- =====================================================

CREATE OR REPLACE FUNCTION get_max_members_for_size(p_size business_size_tier)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE p_size
    WHEN 'small' THEN 5
    WHEN 'medium' THEN 15
    WHEN 'large' THEN 50
    WHEN 'enterprise' THEN 500
    ELSE 5
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- CREATE ORGANISATION WITH ADMIN
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
-- GET ORGANISATION MEMBER COUNT
-- =====================================================

CREATE OR REPLACE FUNCTION get_org_member_count(p_org_id UUID)
RETURNS INTEGER AS $$
DECLARE
  member_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO member_count
  FROM organisation_memberships
  WHERE organisation_id = p_org_id;

  RETURN member_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- CHECK IF ORG CAN ADD MORE MEMBERS
-- =====================================================

CREATE OR REPLACE FUNCTION can_org_add_member(p_org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_max_members INTEGER;
  v_current_count INTEGER;
BEGIN
  SELECT max_members INTO v_max_members
  FROM organisations
  WHERE id = p_org_id;

  SELECT COUNT(*) INTO v_current_count
  FROM organisation_memberships
  WHERE organisation_id = p_org_id;

  RETURN v_current_count < v_max_members;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS POLICY FOR ORG CREATION
-- =====================================================

-- Allow authenticated users to create organisations
CREATE POLICY "Users can create organisations"
  ON organisations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- UPDATE domain auto-join to check member limits
-- =====================================================

CREATE OR REPLACE FUNCTION check_domain_auto_join(p_user_email TEXT)
RETURNS TABLE (
  organisation_id UUID,
  organisation_name TEXT
) AS $$
DECLARE
  email_domain TEXT;
BEGIN
  -- Extract domain from email
  email_domain := split_part(p_user_email, '@', 2);

  -- Don't auto-join for common email domains
  IF is_common_email_domain(email_domain) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT o.id as organisation_id, o.name as organisation_name
  FROM organisations o
  WHERE
    o.allow_domain_auto_join = true
    AND email_domain = ANY(o.allowed_email_domains)
    AND can_org_add_member(o.id); -- Check member limit
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
