# Access Compass - Pre-Launch Checklist

> **Last Updated:** January 2026
> **Status:** Pre-MVP completion
> **Purpose:** Comprehensive checklist for production launch

---

## Executive Summary

Access Compass is a React/TypeScript accessibility self-assessment tool for Australian visitor economy businesses. The UI/UX is 95% complete with 26 modules and 650+ questions. This document tracks remaining work for MVP launch.

---

## Part 1: Current Implementation Status

### Fully Implemented

| Feature | Status | Notes |
|---------|--------|-------|
| Landing Page | Complete | Hero, benefits, how it works, who it's for |
| Business Snapshot | Complete | Collects org info, business type, venue/online |
| Discovery Flow | Complete | Touchpoint selection, module recommendations |
| **26 Module Library** | Complete | 650+ questions with branching logic |
| Question Flow | Complete | Yes/No/Unsure, multi-select, evidence uploads |
| Dashboard | Complete | Progress tracking, module tiles, assignment, run history |
| DIAP Workspace | Complete | Create/edit actions, status, priority, import/export |
| Resource Centre | Complete | Browsable guides, search, category filtering |
| Session Management | Complete | localStorage persistence |
| Auth System | Complete | Supabase integration, roles, org membership |
| PDF Export | Complete | Basic report generation with jsPDF |
| Design System | Complete | Purple-coral gradient, WCAG AAA compliant |
| Mobile Responsive | Complete | Works on all device sizes |

### Module Inventory (26 Total)

| Journey Phase | Modules | Count |
|---------------|---------|-------|
| Before They Arrive | B1, B4.1, B4.2, B4.3, B5, B6 | 6 |
| Getting In and Moving Around | A1, A2, A3a, A3b | 4 |
| During the Visit | A4, A5, A6, A6a, B2, B3 | 6 |
| Service and Support | C1, C2, A7, C3, C4 | 5 |
| Organisational Commitment | P1, P2, P3, P4, P5 | 5 |

---

## Part 2: Critical MVP Gaps

### P0 - Must Fix Before Launch

#### 1. Recommendation Engine (Not Implemented)
**Current State:** `Constraints.tsx` generates 2 hardcoded mock actions
**Location:** `src/pages/Constraints.tsx` lines 44-114, function `generateMockActions()`

**Required:**
- [ ] Analyze all module responses
- [ ] Generate prioritized actions: "Act Now" (3-5), "Plan Next" (3-5), "Consider Later" (2-3)
- [ ] Consider user constraints (budget, capacity, timing)
- [ ] Include effort level and cost band for each action
- [ ] Link actions to Resource Centre guides

**Spec Prompt Template:**
```
Generate a prioritised action plan with:
1. "Act Now" actions (3-5 items): High impact, low-to-medium effort, within budget
2. "Plan Next" actions (3-5 items): Medium-term priorities for next 3-6 months
3. "Consider Later" actions (2-3 items): Higher investment or longer-term

For each action, provide:
- Plain-English action description (1-2 sentences)
- Why it matters (user impact focus, 1-2 sentences)
- Effort level (Low/Medium/High)
- Cost band ($0-500, $500-2k, $2k-10k, $10k+)
- Simple how-to steps (3-5 bullet points)
```

---

#### 2. Backend API for Claude Calls (Security Issue)
**Current State:** `VITE_ANTHROPIC_API_KEY` in `.env` but exposed client-side
**Required:**
- [ ] Create `/api/generate-plan` server-side endpoint
- [ ] Move Claude API call to backend only
- [ ] Implement rate limiting (5 requests/hour/IP recommended)
- [ ] Add input validation with Zod schema
- [ ] Add cost tracking for API usage

**Security Pattern:**
```typescript
// ❌ Current (insecure)
fetch('https://api.anthropic.com/v1/messages', {
  headers: { 'x-api-key': process.env.VITE_ANTHROPIC_API_KEY }
});

// ✅ Required (secure)
// /api/generate-plan/route.ts (server-side only)
export async function POST(request: Request) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY } // Not VITE_
  });
}
```

