---

# Access Compass - Spec Sheet (Reviewed & Updated)

> **Last Updated:** January 2026
> **Related Docs:** See `/docs/MODULES.md`, `/docs/USER-FLOWS.md`, `/docs/RESOURCE-CENTRE.md` for detailed specifications.

## Layer 1: Product Spec

### Problem It Solves
Time-poor visitor economy business owners are overwhelmed by accessibility standards and don't know where to start. Access Compass gives them clear, prioritised actions tailored to their business, replacing confusion with confident next steps. Users can complete a quick Pulse Check (~10-15 min per module) or comprehensive Deep Dive (~18-25 min per module).

### Users
Owner-operators and managers of small-to-medium customer-facing businesses in Australia (cafes, restaurants, accommodation, tour operators, attractions, museums, galleries, visitor centres, retail, events, health & wellness, professional services) who are responsible for accessibility outcomes but are not accessibility experts.

### Success Metric
Users can confidently identify and prioritise their top 3-5 accessibility actions for "Act Now", understand effort/cost/impact, and have a shareable DIAP (Disability Inclusion Action Plan) they can act on immediately.

### Module Structure

Access Compass includes **17 accessibility modules** organised across **4 customer journey phases**:

| Phase | Modules | Description |
|-------|---------|-------------|
| **Before They Arrive** | B1, B4.1, B4.2, B4.3 | How customers find information and plan their visit |
| **Getting In and Moving Around** | A1, A2, A3a, A3b | Physical access and navigation |
| **During the Visit** | A4, A5, A6, B2, B3 | The experience while on-site |
| **Service and Support** | C1, C2, A7, C3 | How you serve and support customers |

Additional **Policy & Operations modules** (P1-P5) cover accessibility policy, inclusive employment, staff training, accessible procurement, and continuous improvement.

See `/docs/MODULES.md` for full module details.

### Review Modes

| Mode | Description | Time per Module | Best For |
|------|-------------|-----------------|----------|
| **Pulse Check** | Quick overview with foundation questions only | ~10-15 minutes | Initial assessment, time-limited reviews |
| **Deep Dive** | Comprehensive review with all questions | ~18-25 minutes | Thorough assessment, DIAP preparation |

### Core Prompt
```
You are an accessibility advisor for the Australian visitor economy. The user runs a {{business_type}} and their role is {{user_role}}. They have selected these modules to review: {{selected_modules}}.

Review mode: {{review_mode}} (pulse-check or deep-dive)

Based on their responses to discovery questions:
{{discovery_responses}}

And their calibration inputs:
- Budget: {{budget_range}}
- Work approach: {{work_approach}}
- Timing: {{action_timing}}

Generate a prioritised action plan with:
1. "Act Now" actions (3-5 items): High impact, low-to-medium effort, within their budget
2. "Plan Next" actions (3-5 items): Medium-term priorities for next 3-6 months
3. "Consider Later" actions (2-3 items): Higher investment or longer-term improvements

For each action, provide:
- Plain-English action description (1-2 sentences)
- Why it matters (user impact focus, 1-2 sentences)
- Effort level (Low/Medium/High)
- Cost band ($0-500, $500-2k, $2k-10k, $10k+)
- Simple how-to steps (3-5 bullet points)
- Example relevant to {{business_type}}
- Link to relevant Resource Centre guide if available

Also identify items they marked as "Not sure" and provide plain-English guidance on how to check or clarify each one.

Use supportive, non-judgmental tone. Frame everything as incremental improvement, not pass/fail compliance. Include specific Australian context where relevant.
```

**Data Structure for {{discovery_responses}}:**
```json
{
  "A1": {
    "A1-F-1": {
      "answer": "no",
      "notes": "2 steps at front door"
    },
    "A1-F-2": {
      "answer": "not_sure",
      "notes": ""
    }
  },
  "B1": {
    "B1-F-1": {
      "answer": "no",
      "notes": ""
    }
  }
}
```

### UI & Flow

> **Flow Overview:** Access Compass offers two pathways:
> 1. **Guided Discovery** (recommended) - Select touchpoints → Get module recommendations → Calibrate → Choose review depth → Dashboard
> 2. **Manual Selection** - Skip discovery → Choose modules manually → Calibrate → Choose review depth → Dashboard
>
> See `/docs/USER-FLOWS.md` for detailed flow diagrams.

---

**Step 1: Landing Page**

**Route:** `/`

**What's on screen:**

