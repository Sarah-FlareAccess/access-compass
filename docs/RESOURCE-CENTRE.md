# Resource Centre Documentation

## Overview

The Resource Centre is a standalone, browsable library of accessibility guides, tips, standards references, and practical examples. Users can access it anytime via the main navigation, and the Report system links directly to relevant resources when recommendations are made.

**Route:** `/resources`

## Features

### Browse by Category
Four main categories aligned with the discovery modules:
- **Before Arrival** - Website, booking, communication accessibility
- **Getting In** - Parking, paths, entrances, wayfinding
- **During Your Visit** - Interior spaces, facilities, amenities
- **Service & Support** - Staff training, policies, assistance

### Search
Full-text search across:
- Resource titles
- Summaries
- Tips content
- Standards references

### DIAP Category Filter
Filter resources by Disability Inclusion Action Plan categories:
- Attitudes & Engagement
- Liveable Communities
- Employment
- Systems & Processes

### Resource Detail View
Each resource includes collapsible sections:
- **Why It Matters** - Business case and impact statistics
- **Quick Tips** - Actionable implementation guidance
- **How to Check** - Self-assessment instructions
- **Standards Reference** - Australian Standards citations
- **Real-World Examples** - Industry-specific implementations
- **Video Tutorial** - Embedded video content (where available)
- **Helpful Resources** - External links and downloads
- **Related Topics** - Cross-references to other resources

### Report Integration
When the Report shows recommendations for accessibility improvements, it includes clickable links to relevant Resource Centre guides.

## File Structure

```
src/
├── pages/
│   ├── ResourceCentre.tsx      # Main page component
│   └── ResourceCentre.css      # Page styles
├── components/help/
│   ├── ResourceCard.tsx        # Browse card component
│   ├── ResourceCard.css
│   ├── ResourceDetail.tsx      # Full resource view
│   └── ResourceDetail.css
├── data/help/
│   ├── types.ts                # TypeScript interfaces
│   ├── index.ts                # Exports and lookup functions
│   ├── before-arrival.ts       # Before Arrival resources
│   ├── getting-in.ts           # Getting In resources
│   ├── during-visit.ts         # During Visit resources
│   └── service-support.ts      # Service & Support resources
├── utils/
│   └── resourceLinks.ts        # Link generation for reports
└── hooks/
    └── useHelp.ts              # Help state management
```

## Data Model

### HelpContent Interface
```typescript
interface HelpContent {
  questionId: string;           // Links to discovery question (e.g., "A1-F-1")
  questionText: string;         // Original question text
  moduleCode: ModuleCode;       // Module identifier
  moduleGroup: ModuleGroup;     // Category grouping
  diapCategory: DIAPCategory;   // DIAP alignment
  title: string;                // Display title
  summary: string;              // Brief description
  whyItMatters: WhyItMatters;   // Business case content
  tips: HelpTip[];              // Implementation tips
  howToCheck?: HowToCheck;      // Self-assessment guide
  standardsReference?: StandardsReference;  // AS citations
  examples?: HelpExample[];     // Industry examples
  videoUrl?: string;            // Tutorial video
  externalResources?: ExternalResource[];   // Links
  relatedQuestions?: string[];  // Cross-references
}
```

### Module Groups
```typescript
type ModuleGroup =
  | 'before-arrival'
  | 'getting-in'
  | 'during-visit'
  | 'service-support';
```

### DIAP Categories
```typescript
type DIAPCategory =
  | 'attitudes-engagement'
  | 'liveable-communities'
  | 'employment'
  | 'systems-processes';
```

## Current Resources (14 total)

### Before Arrival (3)
| ID | Title |
|----|-------|
| B1-F-1 | Accessible Website Information |
| B1-F-7 | Pre-Visit Communication Options |
| B1-F-8 | Accessible Booking Systems |

### Getting In (3)
| ID | Title |
|----|-------|
| A1-F-1 | Accessible Parking Spaces |
| A2-F-1 | Accessible Pathways |
| A2-F-3 | Clear Wayfinding Signage |

### During Your Visit (4)
| ID | Title |
|----|-------|
| A6-1-6 | Accessible Toilet Facilities |
| A6-1-7 | Ambulant Toilet Provisions |
| A6-1-8 | Unisex Accessible Toilets |
| B3-1-4 | Accessible Seating Options |

### Service & Support (4)
| ID | Title |
|----|-------|
| C1-F-1b | Disability Awareness Training |
| P1-F-2 | Accessible Customer Feedback |
| P1-F-4 | Accessible Complaints Process |
| C1-D-18b | Assistance Animal Policy |

## Adding New Resources

1. **Choose the appropriate data file** based on module group
2. **Create a new HelpContent object** with all required fields
3. **Add to the array** in the data file
4. **The resource automatically appears** in browse, search, and filters

### Example Resource Template
```typescript
{
  questionId: 'XX-X-X',
  questionText: 'Original discovery question text',
  moduleCode: 'ModuleCode',
  moduleGroup: 'module-group',
  diapCategory: 'diap-category',
  title: 'Resource Title',
  summary: 'Brief 1-2 sentence description',
  whyItMatters: {
    mainPoint: 'Key business case statement',
    statistics: [
      { value: 'XX%', description: 'Statistic description' }
    ],
    businessCase: 'Detailed business benefit explanation'
  },
  tips: [
    {
      id: 'tip-1',
      title: 'Tip Title',
      description: 'Detailed implementation guidance',
      difficulty: 'easy', // easy | medium | advanced
      priority: 'high'    // high | medium | low
    }
  ],
  howToCheck: {
    steps: ['Step 1', 'Step 2'],
    tools: ['Tool 1'],
    frequency: 'Monthly'
  },
  standardsReference: {
    code: 'AS1428.1',
    title: 'Standard Title',
    section: 'Section Reference',
    summary: 'What the standard requires'
  },
  examples: [
    {
      businessType: 'retail',
      scenario: 'Example scenario',
      solution: 'How they solved it',
      outcome: 'Result achieved'
    }
  ]
}
```

## URL Parameters

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `resource` | Select specific resource | `/resources?resource=A1-F-1` |
| `category` | Filter by module group | `/resources?category=getting-in` |
| `diap` | Filter by DIAP category | `/resources?diap=liveable-communities` |

## Dependencies

- `lucide-react` - Icons for UI elements
- `react-router-dom` - URL parameter handling

## Styling

The Resource Centre uses a consistent design language:
- **Purple accent** (#7c3aed) for interactive elements
- **Category colors** for visual grouping
- **Card-based layout** for browsing
- **Collapsible sections** for progressive disclosure
- **Responsive design** for mobile devices

## Integration Points

### Report Viewer
`src/components/ReportViewer.tsx` renders resource links as clickable anchors:
```typescript
{issue.resourceLinks.map((link, linkIndex) => {
  const parts = link.split(' → ');
  if (parts.length === 2 && parts[1].startsWith('/')) {
    return <a href={parts[1]} className="resource-link">{parts[0]}</a>;
  }
  return <li>{link}</li>;
})}
```

### Report Generation
`src/hooks/useReportGeneration.ts` uses `getReportResourceLinks()` to attach relevant resources to recommendations.

### Navigation
`src/components/NavBar.tsx` includes the Resources link in main navigation.

## Future Enhancements

Potential additions:
- Video content embedding
- PDF download generation
- Bookmark/favorites system
- Progress tracking for implementations
- Community examples submission
- Multi-language support
