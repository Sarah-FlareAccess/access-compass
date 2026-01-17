# Tier Differentiation Strategy: Pulse Check vs Deep Dive

## Executive Summary

Pulse Check and Deep Dive need clear value differentiation beyond just "more questions." This document outlines how to separate the two tiers across five dimensions: **Report Deliverables**, **DIAP Workspace**, **Analysis Tools**, **Resources & Support**, and **Guidance Personalization**.

**Core positioning:**
- **Pulse Check**: "Know where you stand" - Quick self-assessment with summary insights
- **Deep Dive**: "Get to where you need to be" - Comprehensive audit with implementation tools

---

## Current Pricing Structure

| Business Size | Pulse Check | Deep Dive |
|---------------|-------------|-----------|
| Small (1-20 staff) | $600-$1,200 | $1,500-$2,500 |
| Medium (21-100 staff) | $1,200-$2,400 | $3,000-$5,000 |
| Large (100+ staff) | $2,400-$4,800 | Custom pricing |
| Enterprise | Contact sales | Contact sales |

Each tier has three bundles: **Core** (5 modules), **Expanded** (10 modules), **Full** (all modules)

---

## 1. Report Deliverables

### Pulse Check Report
- **Format**: 1-page summary PDF
- **Content**:
  - Overall accessibility score
  - Top 5 strengths
  - Top 5 priority actions (high-level)
  - Areas to explore count
  - Next steps checklist
- **Evidence**: Not included
- **Export**: PDF only

### Deep Dive Report
- **Format**: Comprehensive multi-section PDF (10-20+ pages)
- **Content**:
  - Executive summary with scores
  - Module-by-module breakdown
  - ALL strengths with context
  - ALL priority actions with:
    - Detailed reasoning
    - Impact statements
    - Timeframes
    - Resource links
  - Professional review indicators
  - Evidence completeness tracking
  - Progress comparison (if re-audit)
- **Evidence**: Photo thumbnails embedded, document references
- **Export**: PDF + CSV + Excel (Full bundle)

### Implementation
```
Files to modify:
- src/hooks/useReportGeneration.ts - Add tier-based report generation
- src/utils/pdfGenerator.ts - Create PulseReportGenerator vs DeepDiveReportGenerator
- src/pages/Report.tsx - Gate report sections based on access level
```

---

## 2. DIAP Workspace

### Pulse Check
- **Access**: Read-only suggested actions list
- **Features**:
  - View recommended actions from report
  - No editing/planning capabilities
  - "Upgrade to Deep Dive" prompt to unlock workspace
- **Team**: Single user only

### Deep Dive
- **Access**: Full DIAP workspace
- **Features**:
  - Create/edit/delete action items
  - 5 status levels (Not Started → Complete)
  - Priority assignment (High/Medium/Low)
  - Due dates and team assignment
  - Document upload and management
  - Evidence linking to module responses
  - CSV/Excel import & export
  - Progress tracking dashboard
- **Team**: Multi-user collaboration (Full bundle)

### Implementation
```
Files to modify:
- src/pages/DIAPWorkspace.tsx - Already built, needs gating
- src/components/guards/RouteGuard.tsx - Wrap DIAP with DeepDiveAccessRoute
- Create src/pages/PulseActionsList.tsx - Read-only version for Pulse users
```

---

## 3. Analysis Tools & AI Features

### Pulse Check
- **Assessment**: Self-assessment questions only
- **Analysis**: None
- **Evidence**: Cannot upload or attach evidence
- **AI Features**: None

### Deep Dive
- **Assessment**: Same questions + evidence collection prompts
- **Analysis**:
  - Media Analysis: Upload photos/documents for AI accessibility review
  - URL Analysis: Website accessibility scoring (WAVE integration)
  - Social Media Checker: Standalone tool for post review
- **Evidence**: Full evidence management
  - Photo upload with previews
  - Document attachment
  - Link storage
  - Evidence display in reports
- **AI Features**:
  - Professional review flagging
  - Automated scoring
  - Improvement recommendations