**Hero section:**
- Solid purple background (#490E67)
- Decorative compass elements with directional line (aria-hidden)
- Headline: "Make your business more accessible — step by step"
- Subheading: "Access Compass cuts through the complexity — giving you a clear, prioritised action plan tailored to your business, your budget, and your capacity. No expertise required. Just practical next steps you can actually take."
- Large CTA button: "Start your accessibility check"
- Trust signal: "Created by accessibility consultants who work with businesses like yours."

**What you'll get section (4 cards):**
- Personalised priorities - Recommendations tailored to your business type
- Actionable report - A downloadable summary you can share
- Practical guidance - Clear explanations of what to do and why
- Built for busy people - Start now, save progress, come back anytime

**Who it's for section:**
- Intro: "Access Compass is designed for customer-facing businesses ready to welcome more people."
- Stage message: "Whether you're just beginning your accessibility journey or looking to advance your progress, we'll meet you where you are."
- Business type pills: Attractions, Leisure & Recreation, Hospitality, Events & Venues, Retail, Local Government, Health & Wellness, Education & Training

**How it works section (6 steps):**
1. Select what's relevant to you - Choose accessibility areas that matter most
2. Choose your depth - Pulse Check for a snapshot, or Deep Dive for comprehensive review
3. Answer at your own pace - Work through questions, flag anything you're unsure about
4. Get a prioritised action plan - Recommendations organised by impact with cost/effort estimates
5. Access the Resource Centre - How-to guides, checklists, examples, and standards references
6. Track progress and share your plan - Assign owners, set timeframes, export for stakeholders

**Journey reinforcement section:**
- Value statement: "Accessibility is a journey, not a one-off task. Access Compass supports progress over perfection."
- Final CTA button: "Start your accessibility check"

**User action:** Clicks CTA button → Navigates to /disclaimer → /start

---

**Step 2: Business Snapshot**

**Route:** `/start`

**What's on screen:**
- Page title: "Tell us about your business"
- Helper text: "This helps us show only what's relevant to you"
- Form with 5 fields (all required):
  1. **Business type** (Dropdown):
     - Café/Restaurant
     - Accommodation
     - Tour Operator
     - Attraction/Museum/Gallery
     - Visitor Centre
     - Retail
     - Events & Venues
     - Health & Wellness
     - Other
  2. **Your role** (Dropdown):
     - Owner
     - Manager
     - Operations Lead
     - Other
  3. **Do you have a physical venue customers visit?** (Radio buttons: Yes / No)
  4. **Do you have an online presence (website, booking system)?** (Radio buttons: Yes / No)
  5. **Do you serve public-facing customers?** (Radio buttons: Yes / No)
- Continue button (gradient, bottom right)

**System behavior:** Stores responses in localStorage under session key. Generates session_id (UUID) if not exists.

**User action:** Completes form → Clicks Continue → Navigates to /discovery

---

**Step 3: Discovery (Guided Flow)**

**Route:** `/discovery`

**What's on screen:**
- Page title: "Let's understand where accessibility shows up in your business"
- Touchpoint categories organised by customer journey phase:
  - **Before They Arrive** - Finding you online, booking, planning their visit
  - **Getting In** - Parking, arriving, entering your space
  - **During Their Visit** - Moving around, using facilities, experiencing your service
  - **After Their Visit** - Feedback, reviews, staying connected
  - **Behind the Scenes** - Policies, staff training, procurement
- Each category expands to show specific touchpoints (checkboxes)
- Skip link: "Skip discovery and choose modules manually" → Navigates to /modules

**System behavior:**
- Selected touchpoints map to recommended modules via `TOUCHPOINT_TO_MODULES` mapping
- Modules with score >= 2 are recommended
- Stores `selectedTouchpoints` and `selectedSubTouchpoints` in session

**User action:**
- Selects relevant touchpoints → Clicks Continue → Sees module recommendations
- OR clicks "Skip discovery" → Navigates to /modules

---

**Step 3b: Module Recommendations (from Discovery)**

**Route:** `/discovery` (step 2)

**What's on screen:**
- Page title: "Based on your selections, we recommend these modules"
- Recommended modules shown as cards with checkboxes (pre-selected)
- Users can toggle individual modules on/off
- Module count and estimated time displayed
- "Back to adjust touchpoints" link
- Continue button: "Choose your path →"

**User action:** Adjusts module selection → Clicks Continue → Navigates to Calibration

---

**Step 4: Manual Module Selection**

**Route:** `/modules`

**What's on screen:**
- Page title: "Choose what you want to review today"
- Subheading: "Select the areas most relevant to your business. You can come back to other areas later."
- 17 modules organised by journey phase (expandable groups):

**Before They Arrive (4 modules):**
| Code | Module | Description | Time |
|------|--------|-------------|------|
| B1 | Pre-visit information | How you share accessibility information before customers visit | 12 min |
| B4.1 | Website basics | Basic accessibility of your website for all visitors | 15 min |
| B4.2 | Booking systems and forms | Accessibility of your online booking and form systems | 10 min |
| B4.3 | Video and social media | Accessibility of your video content and social media | 10 min |

**Getting In and Moving Around (4 modules):**
| Code | Module | Description | Time |
|------|--------|-------------|------|
| A1 | Arrival, parking and drop-off | How customers arrive at and enter your premises | 15 min |
| A2 | Entry and doors | How customers enter your building | 12 min |
| A3a | Paths and aisles | Internal circulation and movement routes | 12 min |
| A3b | Queues and busy times | Managing queues and crowded periods | 10 min |

**During the Visit (5 modules):**
| Code | Module | Description | Time |
|------|--------|-------------|------|
| A4 | Seating, furniture and layout | Physical comfort and usability of your space | 12 min |
| A5 | Toilets and amenities | Accessible toilet and amenity facilities | 15 min |
| A6 | Lighting, sound and sensory environment | Sensory aspects of your environment | 12 min |
| B2 | Signage and wayfinding | How customers find their way around | 12 min |
| B3 | Menus and printed materials | Accessibility of printed information | 10 min |

**Service and Support (4 modules):**
| Code | Module | Description | Time |
|------|--------|-------------|------|
| C1 | Customer service and staff confidence | How your team supports customers with different needs | 15 min |
| C2 | Bookings, payments and flexibility | Flexibility in your booking and payment processes | 10 min |
| A7 | Safety and emergencies | Emergency procedures that include everyone | 12 min |
| C3 | Learning from your customers | Gathering and acting on customer feedback | 10 min |

**Features:**
- "Select all" for entire groups
- "Select all modules" for everything
- Module counter with total estimated time
- Continue button (disabled until at least 1 module selected)

**System behavior:**
- Stores selected_modules array in session
- Calculates estimated time based on selected modules

**User action:** Selects 1+ modules → Clicks Continue → Navigates to Calibration

---

**Step 5: Calibration**

**Route:** `/discovery?step=calibration` or integrated in discovery flow

**What's on screen:**
- Page title: "A few quick questions to help us prioritise"
- Form with 3 required fields:

  1. **What's your realistic budget for accessibility improvements this year?** (Dropdown)
     - Under $500
     - $500 - $2,000
     - $2,000 - $10,000
     - $10,000+
     - Not sure yet

  2. **How will you approach this work?** (Dropdown)
     - I can do most things myself
     - I can do some things myself, but need support for complex items
     - I'll need to hire someone for most items
     - Working with a team
     - Not sure yet

  3. **When do you want to start taking action?** (Dropdown)
     - Now (this month)
     - Soon (next 3 months)
     - Later this year
     - Just exploring for now

- Continue button

**System behavior:** Stores calibration responses in session.

**User action:** Completes form → Clicks Continue → Navigates to Pathway Selection

---

**Step 6: Pathway Selection**

**Route:** `/discovery` (final step) or `/decision`

**What's on screen:**
- Page title: "How far do you want to take this?"
- Two pathway cards:

**Pulse Check card:**
- Icon and title: "Pulse Check"
- Description: "Quick overview of your accessibility"
- Time: "~10-15 minutes per module"
- Best for: "Initial assessment, getting started"

**Deep Dive card:**
- Icon and title: "Deep Dive"
- Description: "Comprehensive accessibility review"
- Time: "~18-25 minutes per module"
- Best for: "Thorough assessment, DIAP preparation"

- Selected modules summary with count
- Total estimated time based on selection
- Continue button: "Continue with [selected path] →"

**System behavior:** Stores `review_mode` in session ('pulse-check' or 'deep-dive').

**User action:** Selects pathway → Clicks Continue → Navigates to /dashboard

---

**Step 7: Module Questions**

**Route:** `/questions`

**What's on screen:**
- Progress bar at top: "A1: Arrival, parking and drop-off - Question 3 of 8" (updates dynamically)
- Module name and code displayed prominently
- Question text (large, clear, 1.15rem font)
- Question ID displayed (e.g., "A1-F-1" for foundation questions, "A1-D-1" for detailed questions)
- Optional helper text below question (smaller, gray, explains context)
- 4 answer buttons (large touch targets, 44px min height):
  - **Yes** (green border on hover)
  - **No** (red border on hover)
  - **Not sure** (orange border on hover) - shows helper tooltip: "We'll help you clarify this later"
  - **Not applicable** (gray border on hover)
- Optional text input field (appears for some questions): "Add details (optional)"
  - Placeholder varies by question, e.g., "How many steps?" or "Tell us more"
- Navigation:
  - Back button (ghost style, top left)
  - Progress dots for current module (bottom center)
- "Skip this module" link (small, bottom left)

**Question Flow Logic:**
- Questions displayed one at a time
- System loads questions for first selected module
- **Review mode determines questions shown:**
  - Pulse Check: Foundation questions only (prefix F, e.g., A1-F-1)
  - Deep Dive: All questions including detailed (prefix D, e.g., A1-D-1)
- After answering, automatically advances to next question
- **Branching logic:** Some questions only appear based on previous answers:
  - Example: If "Do you have a bathroom?" = Yes → Show bathroom accessibility questions
  - Example: If "Do you have a bathroom?" = No or Not applicable → Skip bathroom questions
- **Business snapshot filtering:** Questions filtered based on Step 2 responses:
  - Example: If "Online presence" = No → Skip digital modules
  - Example: If "Physical venue" = No → Skip physical access modules
- When module complete, auto-advances to next selected module
- Final module shows "Continue to your report" instead of "Next"

**System behavior:**
- Stores each response in discovery_responses object (nested by module code)
- Tracks "Not sure" responses separately for clarifications table
- Calculates completion % per module
- Validates at least 1 question answered per module before allowing continuation

**User action:** Answers all questions across selected modules → Clicks "Continue to your report" → Navigates to /dashboard

> **📋 QUESTION INVENTORY REFERENCE:**
> The complete list of discovery questions, organized by module with branching logic and conditional display rules, is maintained in:
> - **`AccessCompass_Questions_Reference.csv`** - Full question database
> - **`/docs/MODULES.md`** - Module descriptions and key questions
> - **`src/data/accessModules.ts`** - Code implementation

---

**Step 8: Dashboard**

**Route:** `/dashboard`

**What's on screen:**

**Header section:**
- Overall progress indicator showing completion across selected modules
- Review mode badge: "Pulse Check" or "Deep Dive"
- "Review Discovery" link to revisit touchpoints/module selection

**Module cards grid:**
Each selected module displayed as a card showing:
- Module code and name (e.g., "A1: Arrival, parking and drop-off")
- Progress indicator (not started / in progress / complete)
- Question count: "8 questions"
- Estimated time remaining
- Status badge with color coding
- Click to continue/start module

**Side panel (right side or below on mobile):**
- **Progress summary** card:
  - Modules completed vs total
  - Questions answered vs total
  - Visual progress bar

- **Items to clarify** card:
  - Icon: ❓
  - Count badge: "5 items"
  - Description: "Questions you marked 'Not sure'"
  - "Review items" button → /clarify

**Bottom actions:**
- "View Report" button (primary) - Available when modules complete
- "View DIAP" button (secondary) → /diap
- "Export" button (secondary) → /export

**System behavior:**
- Loads session data from localStorage
- Tracks completion status per module
- Calculates overall progress
- Real-time updates as user completes questions

**User action:**
- Clicks module card → Navigates to /questions for that module
- Clicks "View Report" → Navigates to /report
- Clicks "View DIAP" → Navigates to /diap
- Clicks "Export" → Navigates to /export

---

**Step 9: Report View**

**Route:** `/report`

**What's on screen:**

**Header section:**
- Page title: "Your Accessibility Report"
- Summary text: "Based on your responses, here's what matters most for your [business type]"
- Review mode and date generated

**Main content - 3 priority columns (responsive: stacks on mobile):**

**Column 1: Act Now 🟢**
- Column header with count: "Act now (4 actions)"
- Subheading: "High impact, achievable with your budget"
- 2-4 action cards, each showing:
  - Action title (bold, 1.1rem)
  - Module badge (e.g., "A1")
  - "Why it matters" preview (2 lines max, truncated)
  - Effort badge: Low/Medium/High (color-coded)
  - Cost badge: "$0-500" / "$500-2k" / "$2k-10k" / "$10k+"
  - Link to Resource Centre guide if available
  - Click anywhere to expand

**Column 2: Plan Next 🟡**
- Column header: "Plan next (5 actions)"
- Subheading: "Prioritise these in the next 3-6 months"
- 3-5 action cards (same structure as Column 1)

**Column 3: Consider Later 🔵**
- Column header: "Consider later (3 actions)"
- Subheading: "Longer-term improvements for future planning"
- 2-3 action cards (same structure as Column 1)

**Side panel:**
- **Modules reviewed** card:
  - List of completed modules with codes:
    - ✓ A1: Arrival, parking and drop-off
    - ✓ B1: Pre-visit information
    - ✓ C1: Customer service and staff confidence

- **Confidence snapshot** card:
  - Visual progress showing:
    - Green: Questions answered Yes/No
    - Orange: Questions marked "Not sure"
  - Text: "You answered [X]% of questions confidently."

**Bottom actions:**
- "View full DIAP" button → /diap
- "Export report" button → /export
- "Back to dashboard" link

**System behavior:**
- Generates report from completed module responses
- Groups actions by priority (Act Now / Plan Next / Consider Later)
- Links actions to Resource Centre guides where available

**User action:**
- Clicks action card → Expands to show full details
- Clicks resource link → Opens Resource Centre guide
- Clicks "View full DIAP" → Navigates to /diap
- Clicks "Export report" → Navigates to /export

---

**Step 10: Action Detail View**

**Route:** `/action/:id`

**What's on screen:**

**Header:**
- Back button: "← Back to report"
- Priority badge: "Act now" / "Plan next" / "Consider later" (colored)
- Module badge: Shows module code and name (e.g., "A1: Arrival")

**Main content:**
- **Action title** (large, 2rem, bold)
- **Why this matters** section:
  - Subheading: "Why this matters"
  - 2-3 paragraphs explaining user impact in plain English
  - Real examples: "For example, wheelchair users will be able to..."

- **How to do this** section:
  - Subheading: "Simple steps"
  - Numbered list (3-5 steps) in plain English
  - Each step is actionable and specific

- **Example for your business** section:
  - Subheading: "Example for [business type]"
  - Specific scenario relevant to their business
  - "A café like yours might..." / "Tour operators often..."

- **Resource Centre links** section:
  - Subheading: "Resources"
  - Links to relevant Resource Centre guides
  - Format indicators: [Guide] [Checklist] [Video]
  - Example: "Accessible Parking Spaces → /resources?resource=A1-F-1"

**DIAP fields (editable form):**
- White card with subtle border
- Form title: "Track this action in your DIAP"
- 4 fields:
  1. **Owner** (Text input)
     - Placeholder: "Who's responsible?"
     - Example: "Sarah (Manager)"

  2. **Timeframe** (Date input or dropdown)
     - Options: "This month", "Next 3 months", "This year", "Custom date"

  3. **Status** (Dropdown)
     - Not started
     - In progress
     - Complete
     - On hold

  4. **Notes** (Textarea)
     - Placeholder: "Add any notes, progress updates, or blockers..."
     - 1000 character limit

- Save button (gradient, "Save changes")

**Evidence upload section:**
- Card title: "Add evidence or notes"
- Helper text: "Upload photos, documents, or links to track your progress"
- Three upload options (buttons):
  1. **📸 Upload photo** - Opens file picker (accepts .jpg, .png, .heic)
  2. **📄 Upload PDF** - Opens file picker (accepts .pdf)
  3. **🔗 Add link** - Shows text input for URL
- List of uploaded evidence (if any):
  - Thumbnail or icon
  - Filename or link text
  - Upload date
  - Delete button (×)

**Bottom actions:**
- "Save & return to report" button (primary)
- "Next action" button (secondary) - Shows if more actions exist

**System behavior:**
- Loads action by ID from localStorage
- Auto-saves DIAP fields on blur or every 30 seconds
- Evidence uploads stored in evidence table with action_id
- Files stored as base64 in localStorage for MVP (future: cloud storage)

**User action:**
- Edits DIAP fields → Auto-saved
- Uploads evidence → Stored and displayed
- Clicks resource link → Opens Resource Centre in new tab
- Clicks "Save & return" → Navigates to /report
- Clicks "Next action" → Navigates to /action/:next_id

---

**Step 11: DIAP Workspace**

**Route:** `/diap`

**What's on screen:**

**Header:**
- Page title: "Your Disability Inclusion Action Plan"
- Subheading: "Track and manage all your accessibility actions"

**Filters section (horizontal bar):**
- Filter by module: Dropdown (All modules / A1: Arrival / B1: Pre-visit / etc.)
- Filter by priority: Dropdown (All priorities / Act now / Plan next / Consider later)
- Filter by status: Dropdown (All statuses / Not started / In progress / Complete / On hold)
- Search box: "Search actions..."
- Clear filters button

**Progress summary (cards across top):**
- **Total actions** card: Shows count
- **In progress** card: Shows count + percentage
- **Completed** card: Shows count + percentage
- **Not started** card: Shows count + percentage

**Table view:**
- Responsive table (switches to cards on mobile)
- Sortable columns (click header to sort):
  - **Module** - Shows module code with colored dot (e.g., "A1")
  - **Priority** - Shows badge (Act now/Plan next/Consider later)
  - **Action** - Shows action title (clickable, truncated if long)
  - **Owner** - Shows owner name or "—" if empty
  - **Timeframe** - Shows date or timeframe text
  - **Status** - Shows dropdown (inline editable)
  - **Evidence** - Shows icon: 📎 if evidence attached, — if none
  - **Actions** - Row actions:
    - View (eye icon) → Opens /action/:id
    - Edit DIAP fields (pencil icon) → Inline modal
    - Delete (trash icon) → Confirmation dialog

**Pagination:**
- Shows 20 actions per page
- "Show more" button at bottom (infinite scroll alternative)

**Bottom actions:**
- "Export DIAP" button (secondary) → /export
- "Back to dashboard" link

**System behavior:**
- Loads all actions from localStorage
- Filters apply immediately (no page reload)
- Status updates save on change
- Calculates progress percentages in real-time
- Sorts by priority by default (Act now → Plan next → Consider later)

**User action:**
- Clicks action title → Navigates to /action/:id
- Changes status dropdown → Auto-saves
- Clicks edit → Opens inline form
- Clicks "Export DIAP" → Navigates to /export

---

**Step 12: Clarify Later**

**Route:** `/clarify`

**What's on screen:**

**Header:**
- Page title: "Items to clarify"
- Count badge: "[X] items"
- Subheading: "Questions you marked 'Not sure' — here's how to check each one"

**List of clarification items:**

Each item is a card showing:
- **Module badge** - Shows module code (e.g., "A1")
- **Question ID** - Shows question reference (e.g., "A1-F-3")
- **Original question** (bold, 1.1rem) - Exact question text from discovery
- **Why it matters** section:
  - Brief explanation (2-3 sentences) of why knowing this answer helps
  - Example: "Knowing your doorway width helps determine if wheelchair users can access independently"
- **How to check** section:
  - Icon: 🔍
  - Step-by-step instructions in plain English
  - Example: "Use a tape measure to measure the narrowest point of the doorway. You need at least 850mm clear width."
- **Resource Centre link** (if available):
  - Links to relevant guide for more information
- **Status indicator:**
  - Unresolved: Orange dot + "Not checked yet"
  - Resolved: Green checkmark + "Resolved on [date]"
- **Action buttons:**
  - "Mark as resolved" button (primary, only if unresolved)
  - "Update my answer" button (secondary) - Opens modal to change answer

**Modal for updating answer:**
- Title: "Update your answer"
- Shows original question
- Radio buttons: Yes / No / Still not sure
- Optional notes field
- "Save" and "Cancel" buttons

**Filter options (top right):**
- "Show all" / "Unresolved only" / "Resolved only"

**Bottom actions:**
- "Back to dashboard" button
- Progress text: "[X] of [Y] items resolved"

**System behavior:**
- Loads clarifications from localStorage where resolved = false
- When marked resolved, updates clarifications table
- If user updates answer from Not sure → Yes/No:
  - Updates discovery_responses in session
  - Optionally triggers re-generation of action plan (future feature)
- Filters apply immediately

**User action:**
- Clicks "Mark as resolved" → Updates status, moves to resolved list
- Clicks "Update my answer" → Opens modal → Saves new answer
- Clicks resource link → Opens Resource Centre guide
- Clicks "Back to dashboard" → Navigates to /dashboard

---

**Step 13: Export & Share**

**Route:** `/export`

**What's on screen:**

**Header:**
- Page title: "Export your action plan"
- Subheading: "Download and share your priorities with your team"

**Export options (2 cards):**

**Card 1: Priority Summary**
- Icon: 📄
- Title: "1-Page Priority Summary"
- Description: "Quick overview of your 'Act now' actions—perfect for team briefings"
- Preview thumbnail (shows first page)
- File format: PDF
- Estimated size: "~200 KB"
- Download button: "Download summary"

**Card 2: Full DIAP**
- Icon: 📊
- Title: "Complete DIAP Action Plan"
- Description: "Full table with all actions, owners, timeframes, and status—ready to share with stakeholders"
- Preview thumbnail (shows table view)
- File format: PDF
- Estimated size: "~400 KB"
- Download button: "Download full DIAP"

**Preview section:**
- Tabbed interface: "Summary preview" / "DIAP preview"
- Shows actual formatted PDF content (paginated)
- Page navigation: "Page 1 of 3"

**Disclaimer (prominent, bordered box):**
- Icon: ℹ️
- Text: "This guidance is for information only. It is not legal advice, a compliance certificate, or a substitute for professional accessibility auditing. Actions are suggestions based on your responses."

**Optional features:**
- Email input: "Email this to myself" (optional)
- Sharing options:
  - Copy shareable link (future: requires auth)
  - Download QR code (links to web view of DIAP)

**Bottom actions:**
- "Back to dashboard" button
- "Start again" link (clears session)

**System behavior:**
- Generates PDFs using jsPDF library
- **1-Page Summary includes:**
  - Business name and type
  - Date generated
  - Review mode (Pulse Check / Deep Dive)
  - "Act now" actions (2-4 items) with:
    - Action title
    - Module code
    - Why it matters (abbreviated)
    - Effort and cost
  - Footer: "Generated by Access Compass | accesscompass.com.au"
  - Disclaimer text
- **Full DIAP includes:**
  - Cover page with business details
  - Table of all actions grouped by priority
  - Columns: Module, Action, Owner, Timeframe, Status, Evidence (yes/no)
  - Footer with disclaimer
  - Page numbers
- Downloads trigger browser download
- Tracks download analytics (optional)

**User action:**
- Clicks "Download summary" → PDF downloads
- Clicks "Download full DIAP" → PDF downloads
- Clicks "Back to dashboard" → Navigates to /dashboard
- Clicks "Start again" → Confirmation dialog → Clears localStorage → Navigates to /

---

**Step 14: Resource Centre**

**Route:** `/resources`

**What's on screen:**

> See `/docs/RESOURCE-CENTRE.md` for full documentation.

**Header:**
- Page title: "Resource Centre"
- Search box: Full-text search across all resources

**Browse by Category (4 tabs):**
- **Before Arrival** - Website, booking, communication accessibility
- **Getting In** - Parking, paths, entrances, wayfinding
- **During Your Visit** - Interior spaces, facilities, amenities
- **Service & Support** - Staff training, policies, assistance

**DIAP Category Filter:**
- Attitudes & Engagement
- Liveable Communities
- Employment
- Systems & Processes

**Resource Cards:**
Each resource displayed as a card showing:
- Title
- Module code badge
- Summary (2 lines)
- DIAP category tag
- Click to view full resource

**Resource Detail View (when resource selected):**
Collapsible sections:
- **Why It Matters** - Business case and impact statistics
- **Quick Tips** - Actionable implementation guidance
- **How to Check** - Self-assessment instructions
- **Standards Reference** - Australian Standards citations (AS1428.1, etc.)
- **Real-World Examples** - Industry-specific implementations
- **Video Tutorial** - Embedded video content (where available)
- **Helpful Resources** - External links and downloads
- **Related Topics** - Cross-references to other resources

**URL Parameters:**
| Parameter | Purpose | Example |
|-----------|---------|---------|
| `resource` | Select specific resource | `/resources?resource=A1-F-1` |
| `category` | Filter by module group | `/resources?category=getting-in` |
| `diap` | Filter by DIAP category | `/resources?diap=liveable-communities` |

**Current Resources (14+):**
- Accessible Parking Spaces (A1-F-1)
- Accessible Pathways (A2-F-1)
- Clear Wayfinding Signage (A2-F-3)
- Accessible Toilet Facilities (A6-1-6)
- Disability Awareness Training (C1-F-1b)
- And more...

**System behavior:**
- Standalone browsable library accessible from main navigation
- Report links directly to relevant resources
- Search indexes titles, summaries, tips content
- Filters apply immediately

**User action:**
- Searches for topic → Results update instantly
- Clicks category tab → Filters to that category
- Clicks resource card → Opens full resource view
- Clicks external link → Opens in new tab

---

### Design Style

**Style: Bold & Warm (Hybrid)**

**Colors:**
- Primary gradient: `linear-gradient(135deg, #3a0b52 0%, #c91344 100%)` - Hero sections, large banners
- Button gradient: `linear-gradient(135deg, #e67700 0%, #c91344 100%)` - Primary CTAs, badges, step numbers
- Deep purple #3a0b52 - Headings, important UI elements
- Warm orange #e67700 - Interactive elements, step numbers
- Focus orange #FF9015 - Focus indicators, high visibility elements
- Charcoal #2d2d2d - Body text (10.6:1 contrast)
- Steel gray #4a4a4a - Secondary text (7.4:1 contrast)
- Ivory #ECE9E6 - Subtle backgrounds
- White #FFFFFF - Cards, main backgrounds

**Typography:**
- Font: System stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif)
- H1: 3rem (48px), 800 weight, 1.2 line-height
- H2: 2.2rem (35px), 700 weight, 1.3 line-height
- H3: 1.5rem (24px), 700 weight, 1.3 line-height
- Body: 1rem (16px), 400 weight, 1.6 line-height
- Button: 1.1rem (17px), 600 weight

