# Access Compass - Contextual Help & Resource System

## Overview

A contextual help system that provides users with guidance, examples, standards references, and media content as they answer discovery questions. The system should feel supportive and educational while reducing cognitive overload through progressive disclosure.

**Key Principles:**
- Help content appears when needed, not all at once
- Information is layered: summary → details → resources
- Australian standards and guidelines are referenced where applicable
- Real-world examples help users understand practical application
- Content adapts to business context where possible

---

## Technical Requirements

### Stack
- React 18+ with TypeScript
- Tailwind CSS (existing)
- Vaul for mobile bottom sheet: `npm install vaul`
- Lucide React icons (existing)

### Integration Points
- Integrates with existing `QuestionFlow.tsx` component
- Uses existing question IDs from `accessModules.ts`
- Leverages existing responsive patterns
- Connects to DIAP category system for cross-referencing

---

## File Structure

```
/src
  /components
    /help
      HelpPanel.tsx              # Container - handles responsive rendering
      HelpPanelDesktop.tsx       # Side panel for desktop (≥1024px)
      HelpPanelMobile.tsx        # Bottom sheet for mobile (<1024px)
      HelpContent.tsx            # Main content renderer
      HelpSection.tsx            # Collapsible section component
      HelpImage.tsx              # Image with loading state, alt text, zoom
      HelpVideo.tsx              # YouTube embed with privacy mode
      HelpTipCard.tsx            # Individual tip card
      HelpChecklist.tsx          # How-to-check steps
      HelpExamples.tsx           # Business type examples
      HelpResources.tsx          # External resource links
      HelpRelated.tsx            # Related questions navigation
  /data
    /help
      index.ts                   # Export all help content + lookup functions
      types.ts                   # TypeScript interfaces
      before-arrival.ts          # B1, B4.1, B4.2, B4.3 modules
      getting-in.ts              # A1, A2, A3a, A3b modules
      during-visit.ts            # A4, A5, A6, B2, B3 modules
      service-support.ts         # C1, C2, A7, C3, P1 modules
  /hooks
    useHelp.ts                   # Help panel state management
    useHelpContent.ts            # Content fetching with caching
/public
  /images
    /help
      /before-arrival            # Pre-visit, website, booking, social media
      /getting-in                # Parking, entrance, paths, queues
      /during-visit              # Seating, toilets, sensory, signage, menus
      /service-support           # Customer service, payments, safety, policy
      placeholder.svg            # Fallback image
```

---

## TypeScript Types

### `/src/data/help/types.ts`

```typescript
/**
 * Help Content Type Definitions
 *
 * Aligned with Access Compass module structure and question IDs
 * from accessModules.ts
 */

// Module groups matching accessModules.ts
export type ModuleGroup =
  | 'before-arrival'
  | 'getting-in'
  | 'during-visit'
  | 'service-support';

// Module codes matching accessModules.ts
export type ModuleCode =
  | 'B1' | 'B4.1' | 'B4.2' | 'B4.3'           // Before arrival
  | 'A1' | 'A2' | 'A3a' | 'A3b'               // Getting in
  | 'A4' | 'A5' | 'A6' | 'B2' | 'B3'          // During visit
  | 'C1' | 'C2' | 'A7' | 'C3' | 'P1';         // Service & support

// DIAP categories for cross-referencing
export type DIAPCategory =
  | 'physical-access'
  | 'information-communication-marketing'
  | 'customer-service'
  | 'operations-policy-procedure'
  | 'people-culture';

// Business types for contextual examples
export type BusinessType =
  | 'accommodation'
  | 'restaurant-cafe'
  | 'attraction'
  | 'retail'
  | 'tour-operator'
  | 'event-venue'
  | 'local-government'
  | 'health-wellness'
  | 'general';

// Standards that may be referenced
export type StandardReference =
  | 'AS1428.1'           // Design for access and mobility - General requirements
  | 'AS1428.2'           // Design for access and mobility - Enhanced provisions
  | 'AS1428.4.1'         // Tactile ground surface indicators
  | 'AS1428.5'           // Communication for people who are deaf or hard of hearing
  | 'Access-to-Premises' // Disability (Access to Premises – Buildings) Standards 2010
  | 'WCAG2.1-AA'         // Web Content Accessibility Guidelines 2.1 Level AA
  | 'WCAG2.2-AA'         // Web Content Accessibility Guidelines 2.2 Level AA
  | 'DDA'                // Disability Discrimination Act 1992
  | 'NCC';               // National Construction Code

export interface HelpContent {
  /** Must match question ID from accessModules.ts (e.g., 'B1-F-1', 'A2-F-3') */
  questionId: string;

  /** The question text this help relates to (for verification) */
  questionText: string;

  /** Module code (e.g., 'B1', 'A2') */
  moduleCode: ModuleCode;

  /** Module group for categorisation */
  moduleGroup: ModuleGroup;

  /** DIAP category this maps to */
  diapCategory: DIAPCategory;

  /** Help panel title */
  title: string;

  /** 1-2 sentence plain English summary - always visible */
  summary: string;

  /** Why this matters section - visible by default */
  whyItMatters: WhyItMatters;

  /** Quick tips - always visible */
  tips: HelpTip[];

  /** How to check/verify - collapsible */
  howToCheck?: HowToCheck;

  /** Australian standards reference - collapsible */
  standardsReference?: StandardsReference;

  /** Business-type specific examples - collapsible */
  examples?: HelpExample[];

  /** Primary image */
  image?: HelpImage;

  /** Additional images (gallery) */
  additionalImages?: HelpImage[];

  /** Video content */
  video?: HelpVideo;

  /** External resources */
  resources?: HelpResource[];

  /** Related question IDs for navigation */
  relatedQuestions?: RelatedQuestion[];

  /** Keywords for search functionality */
  keywords?: string[];

  /** Last updated date for content freshness */
  lastUpdated?: string;
}

export interface WhyItMatters {
  /** Main explanation */
  text: string;

  /** Optional statistic to emphasise importance */
  statistic?: {
    value: string;
    context: string;
    source?: string;
  };

  /** Optional quote from lived experience */
  quote?: {
    text: string;
    attribution: string;
  };
}

export interface HelpTip {
  /** Lucide icon name */
  icon: string;

  /** Tip text - keep concise */
  text: string;

  /** Optional: expand on hover/click */
  detail?: string;

  /** Priority for ordering (1 = most important) */
  priority?: number;
}

export interface HowToCheck {
  /** Section title */
  title: string;

  /** Step-by-step instructions */
  steps: HowToCheckStep[];

  /** What you'll need (e.g., tape measure) */
  tools?: string[];

  /** Estimated time to complete */
  estimatedTime?: string;
}

export interface HowToCheckStep {
  /** Step instruction */
  text: string;

  /** Optional image for this step */
  image?: HelpImage;

  /** Optional measurement guidance */
  measurement?: {
    target: string;
    acceptable: string;
    unit: string;
  };
}

export interface StandardsReference {
  /** Primary standard */
  primary: {
    code: StandardReference;
    section?: string;
    requirement: string;
  };

  /** Additional related standards */
  related?: {
    code: StandardReference;
    relevance: string;
  }[];

  /** Plain English interpretation */
  plainEnglish: string;

  /** Important note about compliance */
  complianceNote?: string;
}

export interface HelpExample {
  /** Business type this example applies to */
  businessType: BusinessType;

  /** Business type display label */
  businessTypeLabel: string;

  /** The scenario/challenge */
  scenario: string;

  /** What they did */
  solution: string;

  /** Outcome/result (optional) */
  outcome?: string;

  /** Approximate cost if relevant */
  cost?: string;

  /** Time to implement if relevant */
  timeframe?: string;
}

export interface HelpImage {
  /** Image source path (relative to /public) */
  src: string;

  /** Descriptive alt text (required) */
  alt: string;

  /** Optional caption */
  caption?: string;

  /** Image type for styling */
  type?: 'photo' | 'diagram' | 'comparison' | 'measurement';

  /** Credit/source */
  credit?: string;
}

export interface HelpVideo {
  /** YouTube video ID */
  youtubeId: string;

  /** Video title */
  title: string;

  /** Duration (e.g., "3:45") */
  duration: string;

  /** Brief description */
  description?: string;

  /** Transcript available? */
  hasTranscript?: boolean;

  /** Captions available? */
  hasCaptions?: boolean;
}

export interface HelpResource {
  /** Resource title */
  title: string;

  /** URL */
  url: string;

  /** Resource type */
  type: 'pdf' | 'guide' | 'checklist' | 'video' | 'website' | 'tool' | 'template';

  /** Source organisation */
  source: string;

  /** Brief description */
  description?: string;

  /** Is this an Australian resource? */
  isAustralian?: boolean;

  /** Is this free? */
  isFree?: boolean;
}

export interface RelatedQuestion {
  /** Question ID */
  questionId: string;

  /** Question text (for display) */
  questionText: string;

  /** Why it's related */
  relationship: string;

  /** Module code */
  moduleCode: ModuleCode;
}

// Lookup function types
export type GetHelpByQuestionId = (questionId: string) => HelpContent | undefined;
export type GetHelpByModule = (moduleCode: ModuleCode) => HelpContent[];
export type GetHelpByDIAPCategory = (category: DIAPCategory) => HelpContent[];
export type SearchHelp = (query: string) => HelpContent[];
```

