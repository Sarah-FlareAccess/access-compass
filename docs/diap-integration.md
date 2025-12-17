# DIAP Integration

This document explains how Access Compass integrates with Disability Inclusion Action Plans (DIAPs), automatically translating assessment findings into actionable planning.

## Overview

Access Compass bridges the gap between accessibility self-review and formal DIAP development:

```
Assessment → Translation → DIAP
   │              │           │
   │              │           └── Living action workspace
   │              └── Module-to-DIAP section mapping
   └── Module completion with evidence
```

**Key Principle:** Complete a module once, and the findings flow automatically into your DIAP workspace. No double entry.

---

## DIAP Focus Areas

Access Compass modules map to five standard DIAP focus areas based on Australian DIAP frameworks:

| DIAP Section | Description | Mapped Modules |
|--------------|-------------|----------------|
| **Information & Communication** | How accessibility info is shared with customers | B1 - Accessibility Information |
| **Built Environment** | Physical access including entry, movement, facilities | A1-A6 - Entrance, Parking, Paths, Vertical Movement, Wayfinding, Toilets, Sensory |
| **Service Delivery** | How services are provided during visits | D1-D3 - Experience, Service Points, Seating |
| **Customer Service & Training** | Staff knowledge and disability inclusion training | S1-S2 - Staff Awareness, Communication Support |
| **Policy & Procedure** | Organisational policies supporting inclusion | Default for unmapped items |

---

## Module to DIAP Mapping

### Before the Visit
| Module | Code | DIAP Section |
|--------|------|--------------|
| Accessibility Information | B1 | Information & Communication |

### Getting In and Around
| Module | Code | DIAP Section |
|--------|------|--------------|
| Getting In / Entrance | A1 | Built Environment |
| Parking | A2 | Built Environment |
| Paths and Aisles | A3a | Built Environment |
| Vertical Movement | A3b | Built Environment |
| Wayfinding | A4 | Built Environment |
| Accessible Toilets | A5 | Built Environment |
| Sensory Environment | A6 | Built Environment |

### During the Visit
| Module | Code | DIAP Section |
|--------|------|--------------|
| Experience | D1 | Service Delivery |
| Service Points | D2 | Service Delivery |
| Seating | D3 | Service Delivery |

### Service and Support
| Module | Code | DIAP Section |
|--------|------|--------------|
| Staff Awareness | S1 | Customer Service & Training |
| Communication Support | S2 | Customer Service & Training |

---

## Evidence Layer

When a module is completed, the following metadata becomes DIAP evidence:

| Evidence Field | Source | Example |
|----------------|--------|---------|
| Module name | Module definition | "Accessible Entrance" |
| Completion date | Auto-captured | "15 Dec 2024" |
| Completed by | User input | "Jane Smith" |
| Role | User input | "Operations Manager" |
| Confidence snapshot | Calculated | "Strong" / "Mixed" / "Needs Work" |
| Strengths count | Summary | "5 strengths" |
| Actions count | Summary | "3 actions" |

### Viewing Evidence

**DIAP Workspace** displays evidence in two views:

1. **List View** - All completed modules in a single list
2. **By Section View** - Modules grouped by DIAP focus area

Toggle between views using the view mode buttons in the workspace header.

---

## Action Items Flow

### From Module to DIAP

When you complete a module:

1. **"No" answers** generate priority actions
2. **Safety-related items** are marked high priority
3. **Actions auto-populate** in DIAP workspace
4. **Module source** is tracked for each action

### Priority Levels

| Priority | Criteria | Suggested Timeframe |
|----------|----------|---------------------|
| **High** | Safety-related or critical access | Within 1 month |
| **Medium** | Standard accessibility improvement | Within 3 months |
| **Low** | Enhancement or nice-to-have | Within 6 months |

### Action Item Structure

Each DIAP action includes:

```typescript
{
  id: string;
  title: string;           // Action description
  description: string;     // Context and details
  category: string;        // DIAP section
  priority: 'high' | 'medium' | 'low';
  status: 'not-started' | 'in-progress' | 'completed';
  moduleSource: string;    // Which module generated this
  createdAt: string;
  updatedAt: string;
}
```

---

## DIAP Workspace Features

### Current Features

- **View all actions** from completed modules
- **Filter by DIAP section** (Built Environment, Service Delivery, etc.)
- **Filter by priority** (High, Medium, Low)
- **Filter by status** (Not Started, In Progress, Completed)
- **Evidence layer** showing module completion metadata
- **Edit actions** - modify title, description, priority
- **Update status** - track progress on actions

### Suggested Actions

Actions generated from modules appear as **editable drafts**:
- Review and refine the auto-generated text
- Adjust priority if needed
- Add specific details relevant to your venue
- Mark as "not applicable" if not relevant

---

## Integration Benefits

### No Double Entry
- Complete assessment once
- Findings automatically appear in DIAP
- Evidence tracked consistently

### Accountability Trail
- Know who completed each assessment
- Track when evidence was gathered
- Link actions to source modules

### Standard Structure
- Aligns with Australian DIAP frameworks
- Consistent categorisation
- Easier reporting and compliance

### Living Document
- DIAP updates as you complete modules
- Progress visible in real-time
- Actions can be refined over time

---

## Workflow Example

### 1. Complete Module
```
Module: Accessible Entrance (A1)
Responses: 8 Yes, 2 No, 1 Not Sure
Confidence: Mixed
Completed by: Jane Smith (Operations Manager)
```

### 2. Auto-Generated Evidence
```
DIAP Section: Built Environment
Evidence Source: Access Compass - Accessible Entrance module
Completed: 15 Dec 2024 by Jane Smith
Confidence: Mixed (73% positive responses)
```

### 3. Auto-Generated Actions
```
Action 1: Ensure entrance door has minimum 850mm clear width
Priority: High (safety-related)
Timeframe: Within 1 month
Source: Accessible Entrance module

Action 2: Provide clear signage for accessible entry
Priority: Medium
Timeframe: Within 3 months
Source: Accessible Entrance module
```

### 4. Review in DIAP Workspace
- Actions appear in "Built Environment" section
- Evidence shows module completion details
- Edit actions as needed
- Update status as work progresses

---

## Technical Implementation

### Mapping File
Module-to-DIAP mapping is defined in:
```
src/data/diapMapping.ts
```

### Key Functions

```typescript
// Get DIAP section for a module
getDIAPSectionForModule(moduleId: string): DIAPSection

// Get all modules in a DIAP section
getModulesForDIAPSection(diapSectionId: string): string[]

// Group items by DIAP section
groupItemsByDIAPSection<T>(items: T[]): Record<string, T[]>
```

### DIAP Sections Constant

```typescript
const DIAP_SECTIONS = [
  { id: 'information-communication', name: 'Information & Communication' },
  { id: 'built-environment', name: 'Built Environment' },
  { id: 'service-delivery', name: 'Service Delivery' },
  { id: 'customer-service-training', name: 'Customer Service & Training' },
  { id: 'policy-procedure', name: 'Policy & Procedure' },
];
```

---

## Related Documentation

- [Module Ownership](./module-ownership.md) - Assignment and completion tracking
- [Report Generation](./reports.md) - Understanding report content
- [Question Flow](./question-flow.md) - How module reviews work
