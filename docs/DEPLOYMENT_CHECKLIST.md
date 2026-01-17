# Access Compass - Deployment Checklist

## Before Going Live

### Supabase Project Setup
- [ ] **IMPORTANT: Change Supabase region to Sydney**
  - Current region: Tokyo (ap-northeast-1) - causes high latency for Australian users
  - Create a NEW project in Sydney (ap-southeast-2)
  - Run all migrations in the new project
  - Update `.env` with new VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
  - This will improve response times by 3-5x

### Supabase Authentication
- [ ] **IMPORTANT: Enable email confirmation**
  - Go to Supabase Dashboard → Authentication → Providers → Email
  - Turn ON "Confirm email"
  - This was disabled for testing - MUST be re-enabled for production

- [ ] Configure SMTP settings (for reliable email delivery)
  - Project Settings → Auth → SMTP Settings
  - Use a service like SendGrid, Mailgun, or AWS SES

- [ ] Review email templates
  - Authentication → Email Templates
  - Customize confirmation, password reset, and magic link emails

### Security Settings
- [ ] Review RLS policies are enabled on all tables
- [ ] Ensure service_role key is NOT exposed in frontend code
- [ ] Set appropriate session timeout for production (Security tab)

### Environment Variables
- [ ] Verify VITE_SUPABASE_URL is set correctly
- [ ] Verify VITE_SUPABASE_ANON_KEY is set correctly
- [ ] Set VITE_ANTHROPIC_API_KEY (if using AI features)
- [ ] Set VITE_WAVE_API_KEY (if using accessibility scanning)
- [ ] Remove any test/debug environment variables
- [ ] Set VITE_ENVIRONMENT=production

### Code Cleanup
- [ ] Remove debug console.log statements from AuthContext.tsx
- [ ] Review and remove any temporary code comments
- [ ] Verify no hardcoded test data in components

### Database
- [ ] Run all migrations in order (002 → 003 → 004a → 004b → 005)
  - 002: Core access system (organisations, memberships, entitlements)
  - 003: Organisation creation functions
  - 004a: Role enum updates (owner, admin, approver, editor, member, viewer)
  - 004b: Security enhancements (audit logs, invite codes)
  - 005: Ownership transfer functions
- [ ] Verify enum types exist: `SELECT unnest(enum_range(NULL::org_role));`
- [ ] Test admin override functions work with service_role

### Session & Security Features
- [ ] Review session timeout duration in useSessionTimeout hook
- [ ] Test session timeout warning appears correctly
- [ ] Verify audit logging is capturing events
- [ ] Test ownership transfer flow works correctly
- [ ] Test invite code generation and joining flow

### Testing
- [ ] Complete security testing checklist (see TESTING_CHECKLIST.md)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test mobile responsiveness
- [ ] Test with screen readers for accessibility
- [ ] Test organisation creation flow end-to-end
- [ ] Test all role permissions (owner, admin, approver, editor, member, viewer)

### Vercel/Hosting
- [ ] Environment variables set in Vercel dashboard
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

---

## Post-Deployment

- [ ] Create first organisation and verify owner role
- [ ] Test invite code flow with real users
- [ ] Monitor Supabase logs for errors
- [ ] Set up error monitoring (Sentry, etc.)

---

## Reminders

| Item | Status | Notes |
|------|--------|-------|
| Email verification | DISABLED (testing) | **Re-enable before launch!** |
| Route protection (paywall) | BYPASSED (testing) | **Re-enable before launch!** |
| Payment integration | DEFERRED | **Implement before launch!** See `Decision.tsx` TODOs |
| Auth timeout | 30 seconds (Tokyo latency) | Reduce to 10s after switching to Sydney |
| Supabase region | Tokyo (high latency) | **Change to Sydney before launch!** |
| Warm-up query | ENABLED (dev) | Can remove after switching to Sydney |
| SMTP configured | No | Set up for production emails |

---

## How to Re-enable Security Features

### 1. Email Verification
- Supabase Dashboard → Authentication → Providers → Email
- Turn ON "Confirm email"

### 2. Route Protection (Paywall)
- File: `src/components/guards/RouteGuard.tsx`
- Line ~109: Change `const bypassPaywall = true;` to `const bypassPaywall = false;`

### 3. Payment Integration (Decision Page)
- File: `src/pages/Decision.tsx`
- Currently bypasses payment and goes directly to dashboard
- **Access redirect is DISABLED** (~line 140) - users always see pathway choice
- See TODO comments at top of file for full implementation details
- Required changes:
  - Re-enable the "REDIRECT IF ALREADY HAS ACCESS" useEffect
  - Integrate payment processing (Stripe) for pay-as-you-go users
  - Add entitlement checking based on user type
  - Show "included" vs "additional cost" modules
  - Handle government users (full access bypass)
  - Handle enterprise subscriptions
  - Implement module bundle upgrade flow

### 4. Auth Timeout
- File: `src/contexts/AuthContext.tsx`
- Lines ~180, ~260, ~393: Currently set to 30 seconds for Tokyo latency
- After switching to Sydney, reduce to 10 seconds

### 5. Remove Debug Logging
- File: `src/contexts/AuthContext.tsx`
- Remove or comment out all `console.log('[AuthContext]...)` statements

### 6. Remove Warm-up Query (Optional after Sydney switch)
- File: `src/utils/supabase.ts`
- Remove or comment out the `warmUpConnection()` function and auto-call
- This is only needed for high-latency connections

---

## Quick Reference: Files Modified for Testing

| File | Change | Action Before Launch |
|------|--------|---------------------|
| `src/components/guards/RouteGuard.tsx` | `bypassPaywall = true` | Set to `false` |
| `src/pages/Decision.tsx` | Payment bypassed, access redirect disabled | Re-enable redirect + implement payment |
| `src/contexts/AuthContext.tsx` | Debug console.logs added | Remove logs |
| `src/contexts/AuthContext.tsx` | 30s auth timeouts | Reduce after Sydney switch |
| `src/utils/supabase.ts` | Warm-up query added | Can remove after Sydney |
| Supabase Dashboard | Email confirm disabled | Re-enable |
| Supabase Dashboard | Region: Tokyo | **Create new Sydney project** |

---

*Last updated: January 2026*
