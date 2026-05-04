# Access Compass: Content Creation Methodology

**Author:** Sarah O'Mara, CEO Flare Access
**Date created:** 6 April 2026
**Last updated:** 28 April 2026
**Version:** 1.1

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
| 6 Apr 2026 | Methodology document v1.0 published. State: 31,183 lines of question content, 850+ questions across 40 modules, 8 Resource Hub help entry groups covering 53+ questions |
| 14 Apr 2026 | Employment lifecycle modules added (5.7 Inclusive job design, 5.8 Accessible interviews, 5.9 Onboarding and adjustments, 5.10 Retention and culture). Module 5.2 retired as redundant. Net +3 modules. |
| 19-20 Apr 2026 | Pricing model v3 implemented: 4-tab structure (Single Site, Multi-Site, Major Venue, Authorities), Business Groups SME-only safeguards, Major Venue tier for flagship venues |
| 28 Apr 2026 | Methodology document v1.1: AI-assisted development disclosure and explicit human authorship statement added. Current state: 43 modules. |

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

### 4.5 AI-Assisted Development Disclosure

The platform was built with the assistance of AI coding tools (primarily Anthropic's Claude, used via Claude Code). This section documents how AI was and was not used, in the interests of full transparency for due diligence, copyright, and originality enquiries.

**AI assistance was used for:**
- Code implementation: translating design decisions and content specifications written by the founder into TypeScript, React, and SQL code
- Drafting prose against detailed prompts: producing initial drafts of help text, tips, action text, and graded solutions based on briefs that specify scope, tone, audience, and standards references provided by the founder
- Restructuring and reformatting existing content into new schemas as the data model evolved
- Audit and review tasks: identifying gaps, overlaps, missing fields, and inconsistencies across modules
- Routine refactoring, type fixes, build error resolution, and similar implementation work
- Drafting marketing, sales, and strategy documents for review and editing

**AI assistance was NOT used for:**
- Original module scoping: the choice of what modules exist, what they cover, and how the journey is divided into 6 groups was made by the founder based on consulting experience
- Methodology design: the assessment structure, scoring approach, compliance tagging, DIAP generation logic, recommendation engine logic, and pricing model are original creative decisions of the founder
- Selection of standards and legislation referenced
- Compliance level and safety classifications, which require professional judgement under Australian accessibility law
- Final content approval: every question, help text, tip, and action text has been read, edited, or approved by the founder before publication

**How AI is treated for the purposes of authorship:**
The AI functions as a drafting and implementation tool operating under continuous, detailed human direction. It is comparable to commissioning a junior writer or developer to produce drafts against a detailed brief, where the strategic decisions, editorial judgement, and final approval remain with the human commissioner. The originality of the work resides in the founder's selection, arrangement, refinement, and validation of all content. AI does not autonomously generate content that is published unreviewed.

**Provenance evidence:**
- Git commit history records every change to the codebase and content from 17 December 2025
- Conversation transcripts and session logs document the prompts, briefs, and editorial decisions behind major content additions
- The founder's professional consulting record (Flare Access engagements with MCG, Scenic World, FIFA Women's World Cup, City of Melbourne, Darwin Waterfront, and others) predates the platform and is the primary source of subject matter expertise

### 4.6 Content Governance
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

Originality is preserved notwithstanding the use of AI-assisted drafting tools (see Section 4.5). The selection of subject matter, the design of the methodology, the editorial judgement applied to drafts, and the validation of all content against professional consulting expertise are human creative acts that meet the originality threshold under Australian copyright law.

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
- **AI-assisted development records**: Conversation transcripts and session logs documenting the prompts, briefs, and editorial direction provided by the founder for AI-assisted drafting work

---

## 8. Human Authorship Statement

This statement clarifies the human authorship of Access Compass content for the purposes of copyright, originality, investor due diligence, and similar enquiries. It is intended as a standalone declaration that may be supplied alongside this document.

**1. Author and contact**
Sarah O'Mara, Founder and CEO, Flare Access (T/A Access Compass).

**2. Subject matter expertise**
All content reflects the professional accessibility consulting expertise of the author, accumulated through direct on-site work with major Australian venues and organisations including the Melbourne Cricket Ground, Scenic World, FIFA Women's World Cup operations, City of Melbourne, Darwin Waterfront, and others. This expertise predates the platform and is the primary source of the substantive content.

**3. Methodology authorship**
The structure of the platform, including the choice of 6 journey groups, the breakdown into 43 modules, the question types and answer options, the compliance tagging system, the DIAP generation logic, the recommendation engine, and the pricing model and tier differentiation, was designed by the author based on consulting experience. It is not derived from any existing checklist, assessment tool, or third-party publication.

**4. Editorial control**
Every question, help text, tip, action text, and graded solution in the platform has been read, edited, or approved by the author. No content is auto-generated and published unreviewed.

**5. AI as tool, not author**
AI assistance was used in the production of this platform (see Section 4.5 for full disclosure). It functioned as a drafting and implementation tool under detailed human direction, comparable to commissioning a junior writer or developer to produce drafts against a brief. The selection, arrangement, refinement, and validation of all content is the work of the author. The author treats AI output as draft material that requires human professional judgement to verify, edit, and approve before incorporation. Under Australian copyright law, this human direction and editorial input constitutes the originality required for authorship to vest in the author and Flare Access.

**6. Source acknowledgment**
Australian Standards (including AS 1428 and AS 4685), legislation (including the Disability Discrimination Act 1992), and frameworks (including WCAG, Everyone Can Play, and the UN Convention on the Rights of Persons with Disabilities) inform the content but do not constitute it. No standard or legislative text has been reproduced. The original contribution is the translation of those frameworks into self-guided, plain-language assessment questions and tailored action planning suitable for non-expert business owners.

**7. Verification**
A complete git history from 17 December 2025 provides date-stamped, immutable evidence of every content addition and edit. Session logs document the rationale behind major content decisions. AI-assisted development records (conversation transcripts and prompts) are retained and can be produced if required to demonstrate the human direction applied to drafting work.

**8. Declaration**
The author declares that the content of Access Compass is original work, authored by the founder of Flare Access with the use of AI as a drafting and implementation tool, and that copyright in the content vests in Flare Access. This declaration is made in good faith based on the author's understanding of Australian copyright law as at the date below.

Signed (digital): Sarah O'Mara, Founder, Flare Access
Date: 28 April 2026

---

*This document should be updated whenever significant new content is added to the platform, when the AI tooling or process changes materially, or when the author's understanding of relevant law is updated by professional advice.*
