/**
 * Access Modules with Full Question Inventory
 *
 * Complete module set matching Access Navigator structure.
 * 17 modules across 4 journey phases.
 */

import type { BranchingQuestion } from '../hooks/useBranchingLogic';

export interface AccessModule {
  id: string;
  code: string;
  name: string;
  description: string;
  group: 'before-arrival' | 'getting-in' | 'during-visit' | 'service-support';
  estimatedTime: number;
  estimatedTimeDetailed?: number;
  icon: string;
  questions: BranchingQuestion[];
}

export const moduleGroups = [
  {
    id: 'before-arrival',
    label: 'Before they arrive',
    description: 'How customers find information and plan their visit',
  },
  {
    id: 'getting-in',
    label: 'Getting in and moving around',
    description: 'Physical access and navigation',
  },
  {
    id: 'during-visit',
    label: 'During the visit',
    description: 'The experience while on-site',
  },
  {
    id: 'service-support',
    label: 'Service and support',
    description: 'How you serve and support customers',
  },
];

export const accessModules: AccessModule[] = [
  // ============================================
  // BEFORE THEY ARRIVE (4 modules)
  // ============================================

  // B1: Pre-visit Information
  {
    id: 'B1',
    code: 'B1',
    name: 'Pre-visit information',
    description: 'How you share accessibility information before customers visit',
    group: 'before-arrival',
    estimatedTime: 12,
    estimatedTimeDetailed: 20,
    icon: 'ℹ️',
    questions: [
      {
        id: 'B1-F-1',
        text: 'Do you have accessibility information available for customers before they visit?',
        helpText: 'Examples: a dedicated accessibility page, information included across relevant pages.',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'high',
        reviewMode: 'foundation',
        isEntryPoint: true,
      },
      {
        id: 'B1-F-2A',
        text: "What's currently stopping you from sharing accessibility information?",
        helpText: 'Select all that apply',
        type: 'multi-select',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
        options: [
          { id: 'not-sure-content', label: "We're not sure what information to include" },
          { id: 'worried-wrong', label: "We're worried about getting it wrong" },
          { id: 'inconsistent', label: "Our access features aren't consistent" },
          { id: 'hard-to-update', label: 'Our website or platforms are hard to update' },
          { id: 'never-asked', label: "We've never been asked before" },
          { id: 'other', label: 'Other / Not sure' },
        ],
        showWhen: { questionId: 'B1-F-1', answers: ['no', 'not-sure'] },
      },
      {
        id: 'B1-F-2B',
        text: 'What types of accessibility information do you currently share?',
        helpText: 'Select all that apply',
        type: 'multi-select',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
        options: [
          { id: 'physical-access', label: 'Physical access (parking, entrances, toilets)' },
          { id: 'what-to-expect', label: 'What to expect during a visit' },
          { id: 'sensory', label: 'Sensory considerations (noise, lighting)' },
          { id: 'communication', label: 'Communication support' },
          { id: 'companion', label: 'Companion or support information' },
        ],
        showWhen: { questionId: 'B1-F-1', answers: ['yes'] },
      },
      {
        id: 'B1-F-3',
        text: 'Can customers contact you in a variety of ways to ask accessibility questions?',
        helpText: 'Examples: phone, email, social media, contact forms.',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B1-F-4',
        text: 'Do staff know how to confidently respond to accessibility enquiries?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // B4.1: Website Basics
  {
    id: 'B4.1',
    code: 'B4.1',
    name: 'Website basics',
    description: 'Basic accessibility of your website for all visitors',
    group: 'before-arrival',
    estimatedTime: 15,
    estimatedTimeDetailed: 25,
    icon: '💻',
    questions: [
      {
        id: 'B4.1-F-1',
        text: 'Can all website content be accessed using only a keyboard (no mouse required)?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.1-F-2',
        text: 'Do all images on your website have alternative text descriptions?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.1-F-3',
        text: 'Is there good colour contrast between text and background?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.1-F-4',
        text: 'Can text be resized without breaking the layout?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.1-F-5',
        text: 'Are forms properly labelled so screen readers can identify each field?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.1-F-6',
        text: 'Is your website mobile-friendly and responsive?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // B4.2: Booking Systems and Forms
  {
    id: 'B4.2',
    code: 'B4.2',
    name: 'Booking systems and forms',
    description: 'Accessibility of your online booking and form systems',
    group: 'before-arrival',
    estimatedTime: 10,
    estimatedTimeDetailed: 18,
    icon: '📅',
    questions: [
      {
        id: 'B4.2-F-1',
        text: 'Can customers complete bookings without using a mouse?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.2-F-2',
        text: 'Do booking forms allow customers to request accessibility support or adjustments?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.2-F-3',
        text: 'Are error messages clear and easy to understand?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.2-F-4',
        text: 'Can customers save their progress and return later to complete a booking?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.2-F-5',
        text: 'Is there an alternative way to book (phone, email) if the online system is difficult?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
    ],
  },

  // B4.3: Video and Social Media
  {
    id: 'B4.3',
    code: 'B4.3',
    name: 'Video and social media',
    description: 'Accessibility of your video content and social media presence',
    group: 'before-arrival',
    estimatedTime: 10,
    estimatedTimeDetailed: 18,
    icon: '🎬',
    questions: [
      {
        id: 'B4.3-F-1',
        text: 'Do your videos have captions or subtitles?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.3-F-2',
        text: 'Are transcripts available for audio or video content?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.3-F-3',
        text: 'Do you include image descriptions when posting on social media?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B4.3-F-4',
        text: 'Do you avoid flashing or rapidly moving content that could affect people with epilepsy?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        safetyRelated: true,
        reviewMode: 'foundation',
      },
      {
        id: 'B4.3-F-5',
        text: 'Can videos be paused, stopped, or have autoplay disabled?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // ============================================
  // GETTING IN AND MOVING AROUND (4 modules)
  // ============================================

  // A1: Arrival, Parking and Drop-off
  {
    id: 'A1',
    code: 'A1',
    name: 'Arrival, parking and drop-off',
    description: 'How customers arrive at and enter your premises',
    group: 'getting-in',
    estimatedTime: 15,
    estimatedTimeDetailed: 22,
    icon: '🅿️',
    questions: [
      {
        id: 'A1-F-1',
        text: 'Do you have designated accessible parking spaces?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A1-F-2',
        text: 'Are accessible parking spaces located close to the main entrance?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A1-F-3',
        text: 'Is there a drop-off zone near the entrance for customers who need it?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A1-F-4',
        text: 'Is the path from accessible parking to the entrance smooth and level?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        helpText: 'Consider what a wheelchair user or someone with a mobility aid would experience.',
        reviewMode: 'foundation',
      },
      {
        id: 'A1-F-5',
        text: 'Is the path wide enough for wheelchair users (at least 1.2 metres)?',
        type: 'yes-no-unsure',
        category: 'measurement',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A1-F-6',
        text: 'Would a first-time visitor know where to find accessible parking?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        helpText: 'Consider signage, website information, and visibility.',
        reviewMode: 'foundation',
      },
      {
        id: 'A1-F-7',
        text: 'Is the parking area well-lit for customers arriving in low light?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // A2: Entry and Doors
  {
    id: 'A2',
    code: 'A2',
    name: 'Entry and doors',
    description: 'How customers enter your building',
    group: 'getting-in',
    estimatedTime: 12,
    estimatedTimeDetailed: 18,
    icon: '🚪',
    questions: [
      {
        id: 'A2-F-1',
        text: 'Is your main entrance step-free?',
        helpText: 'No steps or a ramp is available.',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A2-F-2',
        text: 'Is the main entrance door wide enough for wheelchair users (at least 850mm)?',
        type: 'yes-no-unsure',
        category: 'measurement',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A2-F-3',
        text: 'Are entrance doors easy to open (automatic, light push, or lever handles)?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A2-F-4',
        text: 'Is the main entrance clearly visible and identifiable from the street?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A2-F-5',
        text: 'If there is an alternative accessible entrance, is it clearly signed?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A2-F-6',
        text: 'Is there adequate lighting at the entrance for customers with low vision?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // A3a: Paths and Aisles
  {
    id: 'A3a',
    code: 'A3a',
    name: 'Paths and aisles',
    description: 'Internal circulation and movement routes',
    group: 'getting-in',
    estimatedTime: 12,
    estimatedTimeDetailed: 20,
    icon: '🧭',
    questions: [
      {
        id: 'A3a-F-1',
        text: 'Are main circulation routes wide enough for wheelchair users (at least 1.2m)?',
        type: 'yes-no-unsure',
        category: 'measurement',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A3a-F-2',
        text: 'Are pathways kept clear of obstacles and trip hazards?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        safetyRelated: true,
        reviewMode: 'foundation',
      },
      {
        id: 'A3a-F-3',
        text: 'Are floor surfaces stable, firm, and slip-resistant?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        safetyRelated: true,
        reviewMode: 'foundation',
      },
      {
        id: 'A3a-F-4',
        text: 'If you have multiple levels, is there step-free access between them?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A3a-F-5',
        text: 'Are there rest points or seating along longer routes?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A3a-F-6',
        text: 'Are changes in floor level clearly marked with contrasting colours?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // A3b: Queues and Busy Times
  {
    id: 'A3b',
    code: 'A3b',
    name: 'Queues and busy times',
    description: 'Managing queues and crowded periods',
    group: 'getting-in',
    estimatedTime: 10,
    estimatedTimeDetailed: 16,
    icon: '⏳',
    questions: [
      {
        id: 'A3b-F-1',
        text: 'Is there seating available for customers who cannot stand for long periods while queuing?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A3b-F-2',
        text: 'Do staff know how to offer priority service or queue adjustments for customers who need them?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A3b-F-3',
        text: 'Do you share information about busy times so customers can plan their visit?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A3b-F-4',
        text: 'Is there enough space in queuing areas for wheelchair users and mobility aids?',
        type: 'yes-no-unsure',
        category: 'measurement',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A3b-F-5',
        text: 'Can customers request a quieter time or appointment to avoid crowds?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // ============================================
  // DURING THE VISIT (5 modules)
  // ============================================

  // A4: Seating, Furniture and Layout
  {
    id: 'A4',
    code: 'A4',
    name: 'Seating, furniture and layout',
    description: 'Physical comfort and usability of your space',
    group: 'during-visit',
    estimatedTime: 12,
    estimatedTimeDetailed: 20,
    icon: '🪑',
    questions: [
      {
        id: 'A4-F-1',
        text: 'Is there a variety of seating options for different needs?',
        helpText: 'Examples: chairs with arms, different heights, space for wheelchairs.',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A4-F-2',
        text: 'Is there seating available in waiting or queuing areas?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A4-F-3',
        text: 'Are service counters at an accessible height or is an alternative available?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A4-F-4',
        text: 'Can furniture be rearranged to accommodate wheelchair users or mobility aids?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A4-F-5',
        text: 'Is there clear space for customers using wheelchairs to sit alongside companions?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
    ],
  },

  // A5: Toilets and Amenities
  {
    id: 'A5',
    code: 'A5',
    name: 'Toilets and amenities',
    description: 'Accessible toilet and amenity facilities',
    group: 'during-visit',
    estimatedTime: 15,
    estimatedTimeDetailed: 22,
    icon: '🚻',
    questions: [
      {
        id: 'A5-F-1',
        text: 'Do you have accessible toilets on site?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A5-F-2',
        text: 'Are accessible toilets clearly signed and easy to find?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A5-F-3',
        text: 'Is the accessible toilet kept clear of storage items?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A5-F-4',
        text: 'Are grab rails and emergency pull cords in working order?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        safetyRelated: true,
        reviewMode: 'foundation',
      },
      {
        id: 'A5-F-5',
        text: 'Is there a baby change facility that is accessible?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A5-F-6',
        text: 'Do staff know where accessible facilities are to direct customers?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // A6: Lighting, Sound and Sensory Environment
  {
    id: 'A6',
    code: 'A6',
    name: 'Lighting, sound and sensory environment',
    description: 'Sensory aspects of your environment',
    group: 'during-visit',
    estimatedTime: 12,
    estimatedTimeDetailed: 20,
    icon: '💡',
    questions: [
      {
        id: 'A6-F-1',
        text: 'Is lighting consistent and adequate throughout your space?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A6-F-2',
        text: 'Are there quiet times or spaces for customers who are sensitive to noise?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A6-F-3',
        text: 'Do you inform customers about sensory conditions they might encounter?',
        helpText: 'Examples: loud music, strong smells, flashing lights, crowded periods.',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A6-F-4',
        text: 'Can background music or announcements be adjusted or turned down if needed?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'low',
        reviewMode: 'foundation',
      },
      {
        id: 'A6-F-5',
        text: 'Is there good contrast between surfaces to help with visibility?',
        helpText: 'Examples: contrasting edges on steps, door frames that stand out from walls.',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // B2: Signage and Wayfinding
  {
    id: 'B2',
    code: 'B2',
    name: 'Signage and wayfinding',
    description: 'How customers find their way around',
    group: 'during-visit',
    estimatedTime: 12,
    estimatedTimeDetailed: 18,
    icon: '🪧',
    questions: [
      {
        id: 'B2-F-1',
        text: 'Is there directional signage throughout your space?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B2-F-2',
        text: 'Is signage at a readable height for wheelchair users and people of different heights?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B2-F-3',
        text: 'Does signage use clear, simple language and symbols?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B2-F-4',
        text: 'Is there good contrast between sign text and background?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B2-F-5',
        text: 'Are there clear sightlines so customers can see where they need to go?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // B3: Menus and Printed Materials
  {
    id: 'B3',
    code: 'B3',
    name: 'Menus and printed materials',
    description: 'Accessibility of printed information',
    group: 'during-visit',
    estimatedTime: 10,
    estimatedTimeDetailed: 16,
    icon: '📋',
    questions: [
      {
        id: 'B3-F-1',
        text: 'Are printed materials available in large print if requested?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B3-F-2',
        text: 'Is text on menus and brochures easy to read (clear font, good contrast)?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B3-F-3',
        text: 'Can staff read menus or materials aloud for customers who need it?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B3-F-4',
        text: 'Are digital versions of menus or information available (QR codes, website)?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B3-F-5',
        text: 'Do you use plain language that avoids jargon?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // ============================================
  // SERVICE AND SUPPORT (4 modules)
  // ============================================

  // C1: Customer Service and Staff Confidence
  {
    id: 'C1',
    code: 'C1',
    name: 'Customer service and staff confidence',
    description: 'How your team supports customers with different needs',
    group: 'service-support',
    estimatedTime: 15,
    estimatedTimeDetailed: 25,
    icon: '👥',
    questions: [
      {
        id: 'C1-F-1',
        text: 'Have staff received disability awareness or accessibility training?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'C1-F-2',
        text: 'Do staff know how to welcome and assist customers with assistance animals?',
        helpText: 'Guide dogs and other assistance animals must be allowed in most public places.',
        type: 'yes-no-unsure',
        category: 'policy',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'C1-F-3',
        text: 'Do staff feel confident communicating with customers who have different needs?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'C1-F-4',
        text: 'Do you have a process for customers to request assistance before arriving?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'C1-F-5',
        text: 'Are staff trained in basic communication strategies (facing the person, speaking clearly)?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'C1-F-6',
        text: 'Do staff understand they cannot refuse service to someone with an assistance animal?',
        type: 'yes-no-unsure',
        category: 'policy',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
    ],
  },

  // C2: Bookings, Payments and Flexibility
  {
    id: 'C2',
    code: 'C2',
    name: 'Bookings, payments and flexibility',
    description: 'Flexibility in your booking and payment processes',
    group: 'service-support',
    estimatedTime: 10,
    estimatedTimeDetailed: 16,
    icon: '💳',
    questions: [
      {
        id: 'C2-F-1',
        text: 'Do you offer flexible booking or cancellation policies for customers with disabilities?',
        type: 'yes-no-unsure',
        category: 'policy',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'C2-F-2',
        text: 'Can customers pay using a variety of methods (card, cash, contactless)?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'C2-F-3',
        text: 'Are payment terminals positioned at an accessible height?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'C2-F-4',
        text: 'Do you offer companion or carer tickets free or at a reduced rate?',
        type: 'yes-no-unsure',
        category: 'policy',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'C2-F-5',
        text: 'Can customers easily request adjustments when booking?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // A7: Safety and Emergencies
  {
    id: 'A7',
    code: 'A7',
    name: 'Safety and emergencies',
    description: 'Emergency procedures that include everyone',
    group: 'service-support',
    estimatedTime: 12,
    estimatedTimeDetailed: 20,
    icon: '🚨',
    questions: [
      {
        id: 'A7-F-1',
        text: 'Do your emergency procedures include provisions for people with disabilities?',
        type: 'yes-no-unsure',
        category: 'policy',
        impactLevel: 'high',
        safetyRelated: true,
        reviewMode: 'foundation',
      },
      {
        id: 'A7-F-2',
        text: 'Are emergency alarms both audible and visual?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        safetyRelated: true,
        reviewMode: 'foundation',
      },
      {
        id: 'A7-F-3',
        text: 'Do staff know how to assist customers with disabilities during an emergency?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        safetyRelated: true,
        reviewMode: 'foundation',
      },
      {
        id: 'A7-F-4',
        text: 'Are evacuation routes accessible for wheelchair users?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        safetyRelated: true,
        reviewMode: 'foundation',
      },
      {
        id: 'A7-F-5',
        text: 'Is there a refuge area or safe waiting point for people who cannot use stairs?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        safetyRelated: true,
        reviewMode: 'foundation',
      },
    ],
  },

  // C3: Learning from Your Customers
  {
    id: 'C3',
    code: 'C3',
    name: 'Learning from your customers',
    description: 'Gathering and acting on customer feedback',
    group: 'service-support',
    estimatedTime: 10,
    estimatedTimeDetailed: 18,
    icon: '📝',
    questions: [
      {
        id: 'C3-F-1',
        text: 'Do you actively invite feedback about accessibility from customers?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'C3-F-2',
        text: 'Can customers provide feedback in multiple formats (online, phone, in-person)?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'C3-F-3',
        text: 'Is there a clear process for handling accessibility complaints?',
        type: 'yes-no-unsure',
        category: 'policy',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'C3-F-4',
        text: 'Do you track and review accessibility feedback to identify patterns?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'C3-F-5',
        text: 'Do staff know how to respond to accessibility complaints sensitively?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },
];

// Helper to get module by ID or code
export function getModuleById(id: string): AccessModule | undefined {
  return accessModules.find(m => m.id === id || m.code === id);
}

// Helper to get modules by group
export function getModulesByGroup(group: string): AccessModule[] {
  return accessModules.filter(m => m.group === group);
}

// Helper to get questions for a review mode
export function getQuestionsForMode(
  module: AccessModule,
  reviewMode: 'foundation' | 'detailed'
): BranchingQuestion[] {
  if (reviewMode === 'foundation') {
    return module.questions.filter(
      q => q.reviewMode === 'foundation' || q.reviewMode === 'both'
    );
  }
  // Detailed includes all questions
  return module.questions;
}

// Calculate estimated time based on review mode
export function getEstimatedTime(
  module: AccessModule,
  reviewMode: 'foundation' | 'detailed'
): number {
  return reviewMode === 'detailed' && module.estimatedTimeDetailed
    ? module.estimatedTimeDetailed
    : module.estimatedTime;
}
