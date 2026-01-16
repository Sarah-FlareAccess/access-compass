/**
 * URL Analysis Hook
 *
 * Analyzes accessibility information pages and provides feedback
 * based on predefined accessibility criteria.
 */

import { useState, useCallback } from 'react';

// Accessibility feedback parameters
export interface AccessibilityFeedbackParameter {
  id: string;
  name: string;
  description: string;
  weight: number; // Importance weight 1-5
  category: 'content' | 'structure' | 'completeness' | 'clarity';
}

export const ACCESSIBILITY_PARAMETERS: AccessibilityFeedbackParameter[] = [
  // Content Parameters
  {
    id: 'physical-access',
    name: 'Physical Access Information',
    description: 'Information about entrances, ramps, stairs, lifts, and physical navigation',
    weight: 5,
    category: 'content',
  },
  {
    id: 'parking',
    name: 'Parking & Transport',
    description: 'Details about accessible parking, drop-off points, and public transport access',
    weight: 4,
    category: 'content',
  },
  {
    id: 'toilets',
    name: 'Accessible Facilities',
    description: 'Information about accessible toilets, changing places, and amenities',
    weight: 4,
    category: 'content',
  },
  {
    id: 'sensory',
    name: 'Sensory Information',
    description: 'Details about lighting, noise levels, quiet spaces, and sensory considerations',
    weight: 3,
    category: 'content',
  },
  {
    id: 'assistance',
    name: 'Assistance Available',
    description: 'Information about staff assistance, mobility equipment, and support services',
    weight: 4,
    category: 'content',
  },
  {
    id: 'communication',
    name: 'Communication Options',
    description: 'Alternative formats, hearing loops, sign language, and communication aids',
    weight: 3,
    category: 'content',
  },
  // Structure Parameters
  {
    id: 'findability',
    name: 'Easy to Find',
    description: 'Accessibility information is prominently placed and easy to locate',
    weight: 5,
    category: 'structure',
  },
  {
    id: 'navigation',
    name: 'Clear Navigation',
    description: 'Information is well-organised with clear headings and sections',
    weight: 4,
    category: 'structure',
  },
  // Completeness Parameters
  {
    id: 'contact-info',
    name: 'Contact Information',
    description: 'Clear contact details for accessibility questions or requests',
    weight: 5,
    category: 'completeness',
  },
  {
    id: 'photos-media',
    name: 'Visual References',
    description: 'Photos or videos showing accessible features and spaces',
    weight: 3,
    category: 'completeness',
  },
  {
    id: 'limitations',
    name: 'Honest About Limitations',
    description: 'Transparent about areas that may present challenges',
    weight: 4,
    category: 'completeness',
  },
  // Clarity Parameters
  {
    id: 'plain-language',
    name: 'Plain Language',
    description: 'Information written in clear, simple language without jargon',
    weight: 4,
    category: 'clarity',
  },
  {
    id: 'specific-details',
    name: 'Specific Details',
    description: 'Concrete measurements, numbers, and specifics rather than vague statements',
    weight: 4,
    category: 'clarity',
  },
];

// Success indicator levels
export type SuccessLevel = 'excellent' | 'good' | 'needs-improvement' | 'missing';

export interface ParameterResult {
  parameterId: string;
  parameterName: string;
  status: SuccessLevel;
  score: number; // 0-100
  feedback: string;
  suggestions?: string[];
  evidenceFound?: string[];
}

export interface UrlAnalysisResult {
  url: string;
  analysisDate: string;
  overallScore: number; // 0-100
  overallStatus: SuccessLevel;
  summary: string;
  strengths: string[];
  improvements: string[];
  parameterResults: ParameterResult[];
  disclaimer: string;
}

export interface UseUrlAnalysisReturn {
  isAnalyzing: boolean;
  error: string | null;
  result: UrlAnalysisResult | null;
  analyzeUrl: (url: string) => Promise<UrlAnalysisResult | null>;
  reset: () => void;
}