### Implementation
```
Files to modify:
- src/components/questions/QuestionCard.tsx - Hide evidence upload for Pulse
- src/components/questions/MediaAnalysisInput.tsx - Gate to Deep Dive
- src/hooks/useUrlAnalysis.ts - Gate to Deep Dive
- Create src/pages/SocialMediaChecker.tsx - Standalone tool (moved from audit)
```

---

## 4. Resources & Support

### Pulse Check
- **In-question help**: Basic tips only (no examples, no videos)
- **Resource library**: Limited access
  - Getting started guides
  - Basic checklists
- **Support**: Email support (standard response time)
- **Consultation**: Not included

### Deep Dive
- **In-question help**: Full help content
  - Detailed tips
  - Good/poor examples with images
  - Video tutorials (where available)
  - External resource links
- **Resource library**: Full access
  - All guides and checklists
  - Video library
  - Template downloads
  - Expert guides by module
  - Industry-specific resources
- **Support**:
  - Core/Expanded: Email support
  - Full: Priority support (faster response, dedicated contact)
- **Consultation**: Free 30-min consultation included

### Implementation
```
Files to modify:
- src/data/accessModules.ts - Add 'premiumContent' flag to helpContent
- src/components/questions/HelpPanel.tsx - Filter content based on tier
- src/pages/ResourceCentre.tsx - Gate resources by tier
- Create src/lib/resourceAccess.ts - Resource access control logic
```

---

## 5. Guidance Personalization

### Pulse Check
- **Recommendations**: Generic, based on module selection
- **Explanations**: Action items only (no "why")
- **Timeframes**: Standard timeframes
- **Calibration**: None
- **Benchmarking**: None

### Deep Dive
- **Recommendations**: Personalized to discovery responses
  - Weighted by business context
  - Calibrated to stated budget/timeline/approach
- **Explanations**:
  - "Why this matters" for each action
  - Impact statements
  - Connection to specific responses
- **Timeframes**: Adjusted based on:
  - Business size
  - Budget indicator
  - Urgency level
- **Calibration**: Pre-audit calibration questions
  - Budget range
  - Implementation approach (DIY/hybrid/managed)
  - Timeline urgency
- **Benchmarking**:
  - Industry comparisons (where data available)
  - Progress tracking over time

### Implementation
```
Files to modify:
- src/lib/recommendationEngine.ts - Add tier-based recommendation depth
- src/hooks/useReportGeneration.ts - Add "why" explanations for Deep Dive
- Create src/components/CalibrationQuestions.tsx - Pre-audit calibration
- src/pages/Decision.tsx - Add calibration step for Deep Dive
```

---

## Implementation Roadmap

### Phase 1: Enable Core Gating (Week 1-2)
**Goal**: Enforce existing tier structure

1. **Enable paywall**
   - Set `bypassPaywall = false` in `RouteGuard.tsx`
   - Test purchase flow end-to-end

2. **Gate DIAP workspace**
   - Wrap `/diap` route with `DeepDiveAccessRoute`
   - Create read-only action list for Pulse users
   - Add upgrade prompt on Pulse action list

3. **Enforce module limits**
   - Implement `max_modules` check in module selection
   - Core: 5 modules, Expanded: 10, Full: all

**Deliverables**:
- DIAP gated to Deep Dive
- Module limits enforced
- Paywall active

---

### Phase 2: Report Differentiation (Week 3-4)
**Goal**: Create distinct report experiences

1. **Create Pulse report template**
   - 1-page summary format
   - Top 5 strengths/actions only
   - No evidence, no detailed reasoning
   - Clear "Get full report with Deep Dive" CTA

2. **Enhance Deep Dive report**
   - Add "Why this matters" to each action
   - Include evidence thumbnails
   - Add professional review section
   - Add progress comparison (for re-audits)

3. **Gate exports**
   - PDF: All tiers
   - CSV: Deep Dive only
   - Excel: Deep Dive Full only

**Deliverables**:
- Two distinct report formats
- Export gating implemented
- Report preview before generation