---

### P1 - High Priority

#### 3. Supabase Region Migration
**Current State:** Tokyo (ap-northeast-1) - high latency for Australian users
**Required:**
- [ ] Create new Supabase project in Sydney (ap-southeast-2)
- [ ] Run all migrations in order (001 through 006)
- [ ] Update `.env` with new credentials
- [ ] Test organisation creation flow
- [ ] Migrate any existing data

**Current Timeouts (needs reduction after migration):**
- Auth timeout: 30s → reduce to 10s
- RPC calls: 30s → reduce to 15s

---

#### 4. Clarify Later Population
**Current State:** Page exists but not populated from "Not sure" responses
**Location:** `src/pages/ClarifyLater.tsx`
**Required:**
- [ ] Wire up to track all "Not sure" answers from questions
- [ ] Display with "how to check" guidance
- [ ] Allow updating answer after clarification

---

### P2 - Important for Full MVP

#### 5. Enhanced PDF Export
**Current State:** Basic report works
**Required:**
- [ ] Full DIAP export with all actions, owners, timeframes
- [ ] Evidence thumbnails in report
- [ ] Professional review indicators
- [ ] Progress comparison for re-audits

---

#### 6. Stripe Payment Integration
**Current State:** Stubbed with "MOCK CHECKOUT" comments
**Location:** `src/lib/stripe.ts`, `src/pages/Decision.tsx`
**Required:**
- [ ] Wire up actual Stripe checkout
- [ ] Handle webhooks for payment confirmation
- [ ] Verify entitlements before module access
- [ ] Implement subscription management

---

## Part 3: Pulse Check vs Deep Dive Differentiation

### Core Positioning
- **Pulse Check**: "Know where you stand" - Quick self-assessment with summary insights
- **Deep Dive**: "Get to where you need to be" - Comprehensive audit with implementation tools

### Feature Gating Required

| Feature | Pulse Check | Deep Dive |
|---------|-------------|-----------|
| **Report Format** | 1-page summary PDF | Comprehensive multi-page PDF |
| **Report Content** | Top 5 strengths + Top 5 actions | ALL actions with "why it matters" |
| **Evidence** | Not included | Photo thumbnails embedded |
| **Export Formats** | PDF only | PDF + CSV + Excel |
| **DIAP Workspace** | Read-only action list | Full workspace with editing |
| **Team Features** | Single user only | Multi-user collaboration |
| **Media Analysis** | Not available | AI photo/document review |
| **URL Analysis** | Not available | Website accessibility scoring |
| **Help Content** | Basic tips only | Full tips + examples + videos |
| **Resource Library** | Limited access | Full access |
| **Calibration** | None | Budget/timeline/approach questions |
| **Recommendations** | Generic | Personalized to responses |

### Implementation Checklist

#### Phase 1: Enable Core Gating
- [ ] Set `bypassPaywall = false` in `RouteGuard.tsx`
- [ ] Gate `/diap` route with `DeepDiveAccessRoute`
- [ ] Create read-only `PulseActionsList.tsx` for Pulse users
- [ ] Implement `max_modules` check (Core: 5, Expanded: 10, Full: all)

#### Phase 2: Report Differentiation
- [ ] Create `PulseReportGenerator` (1-page summary)
- [ ] Enhance `DeepDiveReportGenerator` with "why this matters"
- [ ] Gate CSV export to Deep Dive only
- [ ] Gate Excel export to Deep Dive Full only

#### Phase 3: Analysis Tools Gating
- [ ] Hide evidence upload section for Pulse users
- [ ] Disable `MediaAnalysisInput` for Pulse
- [ ] Disable `useUrlAnalysis` for Pulse
- [ ] Show "Available in Deep Dive" placeholders

