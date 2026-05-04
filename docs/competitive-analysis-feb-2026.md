# Access Compass: Competitive Analysis (February 2026)

## Market Context

| Stat | Figure |
|------|--------|
| Australians with disability | 4.4 million (1 in 5) |
| Accessible tourism annual spend | $29.2 billion (22% of domestic travel) |
| NDIS provider market | $44.7 billion (2025) |
| Physical venues open to public | ~600,000+ across Australia |
| Cost of a professional DDA access audit | $2,000 - $15,000+ per venue |

The Premises Standards were amended in November 2024 to reference AS 1428.1:2021. NSW councils are on a four-year DIAP cycle. Legislative pressure, market incentive, and no affordable self-service tool to meet the demand.

---

## Competitive Landscape

| Tool | Type | Physical Venue Focus | Educational Guidance | Standards Refs | DIAP Support | Self-Service | Price |
|------|------|---------------------|---------------------|---------------|-------------|-------------|-------|
| Access Compass | Guided self-assessment SaaS | Deep (36 modules) | Extensive | AS 1428.1, Premises Stds | Yes (native) | Yes | SaaS tiers |
| SafetyCulture | Generic audit platform | Basic templates | None | None built-in | No | Yes | $24/user/mo |
| ADN Access and Inclusion Index | Benchmarking tool | Broad (not deep) | Minimal | None | Roadmap only | Partial | Membership (enterprise) |
| DDA Consultants (DDEG, MAA, etc.) | Professional audits | Deep (technical) | Technical reports | Full | Recommendations only | No | $2K-$15K per audit |
| AHRC Health Check | Free self-assessment | Shallow | Minimal | None | No | Yes | Free |
| Accessibility Tick (NZ) | Certification programme | Broad | Some | NZ standards | Embedded | No (consultant-led) | Membership |
| AccessibilityOz / CFA | Digital accessibility | None (websites only) | Training available | WCAG only | No | No | Consulting fees |

### Gap Access Compass Fills

The market is bifurcated: expensive professional consulting ($2K-$15K per audit) on one end, shallow free tools on the other. No purpose-built SaaS platform combines:

1. Guided self-assessment (not a blank checklist)
2. Australian Standards embedded at question level (AS 1428.1:2021, Premises Standards)
3. Educational content (why it matters, how to check, graded solutions)
4. Customer journey framework (touchpoint-based, not building-code-based)
5. DIAP generation from assessment data
6. Affordable self-service accessible to SMEs

---

## What Has Been Built

### Content Scale

| Metric | Count |
|--------|-------|
| Modules | 36 across 6 groups |
| Questions | ~815 (with conditional branching) |
| Help content | 16,560+ lines of rich guidance |
| Graded solutions (Before Arrival alone) | 73, all with 6-12 step arrays |
| Standards references | AS 1428.1, AS 1428.2, Premises Standards, DDA, WCAG 2.2 |
| Mandatory compliance questions | 115+ (with Flare tip) |
| Discovery questions | 25 mapped to touchpoints |
| Industry default profiles | 14 |

### Platform Features

**Discovery and Personalisation:**
- 25 discovery questions map business touchpoints to relevant modules
- Industry-specific default module sets (retail, hospitality, events, etc.)
- Pulse Check (quick) vs. Deep Dive (comprehensive) assessment modes
- Conditional question branching based on venue type and activities

**Assessment:**
- 9 response types (yes/no, single-select, multi-select, text, measurement, media analysis, URL analysis)
- Photo and document evidence upload per question
- AI-powered URL accessibility audits (Wave API)
- AI-powered image accessibility analysis (Vision API)
- Multi-run support (reassess and compare over time)

**Help and Guidance:**
- Inline help content at every question (summary, understanding, tips)
- Rich help library with solutions, measurements, standards references
- Graded solutions (low/medium/high resource paths, each with cost and implementer guidance)
- Business-type examples (hospitality, retail, government, health, etc.)

**Outputs:**
- PDF reports with executive summary, scores, action items, evidence, standards references
- DIAP workspace (create, assign ownership, set priorities, track status, import/export CSV/PDF/Excel)
- Run comparison to track improvement over time

