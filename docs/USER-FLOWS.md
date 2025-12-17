# Access Compass - User Flows

This document outlines the two main user journeys through Access Compass: the guided discovery flow and the manual module selection flow.

---

## Overview

Access Compass offers two pathways for users to begin their accessibility self-review:

1. **Guided Discovery** - Recommended for most users
2. **Manual Module Selection** - For users who know what they want to review

Both pathways converge at the calibration and pathway selection steps before reaching the dashboard.

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        START (/start)                           │
│                    Business Snapshot Setup                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DISCOVERY (/discovery)                     │
│        "Let's understand where accessibility shows up           │
│                     in your business"                           │
│                                                                 │
│   [Select touchpoints]              [Skip discovery and         │
│   [Continue →]                       choose modules manually]   │
└─────────────────────────────────────────────────────────────────┘
         │                                      │
         │                                      ▼
         │                    ┌─────────────────────────────────┐
         │                    │    MODULE SELECTION (/modules)  │
         │                    │     "Choose your modules"       │
         │                    │                                 │
         │                    │  • 17 modules in 4 groups       │
         │                    │  • Select all / Select group    │
         │                    │  • Shows estimated time         │
         │                    │                                 │
         │                    │  [← Back]        [Continue →]   │
         │                    └─────────────────────────────────┘
         │                                      │
         ▼                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                 CALIBRATION QUESTIONS                           │
│              "A few quick questions..."                         │
│                                                                 │
│   • Budget range                                                │
│   • Work approach (solo, team, external)                        │
│   • Action timing                                               │
│                                                                 │
│   [← Back]                                      [Continue →]    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PATHWAY SELECTION                            │
│           "How far do you want to take this?"                   │
│                                                                 │
│   ┌─────────────────┐    ┌─────────────────┐                   │
│   │   PULSE CHECK   │    │    DEEP DIVE    │                   │
│   │                 │    │                 │                   │
│   │ Quick overview  │    │ Comprehensive   │                   │
│   │ ~10-15 min/mod  │    │ ~18-25 min/mod  │                   │
│   └─────────────────┘    └─────────────────┘                   │
│                                                                 │
│   [← Back]                      [Continue with {selected} →]    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DASHBOARD (/dashboard)                     │
│                                                                 │
│   • Overall progress                                            │
│   • Module cards with status indicators                         │
│   • Review Discovery link                                       │
│   • View Report / View DIAP buttons                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flow 1: Guided Discovery (Recommended)

### Step 1: Discovery
**Route:** `/discovery`

Users select touchpoints that describe how customers interact with their business:
- Finding you online
- Booking or reserving
- Getting in (arrival, parking)
- Moving around inside
- Using services
- etc.

The system recommends relevant modules based on selections.

### Step 2: Calibration
**Route:** `/discovery` (step 2)

Quick questions to tailor recommendations:
- **Budget:** What resources are available?
- **Work approach:** Working alone, with team, or external support?
- **Timing:** Ready to act now or exploring?

### Step 3: Pathway Selection
**Route:** `/discovery` (step 3)

Choose review depth:

| Pathway | Description | Time per Module |
|---------|-------------|-----------------|
| **Pulse Check** | Quick overview, key questions only | ~10-15 minutes |
| **Deep Dive** | Comprehensive review, all questions | ~18-25 minutes |

### Step 4: Dashboard
**Route:** `/dashboard`

Modules are automatically selected based on discovery responses.

---

## Flow 2: Manual Module Selection

### Step 1: Skip Discovery
From the discovery page, click **"Skip discovery and choose modules manually"**

### Step 2: Module Selection
**Route:** `/modules`

Select from all 17 modules organised by journey phase:

#### Before They Arrive (4 modules)
| Code | Module | Time |
|------|--------|------|
| B1 | Pre-visit information | 12 min |
| B4.1 | Website basics | 15 min |
| B4.2 | Booking systems and forms | 10 min |
| B4.3 | Video and social media | 10 min |

#### Getting In and Moving Around (4 modules)
| Code | Module | Time |
|------|--------|------|
| A1 | Arrival, parking and drop-off | 15 min |
| A2 | Entry and doors | 12 min |
| A3a | Paths and aisles | 12 min |
| A3b | Queues and busy times | 10 min |

#### During the Visit (5 modules)
| Code | Module | Time |
|------|--------|------|
| A4 | Seating, furniture and layout | 12 min |
| A5 | Toilets and amenities | 15 min |
| A6 | Lighting, sound and sensory environment | 12 min |
| B2 | Signage and wayfinding | 12 min |
| B3 | Menus and printed materials | 10 min |

#### Service and Support (4 modules)
| Code | Module | Time |
|------|--------|------|
| C1 | Customer service and staff confidence | 15 min |
| C2 | Bookings, payments and flexibility | 10 min |
| A7 | Safety and emergencies | 12 min |
| C3 | Learning from your customers | 10 min |

**Features:**
- Select individual modules
- "Select all" for entire groups
- "Select all modules" for everything
- Shows total estimated time

### Step 3: Calibration
**Route:** `/discovery?step=calibration`

Same calibration questions as guided flow.

### Step 4: Pathway Selection
Same pathway selection as guided flow.

### Step 5: Dashboard
**Route:** `/dashboard`

Selected modules appear ready for review.

---

## Navigation Summary

| From | Back Button Goes To |
|------|---------------------|
| Discovery | /start |
| Module Selection | /discovery |
| Calibration (from discovery) | Discovery touchpoints |
| Calibration (from modules) | /modules |
| Pathway Selection | Calibration |

---

## Review Modes Comparison

| Feature | Pulse Check | Deep Dive |
|---------|-------------|-----------|
| Question depth | Foundation questions only | All questions including detailed |
| Time per module | ~10-15 minutes | ~18-25 minutes |
| Best for | Quick assessment, getting started | Comprehensive review, DIAP preparation |
| Output | Priority actions | Full action plan with evidence |

---

## Technical Implementation

### Routes
- `/start` - Business snapshot
- `/discovery` - Discovery flow (3 steps)
- `/discovery?step=calibration` - Direct to calibration (from manual selection)
- `/modules` - Manual module selection
- `/dashboard` - Main working area
- `/questions` - Module question flow
- `/diap` - DIAP action plan
- `/export` - Export reports

### State Management
- Session data stored in localStorage
- Discovery data includes:
  - Selected touchpoints
  - Calibration responses
  - Review mode (pulse-check / deep-dive)
  - Selected/recommended modules

---

*Access Compass by Flare Access*
