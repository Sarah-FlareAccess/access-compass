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
  | 'service-support'
  | 'organisational-commitment'
  | 'events';

// Module codes matching accessModules.ts
export type ModuleCode =
  | '1.1' | '1.2' | '1.3' | '1.4' | '1.5' | '1.6'  // Before arrival
  | '2.1' | '2.2' | '2.3' | '2.4'                    // Getting in
  | '3.1' | '3.2' | '3.3' | '3.4' | '3.5' | '3.6' | '3.7' | '3.8' | '3.9' | '3.10'  // During visit
  | '4.1' | '4.2' | '4.3' | '4.4' | '4.5' | '4.6' | '4.7'  // Service & support
  | '5.1' | '5.2' | '5.3' | '5.4' | '5.5'            // Organisation
  | '6.1' | '6.2' | '6.3' | '6.4' | '6.5';           // Events

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
  /** Must match question ID from accessModules.ts (e.g., '1.1-F-1', '2.2-F-3') */
  questionId: string;

  /** The question text this help relates to (for verification) */
  questionText: string;

  /** Module code (e.g., '1.1', '2.2') */
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

  /** Graded solutions by resource level */
  solutions?: GradedSolution[];

  /** Related question IDs for navigation */
  relatedQuestions?: RelatedQuestion[];

  /** All question IDs this entry provides help for (including the primary questionId) */
  coveredQuestionIds?: string[];

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

/** Resource level for solution grading */
export type ResourceLevel = 'low' | 'medium' | 'high';

/** Solution graded by resource requirements */
export interface GradedSolution {
  /** Solution title */
  title: string;

  /** Description of what to do */
  description: string;

  /** Resource level required */
  resourceLevel: ResourceLevel;

  /** Estimated cost range (e.g., "Free", "$50-200", "$1000+") */
  costRange: string;

  /** Time/effort required (e.g., "1 hour", "1-2 days", "Ongoing") */
  timeRequired: string;

  /** Who can do this (e.g., "DIY", "Staff", "Contractor") */
  implementedBy: 'diy' | 'staff' | 'contractor' | 'specialist';

  /** Impact level of this solution */
  impact: 'quick-win' | 'moderate' | 'significant';

  /** Specific steps to implement */
  steps?: string[];

  /** Additional notes or considerations */
  notes?: string;
}

// Lookup function types
export type GetHelpByQuestionId = (questionId: string) => HelpContent | undefined;
export type GetHelpByModule = (moduleCode: ModuleCode) => HelpContent[];
export type GetHelpByDIAPCategory = (category: DIAPCategory) => HelpContent[];
export type SearchHelp = (query: string) => HelpContent[];
