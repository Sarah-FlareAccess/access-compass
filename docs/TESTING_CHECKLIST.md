# Access Compass - Security Testing Checklist

## Pre-requisites

Before testing, apply the migrations in Supabase SQL Editor in this exact order:

| Step | File | Action |
|------|------|--------|
| 1 | `003_org_creation.sql` | Run, wait for success |
| 2 | `004a_enum_updates.sql` | Run, **wait 5 seconds** |
| 3 | `004b_security_enhancements.sql` | Run, wait for success |
| 4 | `005_ownership_transfer.sql` | Run, wait for success |

**Note:** Step 2 must fully commit before Step 3, or you'll get an enum error.

---

## Test 1: Organisation Creation & Owner Role

### Setup
- [ ] Create a new account (User A) with a work email (not gmail/outlook)

### Test Steps
1. [ ] Sign up as User A
2. [ ] Complete disclaimer flow
3. [ ] When prompted, select "Create new organisation"
4. [ ] Fill in:
   - Organisation name: "Test Company"
   - Size: Medium
   - Contact name: Your name
   - Contact email: (pre-filled)
5. [ ] Submit and note the invite code shown

### Expected Results
- [ ] Organisation is created successfully
- [ ] Invite code is displayed (8 characters)
- [ ] User A is automatically the **Owner** (check in Settings > Members)

### Verify in Supabase
```sql
-- Check organisation was created
SELECT * FROM organisations WHERE name = 'Test Company';

-- Check membership with owner role
SELECT m.*, u.email
FROM organisation_memberships m
JOIN auth.users u ON u.id = m.user_id
WHERE m.role = 'owner';
```

---

## Test 2: Invite Code & Member Join

### Setup
- [ ] Have the invite code from Test 1
- [ ] Create a second account (User B) with a different email domain

### Test Steps
1. [ ] Sign up as User B (different email domain)
2. [ ] Complete disclaimer
3. [ ] When prompted, select "I have an invite code"
4. [ ] Enter the invite code from Test 1
5. [ ] Submit

### Expected Results
- [ ] User B joins the organisation
- [ ] User B has role **Member** (not owner/admin)
- [ ] User B can see the dashboard

### Verify in Supabase
```sql
-- Check User B's membership
SELECT m.role, m.status, u.email
FROM organisation_memberships m
JOIN auth.users u ON u.id = m.user_id
WHERE m.organisation_id = 'YOUR_ORG_ID';
```

---

## Test 3: Domain Auto-Join

### Setup
- [ ] User A (owner) should have a work email like `user@company.com`
- [ ] Create User C with same domain: `another@company.com`

### Test Steps
1. [ ] Sign up as User C with `another@company.com`
2. [ ] Complete disclaimer flow

### Expected Results
- [ ] User C is automatically matched to the organisation
- [ ] Shows message: "You've been added to [Org Name]"
- [ ] User C has role **Member**

---

## Test 4: Role Management

### Setup
- [ ] Log in as User A (owner)

### Test Steps
1. [ ] Go to Dashboard > click Settings (gear icon)
2. [ ] Go to Members tab
3. [ ] Find User B in the list
4. [ ] Change User B's role from Member to **Admin**
5. [ ] Verify the role updates

### Expected Results
- [ ] Role dropdown shows all 6 roles
- [ ] Role change is saved
- [ ] Audit log shows the change (Activity Log tab)

---

## Test 5: Ownership Transfer

### Setup
- [ ] User A is owner
- [ ] User B is now an admin (from Test 4)

### Test Steps
1. [ ] Log in as User A
2. [ ] Go to Settings > Members tab
3. [ ] Scroll to "Ownership & Membership" section
4. [ ] Click "Transfer Ownership"
5. [ ] Select User B from the list
6. [ ] Confirm the transfer

### Expected Results
- [ ] Warning message appears before confirmation
- [ ] After confirmation:
  - User A becomes **Admin**
  - User B becomes **Owner**
