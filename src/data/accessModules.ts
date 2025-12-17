/**
 * Access Modules with Full Question Inventory
 *
 * Ported from Access Navigator with comprehensive questions
 * supporting Foundation and Detailed review modes.
 */

import type { BranchingQuestion } from '../hooks/useBranchingLogic';

export interface AccessModule {
  id: string;
  code: string;
  name: string;
  description: string;
  group: 'before-arrival' | 'getting-in' | 'during-visit' | 'service-support';
  estimatedTime: number; // Foundation mode
  estimatedTimeDetailed?: number;
  icon: string;
  questions: BranchingQuestion[];
}

export const moduleGroups = [
  {
    id: 'before-arrival',
    label: 'Before they arrive',
    description: 'How customers find and plan their visit',
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
  // MODULE A1: ARRIVAL & PARKING
  // ============================================
  {
    id: 'M05',
    code: 'A1',
    name: 'Arrival & Parking',
    description: 'Accessible parking, drop-off zones, and paths to entrance',
    group: 'getting-in',
    estimatedTime: 12,
    estimatedTimeDetailed: 20,
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
        text: 'Do staff know how to direct customers to accessible parking and entry points?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A1-F-8',
        text: 'Is the parking area well-lit for customers arriving in low light?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      // Detailed questions
      {
        id: 'A1-D-9',
        text: 'During busy periods, are accessible parking spaces still available and not blocked?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'detailed',
      },
      {
        id: 'A1-D-10',
        text: 'Is the path from parking protected from weather (covered or sheltered)?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'low',
        reviewMode: 'detailed',
      },
      {
        id: 'A1-D-11',
        text: 'Is the surface of accessible parking spaces firm and slip-resistant?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        safetyRelated: true,
        reviewMode: 'detailed',
      },
    ],
  },

  // ============================================
  // MODULE A2: ENTRY & DOORS
  // ============================================
  {
    id: 'M05b',
    code: 'A2',
    name: 'Entry & Doors',
    description: 'Entrance accessibility and door operation',
    group: 'getting-in',
    estimatedTime: 10,
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
        text: 'Do staff know how to assist customers who need help entering the building?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A2-F-7',
        text: 'Is there adequate lighting at the entrance for customers with low vision?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // ============================================
  // MODULE B1: PRE-VISIT INFORMATION
  // ============================================
  {
    id: 'M02',
    code: 'B1',
    name: 'Pre-visit Information',
    description: 'Accessibility information shared before customers visit',
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

  // ============================================
  // MODULE C1: CUSTOMER SERVICE
  // ============================================
  {
    id: 'M09',
    code: 'C1',
    name: 'Customer Service & Staff Confidence',
    description: 'Staff training and customer interaction',
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
        text: 'Do staff know where accessible facilities are located to direct customers?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'C1-F-7',
        text: 'Is there a clear process for handling accessibility complaints or feedback?',
        type: 'yes-no-unsure',
        category: 'policy',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'C1-F-8',
        text: 'Do staff understand they cannot refuse service to someone with an assistance animal?',
        type: 'yes-no-unsure',
        category: 'policy',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
    ],
  },

  // ============================================
  // MODULE M06: INTERNAL MOVEMENT
  // ============================================
  {
    id: 'M06',
    code: 'A3',
    name: 'Internal Movement & Wayfinding',
    description: 'Moving through your space and finding the way',
    group: 'getting-in',
    estimatedTime: 12,
    estimatedTimeDetailed: 22,
    icon: '🧭',
    questions: [
      {
        id: 'A3-F-1',
        text: 'Are main circulation routes wide enough for wheelchair users (at least 1.2m)?',
        type: 'yes-no-unsure',
        category: 'measurement',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A3-F-2',
        text: 'Are there clear sightlines so customers can see where they need to go?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A3-F-3',
        text: 'Is there directional signage throughout your space?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A3-F-4',
        text: 'Are floor surfaces stable, firm, and slip-resistant?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        safetyRelated: true,
        reviewMode: 'foundation',
      },
      {
        id: 'A3-F-5',
        text: 'If you have multiple levels, is there step-free access between them?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A3-F-6',
        text: 'Are there rest points or seating along longer routes?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // ============================================
  // MODULE M07: SEATING & AMENITIES
  // ============================================
  {
    id: 'M07',
    code: 'A6',
    name: 'Seating, Amenities & Toilets',
    description: 'Seating options and accessible facilities',
    group: 'during-visit',
    estimatedTime: 15,
    estimatedTimeDetailed: 25,
    icon: '🚻',
    questions: [
      {
        id: 'A6-F-1',
        text: 'Do you have accessible toilets on site?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'A6-F-2',
        text: 'Are accessible toilets clearly signed and easy to find?',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A6-F-3',
        text: 'Is there a variety of seating options for different needs?',
        helpText: 'Examples: chairs with arms, different heights, space for wheelchairs.',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A6-F-4',
        text: 'Is there seating available in waiting or queuing areas?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A6-F-5',
        text: 'Are service counters at an accessible height or is an alternative available?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A6-F-6',
        text: 'Do staff know where accessible facilities are to direct customers?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // ============================================
  // MODULE M08: SENSORY ENVIRONMENT
  // ============================================
  {
    id: 'M08',
    code: 'A7',
    name: 'Sensory Environment',
    description: 'Lighting, noise, and sensory considerations',
    group: 'during-visit',
    estimatedTime: 12,
    estimatedTimeDetailed: 20,
    icon: '👁️',
    questions: [
      {
        id: 'A7-F-1',
        text: 'Is lighting consistent and adequate throughout your space?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A7-F-2',
        text: 'Are there quiet times or spaces for customers who are sensitive to noise?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A7-F-3',
        text: 'Do you inform customers about sensory conditions they might encounter?',
        helpText: 'Examples: loud music, strong smells, flashing lights, crowded periods.',
        type: 'yes-no-unsure',
        category: 'information',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'A7-F-4',
        text: 'Can background music or announcements be adjusted or turned down if needed?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'low',
        reviewMode: 'foundation',
      },
      {
        id: 'A7-F-5',
        text: 'Is there good contrast between surfaces to help with visibility?',
        helpText: 'Examples: contrasting edges on steps, door frames that stand out from walls.',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // ============================================
  // MODULE M01: DIGITAL ACCESSIBILITY
  // ============================================
  {
    id: 'M01',
    code: 'B4.1',
    name: 'Website & Digital Accessibility',
    description: 'Website and online content accessibility',
    group: 'before-arrival',
    estimatedTime: 15,
    estimatedTimeDetailed: 25,
    icon: '💻',
    questions: [
      {
        id: 'B4-F-1',
        text: 'Can all website content be accessed using only a keyboard (no mouse required)?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'B4-F-2',
        text: 'Do all images on your website have alternative text descriptions?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'B4-F-3',
        text: 'Is there good colour contrast between text and background?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B4-F-4',
        text: 'Can text be resized without breaking the layout?',
        type: 'yes-no-unsure',
        category: 'lived-experience',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B4-F-5',
        text: 'Are forms properly labelled so screen readers can identify each field?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'high',
        reviewMode: 'foundation',
      },
      {
        id: 'B4-F-6',
        text: 'Do videos have captions or transcripts available?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
      {
        id: 'B4-F-7',
        text: 'Is your website mobile-friendly and responsive?',
        type: 'yes-no-unsure',
        category: 'operational',
        impactLevel: 'medium',
        reviewMode: 'foundation',
      },
    ],
  },

  // ============================================
  // MODULE M10: FEEDBACK & COMPLAINTS
  // ============================================
  {
    id: 'M10',
    code: 'C3',
    name: 'Feedback & Complaints',
    description: 'How you collect and respond to feedback',
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

// Helper to get module by ID
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
