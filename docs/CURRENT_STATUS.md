# Access Compass - Current Development Status

*Last Updated: 14 January 2026*

## Summary

The application is in active development with the authentication and organisation creation flow partially working but experiencing connectivity issues due to Supabase region latency.

---

## Known Issues

### 1. Organisation Creation Flow - BLOCKED

**Status:** Not completing successfully from browser

**Symptoms:**
- User can sign up and authenticate successfully
- After authentication, user reaches "Join or create an organisation" page
- Clicking "Create organisation" times out after 30 seconds
- The same RPC function works instantly when run directly in Supabase SQL Editor

**Root Cause:**
- Supabase project is in **Tokyo (ap-northeast-1)** region
- High latency for Australian users (~200-500ms per request)
- RPC calls timeout before completing

**Workaround Applied:**
- Increased all timeouts to 30 seconds
- Added warm-up query on app load to reduce initial latency
- See `src/utils/supabase.ts` for warm-up implementation

**Permanent Fix Required:**
- Create new Supabase project in **Sydney (ap-southeast-2)**
- Migrate all data and run all migrations
- Update `.env` with new credentials

### 2. Supabase Session Check Timeout

**Status:** Working with extended timeout

**Symptoms:**
- Initial page load shows "Loading..." for extended period
- Console shows: `[AuthContext] Session check timed out`

**Fix Applied:**
- Extended timeout from 5s to 30s in `AuthContext.tsx`

---

## Database Status

### Migrations Applied
All migrations have been run in Supabase:
- [x] 001_create_tables.sql
- [x] 002_access_system.sql
- [x] 003_org_creation.sql
- [x] 004a_enum_updates.sql
- [x] 004b_security_enhancements.sql
- [x] 005_ownership_transfer.sql

### Additional SQL Applied
- [x] `public.users` table (mirrors auth.users for foreign key compatibility)
- [x] Trigger to sync new auth.users to public.users

---

## Files Modified for Development/Testing

| File | Change | Revert Before Launch |
|------|--------|---------------------|
| `src/components/guards/RouteGuard.tsx` | `bypassPaywall = true` | Set to `false` |
| `src/contexts/AuthContext.tsx` | 30s timeouts, debug logs | Reduce timeouts, remove logs |
| `src/utils/supabase.ts` | Warm-up query added | Can remove after Sydney switch |
| Supabase Dashboard | Email confirmation disabled | Re-enable |

---

## Next Steps (Priority Order)

1. **Create Sydney Supabase Project** - Critical for production performance
   - Create new project in ap-southeast-2
   - Run all migrations in order
   - Update environment variables
   - Test organisation creation flow

2. **Complete Organisation Flow Testing**
   - Test sign up → org creation → dashboard flow
   - Test invite code joining
   - Test domain auto-join

3. **Security Review**
   - Re-enable email confirmation
   - Re-enable route protection (bypassPaywall = false)
   - Review RLS policies
   - Remove debug logging

4. **Pre-Launch Checklist**
   - See `docs/DEPLOYMENT_CHECKLIST.md` for full list

5. **User Account Management**
   - Add "Delete Account" option for users
   - Should delete from: auth.users, public.users, organisation_memberships
   - Handle org ownership transfer or deletion when owner deletes account
   - Add confirmation dialog with warning about data loss

---

## Environment Details

| Setting | Current Value | Production Value |
|---------|--------------|------------------|
| Supabase Region | Tokyo (ap-northeast-1) | Sydney (ap-southeast-2) |
| Auth Timeout | 30 seconds | 10 seconds |
| Email Verification | Disabled | Enabled |
| Route Protection | Bypassed | Enabled |

---

## Console Debug Logs Reference

When debugging, look for these log prefixes:
- `[Supabase]` - Connection and warm-up status
- `[AuthContext]` - Authentication flow
- `[Disclaimer]` - Sign up and org creation flow
- `[createOrganisation]` - Organisation RPC calls

---

## Quick Commands

### Delete test organisation data (SQL Editor):
```sql
DELETE FROM organisation_memberships WHERE user_id = 'YOUR_USER_ID';
DELETE FROM organisations WHERE name = 'Test Org';
```

### Check if user exists in public.users:
```sql
SELECT * FROM public.users WHERE email = 'user@example.com';
```

### Test RPC directly:
```sql
SELECT * FROM create_organisation_with_admin(
  'Org Name',
  'small',
  'contact@example.com',
  'Contact Name',
  'USER_UUID_HERE'
);
```
