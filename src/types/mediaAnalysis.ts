/**
 * Media Analysis Types
 *
 * Defines types for analyzing various materials and environments
 * for accessibility compliance against AS 1428, Access to Premises
 * Standards, and WCAG guidelines.
 */

// All supported media/material types for analysis
export type MediaAnalysisType =
  // Printed Materials
  | 'menu'
  | 'brochure'
  | 'flyer'
  | 'large-print'
  | 'signage'
  // Physical Environment
  | 'lighting'
  | 'ground-surface'
  | 'pathway'
  | 'entrance'
  | 'ramp'
  | 'stairs'
  | 'door'
  // Digital/Social
  | 'social-media-post'
  | 'social-media-url'
  | 'website-wave';

// Category groupings for UI
export type MediaAnalysisCategory =
  | 'printed-materials'
  | 'physical-environment'
  | 'digital-social';

// Input type - what the user provides
export type MediaInputType = 'photo' | 'document' | 'url' | 'screenshot';

// Status of analysis
export type MediaAnalysisStatus =
  | 'excellent'    // Meets or exceeds standards
  | 'good'         // Mostly compliant with minor issues
  | 'needs-improvement'  // Notable gaps but functional
  | 'poor'         // Significant accessibility barriers
  | 'not-assessable';    // Cannot determine from provided input

// Individual criterion result
export interface CriterionResult {
  criterionId: string;
  criterionName: string;
  standard: string;           // e.g., "AS 1428.1", "WCAG 2.1 AA", "Access to Premises"
  status: MediaAnalysisStatus;
  score: number;              // 0-100
  finding: string;            // What was observed
  recommendation?: string;    // What to improve
  reference?: string;         // Standard reference (e.g., "AS 1428.1 Section 6.2")
}

// Full analysis result for a media item
export interface MediaAnalysisResult {
  id: string;
  analysisType: MediaAnalysisType;
  inputType: MediaInputType;

  // Source information
  fileName?: string;          // For uploads
  fileSize?: number;
  url?: string;               // For URL-based analysis
  thumbnailDataUrl?: string;  // Preview image (base64)

  // Analysis metadata
  analysisDate: string;
  analysisVersion: string;    // For tracking analysis algorithm versions

  // Overall results
  overallScore: number;       // 0-100
  overallStatus: MediaAnalysisStatus;
  summary: string;            // Plain language summary

  // Detailed results
  criteriaResults: CriterionResult[];

  // Aggregated feedback
  strengths: string[];
  improvements: string[];
  quickWins: string[];        // Easy fixes

  // Standards compliance
  standardsAssessed: string[];  // Which standards were checked

  // Professional review indicators
  needsProfessionalReview: boolean;
  professionalReviewReason?: string;

  // Disclaimer
  disclaimer: string;
}

// Configuration for each analysis type
export interface MediaAnalysisConfig {
  type: MediaAnalysisType;
  category: MediaAnalysisCategory;
  name: string;
  description: string;
  acceptedInputTypes: MediaInputType[];
  acceptedFileTypes?: string[];  // MIME types for uploads
  maxFileSize?: number;          // In bytes
  criteria: AnalysisCriterion[];
  standards: string[];
  examplePrompt?: string;        // Help text for users
  icon: string;
}

// Individual criterion definition
export interface AnalysisCriterion {
  id: string;
  name: string;
  description: string;
  standard: string;
  reference?: string;
  weight: number;  // Importance weighting for scoring
  assessmentMethod: 'visual' | 'measurement' | 'presence' | 'content';
}

// WAVE API types (for future integration)
export interface WaveApiConfig {
  apiKey: string;
  endpoint?: string;  // Default: https://wave.webaim.org/api/request
}

export interface WaveApiResult {
  status: {
    success: boolean;
    httpstatuscode: number;
  };
  statistics: {
    pagetitle: string;
    pageurl: string;
    time: number;
    creditsremaining: number;
    allitemcount: number;
    totalelements: number;
    waveurl: string;
  };
  categories: {
    error: WaveCategory;
    contrast: WaveCategory;
    alert: WaveCategory;
    feature: WaveCategory;
    structure: WaveCategory;
    aria: WaveCategory;
  };
}