**Overall Feel:**
Bold gradient backgrounds that grab attention, combined with friendly white cards, warm emoji (🧭), rounded corners (16-30px), generous spacing (20-40px), and supportive conversational copy. Creates excitement about accessibility while feeling approachable and non-intimidating. Fully WCAG AAA compliant (white text on gradient: 12:1+ contrast).

**Components:**
- Buttons: Gradient background, 25-30px border-radius, colored shadows, hover lift effect
- Cards: White background, 16-20px border-radius, subtle shadows
- Inputs: 12px border-radius, 2px border, focus state with purple border + shadow
- Step numbers: Gradient circles (44px), white text, colored shadows
- Badges: Gradient or solid, 16px border-radius, 6-14px padding

### Test Data Example

**Test User Journey:**

**Step 1:** User lands on homepage → Clicks "Start your accessibility check" → Accepts disclaimer

**Step 2: Business Snapshot**
- Business type: **Café/Restaurant**
- Role: **Owner**
- Physical venue: **Yes**
- Online presence: **Yes**
- Public-facing customers: **Yes**
- System generates session_id: `550e8400-e29b-41d4-a716-446655440000`

**Step 3: Discovery (Guided Flow)**
User selects touchpoints:
- ✓ Website and online presence
- ✓ Parking and arrival
- ✓ Entering your space
- ✓ Moving around inside
- ✓ Using facilities (toilets, etc.)
- ✓ Customer service interactions