---

## Component Specifications

### HelpPanel.tsx (Container)

```typescript
interface HelpPanelProps {
  /** Question ID to show help for */
  questionId: string;

  /** Whether panel is open */
  isOpen: boolean;

  /** Close handler */
  onClose: () => void;

  /** Optional: current business types for contextual examples */
  businessTypes?: BusinessType[];

  /** Optional: callback when user navigates to related question */
  onNavigateToQuestion?: (questionId: string) => void;
}
```

**Behaviour:**
- Desktop (≥1024px): Renders `HelpPanelDesktop` as right side panel
- Mobile (<1024px): Renders `HelpPanelMobile` as bottom sheet via Vaul
- Smooth enter/exit animations (300ms ease-out)
- Focus trap when open
- Close triggers: X button, Escape key, click outside (mobile), swipe down (mobile)
- Returns focus to trigger element on close

### HelpPanelDesktop.tsx

**Layout:**
- Position: Fixed, right side of viewport
- Width: 420px (can expand to 520px with "Expand" button)
- Height: calc(100vh - header height)
- Z-index: 50 (above content, below modals)

**Visual:**
- Background: White (#ffffff)
- Border: 1px solid #e0e0e0 on left edge
- Shadow: -4px 0 20px rgba(0, 0, 0, 0.1)
- Border radius: 0 (full height panel)

**Header:**
- Height: 64px
- Title: Help content title
- Close button: 44×44px touch target, top right
- Optional expand/collapse button

**Content:**
- Scrollable area with padding: 24px
- Smooth scroll behaviour
- Scroll shadow indicators (top/bottom)

### HelpPanelMobile.tsx (using Vaul)

**Behaviour:**
- Snap points: [0.5, 0.92] (50% and 92% of viewport)
- Default open at 50%
- Dismiss on swipe down past threshold
- Background overlay: rgba(0, 0, 0, 0.4)

**Visual:**
- Background: White
- Border radius: 20px 20px 0 0
- Grabber: 40px × 4px, centered, #d1d5db, margin-top 12px
- Safe area padding at bottom

**Footer:**
- Sticky "Got it" button at bottom
- Full width, 48px height
- Safe area padding

### HelpContent.tsx

**Section Order (progressive disclosure):**

1. **Title** (always visible)
   - h2, 1.5rem, font-weight 700

2. **Summary** (always visible)
   - 1-2 sentences, 1rem, line-height 1.6

3. **Why It Matters** (always visible, collapsible detail)
   - Icon + heading
   - Main text
   - Optional statistic card
   - Optional quote

4. **Tips** (always visible)
   - 3-5 tips as cards
   - Icon + text format
   - Expandable detail on tap

5. **Image** (if available, lazy loaded)
   - Full width with aspect ratio
   - Alt text visible on hover/focus
   - Tap to zoom (lightbox)

6. **How to Check** (collapsible, default closed)
   - Numbered steps
   - Optional tools list
   - Optional measurements

7. **Standards Reference** (collapsible, default closed)
   - Standard code + section
   - Plain English interpretation
   - Compliance note

8. **Examples** (collapsible, default open if matches user's business type)
   - Filterable by business type
   - Scenario → Solution → Outcome format

9. **Video** (if available, collapsible)
   - YouTube embed (privacy-enhanced)
   - Play button overlay until clicked
   - Duration badge

10. **Resources** (collapsible, default closed)
    - Grouped by type
    - External link indicators
    - Source organisation

11. **Related Questions** (always visible if available)
    - Compact list
    - Click to navigate

12. **Feedback** (always visible)
    - "Was this helpful?" with thumbs up/down
    - Tracks for analytics

---

## Sample Help Content

### `/src/data/help/before-arrival.ts`

```typescript
import { HelpContent, HelpExample } from './types';

export const beforeArrivalHelp: HelpContent[] = [
  // B1: Pre-visit Information
  {
    questionId: 'B1-F-1',
    questionText: 'Do you have accessibility information available for customers before they visit?',
    moduleCode: 'B1',
    moduleGroup: 'before-arrival',
    diapCategory: 'information-communication-marketing',
    title: 'Pre-visit Accessibility Information',
    summary: 'Sharing accessibility information before customers visit helps them plan confidently and shows your venue is welcoming to everyone.',

    whyItMatters: {
      text: 'People with disabilities often spend significant time researching venues before visiting. Clear, detailed accessibility information reduces anxiety, prevents wasted trips, and demonstrates your commitment to inclusion.',
      statistic: {
        value: '4.4 million',
        context: 'Australians have a disability—that\'s 1 in 5 people. Many more travel with someone who does.',
        source: 'ABS Survey of Disability, Ageing and Carers 2018'
      },
      quote: {
        text: 'When I can\'t find accessibility info, I assume the worst and go somewhere else.',
        attribution: 'Wheelchair user, Tourism Research Australia study'
      }
    },

    tips: [
      {
        icon: 'globe',
        text: 'Create a dedicated accessibility page on your website',
        detail: 'Don\'t bury this in FAQs—make it prominent in your main navigation.',
        priority: 1
      },
      {
        icon: 'camera',
        text: 'Include photos of your entrance, pathways, and accessible features',
        detail: 'Photos help people assess if your venue works for their specific needs.',
        priority: 2
      },
      {
        icon: 'list-checks',
        text: 'Be specific, not vague—list actual features and measurements',
        detail: '"We\'re accessible" is less useful than "Level entry via Smith St, accessible bathroom on ground floor, hearing loop at reception."',
        priority: 3
      },
      {
        icon: 'phone',
        text: 'Provide contact details for accessibility questions',
        detail: 'Some people prefer to call and discuss their specific requirements.',
        priority: 4
      },
      {
        icon: 'refresh-cw',
        text: 'Keep information current—update when things change',
        detail: 'Outdated information erodes trust. Review quarterly.',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Audit your current accessibility information',
      steps: [
        {
          text: 'Search your website for "accessibility" or "access"—can you find relevant information easily?'
        },
        {
          text: 'Check your main navigation—is there a link to accessibility info (not just in the footer)?'
        },
        {
          text: 'Review the content: Does it answer the key questions below?',
        },
        {
          text: 'Key questions to answer: How do I get in? Is there parking? Where\'s the bathroom? Can I get help if needed?'
        },
        {
          text: 'Test from a customer perspective: Could someone plan a visit using only your online information?'
        }
      ],
      estimatedTime: '15-20 minutes'
    },

    standardsReference: {
      primary: {
        code: 'DDA',
        requirement: 'The Disability Discrimination Act requires businesses to provide information in accessible ways and not discriminate in the provision of services.'
      },
      related: [
        {
          code: 'WCAG2.1-AA',
          relevance: 'Your accessibility page itself should be accessible—proper headings, alt text on images, readable contrast.'
        }
      ],
      plainEnglish: 'While there\'s no specific legal requirement to have an accessibility page, providing clear information demonstrates compliance with DDA obligations to make services accessible.',
      complianceNote: 'This is about going beyond minimum compliance to genuinely welcome customers with disabilities.'
    },

    examples: [
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A boutique hotel had no accessibility information online. Potential guests would call with detailed questions, taking up staff time.',
        solution: 'Created a comprehensive accessibility page with: room-by-room access features with photos, bathroom dimensions, parking info with distance to entrance, nearest accessible public transport, and a form for guests to submit specific questions.',
        outcome: 'Phone enquiries about accessibility dropped 60%, and the hotel received positive feedback from guests who appreciated being able to plan in advance.',
        timeframe: '1-2 days to create'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A restaurant frequently had wheelchair users arrive only to find they couldn\'t fit between tables.',
        solution: 'Added a simple "Access" section to their website: photos of the entrance (showing one step), a note about their portable ramp, table spacing info, and accessible bathroom location.',
        outcome: 'Wheelchair users now call ahead to request the ramp, and the restaurant has a table ready with appropriate spacing.',
        cost: 'Free (just time to write and photograph)'
      },
      {
        businessType: 'tour-operator',
        businessTypeLabel: 'Tour Operator',
        scenario: 'A walking tour company received complaints from customers who didn\'t realise how much walking was involved.',
        solution: 'Created an "Accessibility & Fitness" section for each tour listing: exact distances, terrain type, number of rest stops, accessibility of toilets en route, and whether a mobility scooter could manage the path.',
        outcome: 'Complaints dropped significantly, and they developed a seated vehicle alternative for two of their most popular tours.',
        timeframe: '3-4 hours to audit and document all tours'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Museum/Gallery',
        scenario: 'A regional gallery assumed their heritage building meant they couldn\'t do much about accessibility.',
        solution: 'Documented everything honestly: "Main entrance has 3 steps—accessible entrance via rear car park with buzzer. Ground floor fully accessible. Upper gallery accessible via platform lift (staff operated). Accessible bathroom available."',
        outcome: 'Visitors appreciated the honesty and were able to plan their visit accordingly. Some said they visited specifically because the information was so clear.',
        cost: 'Free (documentation only)'
      }
    ],

    image: {
      src: '/images/help/before-arrival/accessibility-page-example.png',
      alt: 'Screenshot of a well-designed accessibility page showing clear sections for Parking, Entrance, Inside the Venue, Bathrooms, and Contact',
      caption: 'An effective accessibility page uses clear headings, specific details, and photos.',
      type: 'diagram'
    },

    resources: [
      {
        title: 'Accessible Tourism Resource Kit',
        url: 'https://www.tourism.australia.com/en/events-and-tools/industry-resources/accessible-tourism.html',
        type: 'guide',
        source: 'Tourism Australia',
        description: 'Comprehensive guide to making tourism businesses more accessible, including website templates.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Creating an Accessibility Page',
        url: 'https://www.and.org.au/',
        type: 'template',
        source: 'Australian Network on Disability',
        description: 'Template and guidance for what to include on your accessibility page.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Disability Discrimination Act',
        url: 'https://humanrights.gov.au/our-work/disability-rights/brief-guide-disability-discrimination-act',
        type: 'guide',
        source: 'Australian Human Rights Commission',
        description: 'Overview of your obligations under the DDA.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'B1-F-5',
        questionText: 'Can customers contact you in a variety of ways to ask accessibility questions?',
        relationship: 'Complements online information with personal contact options',
        moduleCode: 'B1'
      },
      {
        questionId: 'B4.1-1-1',
        questionText: 'Can all website content be accessed using only a keyboard?',
        relationship: 'Your accessibility page itself needs to be accessible',
        moduleCode: 'B4.1'
      }
    ],

    keywords: ['website', 'online', 'information', 'pre-visit', 'planning', 'accessibility page'],
    lastUpdated: '2024-12-18'
  },

  {
    questionId: 'B1-F-7',
    questionText: 'Do you offer familiarisation visits or orientation sessions?',
    moduleCode: 'B1',
    moduleGroup: 'before-arrival',
    diapCategory: 'customer-service',
    title: 'Familiarisation Visits',
    summary: 'Familiarisation visits let people explore your venue before their main visit, reducing anxiety and helping them feel comfortable with the environment.',

    whyItMatters: {
      text: 'For many people—particularly those with autism, anxiety, cognitive disabilities, or sensory sensitivities—visiting a new place can be overwhelming. A familiarisation visit allows them to understand the layout, meet staff, and know what to expect without the pressure of a "real" visit.',
      quote: {
        text: 'Being able to walk through the venue before my son\'s birthday party made all the difference. He knew where everything was and had a great time.',
        attribution: 'Parent of child with autism'
      }
    },

    tips: [
      {
        icon: 'calendar',
        text: 'Offer visits during quieter times when the venue is less overwhelming',
        priority: 1
      },
      {
        icon: 'video',
        text: 'Create a virtual tour or video walkthrough as an alternative',
        detail: 'A 2-3 minute video showing the journey from entrance to key areas can be viewed repeatedly at home.',
        priority: 2
      },
      {
        icon: 'file-text',
        text: 'Provide a social story or visual guide that can be reviewed beforehand',
        detail: 'Social stories use simple text and photos to explain what will happen during a visit.',
        priority: 3
      },
      {
        icon: 'users',
        text: 'Introduce key staff members who will be there during the actual visit',
        priority: 4
      },
      {
        icon: 'clock',
        text: 'Allow flexibility—some people need 10 minutes, others need an hour',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Setting up familiarisation visits',
      steps: [
        {
          text: 'Identify quiet times when familiarisation visits could be accommodated'
        },
        {
          text: 'Create a simple process: How do people request a visit? Who handles them?'
        },
        {
          text: 'Prepare a basic "tour" route covering key areas: entrance, main space, bathroom, quiet area (if available)'
        },
        {
          text: 'Train relevant staff on what a familiarisation visit involves and why it matters'
        },
        {
          text: 'Add information about this service to your accessibility page'
        }
      ],
      estimatedTime: '1-2 hours to set up process'
    },

    examples: [
      {
        businessType: 'attraction',
        businessTypeLabel: 'Theatre',
        scenario: 'A regional theatre wanted to welcome more neurodiverse audiences but found some couldn\'t cope with the full experience.',
        solution: 'Introduced "Pre-Show Tours" available by appointment. Visitors can see the auditorium with lights on, hear what the bells and announcements sound like, and meet front-of-house staff.',
        outcome: 'Several families now attend regularly who had never been to live theatre before. Staff found the tours rewarding.',
        cost: 'Staff time only',
        timeframe: '30 minutes per visit'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A family-friendly restaurant received requests from parents of autistic children who wanted to try dining out.',
        solution: 'Offered to let families visit during setup time (before opening). They could see the space, look at menus, meet the manager, and choose a preferred table for their booking.',
        outcome: 'Word spread in local autism support groups, bringing new loyal customers.',
        cost: 'Free'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Museum',
        scenario: 'A museum noticed that school groups with students with disabilities sometimes struggled on the day.',
        solution: 'Created a free "Teacher Preview" program—teachers can visit with a support person to plan routes, identify quiet spaces, and receive a social story template to customise for their students.',
        outcome: 'Participating schools reported much smoother visits. The social story template is now their most downloaded resource.',
        timeframe: '1-hour appointments'
      }
    ],

    image: {
      src: '/images/help/before-arrival/familiarisation-visit.jpg',
      alt: 'A staff member showing a family around an empty theatre, with lights on and seats visible',
      caption: 'Familiarisation visits work best during quiet times with dedicated staff attention.',
      type: 'photo'
    },

    video: {
      youtubeId: 'PLACEHOLDER_ID',
      title: 'Creating Effective Social Stories for Your Venue',
      duration: '4:30',
      description: 'How to create simple visual guides that help visitors prepare for their visit.',
      hasCaptions: true
    },

    resources: [
      {
        title: 'Social Stories™ Overview',
        url: 'https://carolgraysocialstories.com/social-stories/what-is-it/',
        type: 'guide',
        source: 'Carol Gray Social Stories',
        description: 'Learn about the social story format and how to create effective ones.',
        isFree: true
      },
      {
        title: 'Visual Supports for Autism',
        url: 'https://www.amaze.org.au/',
        type: 'guide',
        source: 'Amaze (Autism Victoria)',
        description: 'Resources for creating visual supports and sensory-friendly experiences.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'A6-1-7',
        questionText: 'Do you offer relaxed or sensory-friendly sessions?',
        relationship: 'Both support neurodiverse visitors',
        moduleCode: 'A6'
      },
      {
        questionId: 'B1-F-1',
        questionText: 'Do you have accessibility information available for customers before they visit?',
        relationship: 'Familiarisation info should be on your accessibility page',
        moduleCode: 'B1'
      }
    ],

    keywords: ['familiarisation', 'orientation', 'preview', 'social story', 'autism', 'anxiety', 'neurodiverse'],
    lastUpdated: '2024-12-18'
  }
];

export default beforeArrivalHelp;
```

### `/src/data/help/during-visit.ts` (partial - sensory questions)

```typescript
import { HelpContent } from './types';

export const duringVisitHelp: HelpContent[] = [
  // A6: Lighting, Sound and Sensory Environment
  {
    questionId: 'A6-1-6',
    questionText: 'Are sensory kits or supports available for customers and visitors?',
    moduleCode: 'A6',
    moduleGroup: 'during-visit',
    diapCategory: 'customer-service',
    title: 'Sensory Kits and Supports',
    summary: 'Sensory kits contain items that help people manage sensory input—like ear defenders, fidget tools, or sunglasses. They\'re a simple way to make your venue more welcoming.',

    whyItMatters: {
      text: 'Many people experience sensory sensitivities—not just those with autism, but also people with anxiety, PTSD, migraines, or other conditions. A sensory kit gives them tools to manage their environment and stay longer.',
      statistic: {
        value: '1 in 70',
        context: 'Australians are on the autism spectrum. Many experience sensory processing differences.',
        source: 'Autism Awareness Australia'
      }
    },

    tips: [
      {
        icon: 'headphones',
        text: 'Include noise-cancelling headphones or ear plugs',
        detail: 'Both adult and child sizes if you serve families.',
        priority: 1
      },
      {
        icon: 'sun',
        text: 'Add sunglasses for bright environments',
        priority: 2
      },
      {
        icon: 'hand',
        text: 'Include fidget tools (stress balls, tangles, fidget cubes)',
        detail: 'These help people self-regulate during overwhelming moments.',
        priority: 3
      },
      {
        icon: 'message-circle',
        text: 'Consider communication cards for non-verbal communication',
        priority: 4
      },
      {
        icon: 'info',
        text: 'Keep kits at the entrance/reception so they\'re easy to request',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Creating a sensory kit',
      steps: [
        {
          text: 'Decide on contents based on your environment (noisy venue = ear defenders; bright venue = sunglasses)'
        },
        {
          text: 'Source items—many are available from disability suppliers or even general retailers'
        },
        {
          text: 'Create a clean, neutral bag or box to store items'
        },
        {
          text: 'Train staff on what\'s in the kit and how to offer it without judgment'
        },
        {
          text: 'Add hygiene protocol: clean items between uses, especially ear defenders'
        },
        {
          text: 'Promote availability on your website and at your entrance'
        }
      ],
      tools: ['Budget: approximately $50-150 per kit'],
      estimatedTime: '2-3 hours to set up'
    },

    examples: [
      {
        businessType: 'attraction',
        businessTypeLabel: 'Cinema',
        scenario: 'A cinema wanted to be more welcoming to neurodiverse audiences.',
        solution: 'Created sensory bags containing: ear plugs (disposable), fidget toy, "I need a break" card, and information card about their relaxed screenings. Available free on request at the candy bar.',
        outcome: 'Families with autistic children feel more confident attending regular screenings, not just relaxed sessions.',
        cost: '$15-20 per kit'
      },
      {
        businessType: 'retail',
        businessTypeLabel: 'Shopping Centre',
        scenario: 'A shopping centre received feedback that the environment was overwhelming for some visitors.',
        solution: 'Partnered with a local autism organisation to create "Calm Kits" available from the information desk. Includes ear defenders, sunglasses, fidget spinner, sensory map showing quiet zones, and a "slow shopping" badge staff can recognise.',
        outcome: 'Became a certified "autism-friendly" shopping centre, attracting new customers.',
        cost: '$30-40 per kit'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Museum',
        scenario: 'A children\'s museum had very hands-on, busy exhibits that overwhelmed some children.',
        solution: 'Created "Comfort Backpacks" with noise-cancelling headphones, a weighted lap pad, a visual timer, and a map showing the quiet room location. Available for loan at reception.',
        outcome: 'Extended average visit length for neurodiverse families by 45 minutes.',
        cost: '$80-100 per kit'
      }
    ],

    image: {
      src: '/images/help/during-visit/sensory-kit.jpg',
      alt: 'A sensory kit laid out showing contents: ear defenders, sunglasses, fidget tools, and communication cards in a small bag',
      caption: 'A typical sensory kit doesn\'t need to be elaborate—a few key items make a big difference.',
      type: 'photo'
    },

    resources: [
      {
        title: 'Sensory Spaces and Equipment Guide',
        url: 'https://www.amaze.org.au/',
        type: 'guide',
        source: 'Amaze Victoria',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Autism-Friendly Business Guide',
        url: 'https://www.autismspectrum.org.au/',
        type: 'guide',
        source: 'Autism Spectrum Australia (Aspect)',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'A6-1-7',
        questionText: 'Do you offer relaxed or sensory-friendly sessions?',
        relationship: 'Both support sensory-sensitive visitors',
        moduleCode: 'A6'
      },
      {
        questionId: 'A6-1-2',
        questionText: 'Are there quiet or reset spaces available?',
        relationship: 'Quiet spaces complement sensory kits',
        moduleCode: 'A6'
      }
    ],

    keywords: ['sensory', 'autism', 'headphones', 'fidget', 'neurodiverse', 'overwhelm'],
    lastUpdated: '2024-12-18'
  },

  {
    questionId: 'A6-1-7',
    questionText: 'Do you offer relaxed or sensory-friendly sessions?',
    moduleCode: 'A6',
    moduleGroup: 'during-visit',
    diapCategory: 'customer-service',
    title: 'Relaxed and Sensory-Friendly Sessions',
    summary: 'Relaxed sessions modify the environment—lower lighting, reduced sound, smaller crowds—to create a more comfortable experience for people with sensory sensitivities.',

    whyItMatters: {
      text: 'Standard experiences can be overwhelming for people with autism, dementia, anxiety, or sensory processing differences. Relaxed sessions don\'t change what you offer, just how you offer it—opening your venue to people who might otherwise stay away.',
      quote: {
        text: 'Relaxed sessions let my mum with dementia enjoy the cinema again. The quiet, the lights staying slightly on—it makes all the difference.',
        attribution: 'Carer, Dementia Australia feedback'
      }
    },

    tips: [
      {
        icon: 'sun-dim',
        text: 'Reduce lighting intensity (but keep safe navigation levels)',
        priority: 1
      },
      {
        icon: 'volume-x',
        text: 'Lower or eliminate background music and sudden loud sounds',
        priority: 2
      },
      {
        icon: 'users',
        text: 'Limit capacity to reduce crowds and queuing',
        priority: 3
      },
      {
        icon: 'door-open',
        text: 'Allow people to move around, leave and return without judgment',
        priority: 4
      },
      {
        icon: 'message-circle',
        text: 'Brief staff to be patient and not rush visitors',
        priority: 5
      },
      {
        icon: 'map-pin',
        text: 'Identify and communicate a quiet/break space',
        priority: 6
      }
    ],

    howToCheck: {
      title: 'Planning a relaxed session',
      steps: [
        {
          text: 'Identify a suitable time—usually quieter periods like early morning or weekday'
        },
        {
          text: 'List environmental changes: What can you dim/lower/turn off?'
        },
        {
          text: 'Decide on capacity limit (typically 50-70% of normal)'
        },
        {
          text: 'Identify or create a quiet space for breaks'
        },
        {
          text: 'Train staff: what\'s different, why it matters, how to interact'
        },
        {
          text: 'Promote the session: autism/disability organisations, carer groups, social media'
        },
        {
          text: 'Gather feedback after each session to improve'
        }
      ],
      estimatedTime: '2-4 hours planning; 1 hour staff briefing'
    },

    examples: [
      {
        businessType: 'attraction',
        businessTypeLabel: 'Cinema',
        scenario: 'A cinema chain wanted to serve autistic customers and families who couldn\'t manage regular screenings.',
        solution: 'Introduced "Sensory Friendly Screenings": lights dimmed but not off, sound at 80% volume, no trailers, freedom to move around, staff trained in autism awareness.',
        outcome: 'Now run weekly at most locations. Attendance has grown 200% over 3 years. Many parents report it\'s their child\'s first cinema experience.',
        timeframe: 'Monthly sessions to start'
      },
      {
        businessType: 'retail',
        businessTypeLabel: 'Supermarket',
        scenario: 'A supermarket received requests for a less overwhelming shopping experience.',
        solution: 'Introduced "Quiet Hour": first hour on Tuesdays has no announcements, no radio, dimmed lights, no trolley collection, staff avoid restocking busy aisles.',
        outcome: 'Popular with autistic shoppers, elderly customers, and parents with babies. Positive media coverage brought new customers.',
        cost: 'Nil (operational adjustment only)'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Zoo',
        scenario: 'A zoo found their popular exhibits were overwhelming for some visitors.',
        solution: 'Created "Early Explorer" sessions on selected mornings: entry 30 minutes before general opening, keeper talks moved outdoors (better acoustics), quiet space available in education centre, sensory bags provided.',
        outcome: 'Sessions sell out regularly. Zoo has developed partnerships with disability schools for educational visits.',
        timeframe: 'Once per month initially, now weekly in school holidays'
      }
    ],

    image: {
      src: '/images/help/during-visit/relaxed-session.jpg',
      alt: 'A relaxed cinema screening showing house lights slightly on and uncrowded seating',
      caption: 'Relaxed sessions maintain the experience while reducing sensory intensity.',
      type: 'photo'
    },

    video: {
      youtubeId: 'PLACEHOLDER_ID',
      title: 'How to Run Sensory-Friendly Sessions',
      duration: '6:15',
      description: 'Practical guide to implementing relaxed sessions in various venue types.',
      hasCaptions: true
    },

    resources: [
      {
        title: 'Relaxed Performances Guide',
        url: 'https://www.artsaccess.com.au/',
        type: 'guide',
        source: 'Arts Access Australia',
        description: 'Guide for running relaxed performances in arts venues.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Dimensions Autism Friendly Award',
        url: 'https://www.dimensions-uk.org/get-involved/campaigns/autism-friendly-award/',
        type: 'website',
        source: 'Dimensions UK',
        description: 'Framework for becoming autism-friendly (UK-based but applicable).',
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'A6-1-6',
        questionText: 'Are sensory kits or supports available?',
        relationship: 'Sensory kits complement relaxed sessions',
        moduleCode: 'A6'
      },
      {
        questionId: 'B1-F-7',
        questionText: 'Do you offer familiarisation visits?',
        relationship: 'Familiarisation visits help people prepare for relaxed sessions',
        moduleCode: 'B1'
      }
    ],

    keywords: ['relaxed', 'sensory-friendly', 'quiet', 'autism', 'dementia', 'low-sensory'],
    lastUpdated: '2024-12-18'
  },

  {
    questionId: 'A6-1-8',
    questionText: 'Do you offer assisted listening devices or hearing augmentation?',
    moduleCode: 'A6',
    moduleGroup: 'during-visit',
    diapCategory: 'information-communication-marketing',
    title: 'Assisted Listening Devices & Hearing Loops',
    summary: 'Assisted listening devices transmit audio directly to hearing aids or headsets, cutting through background noise. They\'re essential for people who are deaf or hard of hearing.',

    whyItMatters: {
      text: 'Background noise in venues makes it extremely difficult for hearing aid users to follow speech. A hearing loop or FM system transmits sound directly to their hearing aid, dramatically improving clarity. For venues with PA systems, hearing augmentation is a legal requirement.',
      statistic: {
        value: '3.6 million',
        context: 'Australians have hearing loss. This number is expected to double by 2060.',
        source: 'Hearing Australia'
      }
    },

    tips: [
      {
        icon: 'ear',
        text: 'Hearing loops are the most common solution in Australia',
        detail: 'They work with hearing aids that have a "T-coil" or "telecoil" setting—most do.',
        priority: 1
      },
      {
        icon: 'square',
        text: 'Display the hearing loop symbol prominently where loops are available',
        priority: 2
      },
      {
        icon: 'wrench',
        text: 'Test your loop regularly—they can fail without you knowing',
        detail: 'Ask a hearing aid user to test, or use a loop listener device.',
        priority: 3
      },
      {
        icon: 'users',
        text: 'Train staff to know where loops are and how to mention them',
        priority: 4
      },
      {
        icon: 'headphones',
        text: 'For people without hearing aids, offer portable receivers with headphones',
        priority: 5
      }
    ],

    standardsReference: {
      primary: {
        code: 'Access-to-Premises',
        section: 'Part D3.7',
        requirement: 'Where an inbuilt amplification system (e.g., PA system) is provided, a hearing augmentation system must also be provided.'
      },
      related: [
        {
          code: 'AS1428.5',
          relevance: 'Specifies technical requirements for hearing augmentation systems.'
        }
      ],
      plainEnglish: 'If you have any kind of PA or speaker system, you\'re legally required to have hearing augmentation (usually a hearing loop) as well.',
      complianceNote: 'This applies to venues like theatres, cinemas, conference rooms, churches, and anywhere with an amplification system. Reception desks and service counters benefit from portable loops even without a PA.'
    },

    howToCheck: {
      title: 'Assessing your hearing augmentation',
      steps: [
        {
          text: 'Do you have a hearing loop installed? Check for the symbol or ask building management.'
        },
        {
          text: 'If yes, when was it last tested? Loops should be tested annually by a professional.'
        },
        {
          text: 'Test it yourself: Set a smartphone to record, hold it near the loop area, and play audio through your PA. Upload the recording to a loop testing app.'
        },
        {
          text: 'Is the hearing loop symbol displayed where people can see it?'
        },
        {
          text: 'Do staff know it exists and how to tell customers about it?'
        },
        {
          text: 'For service counters: Consider a portable counter loop ($300-500).'
        }
      ],
      tools: ['Loop listener device or smartphone app for testing']
    },

    examples: [
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A hotel had a hearing loop in their conference room but guests didn\'t know about it.',
        solution: 'Added hearing loop symbol to all conference room marketing, included loop availability in confirmation emails, trained AV staff to mention it during setup, and added a prompt on their booking form.',
        outcome: 'Loop usage increased significantly. Corporate clients specifically requested the venue for its accessibility.',
        cost: 'Nil (already installed)'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A fine dining restaurant had frequent complaints about noise levels from hearing aid users.',
        solution: 'Installed a portable counter hearing loop at the host stand. When guests mention hearing loss, staff offer seating near the window (away from kitchen noise) and let them know about the loop for communication at the host stand.',
        outcome: 'Positive reviews mentioning accessibility. Loop cost recovered in goodwill within weeks.',
        cost: '$400 for portable counter loop'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Theatre',
        scenario: 'A community theatre had an old loop system that hadn\'t been tested in years.',
        solution: 'Hired an audio professional to test and service the loop ($300). It needed recalibration. Now promote "hearing loop equipped seating" prominently in bookings and signage.',
        outcome: 'Regular patrons who had stopped attending returned. Theatre now offers headsets for people without T-coil hearing aids.',
        cost: '$300 service call'
      }
    ],

    image: {
      src: '/images/help/during-visit/hearing-loop-sign.svg',
      alt: 'The international hearing loop symbol: an ear with a T in the bottom right corner',
      caption: 'Display this symbol where hearing loops are available. Most hearing aid users recognise it.',
      type: 'diagram'
    },

    resources: [
      {
        title: 'Hearing Loop Information',
        url: 'https://www.hearing.com.au/',
        type: 'website',
        source: 'Hearing Australia',
        description: 'Information about hearing loops and where to find them.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Loop Testing App',
        url: 'https://www.hearinglink.org/technology/hearing-loops/loop-testing/',
        type: 'tool',
        source: 'Hearing Link',
        description: 'Free app to test if your hearing loop is working correctly.',
        isFree: true
      },
      {
        title: 'AS 1428.5 Overview',
        url: 'https://www.standards.org.au/',
        type: 'guide',
        source: 'Standards Australia',
        description: 'Summary of technical requirements for hearing augmentation systems.',
        isAustralian: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'C1-D-10',
        questionText: 'Do staff know how to communicate with customers who are Deaf or hard of hearing?',
        relationship: 'Staff awareness complements technical solutions',
        moduleCode: 'C1'
      },
      {
        questionId: 'A7-1-3',
        questionText: 'Are there visual and audible alarms for emergencies?',
        relationship: 'Both support people with hearing loss',
        moduleCode: 'A7'
      }
    ],

    keywords: ['hearing loop', 'T-coil', 'deaf', 'hard of hearing', 'PA system', 'amplification'],
    lastUpdated: '2024-12-18'
  }
];

export default duringVisitHelp;
```

---

## Hook Implementation

### `/src/hooks/useHelp.ts`

```typescript
import { useState, useCallback, useEffect } from 'react';
import { HelpContent, BusinessType, GetHelpByQuestionId } from '@/data/help/types';
import { getHelpByQuestionId } from '@/data/help';

interface UseHelpOptions {
  /** User's business types for contextual examples */
  businessTypes?: BusinessType[];

  /** Callback when help is opened (for analytics) */
  onOpen?: (questionId: string) => void;

  /** Callback when help is closed */
  onClose?: () => void;
}

interface UseHelpReturn {
  /** Whether help panel is open */
  isOpen: boolean;

  /** Current help content (null if closed) */
  content: HelpContent | null;

  /** Current question ID */
  currentQuestionId: string | null;

  /** Open help for a specific question */
  openHelp: (questionId: string) => void;

  /** Close help panel */
  closeHelp: () => void;

  /** Check if help exists for a question */
  hasHelp: (questionId: string) => boolean;

  /** Navigate to help for a related question */
  navigateToRelated: (questionId: string) => void;

  /** Filter examples by business type */
  getRelevantExamples: () => HelpContent['examples'];
}

export function useHelp(options: UseHelpOptions = {}): UseHelpReturn {
  const { businessTypes = [], onOpen, onClose } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<HelpContent | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);

  const openHelp = useCallback((questionId: string) => {
    const helpContent = getHelpByQuestionId(questionId);
    if (helpContent) {
      setContent(helpContent);
      setCurrentQuestionId(questionId);
      setIsOpen(true);
      onOpen?.(questionId);
    } else {
      console.warn(`No help content found for question: ${questionId}`);
    }
  }, [onOpen]);

  const closeHelp = useCallback(() => {
    setIsOpen(false);
    onClose?.();
    // Delay clearing content for exit animation
    setTimeout(() => {
      setContent(null);
      setCurrentQuestionId(null);
    }, 300);
  }, [onClose]);

  const hasHelp = useCallback((questionId: string): boolean => {
    return !!getHelpByQuestionId(questionId);
  }, []);

  const navigateToRelated = useCallback((questionId: string) => {
    // Close briefly then reopen with new content for smooth transition
    setIsOpen(false);
    setTimeout(() => {
      openHelp(questionId);
    }, 150);
  }, [openHelp]);

  const getRelevantExamples = useCallback(() => {
    if (!content?.examples) return [];

    // If no business types specified, return all examples
    if (businessTypes.length === 0) return content.examples;

    // Prioritise matching business types, then include general
    const matching = content.examples.filter(
      ex => businessTypes.includes(ex.businessType) || ex.businessType === 'general'
    );

    // If no matches, return all examples
    return matching.length > 0 ? matching : content.examples;
  }, [content, businessTypes]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeHelp();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeHelp]);

  return {
    isOpen,
    content,
    currentQuestionId,
    openHelp,
    closeHelp,
    hasHelp,
    navigateToRelated,
    getRelevantExamples,
  };
}

export default useHelp;
```

---

## Design Tokens

```css
/* Add to your Tailwind config or CSS variables */

:root {
  /* Help Panel Colors */
  --help-panel-bg: #ffffff;
  --help-panel-border: #e0e0e0;
  --help-panel-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);

  /* Section Colors */
  --help-why-matters-bg: #fef3c7;  /* Warm yellow */
  --help-tip-bg: #f0fdf4;          /* Light green */
  --help-standard-bg: #eff6ff;     /* Light blue */
  --help-example-bg: #faf5ff;      /* Light purple */

  /* Icons */
  --help-icon-why: #d97706;        /* Amber */
  --help-icon-tip: #16a34a;        /* Green */
  --help-icon-check: #2563eb;      /* Blue */
  --help-icon-standard: #7c3aed;   /* Purple */

  /* Typography */
  --help-title-size: 1.5rem;
  --help-section-size: 1.125rem;
  --help-body-size: 1rem;
  --help-caption-size: 0.875rem;

  /* Spacing */
  --help-panel-padding: 24px;
  --help-section-gap: 24px;
  --help-item-gap: 12px;

  /* Mobile */
  --help-mobile-padding: 20px;
  --help-grabber-width: 40px;
  --help-grabber-height: 4px;
}
```

---

## Accessibility Requirements

### Panel Accessibility
- Focus trap when open (focus stays within panel)
- First focusable element receives focus on open
- Return focus to trigger button on close
- Escape key closes panel
- `aria-modal="true"` on container
- `aria-labelledby` pointing to title
- Background content has `aria-hidden="true"` when panel open

### Content Accessibility
- All images have descriptive alt text
- Videos have captions and/or transcripts
- Collapsible sections use `aria-expanded`
- Links indicate external destinations
- Colour is not the only differentiator
- Interactive elements have 44×44px minimum touch targets

### Screen Reader Announcements
- Announce panel opening: "Help panel opened. [Title]"
- Announce panel closing: "Help panel closed"
- Announce section expand/collapse

---

## Analytics Events

Track the following events for content improvement:

```typescript
interface HelpAnalyticsEvent {
  event:
    | 'help_opened'
    | 'help_closed'
    | 'help_section_expanded'
    | 'help_section_collapsed'
    | 'help_resource_clicked'
    | 'help_video_played'
    | 'help_related_clicked'
    | 'help_feedback_positive'
    | 'help_feedback_negative';
  questionId: string;
  moduleCode?: string;
  sectionName?: string;  // For expand/collapse events
  resourceUrl?: string;  // For resource clicks
  targetQuestionId?: string;  // For related navigation
  timeSpent?: number;  // Milliseconds panel was open
}
```

---

## Testing Checklist

### Functionality
- [ ] Help icon appears on questions with help content
- [ ] No icon on questions without help content
- [ ] Correct content displays for each question
- [ ] Desktop side panel slides in from right
- [ ] Mobile bottom sheet slides up from bottom
- [ ] Swipe down dismisses mobile sheet
- [ ] Click outside dismisses mobile sheet
- [ ] Escape key closes panel
- [ ] X button closes panel
- [ ] Related questions navigation works
- [ ] External links open in new tabs

### Content
- [ ] All question IDs match accessModules.ts
- [ ] Images load correctly (or show placeholder)
- [ ] Videos embed and play
- [ ] Resources link to valid URLs
- [ ] No placeholder text in production

### Accessibility
- [ ] Focus trapped within panel
- [ ] Focus returns to trigger on close
- [ ] Screen reader announces open/close
- [ ] All images have alt text
- [ ] Keyboard navigation works throughout
- [ ] Touch targets are 44×44px minimum

### Responsive
- [ ] Desktop: 420px side panel works
- [ ] Tablet: Appropriate breakpoint behaviour
- [ ] Mobile: Bottom sheet works at all snap points
- [ ] Safe area respected on notched phones

---

## Future Enhancements

1. **Search** - Full-text search across all help content
2. **Bookmarks** - Save helpful articles for later
3. **Print** - Print-friendly format for offline reference
4. **Feedback Integration** - Connect thumbs up/down to content improvements
5. **AI Assistant** - Ask follow-up questions about help content
6. **Localisation** - Structure supports translations
7. **Offline** - Cache help content for offline access
8. **Contextual Suggestions** - Proactively suggest help based on user behaviour

---

## Implementation Priority

### Phase 1: Core System (MVP)
- HelpPanel container with responsive rendering
- Basic help content for high-traffic questions
- Tips and Why It Matters sections
- Mobile bottom sheet

### Phase 2: Rich Content
- How to Check sections
- Standards references
- Business-type examples
- Images and diagrams

### Phase 3: Enhanced Features
- Video embeds
- Related questions navigation
- Analytics tracking
- Feedback collection

### Phase 4: Polish
- Animations and transitions
- Search functionality
- Accessibility audit
- Performance optimisation
