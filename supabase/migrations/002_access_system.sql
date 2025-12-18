-- =====================================================
-- ACCESS COMPASS - PAYWALL & ACCESS SYSTEM SCHEMA
-- =====================================================
-- Migration: 002_access_system.sql
-- Adds organisations, memberships, entitlements, and purchases
-- =====================================================

-- =====================================================
-- ENUMS
-- =====================================================

-- Business size tier (includes enterprise)
CREATE TYPE business_size_tier AS ENUM ('small', 'medium', 'large', 'enterprise');

-- Access level (assessment depth)
CREATE TYPE access_level AS ENUM ('pulse', 'deep_dive');

-- Module bundle types
CREATE TYPE module_bundle AS ENUM ('core', 'expanded', 'full');

-- Entitlement scope (user or organisation)
CREATE TYPE entitlement_scope AS ENUM ('user', 'org');

-- Purchase status
CREATE TYPE purchase_status AS ENUM ('pending', 'completed', 'refunded', 'cancelled');

-- Organisation member role
CREATE TYPE org_role AS ENUM ('admin', 'member');

-- =====================================================
-- ORGANISATIONS TABLE
-- Supports enterprise/precinct access
-- =====================================================
CREATE TABLE IF NOT EXISTS organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  -- Access configuration
  allowed_email_domains TEXT[], -- e.g., ['company.com', 'subsidiary.com']
  invite_code TEXT UNIQUE, -- e.g., 'COMPANY2024'
  allow_domain_auto_join BOOLEAN DEFAULT false,

  -- Settings
  max_members INTEGER DEFAULT 100,

  -- Contact info (for enterprise management)
  contact_email TEXT,
  contact_name TEXT,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_organisations_slug ON organisations(slug);
CREATE INDEX IF NOT EXISTS idx_organisations_invite_code ON organisations(invite_code) WHERE invite_code IS NOT NULL;

-- =====================================================
-- ORGANISATION MEMBERSHIPS TABLE
-- Links users to organisations
-- =====================================================
CREATE TABLE IF NOT EXISTS organisation_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  role org_role NOT NULL DEFAULT 'member',

  -- Tracking
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),
  invite_accepted_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique membership per user per org
  CONSTRAINT unique_org_membership UNIQUE (organisation_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_org_memberships_user ON organisation_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_org ON organisation_memberships(organisation_id);

-- =====================================================
-- ENTITLEMENTS TABLE
-- Defines what a user or organisation can access
-- =====================================================
CREATE TABLE IF NOT EXISTS entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Scope: either user or organisation
  scope_type entitlement_scope NOT NULL,
  scope_id UUID NOT NULL, -- user_id or organisation_id depending on scope_type

  -- Access configuration
  access_level access_level NOT NULL DEFAULT 'pulse',
  module_bundle module_bundle NOT NULL DEFAULT 'core',
  max_modules INTEGER, -- NULL = unlimited

  -- Validity period
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ, -- NULL = perpetual (no expiry)

  -- Source tracking
  purchase_id UUID, -- links to purchases table if from purchase
  granted_by TEXT NOT NULL DEFAULT 'purchase', -- 'purchase', 'admin', 'trial', 'enterprise', 'pilot', 'sponsorship'
  granted_by_user_id UUID REFERENCES auth.users(id), -- admin who granted (if applicable)

  -- Notes
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ, -- Set when entitlement is revoked
  revoked_reason TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_entitlements_scope ON entitlements(scope_type, scope_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_active ON entitlements(starts_at, ends_at)
  WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_entitlements_purchase ON entitlements(purchase_id)
  WHERE purchase_id IS NOT NULL;

-- =====================================================
-- PURCHASES TABLE
-- Records all self-serve purchases
-- =====================================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Buyer
  user_id UUID NOT NULL REFERENCES auth.users(id),
  organisation_id UUID REFERENCES organisations(id), -- optional, for org purchases

  -- Product details
  product TEXT NOT NULL, -- 'pulse_check', 'deep_dive'
  business_size_tier business_size_tier NOT NULL,
  module_bundle module_bundle NOT NULL,

  -- Pricing
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AUD',
  gst_cents INTEGER, -- GST amount if applicable

  -- Status
  status purchase_status NOT NULL DEFAULT 'pending',

  -- Stripe integration
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,

  -- Invoice support (for manual/enterprise)
  invoice_number TEXT,
  invoice_sent_at TIMESTAMPTZ,

  -- Metadata
  notes TEXT,
  metadata JSONB, -- For any additional data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_org ON purchases(organisation_id) WHERE organisation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

-- =====================================================
-- UPDATE SESSIONS TABLE
-- Add user_id reference for authenticated sessions
-- =====================================================
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id) WHERE user_id IS NOT NULL;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Organisations: viewable by members, public info viewable by all authenticated
CREATE POLICY "Members can view their organisations"
  ON organisations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organisation_memberships
      WHERE organisation_memberships.organisation_id = organisations.id
      AND organisation_memberships.user_id = auth.uid()
    )
  );

