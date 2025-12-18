/**
 * Vision Analysis Service
 *
 * Uses Claude Vision API to analyze images for accessibility.
 * Implements cost controls:
 * - One analysis per image (hash-based caching)
 * - Token cap on responses
 * - Usage logging
 */

import {
  optimizeImageForAnalysis,
  extractBase64,
  getMediaType,
  type OptimizedImage,
} from './imageOptimization';
import type { MediaAnalysisType, MediaAnalysisStatus } from '../types/mediaAnalysis';

// ============================================
// CONFIGURATION
// ============================================

const CLAUDE_API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MAX_TOKENS = 1500; // Cap response tokens for cost control
const MODEL = 'claude-sonnet-4-20250514'; // Use Sonnet for cost efficiency

// Storage keys
const CACHE_KEY = 'vision_analysis_cache';
const USAGE_LOG_KEY = 'vision_analysis_usage';

// ============================================
// TYPES
// ============================================

export interface VisionAnalysisResult {
  id: string;
  imageHash: string;
  analysisType: MediaAnalysisType;
  timestamp: string;
  overallScore: number;
  overallStatus: MediaAnalysisStatus;
  summary: string;
  findings: VisionFinding[];
  strengths: string[];
  improvements: string[];
  quickWins: string[];
  standardsChecked: string[];
  tokensUsed: number;
  cached: boolean;
}

export interface VisionFinding {
  category: string;
  status: 'pass' | 'partial' | 'fail' | 'not-applicable';
  description: string;
  recommendation?: string;
}

export interface UsageLogEntry {
  timestamp: string;
  imageHash: string;
  analysisType: MediaAnalysisType;
  tokensUsed: number;
  cost: number; // Estimated cost in USD
  orgId?: string;
}

// ============================================
// ANALYSIS PROMPTS BY TYPE
// ============================================

const ANALYSIS_PROMPTS: Record<string, string> = {
  signage: `Analyze this signage image for accessibility compliance. Evaluate:

1. **Text Legibility**
   - Font size (minimum 18pt for primary text)
   - Font style (sans-serif preferred)
   - Letter spacing
   - Text contrast ratio against background

2. **Color & Contrast**
   - Contrast ratio (minimum 4.5:1 for normal text, 3:1 for large text)
   - Color combinations that work for color blindness
   - Avoid relying on color alone to convey information

3. **Symbol Recognition**
   - Use of International Symbol of Access where appropriate
   - Clear, universally recognized pictograms
   - Symbols paired with text labels

4. **Physical Placement** (if visible)
   - Mounting height assessment
   - Glare or reflection issues
   - Visibility from wheelchair height

5. **Tactile/Braille Elements** (if visible)
   - Presence of Braille
   - Raised lettering/tactile elements
   - Correct positioning

6. **Lighting** (if assessable)
   - Even illumination
   - Backlit vs front-lit
   - Shadow interference

Standards reference: AS 1428.1, WCAG 2.1 AA, ADA Signage Guidelines

Provide specific, actionable findings. Be constructive, not punitive.`,

  menu: `Analyze this menu for accessibility. Evaluate:

1. **Text Readability**
   - Font size (minimum 14pt, 18pt+ preferred)
   - Font style and weight
   - Line spacing (1.5x minimum)
   - Text contrast

2. **Layout & Organization**
   - Clear section headings
   - Logical flow
   - White space usage
   - Column alignment

3. **Dietary Information**
   - Allergen indicators clearly marked
   - Symbols explained in legend
   - Vegetarian/vegan markers

4. **Color Usage**
   - Sufficient contrast
   - Not relying on color alone
   - Readable for color blindness

5. **Large Print Availability** (if shown)
   - Font size 18pt+
   - Clean layout

Standards reference: WCAG 2.1 AA, Food Standards Code

Be specific and constructive in your feedback.`,

  lighting: `Analyze this image for lighting accessibility. Evaluate:

1. **Illumination Levels**
   - Overall brightness
   - Even distribution
   - Avoid harsh contrasts

2. **Glare & Reflection**
   - Reflective surfaces
   - Window glare
   - Screen visibility

3. **Wayfinding Support**
   - Path visibility
   - Hazard highlighting
   - Step/edge definition

4. **Color Rendering**
   - Natural color appearance
   - Signage readability under lighting

Standards reference: AS 1428.1, Building Code of Australia

Provide practical recommendations.`,

  'entrance': `Analyze this entrance/doorway for accessibility. Evaluate:

1. **Door Characteristics**
   - Door width (minimum 850mm clear)
   - Handle type (lever preferred)
   - Automatic opening if present
   - Vision panel presence

2. **Threshold**
   - Level access or step
   - Threshold height
   - Contrast marking

3. **Signage**
   - Accessible entrance indication
   - Opening direction
   - Automatic door warnings

4. **Surrounding Area**
   - Clear approach path
   - Lighting
   - Weather protection

Standards reference: AS 1428.1, Disability Discrimination Act

Be specific about measurements where visible.`,

  default: `Analyze this image for accessibility considerations. Evaluate:

1. **Visual Accessibility**
   - Contrast and color usage
   - Text legibility if present
   - Symbol clarity

2. **Physical Accessibility** (if applicable)
   - Clear pathways
   - Obstacle identification
   - Surface conditions

3. **Information Accessibility**
   - Clarity of any information displayed
   - Multiple format availability

4. **Safety Considerations**
   - Hazard identification
   - Warning indicators

Provide specific, actionable recommendations based on Australian accessibility standards.`,
};

