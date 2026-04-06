# Access Compass: Content Creation Methodology

**Author:** Sarah O'Mara, CEO Flare Access
**Date created:** 6 April 2026
**Last updated:** 6 April 2026
**Version:** 1.0

---

## 1. Purpose of This Document

This document records the methodology, sources, and authorship behind the original content in Access Compass, an Australian accessibility self-assessment and planning platform. It serves as evidence of original intellectual work for copyright and prior art purposes.

---

## 2. Development Timeline

| Date | Milestone |
|---|---|
| Pre-Dec 2025 | Domain expertise developed through professional consulting (Flare Access), direct work with MCG, Scenic World, FIFA Women's World Cup, City of Melbourne, and other venues |
| 17 Dec 2025 | Initial commit: MVP with discovery system, question flow, dashboard, DIAP management (commit `c75e91b`) |
| Dec 2025 - Jan 2026 | Core question content authored across original 34 modules |
| Jan - Mar 2026 | Iterative content refinement: help content, graded solutions, resource hub entries, actionText, compliance levels |
| 29-31 Mar 2026 | Major content quality pass: actionText overlap audit (16 high-severity fixes), success indicator refinements, filler text removal, gap analysis features |
| 31 Mar 2026 | 3 new modules added (3.11 Outdoor Spaces, 3.12 Playgrounds, 5.6 Supplier Accessibility), bringing total to 40 modules |
| 30 Mar 2026 | Pricing model designed (8 tiers), authority portal content |
| 2 Apr 2026 | 380 commits across 111 active development days |
| 6 Apr 2026 | Current state: 31,183 lines of question content, 850+ questions across 40 modules, 8 Resource Hub help entry groups covering 53+ questions |

**Git repository:** Private repository with full commit history from 17 December 2025 onward, providing verifiable date-stamped evidence of content creation and evolution.

---

## 3. Content Scope (What Was Created)

### 3.1 Assessment Questions (accessModules.ts)
- **850+ original questions** across 40 modules, organised into 6 groups:
  - 1.x Before Arrival (6 modules)
  - 2.x Getting In (4 modules)
  - 3.x During Visit (12 modules)
  - 4.x Service and Support (7 modules)
  - 5.x Organisation (6 modules)
  - 6.x Events (5 modules)
- Each question includes: question text, question type, help content (summary, understanding guidance, practical tips), action text for each possible response, compliance level, and safety flags

### 3.2 Help Content (per-question guidance)
- **summary**: One paragraph explaining what the question assesses and why it matters
- **understanding**: Structured guidance for interpreting each answer option (e.g., criteria for answering "Yes," "Partially," or "No")
- **tips**: 3-6 practical, conversational tips written for non-expert business owners
- **examples**: Good/poor practice visual examples with captions and explanations

### 3.3 Resource Hub Content (help/*.ts)
- Deep-dive entries organised by journey group: before-arrival, getting-in, during-visit, service-support
- Each entry includes: whyItMatters, tips, howToCheck, standardsReference, graded solutions (quick wins, moderate changes, comprehensive upgrades), real-world examples, keywords
- Entries linked to specific question IDs via coveredQuestionIds mapping

### 3.4 DIAP (Disability Inclusion Action Plan) Content
- Auto-generated action items derived from assessment responses
- 33+ topic-specific success indicator patterns with word-boundary matching
- Tailored supporting steps per topic (replacing generic filler)
- Module-to-DIAP-section mapping (diapMapping.ts)
- Multi-select gap analysis: identifies what is in place vs what is missing

### 3.5 Discovery and Recommendation Engine
- Industry-specific module recommendations based on business type
- Touchpoint-to-module mappings across customer journey phases
- Discovery questions that tailor the assessment scope

### 3.6 Training Content
- Flagship course: "Using AI to Create Accessible and Inclusive Resources" (7 lessons)
- Course structure, lesson content, and learning objectives

### 3.7 Pricing and Business Model
- 8-tier pricing model (Free, Starter, Committed, Multi-Site x3, Council Essentials, Council Pro)
- Authority/council licensing model with per-business pricing
- Individual module purchase options
- Funding models: authority-funded, business-funded, co-funded

---

## 4. Content Creation Methodology

