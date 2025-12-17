---

# Access Compass - Spec Sheet (Reviewed & Updated)

## Layer 1: Product Spec

### Problem It Solves
Time-poor visitor economy business owners are overwhelmed by accessibility standards and don't know where to start. Access Compass gives them clear, prioritised actions tailored to their business in 10-15 minutes, replacing confusion with confident next steps.

### Users
Owner-operators and managers of small-to-medium visitor economy businesses in Australia (cafes, restaurants, accommodation, tour operators, attractions, museums, galleries, visitor centres) who are responsible for accessibility outcomes but are not accessibility experts.

### Success Metric
Users can confidently identify and prioritise their top 3-5 accessibility actions for "Act Now", understand effort/cost/impact, and have a shareable DIAP (Disability Inclusion Action Plan) they can act on immediately.

### Core Prompt
```
You are an accessibility advisor for the Australian visitor economy. The user runs a {{business_type}} and their role is {{user_role}}. They have selected these modules to review: {{selected_modules}}.

Based on their responses to discovery questions:
{{discovery_responses}}

And their constraints:
- Budget: {{budget_range}}
- Capacity: {{diy_or_support}}
- Timeframe: {{timeframe}}

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

Also identify items they marked as "Not sure" and provide plain-English guidance on how to check or clarify each one.

Use supportive, non-judgmental tone. Frame everything as incremental improvement, not pass/fail compliance. Include specific Australian context where relevant.
```

**Data Structure for {{discovery_responses}}:**
```json
{
  "Physical access": {
    "Is there level access to your entrance?": {
      "answer": "no",
      "notes": "2 steps at front door"
    },
    "Do you have an accessible bathroom?": {
      "answer": "not_sure",
      "notes": ""
    }
  },
  "Online and bookings": {
    "Can visitors easily find accessibility information on your website?": {
      "answer": "no",
      "notes": ""
    }
  }
}
```

### UI & Flow

**Step 1: Landing Page**

**What's on screen:**
- Hero section with gradient background (purple to coral)
- Headline: "Clear, practical accessibility priorities for your business"
- Subheading: "Plain English. No expertise required. Built for the visitor economy."
- 3-step visual with icons:
  - Step 1: "Select areas" (with checkmark icon)
  - Step 2: "Answer questions" (with chat bubble icon)
  - Step 3: "Get your action plan" (with document icon)
- Time estimate badge: "10–15 minutes"
- Trust cues (2 items with checkmarks):
  - "Not a compliance certificate"
  - "Designed for Australian businesses"
- Large gradient CTA button: "Start your free accessibility check"

**User action:** Clicks CTA button → Navigates to /start

---

**Step 2: Business Snapshot**

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

**User action:** Completes form → Clicks Continue → Navigates to /modules

---

**Step 3: Module Selection**

**What's on screen:**
- Page title: "Choose what you want to review today"
- Subheading: "Select the areas most relevant to your business. You can come back to other areas later."
- 7 module cards in grid (2-3 columns depending on screen size):

  **Card structure (repeated for each module):**
  - Module icon (emoji or simple icon)
  - Module title (bold, 1.5rem)
  - Short description (2-3 sentences, 0.95rem)
  - "Recommended" badge (appears on some cards based on Business Snapshot responses)
  - Checkbox or click-to-select interaction
  - Subtle border highlight when selected

  **7 Modules:**
  1. **Physical access** 🚪
     - Description: "Entrances, doorways, bathrooms, parking, and moving through your space"
     - Recommended if: Physical venue = Yes
  
  2. **Communication and information** 💬
     - Description: "Menus, signs, brochures, audio announcements, and other ways you share information"
     - Recommended if: Always shown
  
  3. **Customer service and staff** 👥
     - Description: "How your team supports customers with different access needs"
     - Recommended if: Public-facing customers = Yes
  
  4. **Online and bookings** 💻
     - Description: "Website accessibility, booking systems, and digital information"
     - Recommended if: Online presence = Yes
  
  5. **Wayfinding and signage** 🗺️
     - Description: "Signs, maps, directions, and helping people find their way around"
     - Recommended if: Physical venue = Yes AND (Business type = Attraction/Museum/Gallery OR Accommodation)
  
  6. **Sensory considerations** 👂👃
     - Description: "Lighting, noise, sounds, smells, and creating comfortable environments"
     - Recommended if: Physical venue = Yes
  
  7. **Emergency and safety** 🚨
     - Description: "Evacuation plans, emergency communication, and safety procedures"
     - Recommended if: Physical venue = Yes

- Module counter: "3 selected" (updates dynamically)
- Continue button (disabled until at least 1 module selected)

**System behavior:** 
- Marks recommended modules with badge
- Allows selecting 1-7 modules
- Stores selected_modules array in session