System recommends modules based on touchpoints:
- A1: Arrival, parking and drop-off ✓
- A2: Entry and doors ✓
- A5: Toilets and amenities ✓
- B1: Pre-visit information ✓
- C1: Customer service and staff confidence ✓

User accepts recommended modules.

**Step 4: Calibration**
- Budget: **$500 - $2,000**
- Work approach: **I can do some things myself, but need support for complex items**
- Timing: **Now (this month)**

**Step 5: Pathway Selection**
User selects: **Pulse Check** (quick overview, foundation questions only)

**Step 6: Module Questions (Pulse Check)**

*A1: Arrival, parking and drop-off (Foundation questions):*
1. A1-F-1: "Do you have designated accessible parking?" → **No**
2. A1-F-2: "Is there a drop-off zone near the entrance?" → **Yes**
3. A1-F-3: "Is the path from parking smooth and level?" → **Not sure**
4. A1-F-4: "Is the parking area well-lit?" → **Yes**

*A2: Entry and doors (Foundation questions):*
1. A2-F-1: "Is your main entrance step-free?" → **No** + Notes: "2 steps at front door"
2. A2-F-2: "Is the entrance door wide enough (850mm+)?" → **Not sure**
3. A2-F-3: "Are entrance doors easy to open?" → **Yes**

