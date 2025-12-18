-- =====================================================
-- ACCESS COMPASS - TEST DATA
-- =====================================================
-- Quick setup script for testing without payment
-- Run this in Supabase SQL Editor to create test organization
-- =====================================================

-- 1. Create test organization with invite code TEST123
INSERT INTO organisations (name, slug, invite_code, allow_domain_auto_join, allowed_email_domains)
VALUES (
  'Test Organization',
  'test-org',
  'TEST123',
  false,  -- Set to true if you want auto-join by email domain
  NULL    -- Add domains like ARRAY['yourcompany.com'] for auto-join
)
ON CONFLICT (slug) DO UPDATE
SET
  invite_code = 'TEST123',
  name = 'Test Organization';

-- 2. Create deep_dive entitlement for the test organization
INSERT INTO entitlements (
  scope_type,
  scope_id,
  access_level,
  module_bundle,
  max_modules,
  starts_at,
  ends_at,
  granted_by,
  notes
)
SELECT
  'org',                    -- Organisation-level entitlement
  o.id,                     -- Organisation ID
  'deep_dive',              -- Full access level
  'full',                   -- All modules
  NULL,                     -- Unlimited modules
  NOW(),                    -- Active now
  NOW() + INTERVAL '1 year', -- Expires in 1 year
  'test',                   -- Source: test data
  'Test entitlement for development and testing'
FROM organisations o
WHERE o.slug = 'test-org'
ON CONFLICT DO NOTHING;

-- 3. Verify the setup
SELECT
  o.name as org_name,
  o.invite_code,
  o.slug,
  e.access_level,
  e.module_bundle,
  e.starts_at,
  e.ends_at
FROM organisations o
LEFT JOIN entitlements e ON e.scope_id = o.id AND e.scope_type = 'org'
WHERE o.slug = 'test-org';

-- =====================================================
-- EXPECTED RESULT:
-- org_name: Test Organization
-- invite_code: TEST123
-- slug: test-org
-- access_level: deep_dive
-- module_bundle: full
-- starts_at: [current timestamp]
-- ends_at: [1 year from now]
-- =====================================================
