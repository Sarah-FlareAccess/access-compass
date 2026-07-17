# Feature status ledger

**Internal only. Never imported by app code, so it never reaches the browser bundle.**

## Why this exists

Access Compass is sold while it is built. That is deliberate and it is the right call — waiting until everything is finished means no revenue and no feedback. This file is not a brake on that. It is the thing that makes it safe.

Selling ahead of the build costs nothing **if you know the date**. It costs a customer when nobody remembers which rows are real. On 17 July 2026 an audit found the drift running in *both* directions:

- **Sold, not built:** zones (the entire Major Venue tab), multi-plan support (Enterprise's headline), department-level sections (since pulled).
- **Built, not sold:** statutory framework alignment — nine jurisdictions of legislative mapping, live in reports and PDFs, and it appeared in **no tier at all**. Australian data residency, same story.

The second kind is the expensive one. That was work already paid for, sitting unsold, while the pricing page argued about seat counts.

## The rule

**A feature row must be able to name the file that implements it.** If it cannot, it is `PLANNED` and it needs a date, not a tick.

`PLANNED` rows are fine on the pricing page — that is the strategy. They are **not** fine in a document sent to a named prospect. See `feedback-no-unshipped-promises`.

## Status

| Row on the page | Where claimed | Status | Implemented by |
|---|---|---|---|
| Accessibility Self-Assessment | all tabs | **BUILT** | `data/accessModules.ts` (50 modules), `lib/recommendationEngine.ts` |
| Action Plan Management | MS, MV, Auth | **BUILT** | `pages/DIAPWorkspace.tsx`, `hooks/useDIAPManagement.ts`, `diap_items` (001) |
| Plan Import (guided + undo) | MV, Auth | **BUILT** | `hooks/useDIAPManagement.ts` — CSV/Excel map+preview+reverse, AI paste |
| Statutory Framework Alignment | MV, Auth | **BUILT** ⚠️ not gated | `data/frameworks.ts` (9 jurisdictions), `frameworkMappings.ts`, `hooks/useReportGeneration.ts`, `components/ReportViewer.tsx`, `utils/pdfGenerator.ts` |
| Evidence Library | MS, MV, Auth | **BUILT** | `evidence_files` (014, 023) |
| Year-on-Year Progress Measurement | all tabs | **BUILT** | `module_assessment_snapshots` (033) |
| Executive & Board Reporting | MV, Auth | **BUILT** | `pages/ReportPage.tsx`, `utils/pdfGenerator.ts`, `utils/diapPdfGenerator.ts` |
| Own Sites / Venues / Events | all tabs | **BUILT** | `sites` (023), `hooks/useSites.ts` |
| Resource Hub | all tabs | **BUILT** | `pages/ResourceCentre.tsx` |
| Network Program Included | MV, Auth | **BUILT** | `pages/AuthorityPrograms.tsx`, `ProgramEnrol.tsx`, `hooks/useProgramEnrolment.ts` |
| Procurement-Ready Pack | Enterprise | **BUILT** (documents, not software) | Supplied by Flare with the contract |
| Consultant Check-Ins | MV | **BUILT** (a service commitment) | Sarah's calendar |
| Australian hosted / data residency | MV, Auth (platform note) | **BUILT** | Supabase, Sydney region |
| Works With Your Project Tools | MS, MV, Auth | **PARTIAL** | Export **is** built (`useDIAPManagement.exportToCSV`, `diapPdfGenerator`). **Delivery packages are not** — today's export is the whole plan, not team-scoped. |
| Team Allocation + Consolidated Emails | MS, MV, Auth | **PARTIAL** | Assigning `responsible_role` works. **"One consolidated email per person" has no implementation.** |
| Zones / Zone-Based Reporting / Cross-Zone Trends | **all of Major Venue** | 🔴 **PLANNED** | **Nothing.** No zone table, column or type. `sites` is flat. See `bug-zones-sold-not-built`. |
| Multi-Plan Support | Enterprise | 🔴 **PLANNED** | **Nothing.** No plan entity, no `plan_id` on `diap_items`, no historical comparison. Plans are auto-generated per venue. |
| Superuser Training | Premier, Major, Core, Prof, Ent | **PLANNED** | The Training Hub platform exists (`026`, `027`, courses + lessons + progress). **The superuser course itself does not.** Content work, build once. |
| Single Sign-On (SSO) | Enterprise, Major Venue | **PLANNED** | Nothing. The only SAML strings in the repo are the pricing copy. |
| API access | Enterprise, Major Venue | **PLANNED** | Nothing. No edge functions, no endpoints. |
| Report format (PDF vs PDF + interactive) | Single Site, Multi-Site | ⚠️ **NOT GATED** | No tier gate found in `ReportPage.tsx`. Deep and Plus are identical on this row anyway — candidate for removal. |

## The two that cost you money right now

**Framework alignment is not tier-gated.** Every tier gets it in the product. It is off the Single Site and Multi-Site tabs, so it is *unadvertised*, not *restricted*. Until it is enforced, Core's reason to exist above Multi-Site Plus ($7,900 vs $3,499) is a presentational choice rather than a product one.

**Zones and multi-plan carry two prices between them.** Zones are the only thing separating Major Venue ($18,900) from Multi-Site Plus ($3,499). Multi-plan is the only thing separating Enterprise ($25,000) from Professional ($12,900). Both are unbuilt. Those two prices are currently held up by rows with nothing behind them.

## Build order (by value per hour, 17 Jul 2026)

0. **The superuser course** — the Training Hub is built and orphaned; this gives it a reason to be on the pricing page. It is also the scalable replacement for bundled consulting hours, which do not scale past ~50 customers. Build once, serves everyone, available at 9pm when a new starter joins. Directly answers the problem Access Compass claims to solve: when the person who cared leaves, the capability stays.
1. **Delivery packages** — group by `responsible_team`, export that team's rows. Days. Also resurrects department-level ownership **without** Phase 1b RLS, because handing Parks a file is a file, not a permission.
2. **Zones** — `ALTER TABLE sites ADD COLUMN parent_site_id UUID REFERENCES sites(id)`. `site_id` is already on every data table, so assessment, plan, evidence and reporting scope per zone for free. Makes Multi-Site vs Major Venue a real, enforceable boundary.
3. **Evidence capture** — the localStorage quota bug and mobile upload. Filed as maintenance; actually the moat. Evidence is the thing a task tool cannot hold and the board report cannot do without.
4. **Framework gate** — small, and it is what makes Core's $7,900 defensible.
5. **Multi-plan** — `plan_id` on `diap_items` plus a plan switcher. Holds up the Enterprise price.
6. **SSO**, then **API**.

## Maintaining this

Update the row when you change the claim, not when you finish the build. The failure mode is not a stale date, it is a tick with nothing behind it.