**Enterprise/Team:**
- Multi-user organisations with 6 role levels
- Invite codes, domain whitelisting, approval workflows
- Audit logs, MFA, session timeout, IP restrictions
- Stripe checkout with tiered pricing

---

## Competitive Strengths

### Key Differentiators

1. **Graded solutions**: Not just "fix this" but "here is how at low / medium / high cost with specific steps." Professional audits give problem reports. SafetyCulture gives checklists. Access Compass gives pathways.

2. **Customer journey framework**: Competitors treat accessibility as compliance checkboxes. Access Compass frames it as customer experience across touchpoints (before arrival, getting in, during visit, service, departure). More business-friendly lens.

3. **DIAP generation from data**: No SaaS tool turns assessment responses into structured DIAP items with ownership, priority, due dates, and linked evidence. Organisations currently pay consultants thousands for this.

4. **Standards-embedded education**: Every question carries context: why it matters, how to check, relevant standard in plain English. Builds capability, not just compliance reports.

5. **Conditional intelligence**: Assessment adapts to venue type. Clothing retailer gets fitting room questions, supermarket gets self-checkout, beach venue gets mobi-mat questions.

6. **Content moat**: 815 questions, 16,560+ lines of help, 73 graded solutions with step arrays, 51 measurement fields, all aligned to Australian Standards. Not replicable in a quarter.

---

## Areas to Watch

### Current Gaps

| Area | Observation | Severity |
|------|-------------|----------|
| Help content coverage | Before Arrival and Getting In deeply expanded; During Visit and Service and Support need deepening | Medium |
| No mobile-native app | SafetyCulture strength is mobile-first field auditing. Access Compass is web-based | Medium |
| No benchmarking | ADN key draw is peer comparison. Not currently offered | Low-medium |
| No certification/badge | Accessibility Tick (NZ) gives visible credential | Low |
| Single-language | No multilingual support | Low for AU market |
| Bundle size | 4.6MB main JS bundle | Low |

### Competitive Threats

| Threat | Likelihood | Defence |
|--------|------------|---------|
| SafetyCulture builds accessibility product | Low-medium | Domain depth is 12+ month head start |
| ADN creates venue-level tier | Low | Different model DNA |
| Consultant firms build SaaS | Low | Consultants resist productisation |
| Government releases comprehensive tool | Low | AHRC Health Check unchanged for years |
| International player enters AU | Medium | Local standards expertise is strong moat |

---

## Market Sizing

| Level | Estimate | Assumptions |
|-------|----------|-------------|
| TAM | $120M - $300M/yr | ~600K physical venues at $200-$500/yr |
| SAM (initial segments) | $6M - $15M/yr | Tourism, retail, councils, cultural at 10% penetration |
| SOM (years 1-3) | $150K - $1M/yr | 500-2,000 subscribers at $300-$500/yr |

---

## Conclusion

Access Compass occupies a genuine white space. No direct competitor combines guided self-assessment, Australian Standards depth, educational content, customer journey framework, DIAP generation, and affordable self-service.

The content depth (815 questions, 36 modules, 16K+ lines of help, graded solutions, standards alignment) is the hardest asset to replicate and the strongest competitive moat.

The foundation is not "good enough to launch." It is thorough enough that organisations paying $5K-$15K for consultant audits would recognise the depth. That is the core competitive advantage.

### Recommended Next Steps

1. Deepen help content for During Visit and Service and Support to match Before Arrival / Getting In quality
2. Consider a certification/badge ("Access Compass Assessed") for marketing value
3. Mobile optimisation for walk-around assessments
4. Add benchmarking ("venues like yours typically score X")
5. Case studies / ROI data from early users

---

### Sources

- SafetyCulture: safetyculture.com/pricing
- Access and Inclusion Index: accessandinclusionindex.com.au
- Tourism Research Australia: tra.gov.au/en/economic-analysis/accessible-tourism-in-australia
- AHRC: humanrights.gov.au/our-work/disability-rights
- Accessibility Tick: accessibilitytick.nz/programme
- ABCB Premises Standards: abcb.gov.au/news/2025/amended-premises-standards-and-ncc
- ABS Disability Statistics 2022: abs.gov.au
- NDIS Market Size (IBISWorld): ibisworld.com/au