---

### Phase 3: Analysis Tools (Week 5-6)
**Goal**: Make AI analysis a Deep Dive exclusive

1. **Gate evidence upload**
   - Hide evidence upload section for Pulse
   - Show "Available in Deep Dive" placeholder

2. **Gate media analysis**
   - Disable MediaAnalysisInput for Pulse
   - Move social media checker to standalone tool

3. **Gate URL analysis**
   - Disable website analysis for Pulse
   - Show sample analysis with upgrade prompt

4. **Create standalone tools**
   - Social Media Accessibility Checker (accessible to Deep Dive)
   - Website Quick Check (limited free version, full in Deep Dive)

**Deliverables**:
- Analysis tools gated
- Standalone checker tools created
- Clear upgrade paths shown

---

### Phase 4: Resources & Help (Week 7-8)
**Goal**: Differentiate help content depth

1. **Tag premium content**
   - Add `premium: true` flag to advanced helpContent
   - Mark video content as premium
   - Mark detailed examples as premium

2. **Update HelpPanel**
   - Check user tier before displaying premium content
   - Show "See more in Deep Dive" for gated content

3. **Gate Resource Centre**
   - Create resource access tiers
   - Basic resources: All users
   - Advanced resources: Deep Dive only
   - Expert guides: Deep Dive Full only

4. **Add support tier indicators**
   - Show "Priority Support" badge for Full bundle
   - Different support contact options by tier

**Deliverables**:
- Tiered help content
- Gated resource library
- Support tier visibility

---

### Phase 5: Personalization (Week 9-10)
**Goal**: Make Deep Dive feel personalized

1. **Add calibration questions**
   - Budget range (for timeframe adjustment)
   - Implementation approach preference
   - Timeline urgency

2. **Enhance recommendation engine**
   - Add "why" explanations to Deep Dive recommendations
   - Calibrate timeframes based on budget/urgency
   - Weight recommendations by business context

3. **Add benchmarking (future)**
   - Track aggregate data for comparisons
   - Show industry averages where available

**Deliverables**:
- Calibration flow for Deep Dive
- Personalized recommendations
- Framework for benchmarking

---

## Quick Wins (Can Do Now)

These require minimal development effort:

1. **Gate DIAP route** - Just wrap with existing guard
2. **Hide evidence upload in Pulse** - Conditional render
3. **Create summary-only PDF template** - Simpler version of existing
4. **Add "Deep Dive includes..." messaging** - Marketing copy in Pulse experience
5. **Enable paywall** - Flip the flag (after testing)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Pulse → Deep Dive upgrade rate | 15-25% |
| Deep Dive completion rate | 70%+ |
| DIAP engagement (Deep Dive) | 50%+ use workspace |
| Report download rate | 90%+ |
| Resource library usage (Deep Dive) | 40%+ access resources |

---

## User Journey Summary

### Pulse Check Journey
1. Discovery questionnaire
2. Module selection (limited)
3. Answer Pulse Check questions
4. View summary report (1-page)
5. See suggested actions (read-only)
6. Download PDF
7. **Upgrade prompt** to Deep Dive for full features

### Deep Dive Journey
1. Discovery questionnaire
2. Calibration questions (budget/approach/timeline)
3. Module selection (full access)
4. Answer all questions with evidence upload
5. Optional: Media/URL analysis
6. View comprehensive report
7. Access DIAP workspace
8. Assign actions to team
9. Track progress
10. Re-audit for comparison

---

## Appendix: File Reference

### Core Files to Modify
| File | Changes |
|------|---------|
| `src/components/guards/RouteGuard.tsx` | Enable paywall, gate routes |
| `src/pages/DIAPWorkspace.tsx` | Already built, add route guard |
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
| `src/pages/SocialMediaChecker.tsx` | Standalone analysis tool |
| `src/components/CalibrationQuestions.tsx` | Pre-audit calibration |
| `src/lib/resourceAccess.ts` | Resource access control |
| `src/utils/pulseReportGenerator.ts` | Pulse-specific report |
