# Future: Customer-Facing Accessibility Directory

## Concept
A public-facing tool where customers can search participating businesses and learn about their accessibility features. Businesses get a shareable profile/link; customers get a structured, reliable directory.

## Why the data model already supports this
- Module groups (Before Arrival, Getting In, During Visit, Service & Support, Events) mirror a customer's journey
- Question answers (yes/partially/no) translate to traffic-light or badge displays
- helpText and tips already contain customer-friendly language
- Data is self-assessed against a structured framework, not just binary tags

## Differentiator vs existing directories (AccessNow, Wheelmap, etc.)
- Granular: specific details (ramp gradient, hearing loops, quiet spaces, Auslan) not just "wheelchair accessible: yes/no"
- Journey-based: organised by what customers need at each stage
- Business-verified: guided audit, not crowdsourced reviews or checkbox tags
- Confidence indicator: shows how thoroughly a business completed their review

## Customer-relevant modules (~25-30 of 37)
- Physical access: 2.x (Getting In), 3.x (During Visit)
- Communication and contact: 4.1, 4.6
- Events accommodations: 6.x
- Pre-visit info: 1.1-1.4

## Internal-only modules (exclude from public profiles)
- Staff training specifics: 5.3
- Procurement policies: 5.4
- DIAP planning: 5.5
- Internal HR/onboarding: 5.2

## Product options (lightweight to full)
1. Shareable profile page per business (lowest effort, highest immediate value)
2. Embeddable widget for business websites
3. Public directory with search/filter by accessibility features
4. API for third parties (tourism boards, event platforms, mapping services)

## Alignment with existing frameworks (ATDW, tourism accreditation, etc.)

### Positioning
- ATDW / accreditation checklists = "Are you accessible?" (high-level labels and tags)
- Access Compass = "How accessible, specifically, and how do you improve?" (the substance behind the label)
- Access Compass is not a competing checklist. It is the detailed engine that makes those checklists meaningful and accurate.
- Not tourism-specific: Access Compass covers retail, events, services, organisations. Tourism frameworks are a subset of the overlap.

### Avoiding repetition for users
Two directions (can do both):

1. **Import/pre-fill**: If a business has already completed ATDW or an accreditation, map their existing answers to Access Compass questions. Pre-answer or skip overlapping items. User only deals with the deeper detail Access Compass adds.

2. **Export to those formats**: After completing Access Compass, generate exportable outputs mapped to ATDW fields, accreditation checklists, or other frameworks. "You did this once properly, we translate it for you."

### Key message to users
"You are not doing this twice. You are doing it properly once, and we translate it to the formats you need."

### Future work
- Map ATDW accessibility fields to Access Compass question IDs
- Map accessible tourism accreditation checklist items to Access Compass question IDs
- Build import (pre-fill from existing) and export (generate checklist outputs) features
- Could extend to other frameworks as they emerge

## Pricing considerations

### Option A: Paid listing ($49/year or similar)
- Tangible ongoing value (public visibility, customer reach)
- Fee signals commitment, businesses more likely to keep data current
- Recurring revenue supports maintaining the directory
- Risk: reduces participation, especially early on when the directory needs volume

### Option B: Free listing
- Directory fills up faster, making it useful to customers sooner
- Rewards businesses for completing their Access Compass review
- Risk: less revenue, less incentive to maintain data

### Option C: Freemium (middle ground)
- **Free tier**: basic listing (name, location, accessibility summary, completion level)
- **Paid tier**: enhanced profiles (photos, detailed breakdowns, featured placement, embeddable widget, export to ATDW/accreditation formats)
- Free tier fills the directory quickly and acts as a sales funnel for paid features
- Paid tier provides clear upgrade value for businesses that want to stand out

### Decision: TBD

## No build work needed now
The current data model, question structure, and answer format already capture everything required. No schema changes or new fields needed at this stage.
