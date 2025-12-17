# Access Compass

A guided self-review and action planning tool for accessibility improvements, developed by Flare Access.

## Overview

Access Compass helps organisations understand where accessibility matters in their business and create practical, prioritised action plans. It is **not** a compliance audit or certification tool—it's a starting point for building more accessible experiences.

---

## User Flow

### 1. Landing Page
- Introduction to Access Compass
- Key message: "Accessibility is a journey, not a one-off task"
- Four feature highlights explaining how the tool helps

### 2. Disclaimer
- Clear explanation of what Access Compass is and isn't
- Checkbox acknowledgment required before proceeding
- Recommendation to engage professionals for complex issues

### 3. Organisation Details (`/start`)
- Organisation name
- Organisation size (Small: 1-20, Medium: 21-100, Large: 100+)
- Organisation type (multi-select):
  - Attractions
  - Leisure & Recreation
  - Hospitality
  - Events & Venues
  - Retail
  - Local Government
  - Health & Wellness
  - Education & Training
- Role, venue type, online presence questions

### 4. Discovery (`/discovery`)

#### Touchpoint Selection
- Title: "Let's understand where accessibility shows up in your business"
- Three journey phases:
  - **Before arrival** - Planning and booking
  - **During visit** - On-site experience
  - **After visit** - Staying connected
- Sub-touchpoints auto-expand when parent is selected

#### Module Recommendations
- All modules displayed as categorised tiles:
  - Before visit
  - During visit
  - After visit
- Shows module name, code, time estimate, and "why suggested"

### 5. Pathway Selection

Two pathways available:

#### Pulse Check (Foundation)
- "Get clear direction fast"
- Quick compass check showing:
  - Where you're already doing well
  - Most important gaps
  - Top actions for biggest difference
- Deliverables: Clear prioritised actions, confidence about next steps, practical starting point
- Best for: Getting started, limited time, small sites

#### Deep Dive (Detailed)
- "Build a structured plan you can actually deliver"
- Detailed navigation guide helping you:
  - Translate gaps into actions and responsibilities
  - Track progress over time
  - Build realistic, staged roadmap
- Deliverables: DIAP-style action plan, assigned actions with timeframes, comprehensive roadmap
- Best for: Complex sites, planning ahead, deeper implementation

### 6. Optional Questions
- Budget range for accessibility improvements
- Priority timeframe (immediate, this year, future, exploring)
- Skippable if unsure

### 7. Module Selection (`/modules`)
- Choose which modules to review
- Modules organised by journey phase

### 8. Questions (`/questions`)
- Module-by-module assessment
- Branching logic based on responses
- Progress tracking across modules

### 9. Dashboard (`/dashboard`)
- Overall progress overview
- Modules by journey phase
- Priority actions
- DIAP summary
- Quick actions

---

## Key Features

### Reminder Banners
Contextual reminders throughout the experience:
- **Info** (purple) - General self-review reminders
- **Guidance** (amber) - Tips for honest answering
- **Professional** (blue) - Suggestions to consult professionals

### DIAP (Disability Inclusion Action Plan)
- Auto-generated from question responses
- Categories: Physical Access, Digital Access, Communication, Service & Training
- Status tracking: Not started, In progress, Completed
- Priority levels: High, Medium, Low

### Module Categories

| Code | Module | Group |
|------|--------|-------|
| A1 | Arrival & Parking | Getting In |
| A2 | Entry & Doors | Getting In |
| A3 | Internal Movement & Wayfinding | Getting In |
| A6 | Seating, Amenities & Toilets | During Visit |
| A7 | Sensory Environment | During Visit |
| B1 | Pre-visit Information | Before Arrival |
| B4.1 | Website & Digital Accessibility | Before Arrival |
| C1 | Customer Service & Staff Confidence | Service & Support |
| C3 | Feedback & Complaints | Service & Support |

---

## Technical Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: CSS with CSS Variables (custom properties)
- **State**: React hooks + localStorage persistence
- **Database**: Supabase (optional)

---

## Design System

### Colours
```css
--deep-purple: #2d1b4e
--medium-purple: #4c1d6e
--light-purple: #7c3aed
--coral-accent: #d97756
--charcoal: #2d2d2d
--steel-gray: #4a4a4a
--ivory: #f5f3f0
```

### Gradients
- **Primary**: Dark purple to medium purple to muted coral
- **Button**: Purple to light purple to coral accent

### Typography
- System font stack (Apple, Segoe UI, Roboto)
- Bold headings (700-800 weight)
- Clear hierarchy with generous spacing

---

## File Structure

```
src/
├── components/
│   ├── discovery/
│   │   ├── DiscoveryModule.tsx
│   │   ├── JourneyPhaseSection.tsx
│   │   ├── ModuleRecommendationCard.tsx
│   │   ├── ReviewModeSelection.tsx
│   │   ├── OptionalQuestions.tsx
│   │   └── discovery.css
│   ├── questions/
│   └── ReminderBanner.tsx
├── pages/
│   ├── Landing.tsx
│   ├── Disclaimer.tsx
│   ├── BusinessSnapshot.tsx
│   ├── Discovery.tsx
│   ├── ModuleSelection.tsx
│   ├── DiscoveryQuestions.tsx
│   ├── Dashboard.tsx
│   ├── DIAPWorkspace.tsx
│   └── Export.tsx
├── data/
│   ├── accessModules.ts
│   ├── touchpoints.ts
│   └── modules.ts
├── hooks/
│   ├── useModuleProgress.ts
│   ├── useDIAPManagement.ts
│   └── useBranchingLogic.ts
├── lib/
│   └── recommendationEngine.ts
├── styles/
│   ├── global.css
│   ├── landing.css
│   ├── disclaimer.css
│   ├── form-page.css
│   ├── questions.css
│   └── dashboard.css
├── types/
│   └── index.ts
└── utils/
    └── session.ts
```

---

## Session Storage

Data persisted in localStorage:
- `access_compass_session` - Main session data
- `access_compass_discovery` - Discovery selections and recommendations
- `access_compass_actions` - Generated actions
- `access_compass_evidence` - Uploaded evidence
- `access_compass_clarifications` - Items marked for follow-up

---

## Key Principles

1. **Not a compliance tool** - Self-review for planning, not certification
2. **Journey-focused** - Organised around customer experience phases
3. **Outcome-driven** - Focus on practical, achievable improvements
4. **Accessible by design** - WCAG AAA colour contrast, clear navigation
5. **Non-judgemental language** - No failure/risk framing, supportive tone

---

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Landing | Home page |
| `/disclaimer` | Disclaimer | Terms acknowledgment |
| `/start` | BusinessSnapshot | Organisation details |
| `/discovery` | Discovery | Touchpoint selection & pathway |
| `/modules` | ModuleSelection | Choose review modules |
| `/questions` | DiscoveryQuestions | Module assessments |
| `/dashboard` | Dashboard | Results overview |
| `/diap` | DIAPWorkspace | Action plan management |
| `/export` | Export | Download reports |

---

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

---

## Licence

Proprietary - Flare Access