#### Phase 4: Resources & Help Gating
- [ ] Add `premium: true` flag to advanced helpContent
- [ ] Update `HelpPanel.tsx` to check user tier
- [ ] Gate Resource Centre sections by tier
- [ ] Add support tier indicators

#### Phase 5: Personalization (Deep Dive)
- [ ] Add calibration questions (budget/approach/timeline)
- [ ] Add "why" explanations to recommendations
- [ ] Calibrate timeframes based on inputs
- [ ] Weight recommendations by business context

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/guards/RouteGuard.tsx` | Enable paywall, gate routes |
| `src/pages/DIAPWorkspace.tsx` | Add route guard |
| `src/hooks/useReportGeneration.ts` | Add tier-based generation |
| `src/utils/pdfGenerator.ts` | Create Pulse vs Deep Dive templates |
| `src/components/questions/QuestionCard.tsx` | Gate evidence upload |
| `src/components/questions/HelpPanel.tsx` | Gate premium content |
| `src/pages/ResourceCentre.tsx` | Gate resources by tier |
| `src/lib/recommendationEngine.ts` | Add personalization |

### New Files to Create

| File | Purpose |
|------|---------|
| `src/pages/PulseActionsList.tsx` | Read-only actions for Pulse |
| `src/components/CalibrationQuestions.tsx` | Pre-audit calibration |
| `src/lib/resourceAccess.ts` | Resource access control |
| `src/utils/pulseReportGenerator.ts` | Pulse-specific report |

---

## Part 4: Security Checklist

### Pre-Launch Security Items

- [ ] **API Keys**: Move `ANTHROPIC_API_KEY` to server-side only
- [ ] **Rate Limiting**: Implement for Claude API calls
- [ ] **Email Verification**: Re-enable in Supabase dashboard
- [ ] **Route Protection**: Set `bypassPaywall = false`
- [ ] **RLS Policies**: Verify all Row Level Security policies
- [ ] **Debug Logging**: Remove console.log statements from production

### Files to Revert Before Launch

| File | Change | Revert To |
|------|--------|-----------|
| `src/components/guards/RouteGuard.tsx` | `bypassPaywall = true` | `false` |
| `src/contexts/AuthContext.tsx` | 30s timeouts, debug logs | 10s timeouts, remove logs |
| `src/utils/supabase.ts` | Warm-up query | Remove after Sydney switch |
| Supabase Dashboard | Email confirmation disabled | Re-enable |

### Security Testing Checklist

- [ ] Test 1: Organisation creation & owner role
- [ ] Test 2: Invite code & member join
- [ ] Test 3: Domain auto-join
- [ ] Test 4: Role management
- [ ] Test 5: Ownership transfer
- [ ] Test 6: Leave organisation (non-owner)
- [ ] Test 7: Owner cannot leave without transfer
- [ ] Test 8: Invite code expiration & limits
- [ ] Test 9: Member approval workflow
- [ ] Test 10: Session timeout
- [ ] Test 11: Audit logging
- [ ] Test 15: Pre-registered email invites

---

## Part 5: Known Issues

### 1. Organisation Creation Flow - BLOCKED
**Status:** Not completing from browser (times out)
**Root Cause:** Supabase in Tokyo, high latency for AU users
**Workaround:** 30s timeouts + warm-up query
**Fix:** Migrate to Sydney region

### 2. Supabase Session Check Timeout
**Status:** Working with extended timeout
**Symptoms:** Initial load shows "Loading..." for extended period
**Fix Applied:** Extended timeout from 5s to 30s

### 3. Mock Data Locations

| File | Line | What | Replace With |
|------|------|------|--------------|
| `Constraints.tsx` | 44-114 | `generateMockActions()` | Real Claude API response |
| `Dashboard.tsx` | 162-190 | Dev session creation | Remove for production |
| `lib/stripe.ts` | - | MOCK CHECKOUT | Real Stripe integration |
| `utils/waveApi.ts` | - | Mock data | Real WAVE API or remove |

---

## Part 6: Environment Configuration

### Required Environment Variables

```bash
# ============================================
# REQUIRED FOR MVP
# ============================================

