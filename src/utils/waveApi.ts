/**
 * WAVE API Integration Utility
 *
 * This module provides integration with the WAVE (Web Accessibility Evaluation Tool) API.
 * Currently uses mock data for development/demo purposes.
 *
 * WAVE API Documentation: https://wave.webaim.org/api/
 *
 * To enable real WAVE API:
 * 1. Get an API key from https://wave.webaim.org/api/
 * 2. Set VITE_WAVE_API_KEY in your .env file
 * 3. Set VITE_WAVE_API_ENABLED=true
 *
 * Note: WAVE API requires a paid subscription for production use.
 */

// WAVE API Configuration
const WAVE_API_KEY = import.meta.env.VITE_WAVE_API_KEY || '';
const WAVE_API_ENABLED = import.meta.env.VITE_WAVE_API_ENABLED === 'true';
const WAVE_API_BASE_URL = 'https://wave.webaim.org/api/request';

// WAVE API Response Types
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
  contrastdata?: {
    fcolor: string;
    bcolor: string;
    contrast: string;
  }[];
}

export interface WaveStatistics {
  pagetitle: string;
  pageurl: string;
  time: number;
  creditsremaining: number;
  allitemcount: number;
  totalelements: number;
  waveurl: string;
}

export interface WaveApiResponse {
  status: {
    success: boolean;
    httpstatuscode?: number;
  };
  statistics?: WaveStatistics;
  categories?: {
    error?: WaveCategory;
    contrast?: WaveCategory;
    alert?: WaveCategory;
    feature?: WaveCategory;
    structure?: WaveCategory;
    aria?: WaveCategory;
  };
}

// Normalized result for our application
export interface WaveAnalysisResult {
  url: string;
  analysisDate: string;
  overallScore: number;
  overallStatus: 'excellent' | 'good' | 'needs-improvement' | 'poor' | 'not-assessable';
  summary: string;
  errorCount: number;
  contrastErrorCount: number;
  alertCount: number;
  featureCount: number;
  structureCount: number;
  ariaCount: number;
  strengths: string[];
  improvements: string[];
  quickWins: string[];
  detailedIssues: {
    category: string;
    severity: 'error' | 'warning' | 'info';
    description: string;
    count: number;
    wcagCriteria?: string;
    plainLanguage: string;
    whyItMatters: string;
    howToFix: string;
    example?: string;
  }[];
  disclaimer: string;
  isLiveAnalysis: boolean;
}