**User action:** Selects 1+ modules → Clicks Continue → Navigates to /questions

---

**Step 4: Discovery Questions**

**What's on screen:**
- Progress bar at top: "Physical access - Question 3 of 8" (updates dynamically)
- Module name displayed prominently
- Question text (large, clear, 1.15rem font)
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
- After answering, automatically advances to next question
- **Branching logic:** Some questions only appear based on previous answers:
  - Example: If "Do you have a bathroom?" = Yes → Show bathroom accessibility questions
  - Example: If "Do you have a bathroom?" = No or Not applicable → Skip bathroom questions
- **Business snapshot filtering:** Questions filtered based on Step 2 responses:
  - Example: If "Online presence" = No → Skip all "Online and bookings" module
  - Example: If "Physical venue" = No → Skip questions about physical doorways
- When module complete, auto-advances to next selected module
- Final module shows "Continue to priorities" instead of "Next"

**System behavior:**
- Stores each response in discovery_responses object (nested by module)
- Tracks "Not sure" responses separately for clarifications table
- Calculates completion % per module
- Validates at least 1 question answered per module before allowing continuation

**User action:** Answers all questions across selected modules → Clicks "Continue to priorities" → Navigates to /constraints

> **📋 QUESTION INVENTORY REFERENCE:**  
> The complete list of discovery questions, organized by module with branching logic and conditional display rules, is maintained in:  
> **"Access Compass Question Inventory - V2 15_12_25 (2)"**  
> This file contains all questions for the 7 modules with exact question text, answer types, branching rules, and helper text.

---

**Step 5: Constraints & Context**

**What's on screen:**
- Page title: "Help us prioritise realistically"
- Subheading: "We want to suggest actions that actually work for your situation"
- Form with 3 required fields + 1 optional:
  
  1. **What's your realistic budget for accessibility improvements this year?** (Dropdown)
     - Under $500
     - $500 - $2,000
     - $2,000 - $10,000
     - $10,000+
     - Not sure yet
  
  2. **What's your capacity to implement changes?** (Dropdown)
     - I can do most things myself
     - I can do some things myself, but need support for complex items
     - I'll need to hire someone for most items
     - Not sure yet
  
  3. **When do you want to start taking action?** (Dropdown)
     - Now (this month)
     - Soon (next 3 months)
     - Later this year
     - Just exploring for now
  
  4. **Anything else we should know?** (Optional textarea)
     - Placeholder: "e.g., upcoming renovations, specific customer feedback, tight deadlines..."
     - 500 character limit

- Large gradient CTA button: "Get my priorities"
- Loading state appears when clicked (gradient animation, "Creating your action plan...")

**System behavior:**
- Stores constraints in session
- On submit, calls Claude API with full session data
- Shows loading screen (3-8 seconds typically)
- Parses API response into actions and clarifications
- Stores in actions and clarifications tables (localStorage)

**User action:** Completes form → Clicks "Get my priorities" → Loading screen → Navigates to /dashboard

---

**Step 6: Priority Dashboard (✨ Magic Moment)**

**What's on screen:**

**Header section:**
- Congratulations message: "Here are your accessibility priorities, [Business Name]"
- Summary text: "Based on your responses, here's what matters most for your [business type]"

**Main content - 3 columns (responsive: stacks on mobile):**

**Column 1: Act now 🟢**
- Column header with emoji and count: "Act now (4 actions)"
- Subheading: "High impact, achievable with your budget"
- 2-4 action cards, each showing:
  - Action title (bold, 1.1rem)
  - "Why it matters" preview (2 lines max, truncated with "...")
  - Effort badge: Low/Medium/High (color-coded: green/yellow/orange)
  - Cost badge: "$0-500" / "$500-2k" / "$2k-10k" / "$10k+"
  - Click anywhere to expand

**Column 2: Plan next 🟡**
- Column header: "Plan next (5 actions)"
- Subheading: "Prioritise these in the next 3-6 months"
- 3-5 action cards (same structure as Column 1)

**Column 3: Consider later 🔵**
- Column header: "Consider later (3 actions)"
- Subheading: "Longer-term improvements for future planning"
- 2-3 action cards (same structure as Column 1)

**Side panel (right side or below on mobile):**
- **Items to clarify later** card:
  - Icon: ❓
  - Title: "Items to clarify later"
  - Count badge: "5 items"
  - Description: "Questions you weren't sure about—we'll help you check these"
  - "Review items" button
  
- **Modules reviewed** card:
  - Icon: ✅
  - List of completed modules with checkmarks:
    - ✓ Physical access
    - ✓ Online and bookings
    - ✓ Customer service and staff
  
- **Confidence snapshot** card:
  - Icon: 📊
  - Visual: Simple progress-style graphic showing:
    - Green section: Questions answered confidently (Yes/No)
    - Orange section: Questions marked "Not sure"
    - No numerical score shown
  - Text: "You answered [X]% of questions confidently. We've flagged [Y] items for you to clarify."