*A5: Toilets and amenities (Foundation questions):*
1. A5-F-1: "Do you have accessible toilets on site?" → **Not sure**
2. A5-F-2: "Are accessible toilets clearly signed?" → **Not applicable**
3. A5-F-3: "Is the accessible toilet kept clear of storage?" → **Not applicable**

*B1: Pre-visit information (Foundation questions):*
1. B1-F-1: "Do you have accessibility information on your website?" → **No**
2. B1-F-2: "Can customers contact you about accessibility before visiting?" → **Yes** + Notes: "Phone and email"
3. B1-F-3: "Do staff know how to respond to accessibility enquiries?" → **No**

*C1: Customer service and staff confidence (Foundation questions):*
1. C1-F-1: "Have staff received disability awareness training?" → **No**
2. C1-F-2: "Do staff know how to assist customers with assistance animals?" → **Not sure**
3. C1-F-3: "Do staff feel confident supporting customers with different needs?" → **No**

**Questions marked "Not sure" (for Clarify Later):**
- A1-F-3: "Is the path from parking smooth and level?" (A1)
- A2-F-2: "Is the entrance door wide enough (850mm+)?" (A2)
- A5-F-1: "Do you have accessible toilets on site?" (A5)
- C1-F-2: "Do staff know how to assist customers with assistance animals?" (C1)