// Plain language explanations for common WAVE issues
const ISSUE_EXPLANATIONS: Record<string, {
  plainLanguage: string;
  whyItMatters: string;
  howToFix: string;
  example?: string;
}> = {
  // Errors
  'alt_missing': {
    plainLanguage: 'Images without descriptions',
    whyItMatters: 'Screen reader users cannot understand what the image shows. They hear "image" with no context.',
    howToFix: 'Add a short description to each image using the "alt" attribute. Describe what the image shows in 1-2 sentences.',
    example: 'Instead of: <img src="team.jpg">\nUse: <img src="team.jpg" alt="Our friendly customer service team standing at the front desk">'
  },
  'alt_link_missing': {
    plainLanguage: 'Linked images without descriptions',
    whyItMatters: 'Users cannot understand where a clickable image will take them.',
    howToFix: 'Add alt text that describes where the link goes, not just what the image shows.',
    example: 'For a logo that links home: alt="Company Name - Go to homepage"'
  },
  'label_missing': {
    plainLanguage: 'Form fields without labels',
    whyItMatters: 'Users cannot understand what information to enter in a form field. Screen readers announce "edit text" with no context.',
    howToFix: 'Add a visible label next to each form field (name, email, phone, etc.).',
    example: 'Add "Your Name:" as a label before the name input field'
  },
  'input_empty': {
    plainLanguage: 'Buttons or inputs with no text',
    whyItMatters: 'Users cannot understand what a button does or what to enter.',
    howToFix: 'Add descriptive text to buttons (e.g., "Submit Enquiry" instead of just an icon).',
    example: 'Change a search button from just a magnifying glass icon to include "Search" text'
  },
  'link_empty': {
    plainLanguage: 'Links with no text',
    whyItMatters: 'Screen reader users hear "link" but have no idea where it leads.',
    howToFix: 'Add meaningful text to links that describes where they go.',
    example: 'Instead of "Click here", use "View our accessibility statement"'
  },
  'button_empty': {
    plainLanguage: 'Buttons with no text',
    whyItMatters: 'Users cannot understand what the button does.',
    howToFix: 'Add text to buttons. If using an icon, add hidden text for screen readers.',
    example: 'A menu button should say "Open menu" not just show three lines'
  },
  'th_empty': {
    plainLanguage: 'Empty table headers',
    whyItMatters: 'Users navigating tables cannot understand the data columns.',
    howToFix: 'Add descriptive text to all table header cells.',
    example: 'Label columns like "Service", "Price", "Duration" instead of leaving headers empty'
  },
  'blink': {
    plainLanguage: 'Blinking or flashing content',
    whyItMatters: 'Can trigger seizures and is extremely distracting for many users.',
    howToFix: 'Remove all blinking and flashing effects. Use subtle animations if needed.',
    example: 'Replace flashing "SALE!" text with a static banner'
  },
  'marquee': {
    plainLanguage: 'Scrolling or moving text',
    whyItMatters: 'Moving text is difficult to read and cannot be paused by users who need more time.',
    howToFix: 'Replace scrolling text with static content or provide pause controls.',
    example: 'Display announcements in a static list instead of a scrolling ticker'
  },

  // Contrast errors
  'contrast': {
    plainLanguage: 'Text that is hard to read due to low contrast',
    whyItMatters: 'Users with low vision, colour blindness, or reading in bright light cannot read the text.',
    howToFix: 'Make text darker on light backgrounds, or lighter on dark backgrounds. Use a contrast checker tool.',
    example: 'Change light grey text (#999) on white to dark grey (#333) - this makes a big difference!'
  },
  'contrast_aa': {
    plainLanguage: 'Text contrast does not meet accessibility standards',
    whyItMatters: 'The colour combination makes text difficult to read for many users.',
    howToFix: 'Increase contrast ratio to at least 4.5:1 for normal text, 3:1 for large text.',
    example: 'If using blue text (#4A90D9) on white, darken it to (#2563EB) for better readability'
  },

  // Alerts
  'alt_suspicious': {
    plainLanguage: 'Image descriptions may not be helpful',
    whyItMatters: 'Descriptions like "image1.jpg" or "photo" do not help users understand the content.',
    howToFix: 'Replace generic descriptions with meaningful ones that convey the image purpose.',
    example: 'Change "IMG_2847.jpg" to "Customer enjoying accessible outdoor seating area"'
  },
  'alt_redundant': {
    plainLanguage: 'Image descriptions repeat nearby text',
    whyItMatters: 'Screen reader users hear the same information twice, which is annoying and wastes time.',
    howToFix: 'If text near the image already describes it, use an empty alt="" instead.',
    example: 'If "About Us" heading is next to a team photo, the photo alt can be brief or empty'
  },
  'alt_long': {
    plainLanguage: 'Image descriptions are too long',
    whyItMatters: 'Very long descriptions are overwhelming and hard to remember.',
    howToFix: 'Keep descriptions under 125 characters. Use a longer description link for complex images.',
    example: 'Summarise a floor plan image briefly, then link to a detailed accessible description'
  },
  'title_redundant': {
    plainLanguage: 'Link title repeats the link text',
    whyItMatters: 'Screen reader users hear the same thing twice.',
    howToFix: 'Remove the title attribute if it matches the link text, or add additional useful info.',
    example: 'Link text "Contact Us" does not need title="Contact Us"'
  },
  'noscript': {
    plainLanguage: 'Content may not work without JavaScript',
    whyItMatters: 'Some users browse with JavaScript disabled for security or performance.',
    howToFix: 'Ensure essential content is available without JavaScript, or provide alternatives.',
    example: 'Show a message with your phone number if the booking widget requires JavaScript'
  },
  'heading_missing': {
    plainLanguage: 'Page may be missing main headings',
    whyItMatters: 'Users cannot quickly scan and understand the page structure.',
    howToFix: 'Add clear headings (H1, H2, H3) to organise your content logically.',
    example: 'Use "Our Services", "Prices", "Contact Us" as H2 headings to break up the page'
  },
  'heading_skipped': {
    plainLanguage: 'Heading levels are skipped (e.g., H1 to H3)',
    whyItMatters: 'Users navigating by headings may think content is missing.',
    howToFix: 'Use headings in order: H1 for main title, H2 for sections, H3 for subsections.',
    example: 'Do not jump from H1 "Welcome" to H3 "Services" - use H2 instead'
  },
  'link_redundant': {
    plainLanguage: 'Multiple links go to the same place',
    whyItMatters: 'Users hear the same link announced multiple times, which is confusing.',
    howToFix: 'Combine adjacent links into a single link, or give each a distinct purpose.',
    example: 'Instead of separate image and text links to the same page, wrap both in one link'
  },
  'link_pdf': {
    plainLanguage: 'Link opens a PDF document',
    whyItMatters: 'Users should know they are leaving the webpage and opening a different format.',
    howToFix: 'Add "(PDF)" to the link text and ensure the PDF itself is accessible.',
    example: 'Change "Menu" to "Menu (PDF, 2MB)" and ensure the PDF has proper headings and alt text'
  },
  'html5_video_audio': {
    plainLanguage: 'Video or audio content detected',
    whyItMatters: 'Videos need captions for deaf users; audio needs transcripts.',
    howToFix: 'Add captions to all videos. Provide text transcripts for audio content.',
    example: 'Upload captions when posting videos. Many platforms auto-generate captions you can edit'
  },
  'youtube_video': {
    plainLanguage: 'YouTube video embedded',
    whyItMatters: 'YouTube videos need captions for accessibility.',
    howToFix: 'Enable captions on YouTube videos. Review auto-captions for accuracy.',
    example: 'In YouTube Studio, go to Subtitles and add/review captions for each video'
  },
  'table_layout': {
    plainLanguage: 'Table may be used for layout instead of data',
    whyItMatters: 'Screen readers announce "table" which confuses users when there is no tabular data.',
    howToFix: 'Use CSS for layout instead of tables. Reserve tables for actual data.',
    example: 'Replace a 2-column table layout with CSS flexbox or grid'
  },
  'text_small': {
    plainLanguage: 'Text may be too small',
    whyItMatters: 'Small text is hard to read, especially for users with low vision.',
    howToFix: 'Use at least 16px for body text. Ensure text can be zoomed to 200%.',
    example: 'Change 12px body text to 16px or 18px for better readability'
  },
  'underline': {
    plainLanguage: 'Underlined text that is not a link',
    whyItMatters: 'Users expect underlined text to be clickable, causing confusion.',
    howToFix: 'Remove underlines from non-link text. Use bold or colour for emphasis instead.',
    example: 'Change underlined "Important:" to bold "Important:"'
  }
};