**Bottom actions:**
- "View full DIAP" button (secondary style)
- "Export summary" button (secondary style)
- "Start again" link (small, subtle)

**System behavior:**
- Loads actions from localStorage grouped by priority
- Cards are clickable—clicking navigates to /action/:id
- Real-time data, updates if user edits actions

**User action:** 
- Clicks action card → Navigates to /action/:id
- Clicks "Review items" → Navigates to /clarify
- Clicks "View full DIAP" → Navigates to /diap
- Clicks "Export summary" → Navigates to /export

---

**Step 7: Action Detail View**

**What's on screen:**

**Header:**
- Back button: "← Back to dashboard"
- Priority badge: "Act now" / "Plan next" / "Consider later" (colored)
- Module badge: Shows which module this action belongs to

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

- **Helpful resources** section:
  - Subheading: "Resources"
  - 2-4 linked resources:
    - Link text (underlined)
    - Format indicator: [PDF] [Checklist] [Guide] [Video]
    - Brief description
  - Example: "Accessible Bathroom Checklist [PDF] - Measure doorways, clearances, and fixtures"

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
- "Save & return to dashboard" button (primary)
- "Next action" button (secondary) - Shows if more actions exist

**System behavior:**
- Loads action by ID from localStorage
- Auto-saves DIAP fields on blur or every 30 seconds
- Evidence uploads stored in evidence table with action_id
- Files stored as base64 in localStorage for MVP (future: cloud storage)

**User action:** 
- Edits DIAP fields → Auto-saved
- Uploads evidence → Stored and displayed
- Clicks "Save & return" → Navigates to /dashboard
- Clicks "Next action" → Navigates to /action/:next_id

---

**Step 8: DIAP Workspace**

**What's on screen:**

**Header:**
- Page title: "Your Disability Inclusion Action Plan"
- Subheading: "Track and manage all your accessibility actions"

**Filters section (horizontal bar):**
- Filter by module: Dropdown (All modules / Physical access / Online / etc.)
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
  - **Module** - Shows module name with colored dot
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
- "Export DIAP" button (secondary)
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

**Step 9: Clarify Later**

**What's on screen:**

**Header:**
- Page title: "Items to clarify later"
- Count badge: "[X] items"
- Subheading: "Questions you weren't sure about—here's how to check each one"

**List of clarification items:**

Each item is a card showing:
- **Module badge** - Shows which module this question belongs to
- **Original question** (bold, 1.1rem) - Exact question text from discovery
- **Why it matters** section:
  - Brief explanation (2-3 sentences) of why knowing this answer helps
  - Example: "Knowing your doorway width helps determine if wheelchair users can access your bathroom independently"
- **How to check** section:
  - Icon: 🔍
  - Step-by-step instructions in plain English
  - Example: "Use a tape measure to measure the narrowest point of the doorway. You need at least 850mm clear width when the door is open."
- **Status indicator:**
  - Unresolved: Orange dot + "Not checked yet"
  - Resolved: Green checkmark + "Resolved on [date]"
- **Action buttons:**
  - "Mark as resolved" button (primary, only if unresolved)
  - "Update my answer" button (secondary) - Opens modal to change answer from "Not sure" to Yes/No

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
- Clicks "Back to dashboard" → Navigates to /dashboard

---

**Step 10: Export & Share**

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
- Generates PDFs using library (e.g., jsPDF or react-pdf)
- **1-Page Summary includes:**
  - Business name and type
  - Date generated
  - "Act now" actions (2-4 items) with:
    - Action title
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

**Step 1:** User lands on homepage → Clicks "Start your free accessibility check"

**Step 2: Business Snapshot**
- Business type: **Café/Restaurant**
- Role: **Owner**
- Physical venue: **Yes**
- Online presence: **Yes**
- Public-facing customers: **Yes**
- System generates session_id: `550e8400-e29b-41d4-a716-446655440000`

**Step 3: Module Selection**
User sees 7 modules, 5 marked "Recommended":
- Physical access ✓ (Recommended)
- Communication and information (Recommended)
- Customer service and staff ✓ (Recommended)
- Online and bookings ✓ (Recommended)
- Wayfinding and signage
- Sensory considerations (Recommended)
- Emergency and safety (Recommended)

User selects: **Physical access, Online and bookings, Customer service and staff**

**Step 4: Discovery Questions**

*Physical Access module (8 questions):*
1. "Is there level access to your entrance?" → **No** + Notes: "2 steps at front door"
2. "Do you have an accessible bathroom?" → **Not sure**
3. "Can someone using a wheelchair move through your main customer areas?" → **Yes** + Notes: "Tables can be rearranged"
4. "Are doorways at least 850mm wide?" → **Not sure**
5. "Is there accessible parking nearby?" → **Yes**
6. "Do you have seating options for people who need to rest?" → **Yes**
7. "Are pathways clear of obstacles?" → **Yes**
8. "Is your counter at an accessible height?" → **No**