**Step 7: Expected Report Output**

**Act now (4 actions):**
1. Add accessibility info page on website | Low effort | $0-200 | B1
2. Staff training session on disability awareness | Medium effort | $0-500 | C1
3. Add temporary ramp at entrance | Low effort | $200-500 | A2
4. Train staff on assistance animal requirements | Low effort | $0 | C1

**Plan next (4 actions):**
1. Measure entrance door width to confirm accessibility | Low effort | $0 | A2
2. Check and document toilet accessibility | Low effort | $0 | A5
3. Improve path from street/parking to entrance | Medium effort | $500-2k | A1
4. Create staff accessibility response guide | Low effort | $0-200 | B1

**Consider later (3 actions):**
1. Permanent accessible entrance (coordinate with renovation) | High effort | $3k-10k | A2
2. Upgrade bathroom to accessible standard | High effort | $5k-15k | A5
3. Develop comprehensive accessibility policy | Medium effort | $0-500 | C1

**Clarify later (4 items):**
1. A1-F-3: "Is the path from parking smooth and level?" - Module: A1
2. A2-F-2: "Is the entrance door wide enough?" - Module: A2
3. A5-F-1: "Do you have accessible toilets?" - Module: A5
4. C1-F-2: "Do staff know about assistance animals?" - Module: C1