- [ ] User A no longer sees Transfer Ownership button
- [ ] User B now sees Transfer Ownership button

### Verify in Supabase
```sql
-- Check roles after transfer
SELECT m.role, u.email
FROM organisation_memberships m
JOIN auth.users u ON u.id = m.user_id
WHERE m.organisation_id = 'YOUR_ORG_ID'
ORDER BY
  CASE m.role
    WHEN 'owner' THEN 1
    WHEN 'admin' THEN 2
    ELSE 3
  END;
```

---

## Test 6: Leave Organisation (Non-Owner)

### Setup
- [ ] Log in as User A (now an admin, not owner)

### Test Steps
1. [ ] Go to Settings > Members tab
2. [ ] Scroll to "Ownership & Membership"
3. [ ] Click "Leave Organisation"
4. [ ] Confirm

### Expected Results
- [ ] Confirmation dialog appears
- [ ] After confirming, User A is removed from organisation
- [ ] User A is redirected (no longer has access)

---

## Test 7: Owner Cannot Leave Without Transfer

### Setup
- [ ] Log in as User B (current owner)

### Test Steps
1. [ ] Go to Settings > Members
2. [ ] Look for "Leave Organisation" option

### Expected Results
- [ ] Leave button should NOT be visible (owner sees info message instead)
- [ ] Message says: "As the owner, you must transfer ownership before leaving"

---

## Test 8: Invite Code Expiration & Limits

### Setup
- [ ] Log in as owner/admin

### Test Steps
1. [ ] Go to Settings > Invites tab
2. [ ] Click "Create Invite"
3. [ ] Set:
   - Label: "Test Limited"
   - Expires in: 1 day
   - Maximum uses: 1
4. [ ] Create the code
5. [ ] Use the code to join (new user)
6. [ ] Try to use the same code again (another new user)

### Expected Results
- [ ] First use: Works, user joins
- [ ] Second use: Fails (code exhausted)
- [ ] Code shows as inactive in Invites tab

---

## Test 9: Member Approval Workflow

### Setup
- [ ] Log in as owner/admin

### Test Steps
1. [ ] Go to Settings > Security tab
2. [ ] Enable "Require Approval for New Members"
3. [ ] Save
4. [ ] Create new invite code
5. [ ] New user joins with that code

### Expected Results
- [ ] New user's status is **Pending** (not Active)
- [ ] New user cannot access dashboard yet
- [ ] Admin sees pending member in Settings > Members
- [ ] Admin can Approve or Reject
- [ ] After approval, user can access dashboard

---

## Test 10: Session Timeout

### Setup
- [ ] Log in as owner/admin

### Test Steps
1. [ ] Go to Settings > Security
2. [ ] Set Session Timeout to **30 minutes**
3. [ ] Save
4. [ ] Wait without any activity (or manually test by reducing timeout)

### Expected Results
- [ ] Warning modal appears 5 minutes before timeout
- [ ] Shows countdown timer
- [ ] "Stay Logged In" extends session
- [ ] "Log Out" logs out immediately
- [ ] If no action, auto-logout occurs

---

## Test 11: Audit Logging

### Setup
- [ ] Perform several actions (change role, create invite, etc.)

### Test Steps
1. [ ] Go to Settings > Activity Log tab
2. [ ] Review the entries

### Expected Results
- [ ] All actions are logged:
  - Member joined
  - Role changed
  - Invite created
  - Settings changed
- [ ] Each entry shows who did it and when

---

## Test 12: Admin Override (Supabase Console)

### Setup
- [ ] Need Supabase service_role key
- [ ] Have an organisation with no owner (simulate by direct DB edit)

### Test Steps (in Supabase SQL Editor)