-- Allow looking up orgs by invite code (for joining)
CREATE POLICY "Anyone can lookup org by invite code"
  ON organisations FOR SELECT
  USING (invite_code IS NOT NULL);

-- Organisation memberships: users can see their own memberships
CREATE POLICY "Users can view their own memberships"
  ON organisation_memberships FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own memberships (when joining via invite code)
CREATE POLICY "Users can create their own membership"
  ON organisation_memberships FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Entitlements: users can view their own entitlements
CREATE POLICY "Users can view their own user entitlements"
  ON entitlements FOR SELECT
  USING (
    (scope_type = 'user' AND scope_id = auth.uid()) OR
    (scope_type = 'org' AND EXISTS (
      SELECT 1 FROM organisation_memberships
      WHERE organisation_memberships.organisation_id = entitlements.scope_id
      AND organisation_memberships.user_id = auth.uid()
    ))
  );

-- Purchases: users can view their own purchases
CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own purchases
CREATE POLICY "Users can create their own purchases"
  ON purchases FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to check if a user has any valid entitlement
CREATE OR REPLACE FUNCTION check_user_has_access(
  p_user_id UUID,
  p_required_level access_level DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM entitlements e
    LEFT JOIN organisation_memberships om ON
      e.scope_type = 'org' AND e.scope_id = om.organisation_id
    WHERE
      (
        (e.scope_type = 'user' AND e.scope_id = p_user_id) OR
        (e.scope_type = 'org' AND om.user_id = p_user_id)
      )
      AND (p_required_level IS NULL OR e.access_level = p_required_level OR e.access_level = 'deep_dive')
      AND e.starts_at <= NOW()
      AND (e.ends_at IS NULL OR e.ends_at > NOW())
      AND e.revoked_at IS NULL
  ) INTO has_access;

  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's best/active entitlement
CREATE OR REPLACE FUNCTION get_user_entitlement(p_user_id UUID)
RETURNS TABLE (
  entitlement_id UUID,
  access_level access_level,
  module_bundle module_bundle,
  max_modules INTEGER,
  source TEXT,
  expires_at TIMESTAMPTZ,
  organisation_id UUID,
  organisation_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id as entitlement_id,
    e.access_level,
    e.module_bundle,
    e.max_modules,
    e.granted_by as source,
    e.ends_at as expires_at,
    CASE WHEN e.scope_type = 'org' THEN e.scope_id ELSE NULL END as organisation_id,
    o.name as organisation_name
  FROM entitlements e
  LEFT JOIN organisation_memberships om ON
    e.scope_type = 'org' AND e.scope_id = om.organisation_id AND om.user_id = p_user_id
  LEFT JOIN organisations o ON
    e.scope_type = 'org' AND e.scope_id = o.id
  WHERE
    (
      (e.scope_type = 'user' AND e.scope_id = p_user_id) OR
      (e.scope_type = 'org' AND om.user_id IS NOT NULL)
    )
    AND e.starts_at <= NOW()
    AND (e.ends_at IS NULL OR e.ends_at > NOW())
    AND e.revoked_at IS NULL
  ORDER BY
    -- Prefer deep_dive over pulse
    CASE e.access_level WHEN 'deep_dive' THEN 0 ELSE 1 END,
    -- Prefer full bundle
    CASE e.module_bundle WHEN 'full' THEN 0 WHEN 'expanded' THEN 1 ELSE 2 END,
    -- Prefer org entitlements (enterprise)
    CASE e.scope_type WHEN 'org' THEN 0 ELSE 1 END,
    -- Most recent first
    e.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to find organisation by invite code
CREATE OR REPLACE FUNCTION find_org_by_invite_code(p_invite_code TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.id, o.name, o.slug
  FROM organisations o
  WHERE UPPER(o.invite_code) = UPPER(p_invite_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can auto-join org by email domain
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

  RETURN QUERY
  SELECT o.id as organisation_id, o.name as organisation_name
  FROM organisations o
  WHERE
    o.allow_domain_auto_join = true
    AND email_domain = ANY(o.allowed_email_domains);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamps
DROP TRIGGER IF EXISTS update_organisations_updated_at ON organisations;
CREATE TRIGGER update_organisations_updated_at
  BEFORE UPDATE ON organisations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_entitlements_updated_at ON entitlements;
CREATE TRIGGER update_entitlements_updated_at
  BEFORE UPDATE ON entitlements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_purchases_updated_at ON purchases;
CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- Uncomment to create test organisations
-- =====================================================
/*
INSERT INTO organisations (name, slug, invite_code, allow_domain_auto_join, allowed_email_domains)
VALUES
  ('Test Enterprise', 'test-enterprise', 'TESTORG2024', false, NULL),
  ('Auto-Join Corp', 'auto-join-corp', 'AUTOJOIN', true, ARRAY['autojoin.com', 'autojoin.org']);
*/