---

## Layer 2: Technical Spec

### Session Lifecycle (MVP)

**Session Creation:**
1. User lands on / → No session exists
2. User clicks "Start" → Navigates to /disclaimer → /start
3. /start page loads → JavaScript checks localStorage for `access_compass_session_id`
4. If not found → Generate new UUID → Store as `access_compass_session_id`
5. Create session object in localStorage:
```javascript
{
  session_id: "550e8400-e29b-41d4-a716-446655440000",
  created_at: "2026-01-14T10:30:00Z",
  last_updated: "2026-01-14T10:30:00Z",
  business_snapshot: {},
  discovery_data: {
    selectedTouchpoints: [],
    selectedSubTouchpoints: []
  },
  recommended_modules: [],    // Module codes like 'A1', 'B1', 'C1'
  selected_modules: [],       // User's final module selection
  review_mode: null,          // 'pulse-check' or 'deep-dive'
  calibration: {
    budget: null,
    work_approach: null,
    timing: null
  },
  discovery_responses: {},    // Nested by module code: { A1: { 'A1-F-1': { answer, notes } } }
  ai_response: null
}
```

**Session Persistence:**
- All data stored in localStorage under key: `access_compass_session`
- Session persists across page refreshes and browser closes
- User can return to /dashboard anytime to view results
- localStorage has no expiration unless user manually clears browser data

**Session Reset:**
- User clicks "Start again" on /export page
- Confirmation dialog: "This will clear your current session and start fresh. Continue?"
- If confirmed → Clear `access_compass_session` from localStorage
- Redirect to /

**Cross-Device Note:**
localStorage is browser-specific, so sessions don't sync across devices. This is acceptable for MVP. Phase 2 with authentication will enable multi-device sync.

### Data Model

| Table | Columns | Notes |
|-------|--------|-------|
| sessions | id (UUID PK), created_at (timestamp), last_updated (timestamp), business_snapshot (JSONB), selected_modules (text[]), discovery_responses (JSONB), constraints (JSONB), ai_response (JSONB) | For MVP: Single object in localStorage. For Phase 2: PostgreSQL table with user_id FK |
| actions | id (UUID PK), session_id (UUID FK), priority (enum: act_now/plan_next/consider_later), category (text = module name), title (text), why_matters (text), effort (enum: low/medium/high), cost_band (text), how_to_steps (text[]), example (text), owner (text nullable), timeframe (text nullable), status (enum: not_started/in_progress/complete/on_hold), notes (text nullable), created_at (timestamp) | For MVP: Array in localStorage. For Phase 2: PostgreSQL table |
| evidence | id (UUID PK), action_id (UUID FK), type (enum: photo/pdf/link), filename (text nullable), url (text), file_data (text nullable = base64 for MVP), uploaded_at (timestamp) | For MVP: Array in localStorage. For Phase 2: URLs pointing to cloud storage |
| clarifications | id (UUID PK), session_id (UUID FK), question (text), module (text), why_matters (text), how_to_check (text), resolved (boolean default false), resolved_at (timestamp nullable) | For MVP: Array in localStorage. For Phase 2: PostgreSQL table |

**localStorage Schema for MVP:**
```javascript
{
  session: { /* session object */ },
  actions: [ /* array of action objects */ ],
  evidence: [ /* array of evidence objects */ ],
  clarifications: [ /* array of clarification objects */ ]
}
```

### Pages/Routes

| Page | Route | What's on it | Data Source |
|------|-------|--------------|-------------|
| Landing | / | Hero, 6-step how it works, who it's for, CTA | Static content |
| Disclaimer | /disclaimer | Legal disclaimer before starting | Static content |
| Business Snapshot | /start | 5-field form | Creates/updates session.business_snapshot |
| Discovery | /discovery | Touchpoint selection, module recommendations, calibration, pathway selection | Updates session.discovery_data, recommended_modules, review_mode |
| Manual Module Selection | /modules | 17 module cards in 4 groups | Updates session.selected_modules |
| Decision | /decision | Pathway selection (Pulse Check / Deep Dive) | Updates session.review_mode |
| Dashboard | /dashboard | Module cards with progress, overall status | Displays session progress |
| Module Questions | /questions | Adaptive question flow by module | Updates session.discovery_responses |
| Report | /report | 3 columns of prioritised actions | Displays generated report |
| Action Detail | /action/:id | Action details, DIAP form, evidence upload, resource links | Displays single action, updates action fields |
| DIAP Workspace | /diap | Table view of all actions, filters | Displays all actions in table format |
| Clarify Later | /clarify | List of "Not sure" items with guidance | Displays clarifications where resolved=false |
| Export | /export | PDF previews, download buttons | Generates PDFs from actions data |
| Resource Centre | /resources | Browsable library of guides and tips | Static help content, linked from reports |

### Auth Requirements

**MVP (Phase 1 - No Login):**
- **No authentication required**
- Session-based using localStorage (browser-only persistence)
- Data stored in browser, not synced across devices
- No user accounts, no passwords
- Session persists indefinitely in browser until localStorage cleared
- Session ID: UUID generated client-side on first visit to /start
- No server-side session management
- No user profiles or saved history

**Access control:**
- All users can access all pages
- No concept of "my sessions" vs "other users' sessions"
- Each browser instance has its own isolated session

**Phase 2 (With Login - Future):**
- Email/password authentication via Supabase Auth
- Row-level security: Users can only access their own sessions, actions, evidence
- Session data tied to user_id (UUID FK to auth.users)
- Multi-device sync enabled (sessions stored server-side)
- Optional: Social login (Google, Microsoft for business users)
- User profile page: View all past sessions, compare progress over time
- Shareable links: Generate public URLs for DIAP exports

### Integrations