# Anthropic API - Server-side only (NOT VITE_)
ANTHROPIC_API_KEY=sk-ant-api03-xxx

# App URL
VITE_APP_URL=https://accesscompass.com.au

# ============================================
# REQUIRED FOR FULL LAUNCH
# ============================================

# Supabase (Sydney region)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# ============================================
# OPTIONAL
# ============================================

# Analytics
VITE_PLAUSIBLE_DOMAIN=accesscompass.com.au

# Feature Flags
VITE_ENABLE_AUTH=true
VITE_ENABLE_FILE_UPLOAD=true
```

### Environment Differences

| Setting | Development | Production |
|---------|-------------|------------|
| Supabase Region | Tokyo | Sydney |
| Auth Timeout | 30 seconds | 10 seconds |
| Email Verification | Disabled | Enabled |
| Route Protection | Bypassed | Enabled |
| Debug Logs | Enabled | Disabled |

---

## Part 7: Database Migrations

### Migration Order (Critical)

Run in Supabase SQL Editor in this exact order:

| Step | File | Wait Time |
|------|------|-----------|
| 1 | `database-schema.sql` | Wait for success |
| 2 | `003_org_creation.sql` | Wait for success |
| 3 | `004a_enum_updates.sql` | **Wait 5 seconds** |
| 4 | `004b_security_enhancements.sql` | Wait for success |
| 5 | `005_ownership_transfer.sql` | Wait for success |
| 6 | `006_pre_registered_emails.sql` | Wait for success |

**Note:** Step 3 must fully commit before Step 4, or enum errors occur.

---

## Part 8: Launch Day Checklist

### T-7 Days
- [ ] Create Sydney Supabase project
- [ ] Run all migrations
- [ ] Test org creation flow in new region
- [ ] Migrate any existing data

### T-3 Days
- [ ] Implement recommendation engine (or confirm mock is acceptable for soft launch)
- [ ] Create backend API for Claude calls
- [ ] Enable paywall (`bypassPaywall = false`)
- [ ] Wire up Stripe (or confirm free-only launch)

### T-1 Day
- [ ] Re-enable email verification
- [ ] Reduce auth timeouts to production values
- [ ] Remove debug logging
- [ ] Run full security test checklist
- [ ] Test complete user journey end-to-end

### Launch Day
- [ ] Deploy to production
- [ ] Verify all routes working
- [ ] Test sign-up flow
- [ ] Test org creation
- [ ] Test module completion
- [ ] Test report generation
- [ ] Monitor error logs

### Post-Launch
- [ ] Monitor for API rate limit issues
- [ ] Track user completion rates
- [ ] Gather feedback on recommendation quality
- [ ] Plan Phase 2 features

---

## Part 9: Phase 2 Roadmap (Post-MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| Cloud Storage | Move evidence from localStorage to S3/R2 | High |
| Vision Analysis | AI photo accessibility analysis | Medium |
| WAVE Integration | Website accessibility testing | Medium |
| Multi-device Sync | Supabase real-time sync | Medium |
| Email Notifications | Action reminders, report delivery | Medium |
| Benchmarking | Industry comparisons | Low |
| Audit Trail | Full change history | Low |

---

## Reference Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Full Spec | `AccessCompass_SpecSheet_REVIEWED.md` | Complete product spec |
| Questions | `AccessCompass_Questions_Reference.csv` | 650+ question inventory |
| Database | `database-schema.sql` | Supabase table definitions |
| Security | `docs/SECURITY.md` | Security implementation |
| Testing | `docs/TESTING_CHECKLIST.md` | Full test procedures |
| Tier Strategy | `docs/TIER-DIFFERENTIATION-STRATEGY.md` | Pulse vs Deep Dive |
| Modules | `docs/MODULES.md` | Module descriptions |

---

*Document generated January 2026*
