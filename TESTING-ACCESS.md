# Testing Access System - Bypass Payment

This guide explains how to create organizational codes and entitlements for testing without going through the payment process.

## Option 1: Direct Database Access (Quickest)

### 1. Create a Test User Entitlement

Connect to your Supabase database and run:

```sql
-- First, sign up as a test user through the UI to get a user ID
-- Then add an entitlement directly:

INSERT INTO entitlements (
  scope_type,
  scope_id,
  access_level,
  module_bundle,
  max_modules,
  starts_at,
  ends_at
) VALUES (
  'user',
  'YOUR_USER_ID_HERE',  -- Replace with your test user's ID from auth.users
  'deep_dive',           -- or 'pulse'
  'full',               -- or 'core' or 'expanded'
  NULL,                 -- NULL for unlimited modules
  NOW(),
  NOW() + INTERVAL '1 year'
);
```

### 2. Find Your User ID

After signing up, run this query:

```sql
SELECT id, email FROM auth.users WHERE email = 'your-test-email@example.com';
```

## Option 2: Create an Organization with Invite Code

### 1. Create a Test Organization

```sql
INSERT INTO organisations (
  name,
  slug,
  invite_code,
  allowed_email_domains,
  allow_domain_auto_join
) VALUES (
  'Test Organization',
  'test-org',
  'TESTCODE123',        -- Use this code to join
  ARRAY['example.com'], -- Optional: auto-join by email domain
  true                  -- Set to false to require invite code only
);
```

### 2. Create Organization Entitlement

```sql
-- Get the org ID from the previous insert
INSERT INTO entitlements (
  scope_type,
  scope_id,
  access_level,
  module_bundle,
  max_modules,
  starts_at,
  ends_at
) VALUES (
  'organisation',
  'ORG_ID_HERE',        -- Replace with org ID from step 1
  'deep_dive',
  'full',
  NULL,
  NOW(),
  NOW() + INTERVAL '1 year'
);
```

### 3. Join the Organization

On the Decision page:
1. Click "Already have organisation access?"
2. Enter invite code: `TESTCODE123`
3. You'll automatically get access

## Option 3: Email Domain Auto-Join

If you set `allow_domain_auto_join = true` and added your email domain to `allowed_email_domains`, any user signing up with that domain will automatically join and get access.

Example:
```sql
-- Update organization to allow auto-join for @yourcompany.com
UPDATE organisations
SET
  allowed_email_domains = ARRAY['yourcompany.com'],
  allow_domain_auto_join = true
WHERE slug = 'test-org';
```

Now anyone signing up with `user@yourcompany.com` gets automatic access.

## Quick Test Setup Script

Run this entire script to set up a complete test environment:

```sql
-- 1. Create test organization
INSERT INTO organisations (name, slug, invite_code, allow_domain_auto_join)
VALUES ('Test Org', 'test-org', 'TEST123', true)
RETURNING id;

-- 2. Note the returned ID and use it below
WITH org AS (
  SELECT id FROM organisations WHERE slug = 'test-org'
)
INSERT INTO entitlements (scope_type, scope_id, access_level, module_bundle, starts_at, ends_at)
SELECT 'organisation', org.id, 'deep_dive', 'full', NOW(), NOW() + INTERVAL '1 year'
FROM org;
```

## Verify Access

After setting up, you can verify by running:

```sql
-- Check your entitlements
SELECT
  e.*,
  o.name as org_name
FROM entitlements e
LEFT JOIN organisations o ON e.scope_id = o.id::text AND e.scope_type = 'organisation'
WHERE e.scope_type = 'user' AND e.scope_id = 'YOUR_USER_ID'
   OR e.scope_type = 'organisation' AND e.scope_id IN (
     SELECT organisation_id::text FROM organisation_memberships WHERE user_id = 'YOUR_USER_ID'
   );
```

## Common Test Scenarios

### Scenario 1: Small Business Self-Serve
- Sign up normally
- No entitlement needed
- Go through Stripe checkout (use Stripe test mode)

### Scenario 2: Enterprise with Entitlement
- Create user entitlement (Option 1)
- Sign in
- Should bypass payment entirely and go straight to dashboard

### Scenario 3: Organization Member
- Create organization with invite code (Option 2)
- Sign up
- Use invite code
- Get instant access

## Environment Variables

Make sure these are set in your `.env`:

```bash
# Stripe (use test keys)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Optional: Consultation booking
VITE_CONSULT_BOOKING_URL=https://calendly.com/your-link
VITE_SALES_BOOKING_URL=https://calendly.com/sales-link
```

## Troubleshooting

### "Still seeing payment page after adding entitlement"
- Check that `starts_at <= NOW()` and `ends_at >= NOW()`
- Verify `access_level` matches what you're trying to access
- Sign out and sign back in to refresh access state

### "Invite code not working"
- Check `invite_code` is exact match (case-sensitive)
- Verify organization has an entitlement
- Make sure you're signed in when entering the code

### "Access denied after sign-in"
- Check Row Level Security (RLS) policies are enabled
- Verify user ID matches in entitlements table
- Check browser console for errors