| Service | What for | API key needed? | MVP or Phase 2? |
|---------|----------|-----------------|-----------------|
| Anthropic Claude API | Generate prioritised action plan from discovery responses. Called from /constraints page after user submits. | Yes - ANTHROPIC_API_KEY | **MVP (Required)** |
| Supabase | PostgreSQL database + authentication + real-time subscriptions | Yes - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY | **Phase 2** |
| Cloud storage (AWS S3 / Cloudflare R2) | Evidence file uploads (photos/PDFs). Replaces base64 in localStorage. | Yes - varies by provider | **Phase 2** |
| SendGrid / Resend (email) | Email action plans to users, send reminder emails | Yes - API key | **Phase 2** |
| Analytics (Plausible / PostHog) | Track user behavior, completion rates, popular modules | Optional - tracking ID | **Optional (MVP or Phase 2)** |

**MVP Can Function With:**
- ✅ Anthropic Claude API only (required)
- ✅ localStorage for data persistence (no backend needed for demo)
- ✅ Client-side PDF generation (jsPDF library)

### Environment Variables

```bash
# ============================================
# REQUIRED FOR MVP
# ============================================

# Anthropic API - REQUIRED
ANTHROPIC_API_KEY=sk-ant-api03-xxx
# Used for generating action plans. Never expose on client side.
# Get from: https://console.anthropic.com/

# Next.js Public Variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Used for generating shareable links and canonical URLs

# ============================================
# REQUIRED FOR PHASE 2 (Backend + Auth)
# ============================================

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
# Get from: Supabase Dashboard > Project Settings > API

# Cloud Storage (choose one provider)
# AWS S3:
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_BUCKET_NAME=access-compass-evidence
AWS_REGION=ap-southeast-2

# OR Cloudflare R2:
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=access-compass-evidence
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=no-reply@accesscompass.com.au
SENDGRID_FROM_NAME=Access Compass

# ============================================
# OPTIONAL
# ============================================

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
# Options: development, staging, production

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=accesscompass.com.au
# OR
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Feature Flags
NEXT_PUBLIC_ENABLE_AUTH=false
NEXT_PUBLIC_ENABLE_FILE_UPLOAD=false
```

**Security & Implementation Notes:**

**Critical - API Key Security:**
```javascript
// ❌ NEVER DO THIS - Exposes API key to client
const response = await fetch('https://api.anthropic.com/v1/messages', {
  headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY }
});

// ✅ DO THIS - Use Next.js API route (server-side)
// File: /app/api/generate-plan/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY, // Server-side only
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: /* your prompt */ }]
    })
  });
  
  return Response.json(await response.json());
}

// Client calls: fetch('/api/generate-plan', { method: 'POST', body: JSON.stringify(data) })
```

**Rate Limiting:**
```javascript
// Implement simple rate limiting on API routes
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 requests per hour per IP
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }
  
  // ... rest of API logic
}
```

**Input Validation:**
```javascript
// Validate all inputs before sending to Claude API
import { z } from 'zod';

const ConstraintsSchema = z.object({
  budget_range: z.enum(['under_500', '500_2k', '2k_10k', '10k_plus', 'not_sure']),
  capacity: z.enum(['diy', 'some_support', 'hire_help', 'not_sure']),
  timeframe: z.enum(['now', 'soon', 'later', 'exploring']),
  notes: z.string().max(500).optional()
});

// In API route:
const validated = ConstraintsSchema.safeParse(data);
if (!validated.success) {
  return Response.json({ error: validated.error }, { status: 400 });
}
```

**File Upload Security (Phase 2):**
- Validate file types: Only allow .jpg, .jpeg, .png, .pdf
- Limit file size: Max 5MB per file
- Scan uploads for malware (using AWS Macie or ClamAV)
- Generate unique filenames: `${uuid()}-${sanitized_original_name}`
- Store in private bucket with signed URLs for access

---

## Build Priority for MVP

**Sprint 1: Core Flow (Week 1-2)**
1. ✅ Setup Next.js project with TypeScript
2. ✅ Implement localStorage session management
3. ✅ Build pages 1-5: Landing → Business Snapshot → Module Selection → Discovery Questions → Constraints
4. ✅ Integrate Question Inventory data (reference external file for now, hardcode sample questions for testing)
5. ✅ Implement basic routing and navigation

**Sprint 2: AI Integration (Week 3)**
6. ✅ Create server-side API route for Claude API
7. ✅ Build prompt template with variable substitution
8. ✅ Parse Claude API response into actions and clarifications
9. ✅ Store results in localStorage
10. ✅ Add loading states and error handling

**Sprint 3: Dashboard & Actions (Week 4)**
11. ✅ Build Page 6: Priority Dashboard with 3 columns
12. ✅ Build Page 7: Action Detail with DIAP fields
13. ✅ Implement evidence upload (base64 in localStorage)
14. ✅ Add auto-save functionality for DIAP fields

**Sprint 4: DIAP & Export (Week 5)**
15. ✅ Build Page 8: DIAP Workspace with table view and filters
16. ✅ Build Page 9: Clarify Later list
17. ✅ Build Page 10: Export with PDF generation
18. ✅ Implement 1-page summary PDF
19. ✅ Implement full DIAP PDF

**Sprint 5: Polish & Testing (Week 6)**
20. ✅ Apply design system (gradients, colors, typography, components)
21. ✅ Make all pages fully responsive (mobile, tablet, desktop)
22. ✅ Add loading states, error boundaries, empty states
23. ✅ Test full user journey with real data
24. ✅ Fix bugs and edge cases
25. ✅ Deploy MVP to Vercel

**Total Estimated Time:** 6 weeks for MVP (1 developer)

---

## Phase 2 Additions (Future)

**Authentication & Database (Week 7-8)**
- Set up Supabase project
- Implement email/password authentication
- Create PostgreSQL tables (migrate from localStorage schema)
- Add Row Level Security policies
- Build user profile page

**Cloud Storage (Week 9)**
- Set up AWS S3 or Cloudflare R2
- Replace base64 evidence storage with cloud uploads
- Implement signed URLs for file access
- Add file validation and security scanning

**Enhanced Features (Week 10-12)**
- Multi-device sync
- Shareable DIAP links (public URLs)
- Email action plans to users
- Reminder emails for incomplete actions
- Export to Google Drive / Dropbox integration
- Analytics dashboard for admin

**Total Phase 2 Time:** 6 weeks additional

---