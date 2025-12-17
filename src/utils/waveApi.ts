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
  }[];
  disclaimer: string;
  isLiveAnalysis: boolean;
}

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

  // Extract detailed issues
  const detailedIssues: WaveAnalysisResult['detailedIssues'] = [];

  if (categories.error?.items) {
    Object.values(categories.error.items).forEach(item => {
      detailedIssues.push({
        category: 'Errors',
        severity: 'error',
        description: item.description,
        count: item.count,
      });
    });
  }

  if (categories.contrast?.items) {
    Object.values(categories.contrast.items).forEach(item => {
      detailedIssues.push({
        category: 'Contrast',
        severity: 'error',
        description: item.description,
        count: item.count,
      });
    });
  }

  if (categories.alert?.items) {
    Object.values(categories.alert.items).forEach(item => {
      detailedIssues.push({
        category: 'Alerts',
        severity: 'warning',
        description: item.description,
        count: item.count,
      });
    });
  }

  // Generate strengths
  const strengths: string[] = [];
  if (errorCount === 0) strengths.push('No accessibility errors detected');
  if (contrastCount === 0) strengths.push('All colour contrast meets WCAG guidelines');
  if (featureCount > 0) strengths.push(`${featureCount} accessibility features present`);
  if (structureCount > 5) strengths.push('Good page structure with proper headings');
  if (ariaCount > 0) strengths.push('ARIA attributes used for enhanced accessibility');

  // Generate improvements
  const improvements: string[] = [];
  if (errorCount > 0) improvements.push(`Fix ${errorCount} accessibility error(s)`);
  if (contrastCount > 0) improvements.push(`Address ${contrastCount} colour contrast issue(s)`);
  if (alertCount > 0) improvements.push(`Review ${alertCount} accessibility alert(s)`);

  // Generate quick wins
  const quickWins: string[] = [];
  if (improvements.length > 0) {
    quickWins.push('Start with the most critical errors first');
    if (contrastCount > 0) quickWins.push('Improve text contrast for better readability');
    quickWins.push('Add missing alt text to images');
  }

  return {
    url,
    analysisDate: new Date().toISOString(),
    overallScore: score,
    overallStatus: status,
    summary: `Analysis found ${errorCount} errors, ${contrastCount} contrast issues, and ${alertCount} alerts. ${
      score >= 70 ? 'The page meets basic accessibility standards.' : 'Significant improvements are recommended.'
    }`,
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
    disclaimer: 'This analysis uses the WAVE Web Accessibility Evaluation Tool. Results are indicative and should be verified with manual testing and user feedback.',
    isLiveAnalysis: true,
  };
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

  // Generate contextual feedback
  if (errorCount === 0) {
    strengths.push('No critical accessibility errors detected');
  } else {
    improvements.push(`Address ${errorCount} accessibility error(s) that may prevent some users from accessing content`);
    quickWins.push('Focus on fixing errors first as they have the biggest impact');
  }

  if (contrastCount === 0) {
    strengths.push('Colour contrast appears to meet WCAG 2.1 AA standards');
  } else {
    improvements.push(`Improve colour contrast in ${contrastCount} area(s) to ensure text is readable for users with low vision`);
    quickWins.push('Increase contrast between text and background colours');
  }

  if (featureCount > 5) {
    strengths.push(`${featureCount} accessibility features detected including form labels and skip links`);
  }

  if (structureCount > 5) {
    strengths.push('Good semantic structure with proper heading hierarchy');
  } else {
    improvements.push('Consider improving page structure with proper heading levels (H1, H2, H3)');
  }

  if (ariaCount > 0) {
    strengths.push('ARIA attributes present to enhance screen reader experience');
  } else {
    improvements.push('Consider adding ARIA labels for interactive elements');
    quickWins.push('Add aria-label attributes to buttons and links that lack descriptive text');
  }

  if (alertCount > 3) {
    improvements.push(`Review ${alertCount} potential accessibility issues that may affect some users`);
  }

  // Add general quick wins
  quickWins.push('Ensure all images have meaningful alt text');
  quickWins.push('Test your site with a screen reader');

  const detailedIssues: WaveAnalysisResult['detailedIssues'] = [];

  if (errorCount > 0) {
    detailedIssues.push({
      category: 'Errors',
      severity: 'error',
      description: 'Missing form label - form controls must have associated labels',
      count: Math.max(1, errorCount - 1),
      wcagCriteria: 'WCAG 1.3.1, 4.1.2',
    });
    if (errorCount > 1) {
      detailedIssues.push({
        category: 'Errors',
        severity: 'error',
        description: 'Empty link - links must contain text or have accessible names',
        count: 1,
        wcagCriteria: 'WCAG 2.4.4',
      });
    }
  }

  if (contrastCount > 0) {
    detailedIssues.push({
      category: 'Contrast',
      severity: 'error',
      description: 'Low contrast text - text does not meet WCAG AA contrast ratio of 4.5:1',
      count: contrastCount,
      wcagCriteria: 'WCAG 1.4.3',
    });
  }

  detailedIssues.push({
    category: 'Alerts',
    severity: 'warning',
    description: 'Suspicious alternative text - alt text may not adequately describe the image',
    count: Math.ceil(alertCount / 2),
    wcagCriteria: 'WCAG 1.1.1',
  });

  return {
    url,
    analysisDate: new Date().toISOString(),
    overallScore: score,
    overallStatus: status,
    summary: `Simulated analysis found ${errorCount} errors, ${contrastCount} contrast issues, and ${alertCount} alerts. ${
      score >= 70 ? 'The page appears to meet basic accessibility standards.' : 'Improvements are recommended to enhance accessibility.'
    }`,
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
    disclaimer: 'This is a simulated analysis for demonstration purposes. For accurate results, connect the WAVE API or conduct manual accessibility testing. Results do not guarantee WCAG compliance.',
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
