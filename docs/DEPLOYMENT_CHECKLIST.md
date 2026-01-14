# Access Compass - Deployment Checklist

## Before Going Live

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
- [ ] Remove any test/debug environment variables

### Database
- [ ] Run all migrations in order (003 → 004a → 004b → 005)
- [ ] Verify enum types exist: `SELECT unnest(enum_range(NULL::org_role));`
- [ ] Test admin override functions work with service_role

### Testing
- [ ] Complete security testing checklist (see TESTING_CHECKLIST.md)
- [ ] Test on multiple browsers
- [ ] Test mobile responsiveness

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
| SMTP configured | No | Set up for production emails |

---

*Last updated: January 2026*