/**
 * Analyze a website URL using WAVE API
 */
export async function analyzeWithWave(url: string): Promise<WaveAnalysisResult> {
  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL provided');
  }

  // Check if real WAVE API is enabled
  if (WAVE_API_ENABLED && WAVE_API_KEY) {
    try {
      return await performLiveWaveAnalysis(url);
    } catch (error) {
      console.error('WAVE API error, falling back to mock:', error);
      // Fall back to mock on error
      return generateMockWaveResult(url);
    }
  }

  // Use mock data
  return generateMockWaveResult(url);
}

/**
 * Perform live WAVE API analysis
 */
async function performLiveWaveAnalysis(url: string): Promise<WaveAnalysisResult> {
  const params = new URLSearchParams({
    key: WAVE_API_KEY,
    url: url,
    reporttype: '4', // Full JSON report
  });

  const response = await fetch(`${WAVE_API_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`WAVE API returned ${response.status}`);
  }

  const data: WaveApiResponse = await response.json();

  if (!data.status.success) {
    throw new Error('WAVE API analysis failed');
  }

  return normalizeWaveResponse(url, data);
}

/**
 * Get explanation for a WAVE issue ID
 */
function getIssueExplanation(issueId: string, fallbackDescription: string): {
  plainLanguage: string;
  whyItMatters: string;
  howToFix: string;
  example?: string;
} {
  const explanation = ISSUE_EXPLANATIONS[issueId];
  if (explanation) {
    return explanation;
  }

  // Fallback for unknown issues
  return {
    plainLanguage: fallbackDescription,
    whyItMatters: 'This may create barriers for some users trying to access your website.',
    howToFix: 'Review this issue and consider how it might affect users with disabilities.',
    example: undefined,
  };
}

/**
 * Normalize WAVE API response to our format
 */
function normalizeWaveResponse(url: string, data: WaveApiResponse): WaveAnalysisResult {
  const categories = data.categories || {};

  const errorCount = categories.error?.count || 0;
  const contrastCount = categories.contrast?.count || 0;
  const alertCount = categories.alert?.count || 0;
  const featureCount = categories.feature?.count || 0;
  const structureCount = categories.structure?.count || 0;
  const ariaCount = categories.aria?.count || 0;

  // Calculate score (simplified algorithm)
  const totalIssues = errorCount + contrastCount;
  const score = Math.max(0, Math.min(100, 100 - (totalIssues * 5)));

  // Determine status
  let status: WaveAnalysisResult['overallStatus'];
  if (score >= 90) status = 'excellent';
  else if (score >= 70) status = 'good';
  else if (score >= 50) status = 'needs-improvement';
  else status = 'poor';

  // Extract detailed issues with plain language explanations
  const detailedIssues: WaveAnalysisResult['detailedIssues'] = [];

  if (categories.error?.items) {
    Object.entries(categories.error.items).forEach(([id, item]) => {
      const explanation = getIssueExplanation(id, item.description);
      detailedIssues.push({
        category: 'Errors',
        severity: 'error',
        description: item.description,
        count: item.count,
        wcagCriteria: getWcagCriteria(id),
        plainLanguage: explanation.plainLanguage,
        whyItMatters: explanation.whyItMatters,
        howToFix: explanation.howToFix,
        example: explanation.example,
      });
    });
  }

  if (categories.contrast?.items) {
    Object.entries(categories.contrast.items).forEach(([id, item]) => {
      const explanation = getIssueExplanation(id, item.description);
      detailedIssues.push({
        category: 'Contrast',
        severity: 'error',
        description: item.description,
        count: item.count,
        wcagCriteria: 'WCAG 1.4.3',
        plainLanguage: explanation.plainLanguage,
        whyItMatters: explanation.whyItMatters,
        howToFix: explanation.howToFix,
        example: explanation.example,
      });
    });
  }

  if (categories.alert?.items) {
    Object.entries(categories.alert.items).forEach(([id, item]) => {
      const explanation = getIssueExplanation(id, item.description);
      detailedIssues.push({
        category: 'Alerts',
        severity: 'warning',
        description: item.description,
        count: item.count,
        wcagCriteria: getWcagCriteria(id),
        plainLanguage: explanation.plainLanguage,
        whyItMatters: explanation.whyItMatters,
        howToFix: explanation.howToFix,
        example: explanation.example,
      });
    });
  }

  // Generate user-friendly strengths
  const strengths: string[] = [];
  if (errorCount === 0) {
    strengths.push('Great news! No critical accessibility errors were found on your page.');
  }
  if (contrastCount === 0) {
    strengths.push('Your text colours have good contrast, making content readable for users with low vision.');
  }
  if (featureCount > 0) {
    strengths.push(`Your page includes ${featureCount} accessibility features like form labels and skip links.`);
  }
  if (structureCount > 5) {
    strengths.push('Your page has good structure with proper headings, helping users navigate easily.');
  }
  if (ariaCount > 0) {
    strengths.push('You are using ARIA attributes to provide extra information for screen reader users.');
  }

  // Generate actionable improvements
  const improvements: string[] = [];

  // Prioritise by impact
  if (errorCount > 0) {
    const topError = detailedIssues.find(i => i.severity === 'error');
    if (topError) {
      improvements.push(`Priority: ${topError.plainLanguage} (${topError.count} found) - ${topError.howToFix}`);
    }
  }
  if (contrastCount > 0) {
    improvements.push(`Improve colour contrast in ${contrastCount} place(s) - use darker text on light backgrounds or lighter text on dark backgrounds.`);
  }
  if (alertCount > 2) {
    improvements.push(`Review ${alertCount} potential issues that could affect some users.`);
  }

  // Generate specific quick wins (easy fixes with high impact)
  const quickWins: string[] = [];

  // Find quick wins from detailed issues
  const altMissing = detailedIssues.find(i => i.description.toLowerCase().includes('alt') && i.severity === 'error');
  if (altMissing) {
    quickWins.push(`Add descriptions to ${altMissing.count} image(s) - describe what each image shows in a sentence.`);
  }

  const labelMissing = detailedIssues.find(i => i.description.toLowerCase().includes('label') && i.severity === 'error');
  if (labelMissing) {
    quickWins.push(`Add labels to ${labelMissing.count} form field(s) - ensure each input has a visible label like "Your Name:" or "Email:".`);
  }

  const contrastIssue = detailedIssues.find(i => i.category === 'Contrast');
  if (contrastIssue) {
    quickWins.push('Darken your text colours or lighten your backgrounds for better readability.');
  }

  if (quickWins.length === 0 && improvements.length > 0) {
    quickWins.push('Start with the first improvement listed above - small changes can make a big difference!');
  }

  // Create user-friendly summary
  let summary: string;
  if (score >= 90) {
    summary = `Excellent! Your website is performing well for accessibility. ${featureCount > 0 ? `We detected ${featureCount} accessibility features.` : ''} Keep up the good work and continue to test with real users.`;
  } else if (score >= 70) {
    summary = `Good progress! Your website has solid foundations but there are ${errorCount + contrastCount} issue(s) to address. The improvements below will help make your site more accessible.`;
  } else if (score >= 50) {
    summary = `Your website needs some attention. We found ${errorCount} error(s) and ${contrastCount} contrast issue(s) that may prevent some users from accessing your content. Focus on the quick wins first.`;
  } else {
    summary = `Your website has significant accessibility barriers. We found ${errorCount} error(s) that will affect users with disabilities. We recommend addressing the priority issues below and consider getting professional help.`;
  }

  return {
    url,
    analysisDate: new Date().toISOString(),
    overallScore: score,
    overallStatus: status,
    summary,
    errorCount,
    contrastErrorCount: contrastCount,
    alertCount,
    featureCount,
    structureCount,
    ariaCount,
    strengths,
    improvements,
    quickWins,
    detailedIssues,
    disclaimer: 'This analysis checks common accessibility issues but cannot detect everything. Some issues require human judgement. We recommend testing with real users who have disabilities and considering a professional accessibility audit for comprehensive coverage.',
    isLiveAnalysis: true,
  };
}

/**
 * Get WCAG criteria for common WAVE issue IDs
 */
function getWcagCriteria(issueId: string): string | undefined {
  const wcagMap: Record<string, string> = {
    'alt_missing': 'WCAG 1.1.1',
    'alt_link_missing': 'WCAG 1.1.1, 2.4.4',
    'label_missing': 'WCAG 1.3.1, 4.1.2',
    'input_empty': 'WCAG 4.1.2',
    'link_empty': 'WCAG 2.4.4',
    'button_empty': 'WCAG 4.1.2',
    'contrast': 'WCAG 1.4.3',
    'contrast_aa': 'WCAG 1.4.3',
    'heading_missing': 'WCAG 1.3.1',
    'heading_skipped': 'WCAG 1.3.1',
    'alt_suspicious': 'WCAG 1.1.1',
    'html5_video_audio': 'WCAG 1.2.1, 1.2.2',
    'blink': 'WCAG 2.2.2',
    'marquee': 'WCAG 2.2.2',
  };
  return wcagMap[issueId];
}

/**
 * Generate mock WAVE analysis result for demo purposes
 */
function generateMockWaveResult(url: string): WaveAnalysisResult {
  // Generate somewhat random but consistent results based on URL
  const urlHash = hashCode(url);
  const baseScore = 55 + (Math.abs(urlHash) % 40); // Score between 55-95

  const errorCount = baseScore > 80 ? 0 : 1 + (Math.abs(urlHash) % 4);
  const contrastCount = baseScore > 85 ? 0 : (Math.abs(urlHash >> 4) % 3);
  const alertCount = 2 + (Math.abs(urlHash >> 8) % 5);
  const featureCount = 3 + (Math.abs(urlHash >> 12) % 8);
  const structureCount = 5 + (Math.abs(urlHash >> 16) % 10);
  const ariaCount = (Math.abs(urlHash >> 20) % 6);

  const score = Math.max(0, Math.min(100, 100 - (errorCount * 10) - (contrastCount * 5)));

  let status: WaveAnalysisResult['overallStatus'];
  if (score >= 90) status = 'excellent';
  else if (score >= 70) status = 'good';
  else if (score >= 50) status = 'needs-improvement';
  else status = 'poor';

  const strengths: string[] = [];
  const improvements: string[] = [];
  const quickWins: string[] = [];

  // Generate user-friendly strengths
  if (errorCount === 0) {
    strengths.push('Great news! No critical accessibility errors were found on your page.');
  }

  if (contrastCount === 0) {
    strengths.push('Your text colours have good contrast, making content readable for users with low vision.');
  }

  if (featureCount > 5) {
    strengths.push(`Your page includes ${featureCount} accessibility features like form labels and skip links.`);
  }

  if (structureCount > 5) {
    strengths.push('Your page has good structure with proper headings, helping users navigate easily.');
  }

  if (ariaCount > 0) {
    strengths.push('You are using ARIA attributes to provide extra information for screen reader users.');
  }

  // Generate actionable improvements with specific guidance
  if (errorCount > 0) {
    improvements.push(`Priority: Fix ${errorCount} issue(s) that create barriers - focus on form labels and image descriptions first.`);
  }

  if (contrastCount > 0) {
    improvements.push(`Improve colour contrast in ${contrastCount} place(s) - make text darker on light backgrounds, or lighter on dark backgrounds.`);
  }

  if (structureCount <= 5) {
    improvements.push('Add clear headings (H1, H2, H3) to help users scan your page - use "Our Services", "Contact Us" etc. as section headings.');
  }

  if (ariaCount === 0) {
    improvements.push('Add descriptive text to buttons that only show icons - for example, add "Open menu" text to menu buttons.');
  }

  if (alertCount > 3) {
    improvements.push(`Review ${alertCount} potential issues - these may affect some users depending on your content.`);
  }

  // Generate specific, achievable quick wins
  if (errorCount > 0) {
    quickWins.push(`Add a visible label before each form field - write "Your Name:", "Email:", "Phone:" next to each input box.`);
  }

  if (contrastCount > 0) {
    quickWins.push('Use a contrast checker tool (like WebAIM Contrast Checker) and aim for a ratio of 4.5:1 or higher.');
  }

  quickWins.push('Add descriptions to images - click on each image in your website editor and add text describing what it shows.');

  if (quickWins.length < 3) {
    quickWins.push('Test your website using only your keyboard (Tab, Enter, Arrow keys) - can you access everything?');
  }

  // Build detailed issues with plain language
  const detailedIssues: WaveAnalysisResult['detailedIssues'] = [];

  if (errorCount > 0) {
    const labelExplanation = getIssueExplanation('label_missing', 'Missing form label');
    detailedIssues.push({
      category: 'Errors',
      severity: 'error',
      description: 'Missing form label - form controls must have associated labels',
      count: Math.max(1, errorCount - 1),
      wcagCriteria: 'WCAG 1.3.1, 4.1.2',
      plainLanguage: labelExplanation.plainLanguage,
      whyItMatters: labelExplanation.whyItMatters,
      howToFix: labelExplanation.howToFix,
      example: labelExplanation.example,
    });

    if (errorCount > 1) {
      const linkExplanation = getIssueExplanation('link_empty', 'Empty link');
      detailedIssues.push({
        category: 'Errors',
        severity: 'error',
        description: 'Empty link - links must contain text or have accessible names',
        count: 1,
        wcagCriteria: 'WCAG 2.4.4',
        plainLanguage: linkExplanation.plainLanguage,
        whyItMatters: linkExplanation.whyItMatters,
        howToFix: linkExplanation.howToFix,
        example: linkExplanation.example,
      });
    }
  }

  if (contrastCount > 0) {
    const contrastExplanation = getIssueExplanation('contrast', 'Low contrast text');
    detailedIssues.push({
      category: 'Contrast',
      severity: 'error',
      description: 'Low contrast text - text does not meet WCAG AA contrast ratio of 4.5:1',
      count: contrastCount,
      wcagCriteria: 'WCAG 1.4.3',
      plainLanguage: contrastExplanation.plainLanguage,
      whyItMatters: contrastExplanation.whyItMatters,
      howToFix: contrastExplanation.howToFix,
      example: contrastExplanation.example,
    });
  }

  const altExplanation = getIssueExplanation('alt_suspicious', 'Suspicious alternative text');
  detailedIssues.push({
    category: 'Alerts',
    severity: 'warning',
    description: 'Suspicious alternative text - alt text may not adequately describe the image',
    count: Math.ceil(alertCount / 2),
    wcagCriteria: 'WCAG 1.1.1',
    plainLanguage: altExplanation.plainLanguage,
    whyItMatters: altExplanation.whyItMatters,
    howToFix: altExplanation.howToFix,
    example: altExplanation.example,
  });

  // Create user-friendly summary
  let summary: string;
  if (score >= 90) {
    summary = `Excellent! Your website is performing well for accessibility. ${featureCount > 0 ? `We detected ${featureCount} accessibility features.` : ''} Keep up the good work and continue to test with real users.`;
  } else if (score >= 70) {
    summary = `Good progress! Your website has solid foundations but there are ${errorCount + contrastCount} issue(s) to address. The quick wins below are easy changes that will help many users.`;
  } else if (score >= 50) {
    summary = `Your website needs some attention. We found ${errorCount} error(s) and ${contrastCount} contrast issue(s) that may prevent some customers from using your site. Start with the quick wins - they're easier than you think!`;
  } else {
    summary = `Your website has some accessibility barriers to address. We found ${errorCount} error(s) that will affect customers with disabilities. The good news is that many of these can be fixed without technical expertise. Focus on one issue at a time.`;
  }

  return {
    url,
    analysisDate: new Date().toISOString(),
    overallScore: score,
    overallStatus: status,
    summary,
    errorCount,
    contrastErrorCount: contrastCount,
    alertCount,
    featureCount,
    structureCount,
    ariaCount,
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 4),
    quickWins: quickWins.slice(0, 3),
    detailedIssues,
    disclaimer: 'This is a simulated analysis showing the type of feedback you would receive. For accurate results, we recommend connecting the live WAVE API. This analysis cannot detect all issues - some require human judgement and testing with real users.',
    isLiveAnalysis: false,
  };
}

/**
 * Simple hash function for generating consistent mock results
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Check if WAVE API is configured and enabled
 */
export function isWaveApiEnabled(): boolean {
  return WAVE_API_ENABLED && !!WAVE_API_KEY;
}

/**
 * Get WAVE API status message
 */
export function getWaveApiStatus(): string {
  if (isWaveApiEnabled()) {
    return 'WAVE API is configured and ready for live analysis';
  }
  return 'Using simulated analysis (WAVE API not configured)';
}