```sql
-- 1. First, check org status
SELECT * FROM admin_get_org_status('YOUR_ORG_ID');

-- 2. Simulate missing owner (for testing only!)
UPDATE organisation_memberships
SET role = 'admin'
WHERE organisation_id = 'YOUR_ORG_ID' AND role = 'owner';

-- 3. Verify no owner
SELECT * FROM admin_get_org_status('YOUR_ORG_ID');
-- has_owner should be false

-- 4. Run auto-promote (requires service role - use Supabase dashboard)
SELECT * FROM admin_auto_promote_owner(
  'YOUR_ORG_ID',
  'Testing admin override - simulated missing owner',
  'TEST-001'
);

-- 5. Check result
SELECT * FROM admin_get_org_status('YOUR_ORG_ID');
-- has_owner should be true now

-- 6. Check audit log
SELECT * FROM audit_logs
WHERE organisation_id = 'YOUR_ORG_ID'
AND entity_type = 'admin_override'
ORDER BY created_at DESC
LIMIT 5;
```

### Expected Results
- [ ] `admin_get_org_status` returns org info
- [ ] `admin_auto_promote_owner` promotes longest-serving admin
- [ ] Audit log records the override with reason

---

## Test 13: Suspend & Reactivate Member

### Setup
- [ ] Have at least 2 members in org
- [ ] Log in as owner/admin

### Test Steps
1. [ ] Go to Settings > Members
2. [ ] Find a member (not owner)
3. [ ] Click "Suspend"
4. [ ] Enter reason: "Testing suspension"
5. [ ] Confirm

### Expected Results
- [ ] Member moves to "Suspended" section
- [ ] Shows suspension reason
- [ ] Suspended member cannot access dashboard
- [ ] "Reactivate" button appears
- [ ] Reactivating restores access

---

## Test 14: Data Export

### Setup
- [ ] Log in as owner/admin
- [ ] Have some data in the organisation

### Test Steps
1. [ ] Go to Settings > Security tab
2. [ ] Click "Export Data"
3. [ ] Check downloaded file

### Expected Results
- [ ] JSON file downloads
- [ ] Contains organisation data
- [ ] File is properly formatted

---

## Quick Verification Queries

Run these in Supabase SQL Editor to verify setup:

```sql
-- Check all roles exist
SELECT unnest(enum_range(NULL::org_role));
-- Should show: owner, admin, approver, editor, member, viewer

-- Check all status types exist
SELECT unnest(enum_range(NULL::membership_status));
-- Should show: pending, active, suspended, rejected

-- Check functions exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
AND routine_name LIKE '%owner%' OR routine_name LIKE '%admin_%';

-- Check audit_logs table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'audit_logs';
```

---

## Troubleshooting

### Error: "unsafe use of new value of enum type"
**Solution:** Run `004a_enum_updates.sql` first, wait 5 seconds, then run `004b`.

### Error: "function does not exist"
**Solution:** Run migrations in order. Check the function exists with:
```sql
SELECT proname FROM pg_proc WHERE proname = 'function_name_here';
```

### Members not showing in admin panel
**Solution:** Check RLS policies are enabled and user has correct role.

### Invite code not working
**Solution:** Check code hasn't expired or reached max uses:
```sql
SELECT * FROM organisation_invite_codes WHERE code = 'YOUR_CODE';
```

---

## Test Complete Checklist

- [ ] Test 1: Organisation Creation
- [ ] Test 2: Invite Code Join
- [ ] Test 3: Domain Auto-Join
- [ ] Test 4: Role Management
- [ ] Test 5: Ownership Transfer
- [ ] Test 6: Leave Organisation
- [ ] Test 7: Owner Cannot Leave
- [ ] Test 8: Invite Limits
- [ ] Test 9: Approval Workflow
- [ ] Test 10: Session Timeout
- [ ] Test 11: Audit Logging
- [ ] Test 12: Admin Override
- [ ] Test 13: Suspend/Reactivate
- [ ] Test 14: Data Export

**All tests passed?** Your security implementation is working correctly!