### 4.1 Source Expertise
All question content was authored drawing on the creator's direct professional experience in accessibility consulting, including:
- On-site accessibility assessments for major Australian venues
- Development of accessibility strategies for local government
- Direct engagement with people with disability and their lived experience
- Compliance advisory work under the Disability Discrimination Act 1992 (Cth)

### 4.2 Standards Referenced
Questions and guidance reference (but do not reproduce) the following standards and frameworks:
- AS 1428 (Design for access and mobility) series
- Disability Discrimination Act 1992 (Cth)
- AHRC Advisory Notes on Access to Premises
- WCAG 2.1 / 2.2 (Web Content Accessibility Guidelines)
- Everyone Can Play guidelines (NSW)
- AS 4685 (Playground equipment)
- DDA Section 24 (Goods, services, and facilities)
- UN Convention on the Rights of Persons with Disabilities

### 4.3 Content Authoring Process
1. **Module scoping**: Each module covers a specific aspect of the customer journey or organisational practice, defined by the creator based on consulting experience
2. **Question drafting**: Questions written to be understandable by non-expert business owners, using plain language rather than technical standards terminology
3. **Help content layering**: Each question receives a summary (context and purpose), understanding guidance (how to interpret answers), and practical tips (actionable advice)
4. **Compliance tagging**: Questions tagged with compliance level (mandatory, recommended, best-practice) and safety flags based on the creator's knowledge of Australian accessibility law
5. **Action text authoring**: Each answer option triggers tailored action text that feeds into the DIAP, written to be specific to the question topic rather than generic
6. **Cross-reference audit**: Regular audits for overlapping advice between modules (e.g., training recommendations in module 4.2 vs 5.3, signage in module 3.5 vs others)
7. **Resource Hub deep content**: Graded solutions (quick wins through comprehensive upgrades) authored with real-world implementation knowledge, including rough effort levels and standards references

### 4.4 Quality Assurance
- Automated audit scripts verify structural completeness (helpContent presence, understanding arrays, tip counts)
- ActionText overlap audits identify and resolve cross-module redundancy
- Success indicator patterns tested with word-boundary matching to prevent false positives
- 10-step question change checklist ensures all dependent systems are updated when content changes (see Section 5)

### 4.5 Content Governance
A formal checklist governs any modification to question content, ensuring changes propagate correctly across:
1. The question itself (text, type, options, help content, action text)
2. Branching/conditional logic (showWhen references)
3. Per-question recommendations (useReportGeneration.ts)
4. Resource Hub help entries (help/*.ts, index.ts)
5. Legacy help content (helpContent.ts)
6. Discovery engine and touchpoint mappings
7. DIAP section mappings
8. Compliance and priority settings
9. Build verification

---

## 5. Originality Statement

The assessment questions, help content, tips, action text, graded solutions, resource hub entries, DIAP generation logic, discovery engine, and training materials in Access Compass are original works created by the platform's founder. They are not reproductions of any existing tool, checklist, or publication.

Where Australian Standards or legislation are referenced, the content provides original interpretive guidance and practical application advice rather than reproducing the text of those standards.

The platform's unique contribution is translating complex accessibility standards and legislation into a structured, self-guided assessment that non-expert business owners can complete independently, with tailored action planning that goes beyond generic compliance checklists.

---

## 6. Copyright Notice

Copyright 2025-2026 Flare Access T/A Access Compass. All rights reserved.

The content described in this document, including but not limited to assessment questions, help text, tips, action text, graded solutions, resource hub entries, DIAP generation logic, and training materials, is protected by copyright under Australian law (Copyright Act 1968). Unauthorised reproduction, distribution, or use of this content is prohibited.

---

## 7. Evidence of Creation

- **Git repository**: Full commit history from 17 December 2025, providing date-stamped evidence of every content addition and modification
- **Total commits**: 380+ as of 6 April 2026
- **Content volume**: 31,183 lines in primary content file (accessModules.ts) alone
- **Development session records**: Detailed session logs documenting content decisions, rationale, and changes made on specific dates
- **Supabase database**: Migration files (001-019) with timestamps documenting data model evolution

---

*This document should be updated whenever significant new content is added to the platform.*