export function useUrlAnalysis(): UseUrlAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);

  const analyzeUrl = useCallback(async (url: string): Promise<UrlAnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Validate URL
      let validUrl: URL;
      try {
        validUrl = new URL(url);
        if (!validUrl.protocol.startsWith('http')) {
          throw new Error('URL must start with http:// or https://');
        }
      } catch {
        throw new Error('Please enter a valid URL (e.g., https://example.com/accessibility)');
      }

      // Fetch the URL content via a proxy or CORS-enabled endpoint
      // For now, we'll use a simulated analysis based on URL patterns
      // In production, this would call an AI API endpoint

      // Simulated delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate analysis result
      // In production, this would call the AI API with the fetched content
      const analysisResult = await performAnalysis(url);

      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyse URL';
      setError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsAnalyzing(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    isAnalyzing,
    error,
    result,
    analyzeUrl,
    reset,
  };
}

// Perform the actual analysis
// In production, this would call an AI API endpoint
async function performAnalysis(url: string): Promise<UrlAnalysisResult> {
  // This is a placeholder implementation
  // In production, you would:
  // 1. Fetch the URL content (via server-side proxy to avoid CORS)
  // 2. Send content to AI API (Claude, GPT, etc.)
  // 3. Parse and return the structured response

  // For MVP, return a template result that can be enhanced with real AI
  const parameterResults: ParameterResult[] = ACCESSIBILITY_PARAMETERS.map(param => ({
    parameterId: param.id,
    parameterName: param.name,
    status: 'needs-improvement' as SuccessLevel,
    score: 50,
    feedback: `Analysis pending for ${param.name.toLowerCase()}. Submit URL for detailed AI analysis.`,
    suggestions: [`Consider adding more details about ${param.name.toLowerCase()}`],
    evidenceFound: [],
  }));

  // Calculate overall score
  const totalWeight = ACCESSIBILITY_PARAMETERS.reduce((sum, p) => sum + p.weight, 0);
  const weightedScore = parameterResults.reduce((sum, result, index) => {
    return sum + (result.score * ACCESSIBILITY_PARAMETERS[index].weight);
  }, 0);
  const overallScore = Math.round(weightedScore / totalWeight);

  const getOverallStatus = (score: number): SuccessLevel => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 30) return 'needs-improvement';
    return 'missing';
  };

  return {
    url,
    analysisDate: new Date().toISOString(),
    overallScore,
    overallStatus: getOverallStatus(overallScore),
    summary: `This accessibility information page has been submitted for analysis. The AI will review the content against 13 accessibility information criteria covering content, structure, completeness, and clarity.`,
    strengths: [
      'Accessibility information is being shared publicly',
      'Commitment to providing pre-visit information demonstrated',
      'Page is accessible for review',
    ],
    improvements: [
      'Ensure specific measurements and details are included',
      'Add photos or videos of accessible features',
      'Include clear contact information for accessibility enquiries',
    ],
    parameterResults,
    disclaimer: 'This review is indicative only and based on publicly available information. It does not verify accuracy or confirm compliance with accessibility standards.',
  };
}

// Helper to get status color
export function getStatusColor(status: SuccessLevel): { bg: string; text: string; border: string } {
  switch (status) {
    case 'excellent':
      return { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a', border: '#22c55e' };
    case 'good':
      return { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb', border: '#3b82f6' };
    case 'needs-improvement':
      return { bg: 'rgba(251, 191, 36, 0.1)', text: '#d97706', border: '#fbbf24' };
    case 'missing':
      return { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626', border: '#ef4444' };
  }
}

// Helper to get status label
export function getStatusLabel(status: SuccessLevel): string {
  switch (status) {
    case 'excellent':
      return 'Excellent';
    case 'good':
      return 'Good';
    case 'needs-improvement':
      return 'Needs Improvement';
    case 'missing':
      return 'Missing';
  }
}
