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

// AI prompt for analyzing accessibility content
const ANALYSIS_PROMPT = `You are an accessibility expert analyzing a webpage that contains accessibility information for a venue or business.

Analyze the content and evaluate it against these accessibility information criteria:

1. **Physical Access Information** (Weight: 5/5)
   - Does it describe entrances, ramps, stairs, lifts, door widths?
   - Are there details about physical navigation within the space?

2. **Parking & Transport** (Weight: 4/5)
   - Are there accessible parking details?
   - Is public transport accessibility mentioned?
   - Are drop-off points described?

3. **Accessible Facilities** (Weight: 4/5)
   - Are accessible toilets mentioned?
   - Are changing facilities described?
   - Are other accessible amenities noted?

4. **Sensory Information** (Weight: 3/5)
   - Is lighting described?
   - Are noise levels or quiet spaces mentioned?
   - Are sensory considerations addressed?

5. **Assistance Available** (Weight: 4/5)
   - Is staff assistance mentioned?
   - Is mobility equipment available?
   - Are support services described?

6. **Communication Options** (Weight: 3/5)
   - Are alternative formats available?
   - Is a hearing loop mentioned?
   - Are other communication aids noted?

7. **Easy to Find** (Weight: 5/5)
   - Is this information easy to locate on the site?
   - Is it prominently linked or labelled?

8. **Clear Navigation** (Weight: 4/5)
   - Is the information well-organized?
   - Are there clear headings and sections?

9. **Contact Information** (Weight: 5/5)
   - Are contact details provided for accessibility questions?
   - Can visitors easily reach out with specific needs?

10. **Visual References** (Weight: 3/5)
    - Are there photos or videos of accessible features?
    - Do images help visitors understand the space?

11. **Honest About Limitations** (Weight: 4/5)
    - Does it acknowledge any accessibility challenges?
    - Is it transparent about areas that need improvement?

12. **Plain Language** (Weight: 4/5)
    - Is the language clear and simple?
    - Is technical jargon avoided or explained?

13. **Specific Details** (Weight: 4/5)
    - Are there concrete measurements and specifics?
    - Does it avoid vague statements like "accessible" without details?

For each criterion, provide:
- A score from 0-100
- A status: "excellent" (80+), "good" (60-79), "needs-improvement" (30-59), or "missing" (0-29)
- Brief feedback explaining the rating
- Specific suggestions for improvement (if applicable)
- Evidence/quotes found (if applicable)

Then provide:
- An overall score (weighted average)
- A summary paragraph
- Top 3 strengths
- Top 3 areas for improvement

Respond in JSON format only.`;

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
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze URL';
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