*Online and Bookings module (6 questions):*
1. "Can visitors easily find accessibility information on your website?" → **No**
2. "Is your booking system accessible (keyboard navigation, screen readers)?" → **Not sure**
3. "Do you provide accessibility info in confirmation emails?" → **No**
4. "Can customers indicate access needs when booking?" → **No**
5. "Are your menus available online?" → **Yes**
6. "Is your website mobile-friendly?" → **Yes**

*Customer Service and Staff module (5 questions):*
1. "Do you train staff on how to support customers with access needs?" → **No**
2. "Do you ask customers about access needs when they book?" → **Not applicable** (walk-in only)
3. "Can customers contact you to ask about accessibility before visiting?" → **Yes** + Notes: "Phone and email"
4. "Do you have a process for responding to accessibility feedback?" → **Not sure**
5. "Are staff aware of accessible features at your venue?" → **No**

**Questions marked "Not sure" (for Clarify Later):**
- "Do you have an accessible bathroom?" (Physical access)
- "Are doorways at least 850mm wide?" (Physical access)
- "Is your booking system accessible?" (Online and bookings)
- "Do you have a process for accessibility feedback?" (Customer service)

**Step 5: Constraints & Context**
- Budget: **$1,000-$5,000**
- Capacity: **I can do some things myself, but need support for complex items**
- Timeframe: **Now (this month)**
- Additional notes: "We have a renovation planned in 6 months, so some changes might wait until then"

**Step 6: Expected Dashboard Output**

**Act now (4 actions):**
1. Add temporary ramp at entrance | Low effort | $200-500 | Physical access
2. Create accessibility info page on website | Low effort | $0-200 | Online and bookings
3. Staff training session on supporting customers with access needs | Medium effort | $0-500 | Customer service
4. Add accessibility info to confirmation emails | Low effort | $0 | Online and bookings

**Plan next (5 actions):**
1. Measure doorways and bathroom to confirm accessibility | Low effort | $0 | Physical access
2. Lower counter or add accessible service point | Medium effort | $500-2k | Physical access
3. Upgrade bathroom to accessible standard | High effort | $5k-15k | Physical access
4. Add accessibility questions to booking system | Medium effort | $500-2k | Online and bookings
5. Create accessibility feedback process | Low effort | $0-200 | Customer service

**Consider later (3 actions):**
1. Permanent accessible entrance (coordinate with renovation) | High effort | $3k-10k | Physical access
2. Full website accessibility audit | Medium effort | $1k-3k | Online and bookings
3. Develop comprehensive accessibility policy | Medium effort | $0-500 | Customer service

**Clarify later (4 items):**
1. "Do you have an accessible bathroom?" - Module: Physical access
2. "Are doorways at least 850mm wide?" - Module: Physical access
3. "Is your booking system accessible?" - Module: Online and bookings
4. "Do you have a process for accessibility feedback?" - Module: Customer service

---

## Layer 2: Technical Spec

### Session Lifecycle (MVP)

**Session Creation:**
1. User lands on / → No session exists
2. User clicks "Start" → Navigates to /start
3. /start page loads → JavaScript checks localStorage for `access_compass_session_id`
4. If not found → Generate new UUID → Store as `access_compass_session_id`
5. Create session object in localStorage:
```javascript
{
  session_id: "550e8400-e29b-41d4-a716-446655440000",
  created_at: "2025-12-17T10:30:00Z",
  last_updated: "2025-12-17T10:30:00Z",
  business_snapshot: {},
  selected_modules: [],
  discovery_responses: {},
  constraints: {},
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
| Landing | / | Hero, 3-step visual, CTA | Static content |
| Business Snapshot | /start | 5-field form | Creates/updates session.business_snapshot |
| Module Selection | /modules | 7 module cards, checkboxes | Updates session.selected_modules |
| Discovery Questions | /questions | Adaptive question flow | References Question Inventory file, updates session.discovery_responses |
| Constraints | /constraints | 3 dropdowns + textarea, API call | Updates session.constraints, calls Claude API |
| Priority Dashboard | /dashboard | 3 columns of actions, side panels | Displays actions grouped by priority |
| Action Detail | /action/:id | Action details, DIAP form, evidence upload | Displays single action by ID, updates action fields |
| DIAP Workspace | /diap | Table view of all actions, filters | Displays all actions in table format |
| Clarify Later | /clarify | List of "Not sure" items | Displays clarifications where resolved=false |
| Export | /export | PDF previews, download buttons | Generates PDFs from actions data |

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