export interface WaveCategory {
  description: string;
  count: number;
  items?: Record<string, WaveItem>;
}

export interface WaveItem {
  id: string;
  description: string;
  count: number;
  selectors?: string[];
  contrastdata?: Array<{
    fcolor: string;
    bcolor: string;
    contrastratio: string;
    fontsize: string;
    fontweight: string;
    bold: boolean;
  }>;
}

// Social media URL analysis types
export interface SocialMediaUrlAnalysis {
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'other';
  postType: 'image' | 'video' | 'carousel' | 'story' | 'reel' | 'text';
  hasAltText: boolean;
  hasCaptions: boolean;
  hasAudioDescription: boolean;
  captionQuality?: 'auto-generated' | 'manual' | 'none';
}

// Dropdown options for UI
export const MEDIA_TYPE_OPTIONS: Array<{
  value: MediaAnalysisType;
  label: string;
  category: MediaAnalysisCategory;
  description: string;
  inputTypes: MediaInputType[];
}> = [
  // Printed Materials
  {
    value: 'menu',
    label: 'Menu',
    category: 'printed-materials',
    description: 'Restaurant, cafe, or service menu',
    inputTypes: ['photo', 'document'],
  },
  {
    value: 'brochure',
    label: 'Brochure',
    category: 'printed-materials',
    description: 'Information brochure or pamphlet',
    inputTypes: ['photo', 'document'],
  },
  {
    value: 'flyer',
    label: 'Flyer / Poster',
    category: 'printed-materials',
    description: 'Promotional flyer or poster',
    inputTypes: ['photo', 'document'],
  },
  {
    value: 'large-print',
    label: 'Large Print Material',
    category: 'printed-materials',
    description: 'Large print version of any document',
    inputTypes: ['photo', 'document'],
  },
  {
    value: 'signage',
    label: 'Signage',
    category: 'printed-materials',
    description: 'Wayfinding, information, or safety signage',
    inputTypes: ['photo'],
  },
  // Physical Environment
  {
    value: 'lighting',
    label: 'Venue Lighting',
    category: 'physical-environment',
    description: 'Photo of lighting in a space',
    inputTypes: ['photo'],
  },
  {
    value: 'ground-surface',
    label: 'Ground Surface',
    category: 'physical-environment',
    description: 'Floor, pathway, or ground surface',
    inputTypes: ['photo'],
  },
  {
    value: 'pathway',
    label: 'Pathway / Corridor',
    category: 'physical-environment',
    description: 'Walking path or corridor',
    inputTypes: ['photo'],
  },
  {
    value: 'entrance',
    label: 'Entrance',
    category: 'physical-environment',
    description: 'Building or room entrance',
    inputTypes: ['photo'],
  },
  {
    value: 'ramp',
    label: 'Ramp',
    category: 'physical-environment',
    description: 'Access ramp',
    inputTypes: ['photo'],
  },
  {
    value: 'stairs',
    label: 'Stairs',
    category: 'physical-environment',
    description: 'Staircase or steps',
    inputTypes: ['photo'],
  },
  {
    value: 'door',
    label: 'Door',
    category: 'physical-environment',
    description: 'Door or doorway',
    inputTypes: ['photo'],
  },
  // Digital/Social
  {
    value: 'social-media-post',
    label: 'Social Media Post (Screenshot)',
    category: 'digital-social',
    description: 'Screenshot of a social media post',
    inputTypes: ['screenshot', 'photo'],
  },
  {
    value: 'social-media-url',
    label: 'Social Media URL',
    category: 'digital-social',
    description: 'Link to a social media post',
    inputTypes: ['url'],
  },
  {
    value: 'website-wave',
    label: 'Website (WAVE Analysis)',
    category: 'digital-social',
    description: 'Website URL for accessibility audit',
    inputTypes: ['url'],
  },
];

// Category labels for grouping
export const MEDIA_CATEGORY_LABELS: Record<MediaAnalysisCategory, string> = {
  'printed-materials': 'Printed Materials',
  'physical-environment': 'Physical Environment',
  'digital-social': 'Digital & Social Media',
};