// ============================================
// CACHE MANAGEMENT
// ============================================

interface AnalysisCache {
  [hash: string]: VisionAnalysisResult;
}

function getCache(): AnalysisCache {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
}

function setCache(hash: string, result: VisionAnalysisResult): void {
  try {
    const cache = getCache();
    cache[hash] = result;

    // Limit cache size (keep last 50 analyses)
    const keys = Object.keys(cache);
    if (keys.length > 50) {
      const oldest = keys
        .map(k => ({ key: k, time: new Date(cache[k].timestamp).getTime() }))
        .sort((a, b) => a.time - b.time)
        .slice(0, keys.length - 50)
        .map(x => x.key);

      oldest.forEach(k => delete cache[k]);
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Failed to cache analysis result:', e);
  }
}

function getCachedResult(hash: string): VisionAnalysisResult | null {
  const cache = getCache();
  return cache[hash] || null;
}

// ============================================
// USAGE LOGGING
// ============================================

function logUsage(entry: UsageLogEntry): void {
  try {
    const logStr = localStorage.getItem(USAGE_LOG_KEY);
    const log: UsageLogEntry[] = logStr ? JSON.parse(logStr) : [];

    log.push(entry);

    // Keep last 100 entries
    if (log.length > 100) {
      log.splice(0, log.length - 100);
    }

    localStorage.setItem(USAGE_LOG_KEY, JSON.stringify(log));
  } catch (e) {
    console.warn('Failed to log usage:', e);
  }
}

export function getUsageLog(): UsageLogEntry[] {
  try {
    const logStr = localStorage.getItem(USAGE_LOG_KEY);
    return logStr ? JSON.parse(logStr) : [];
  } catch {
    return [];
  }
}

export function getUsageStats(): { totalAnalyses: number; totalTokens: number; estimatedCost: number } {
  const log = getUsageLog();
  return {
    totalAnalyses: log.length,
    totalTokens: log.reduce((sum, e) => sum + e.tokensUsed, 0),
    estimatedCost: log.reduce((sum, e) => sum + e.cost, 0),
  };
}

// ============================================
// API INTEGRATION
// ============================================

/**
 * Check if Claude API is configured
 */
export function isVisionApiEnabled(): boolean {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  return !!apiKey && apiKey.length > 0;
}

/**
 * Analyze an image using Claude Vision API
 */
export async function analyzeImageWithVision(
  file: File,
  analysisType: MediaAnalysisType,
  orgId?: string
): Promise<VisionAnalysisResult> {
  // Step 1: Optimize image
  const optimized = await optimizeImageForAnalysis(file);

  // Step 2: Check cache (one analysis per image)
  const cacheKey = `${optimized.hash}_${analysisType}`;
  const cached = getCachedResult(cacheKey);

  if (cached) {
    console.log('Returning cached analysis for', cacheKey);
    return { ...cached, cached: true };
  }

  // Step 3: Check if API is enabled
  if (!isVisionApiEnabled()) {
    // Return simulated result if no API key
    return generateSimulatedResult(optimized, analysisType, orgId);
  }

  // Step 4: Call Claude Vision API
  const result = await callClaudeVisionApi(optimized, analysisType, orgId);

  // Step 5: Cache result
  setCache(cacheKey, result);

  return result;
}

/**
 * Call Claude Vision API
 */
async function callClaudeVisionApi(
  optimized: OptimizedImage,
  analysisType: MediaAnalysisType,
  orgId?: string
): Promise<VisionAnalysisResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  const prompt = ANALYSIS_PROMPTS[analysisType] || ANALYSIS_PROMPTS.default;

  const systemPrompt = `You are an accessibility expert analyzing images for compliance with Australian accessibility standards (AS 1428.1, WCAG 2.1 AA, DDA).

Your response MUST be valid JSON in this exact format:
{
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence summary>",
  "findings": [
    {
      "category": "<category name>",
      "status": "<pass|partial|fail|not-applicable>",
      "description": "<what was observed>",
      "recommendation": "<how to improve, if needed>"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "quickWins": ["<quick win 1>"]
}

Be specific, constructive, and practical. Focus on actionable feedback.
Do not be overly critical - acknowledge what's working well.
If something cannot be assessed from the image, mark it as "not-applicable".`;

  try {
    const response = await fetch(CLAUDE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: getMediaType(optimized.dataUrl),
                  data: extractBase64(optimized.dataUrl),
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text || '';
    const tokensUsed = data.usage?.output_tokens || 0;

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Log usage
    const estimatedCost = (tokensUsed / 1000) * 0.003; // Approximate Sonnet pricing
    logUsage({
      timestamp: new Date().toISOString(),
      imageHash: optimized.hash,
      analysisType,
      tokensUsed,
      cost: estimatedCost,
      orgId,
    });

    // Build result
    const result: VisionAnalysisResult = {
      id: `va_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      imageHash: optimized.hash,
      analysisType,
      timestamp: new Date().toISOString(),
      overallScore: parsed.overallScore || 70,
      overallStatus: scoreToStatus(parsed.overallScore || 70),
      summary: parsed.summary || 'Analysis complete.',
      findings: parsed.findings || [],
      strengths: parsed.strengths || [],
      improvements: parsed.improvements || [],
      quickWins: parsed.quickWins || [],
      standardsChecked: ['AS 1428.1', 'WCAG 2.1 AA', 'DDA'],
      tokensUsed,
      cached: false,
    };

    return result;
  } catch (error) {
    console.error('Vision API error:', error);
    // Fall back to simulated result on error
    return generateSimulatedResult(optimized, analysisType, orgId);
  }
}

/**
 * Generate simulated result (when API not available)
 */
function generateSimulatedResult(
  optimized: OptimizedImage,
  analysisType: MediaAnalysisType,
  orgId?: string
): VisionAnalysisResult {
  // Log as simulated (0 tokens, 0 cost)
  logUsage({
    timestamp: new Date().toISOString(),
    imageHash: optimized.hash,
    analysisType,
    tokensUsed: 0,
    cost: 0,
    orgId,
  });

  const score = Math.floor(Math.random() * 30) + 60; // 60-90 range

  return {
    id: `va_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageHash: optimized.hash,
    analysisType,
    timestamp: new Date().toISOString(),
    overallScore: score,
    overallStatus: scoreToStatus(score),
    summary: `Simulated analysis complete. To enable AI-powered image recognition, add VITE_ANTHROPIC_API_KEY to your .env file.`,
    findings: [
      {
        category: 'Text Legibility',
        status: 'partial',
        description: 'Simulated: Text appears present but detailed analysis requires API.',
        recommendation: 'Enable API for accurate text analysis.',
      },
      {
        category: 'Contrast',
        status: 'pass',
        description: 'Simulated: Contrast appears adequate.',
      },
      {
        category: 'Symbols',
        status: 'not-applicable',
        description: 'Simulated: Unable to assess without API.',
      },
    ],
    strengths: [
      'Image uploaded successfully',
      'Image optimized for analysis',
    ],
    improvements: [
      'Enable AI vision API for detailed accessibility analysis',
      'Upload multiple angles for comprehensive review',
    ],
    quickWins: [
      'Configure VITE_ANTHROPIC_API_KEY for real analysis',
    ],
    standardsChecked: ['AS 1428.1', 'WCAG 2.1 AA'],
    tokensUsed: 0,
    cached: false,
  };
}

function scoreToStatus(score: number): MediaAnalysisStatus {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'needs-improvement';
  return 'poor';
}

/**
 * Analyze multiple images (aggregates results)
 */
export async function analyzeMultipleImages(
  files: File[],
  analysisType: MediaAnalysisType,
  orgId?: string
): Promise<VisionAnalysisResult> {
  if (files.length === 0) {
    throw new Error('No files provided');
  }

  // Analyze each image
  const results = await Promise.all(
    files.map(file => analyzeImageWithVision(file, analysisType, orgId))
  );

  // Aggregate results
  const avgScore = Math.round(
    results.reduce((sum, r) => sum + r.overallScore, 0) / results.length
  );

  // Combine findings (deduplicate by category)
  const findingsMap = new Map<string, VisionFinding>();
  results.forEach(r => {
    r.findings.forEach(f => {
      const existing = findingsMap.get(f.category);
      if (!existing || (f.status === 'fail' && existing.status !== 'fail')) {
        findingsMap.set(f.category, f);
      }
    });
  });

  // Combine and deduplicate arrays
  const allStrengths = [...new Set(results.flatMap(r => r.strengths))];
  const allImprovements = [...new Set(results.flatMap(r => r.improvements))];
  const allQuickWins = [...new Set(results.flatMap(r => r.quickWins))];

  return {
    id: `va_multi_${Date.now()}`,
    imageHash: results.map(r => r.imageHash).join('_'),
    analysisType,
    timestamp: new Date().toISOString(),
    overallScore: avgScore,
    overallStatus: scoreToStatus(avgScore),
    summary: `Analysis of ${files.length} image(s) complete. ${
      results.some(r => r.cached) ? 'Some results from cache.' : ''
    }`,
    findings: Array.from(findingsMap.values()),
    strengths: allStrengths.slice(0, 5),
    improvements: allImprovements.slice(0, 5),
    quickWins: allQuickWins.slice(0, 3),
    standardsChecked: ['AS 1428.1', 'WCAG 2.1 AA', 'DDA'],
    tokensUsed: results.reduce((sum, r) => sum + r.tokensUsed, 0),
    cached: results.every(r => r.cached),
  };
}
