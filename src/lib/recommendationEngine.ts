/**
 * Module Recommendation Engine
 *
 * Deterministic, rule-based module recommendations with transparent logic.
 * Ported from Access Navigator MVP.
 *
 * Two modes:
 * - Mode A: Discovery-driven recommendations (primary)
 * - Mode B: Default starter set (fallback when discovery is skipped/insufficient)
 */

import type {
  JourneyPhase,
  DiscoveryData,
  DiscoveryResponse,
  ModuleScore,
  RecommendedModule,
  RecommendationResult,
  RecommendationWarning,
  WhySuggested,
  JourneyGroup,
} from '../types';

// ============================================================================
// DISCOVERY QUESTION IDs (Canonical)
// ============================================================================

export interface DiscoveryQuestion {
  id: string;
  text: string;
  journeyPhase: JourneyPhase;
  touchpointId: string;
}

export const DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  { id: 'DQ01', text: 'Do customers typically visit your website before coming?', journeyPhase: 'before-arrival', touchpointId: 'finding-online' },
  { id: 'DQ02', text: 'Do customers book or make reservations before visiting?', journeyPhase: 'before-arrival', touchpointId: 'booking' },
  { id: 'DQ03', text: 'Do you provide information about accessibility features?', journeyPhase: 'before-arrival', touchpointId: 'planning-visit' },
  { id: 'DQ04', text: 'Do customers need to understand costs or policies before arrival?', journeyPhase: 'before-arrival', touchpointId: 'costs-policies' },
  { id: 'DQ05', text: 'Do customers ask questions or make enquiries before visiting?', journeyPhase: 'before-arrival', touchpointId: 'enquiries' },
  { id: 'DQ06', text: 'Do customers typically drive and park at your location?', journeyPhase: 'during-visit', touchpointId: 'getting-in' },
  { id: 'DQ07', text: 'Do customers move through multiple areas or spaces during their visit?', journeyPhase: 'during-visit', touchpointId: 'getting-in' },
  { id: 'DQ08', text: 'Do customers typically sit down during their visit?', journeyPhase: 'during-visit', touchpointId: 'using-space' },
  { id: 'DQ09', text: 'Do customers use toilet facilities during their visit?', journeyPhase: 'during-visit', touchpointId: 'using-space' },
  { id: 'DQ10', text: 'Is lighting, noise, or sensory environment relevant to your space?', journeyPhase: 'during-visit', touchpointId: 'sensory' },
  { id: 'DQ11', text: 'Do staff regularly interact directly with customers?', journeyPhase: 'during-visit', touchpointId: 'staff-interaction' },
  { id: 'DQ12', text: 'Do you support customers with assistance animals or specific support needs?', journeyPhase: 'during-visit', touchpointId: 'staff-interaction' },
  { id: 'DQ13', text: 'Do you collect feedback or handle complaints?', journeyPhase: 'after-visit', touchpointId: 'feedback' },
  { id: 'DQ14', text: 'Do you stay connected with customers after their visit?', journeyPhase: 'after-visit', touchpointId: 'staying-connected-touchpoint' },
];

// ============================================================================
// MODULE SET (Fixed for V1)
// ============================================================================

export interface ModuleDefinition {
  id: string;
  name: string;
  journeyTheme: JourneyPhase;
  estimatedTime: number;
}

export const MODULES: ModuleDefinition[] = [
  { id: 'M01', name: 'Digital accessibility (website & online content)', journeyTheme: 'before-arrival', estimatedTime: 15 },
  { id: 'M02', name: 'Information & communication (pre-visit info, materials)', journeyTheme: 'before-arrival', estimatedTime: 12 },
  { id: 'M03', name: 'Booking & transactions', journeyTheme: 'before-arrival', estimatedTime: 12 },
  { id: 'M04', name: 'Policies, pricing & support information', journeyTheme: 'before-arrival', estimatedTime: 10 },
  { id: 'M05', name: 'Arrival & entry', journeyTheme: 'during-visit', estimatedTime: 12 },
  { id: 'M06', name: 'Internal movement & wayfinding', journeyTheme: 'during-visit', estimatedTime: 12 },
  { id: 'M07', name: 'Seating, amenities & toilets', journeyTheme: 'during-visit', estimatedTime: 15 },
  { id: 'M08', name: 'Sensory environment (lighting, noise, calm spaces)', journeyTheme: 'during-visit', estimatedTime: 12 },
  { id: 'M09', name: 'Customer service & staff confidence', journeyTheme: 'during-visit', estimatedTime: 15 },
  { id: 'M10', name: 'Feedback & complaints', journeyTheme: 'after-visit', estimatedTime: 10 },
  { id: 'M11', name: 'Staying connected & return visits', journeyTheme: 'after-visit', estimatedTime: 10 },
];

// Map new module IDs to existing module codes for backward compatibility
export const MODULE_ID_TO_CODE: Record<string, string> = {
  'M01': 'B4.1',  // Digital accessibility -> Website Basics
  'M02': 'B1',    // Information & communication -> Pre-visit Information
  'M03': 'B4.2',  // Booking & transactions -> Online Transactions
  'M04': 'B2',    // Policies, pricing -> Information Access
  'M05': 'A1',    // Arrival & entry -> Arrival and Parking (includes A2)
  'M06': 'A3a',   // Internal movement -> Internal Movement
  'M07': 'A6',    // Seating, amenities, toilets -> Toilets & Amenities (includes A4, A5)
  'M08': 'A7',    // Sensory environment -> Sensory Environment
  'M09': 'C1',    // Customer service -> Customer Service
  'M10': 'C3',    // Feedback & complaints -> Complaints & Feedback
  'M11': 'B3',    // Staying connected -> Feedback Systems
};

export const CODE_TO_MODULE_ID: Record<string, string> = Object.entries(MODULE_ID_TO_CODE).reduce(
  (acc, [moduleId, code]) => ({ ...acc, [code]: moduleId }),
  {}
);

// ============================================================================
// DISCOVERY -> MODULE MAPPING TABLE
// ============================================================================

// Maps touchpoint IDs to module IDs
export const TOUCHPOINT_TO_MODULES: Record<string, string[]> = {
  'finding-online': ['M01', 'M02'],
  'booking': ['M03', 'M01'],
  'planning-visit': ['M02'],
  'costs-policies': ['M04'],
  'enquiries': ['M09'],
  'getting-in': ['M05', 'M06'],
  'using-space': ['M07'],
  'wayfinding': ['M06', 'M02'],
  'sensory': ['M08'],
  'staff-interaction': ['M09', 'M04'],
  'feedback': ['M10'],
  'staying-connected-touchpoint': ['M11'],
  'return-visits': ['M11', 'M10'],
};

// ============================================================================
// SCORING SYSTEM
// ============================================================================

/**
 * Calculate relevance scores for all modules based on discovery responses
 *
 * Scoring:
 * - Selected touchpoint (implicit "Yes"): +2 points
 * - "Not sure" response: +1 point
 * - "No" response or not selected: 0 points
 */
export function calculateModuleScores(discoveryData: DiscoveryData): ModuleScore[] {
  const scores: Record<string, ModuleScore> = {};

  // Initialize all modules with 0 score
  MODULES.forEach(module => {
    scores[module.id] = {
      moduleId: module.id,
      score: 0,
      triggeringTouchpoints: [],
      triggeringQuestions: [],
    };
  });

  // For each selected touchpoint, add points to mapped modules
  discoveryData.selectedTouchpoints.forEach(touchpointId => {
    const mappedModules = TOUCHPOINT_TO_MODULES[touchpointId] || [];
    const response = discoveryData.responses?.[touchpointId] || 'yes';

    const points = response === 'yes' ? 2 : response === 'not-sure' ? 1 : 0;

    if (points > 0) {
      mappedModules.forEach(moduleId => {
        scores[moduleId].score += points;
        if (!scores[moduleId].triggeringTouchpoints.includes(touchpointId)) {
          scores[moduleId].triggeringTouchpoints.push(touchpointId);
        }
      });
    }
  });

  return Object.values(scores);
}

// ============================================================================
// DEFAULT STARTER SETS BY INDUSTRY (Mode B)
// ============================================================================

export const INDUSTRY_DEFAULT_MODULES: Record<string, string[]> = {
  'tourism': ['M05', 'M09', 'M02', 'M06'],
  'hospitality': ['M09', 'M07', 'M08', 'M05'],
  'accommodation': ['M03', 'M07', 'M05', 'M09'],
  'events': ['M05', 'M06', 'M09', 'M08'],
  'retail': ['M05', 'M06', 'M09', 'M03'],
  'corporate': ['M01', 'M02', 'M09', 'M06'],
  'local-government': ['M01', 'M02', 'M04', 'M09'],
  'health': ['M09', 'M05', 'M07', 'M04'],
  'education': ['M02', 'M09', 'M06', 'M01'],
  'cafe-restaurant': ['M09', 'M07', 'M08', 'M05'],
  'tour-operator': ['M09', 'M05', 'M06', 'M02'],
  'attraction-museum-gallery': ['M05', 'M06', 'M09', 'M08'],
  'visitor-centre': ['M02', 'M09', 'M05', 'M06'],
  'other': ['M09', 'M02', 'M05'],
};

// Service type priority for tie-breaking
export const SERVICE_TYPE_PRIORITY: Record<string, string[]> = {
  'restaurant': ['M08', 'M07', 'M09', 'M05'],
  'cafe': ['M08', 'M07', 'M09', 'M05'],
  'bar': ['M08', 'M07', 'M09', 'M05'],
  'hotel': ['M07', 'M05', 'M09', 'M03'],
  'tour': ['M09', 'M05', 'M06', 'M02'],
  'corporate': ['M01', 'M02', 'M09', 'M06'],
  'retail': ['M05', 'M06', 'M09', 'M03'],
  'event': ['M05', 'M08', 'M06', 'M09'],
  'other': [],
};

// ============================================================================
// TOUCHPOINT LABELS (Human-readable)
// ============================================================================

const TOUCHPOINT_LABELS: Record<string, string> = {
  'finding-online': 'Customers visit your website before coming',
  'booking': 'Customers book or make reservations',
  'planning-visit': 'You provide accessibility information',
  'costs-policies': 'Customers understand costs and policies before arrival',
  'enquiries': 'Customers ask questions before visiting',
  'getting-in': 'Customers drive and park, or move through spaces',
  'using-space': 'Customers sit down or use facilities',
  'wayfinding': 'Customers find their way around',
  'sensory': 'Lighting, noise, or sensory environment is relevant',
  'staff-interaction': 'Staff regularly interact with customers',
  'feedback': 'You collect feedback or handle complaints',
  'staying-connected-touchpoint': 'You stay connected after visits',
  'return-visits': 'You encourage return visits',
};

// ============================================================================
// RECOMMENDATION ALGORITHM
// ============================================================================

export function generateRecommendations(
  discoveryData: DiscoveryData | null,
  industryId: string = 'other',
  serviceType: string = 'other'
): RecommendationResult {
  const warnings: RecommendationWarning[] = [];

  // MODE B: No discovery data - use defaults
  if (!discoveryData || discoveryData.selectedTouchpoints.length === 0) {
    return generateDefaultStarterSet(industryId, serviceType, 'skipped');
  }

  // MODE A: Discovery-driven
  const scores = calculateModuleScores(discoveryData);
  const threshold = 2;

  // Count response types
  const notSureCount = Object.values(discoveryData.responses || {}).filter(r => r === 'not-sure').length;
  const totalResponses = discoveryData.selectedTouchpoints.length;

  // Check for edge cases
  if (notSureCount >= totalResponses * 0.5 && totalResponses > 2) {
    warnings.push({
      type: 'many-not-sure',
      message: "Many of your Discovery responses were \"Not sure.\" This means our recommendations are less confident. Consider revisiting Discovery with a colleague or choosing Detailed Review for guided support.",
    });
  }

  // Get modules that meet threshold
  const meetingThreshold = scores
    .filter(s => s.score >= threshold)
    .sort((a, b) => b.score - a.score);

  // EDGE CASE: All "No" or insufficient signal
  if (meetingThreshold.length === 0) {
    warnings.push({
      type: 'all-no',
      message: "We noticed you indicated most touchpoints don't apply to your business. We've suggested common starting points.",
    });
    return generateDefaultStarterSet(industryId, serviceType, 'insufficient-signal', warnings);
  }

  // Apply minimum of 3 modules rule with padding
  let recommended = [...meetingThreshold];

  if (recommended.length < 3) {
    // Get highest-scoring remaining modules from same journey phases
    const selectedPhases = new Set(
      discoveryData.selectedTouchpoints.map(t => {
        const question = DISCOVERY_QUESTIONS.find(q => q.touchpointId === t);
        return question?.journeyPhase;
      }).filter(Boolean)
    );

    const paddingCandidates = scores
      .filter(s => s.score < threshold && s.score > 0)
      .filter(s => {
        const module = MODULES.find(m => m.id === s.moduleId);
        return module && selectedPhases.has(module.journeyTheme);
      })
      .sort((a, b) => b.score - a.score);

    // Add padding from same phases
    while (recommended.length < 3 && paddingCandidates.length > 0) {
      const next = paddingCandidates.shift()!;
      next.triggeringTouchpoints.push('_padding_same_phase');
      recommended.push(next);
    }

    // If still under 3, use industry defaults
    if (recommended.length < 3) {
      const defaults = INDUSTRY_DEFAULT_MODULES[industryId] || INDUSTRY_DEFAULT_MODULES['other'];
      const existingIds = new Set(recommended.map(r => r.moduleId));

      for (const moduleId of defaults) {
        if (!existingIds.has(moduleId) && recommended.length < 3) {
          recommended.push({
            moduleId,
            score: 0,
            triggeringTouchpoints: ['_padding_industry_default'],
            triggeringQuestions: [],
          });
          existingIds.add(moduleId);
        }
      }
    }
  }

  // EDGE CASE: Too many modules (10+)
  if (recommended.length >= 10) {
    warnings.push({
      type: 'too-many-modules',
      message: `Accessibility touches many parts of your business (${recommended.length} modules). Most organizations start with 5-6 priority modules and add more over time.`,
    });
  }

  // Order modules
  const orderedRecommended = orderModules(recommended, discoveryData, serviceType);

  // Split into recommended (top 6-8) and also relevant
  const mainRecommended = orderedRecommended.slice(0, 6);
  const alsoRelevantModules = orderedRecommended.slice(6);

  // Convert to RecommendedModule format
  const recommendedModules = mainRecommended.map(s => toRecommendedModule(s, discoveryData));
  const alsoRelevantFormatted = alsoRelevantModules.map(s => toRecommendedModule(s, discoveryData));

  // Determine confidence level
  let confidenceLevel: 'high' | 'medium' | 'low' = 'high';
  if (notSureCount >= totalResponses * 0.5) {
    confidenceLevel = 'low';
  } else if (notSureCount > 0 || recommended.some(r => r.score < 3)) {
    confidenceLevel = 'medium';
  }

  // Build reasoning
  const selectedPhaseNames = new Set<string>();
  discoveryData.selectedTouchpoints.forEach(t => {
    const q = DISCOVERY_QUESTIONS.find(dq => dq.touchpointId === t);
    if (q) selectedPhaseNames.add(q.journeyPhase);
  });

  const phaseDisplay = Array.from(selectedPhaseNames)
    .map(p => p === 'before-arrival' ? 'before they arrive' : p === 'during-visit' ? 'during their visit' : 'staying connected')
    .join(', ');

  const reasoning = `Based on what you shared, accessibility shows up most in areas related to ${phaseDisplay}. These modules help you focus on those areas first. You can add or remove modules at any time.`;

  return {
    mode: 'discovery-driven',
    recommendedModules,
    alsoRelevant: alsoRelevantFormatted,
    warnings,
    reasoning,
    confidenceLevel,
  };
}

function generateDefaultStarterSet(
  industryId: string,
  serviceType: string,
  reason: 'skipped' | 'insufficient-signal',
  existingWarnings: RecommendationWarning[] = []
): RecommendationResult {
  const defaults = INDUSTRY_DEFAULT_MODULES[industryId] || INDUSTRY_DEFAULT_MODULES['other'];
  const industryName = industryId !== 'other' ? industryId.replace(/-/g, ' ') : undefined;

  const recommendedModules: RecommendedModule[] = defaults.map(moduleId => {
    const module = MODULES.find(m => m.id === moduleId)!;
    return {
      moduleId,
      moduleName: module.name,
      moduleCode: MODULE_ID_TO_CODE[moduleId] || moduleId,
      journeyTheme: module.journeyTheme,
      estimatedTime: module.estimatedTime,
      score: 0,
      whySuggested: {
        type: 'default-starter' as const,
        triggeringTouchpoints: [],
        triggeringQuestionTexts: [],
        industryName,
      },
    };
  });

  const reasoning = reason === 'skipped'
    ? `Since you skipped Discovery, we've suggested common starting points${industryName ? ` for ${industryName}` : ''}. You can adjust these based on what's most relevant to you.`
    : `We noticed you indicated most touchpoints don't apply to your business. We've suggested common starting points${industryName ? ` for ${industryName}` : ''}, but feel free to choose what's most relevant.`;

  return {
    mode: 'default-starter-set',
    recommendedModules,
    alsoRelevant: [],
    warnings: existingWarnings,
    reasoning,
    confidenceLevel: 'low',
  };
}

function orderModules(
  modules: ModuleScore[],
  discoveryData: DiscoveryData,
  serviceType: string
): ModuleScore[] {
  // Count "Yes" per phase for secondary sort
  const phaseCounts: Record<string, number> = {
    'before-arrival': 0,
    'during-visit': 0,
    'after-visit': 0,
  };

  discoveryData.selectedTouchpoints.forEach(t => {
    const response = discoveryData.responses?.[t] || 'yes';
    if (response === 'yes') {
      const question = DISCOVERY_QUESTIONS.find(q => q.touchpointId === t);
      if (question) {
        phaseCounts[question.journeyPhase]++;
      }
    }
  });

  const dominantPhase = Object.entries(phaseCounts).sort((a, b) => b[1] - a[1])[0][0];
  const servicePriority = SERVICE_TYPE_PRIORITY[serviceType] || [];

  return [...modules].sort((a, b) => {
    // Primary: score (descending)
    if (b.score !== a.score) return b.score - a.score;

    // Secondary: journey phase priority (prefer dominant phase)
    const moduleA = MODULES.find(m => m.id === a.moduleId)!;
    const moduleB = MODULES.find(m => m.id === b.moduleId)!;

    const aInDominant = moduleA.journeyTheme === dominantPhase;
    const bInDominant = moduleB.journeyTheme === dominantPhase;
    if (aInDominant && !bInDominant) return -1;
    if (!aInDominant && bInDominant) return 1;

    // Tertiary: service type priority
    const aServicePriority = servicePriority.indexOf(a.moduleId);
    const bServicePriority = servicePriority.indexOf(b.moduleId);
    if (aServicePriority !== -1 && bServicePriority !== -1) {
      return aServicePriority - bServicePriority;
    }
    if (aServicePriority !== -1) return -1;
    if (bServicePriority !== -1) return 1;

    // Quaternary: alphabetical by module ID
    return a.moduleId.localeCompare(b.moduleId);
  });
}

function toRecommendedModule(score: ModuleScore, discoveryData: DiscoveryData | null): RecommendedModule {
  const module = MODULES.find(m => m.id === score.moduleId)!;

  // Determine "why suggested" type
  const isPadding = score.triggeringTouchpoints.some(t => t.startsWith('_padding'));
  const isIndustryDefault = score.triggeringTouchpoints.includes('_padding_industry_default');

  let whySuggestedType: 'discovery' | 'default-starter' | 'padding' = 'discovery';
  if (isIndustryDefault) {
    whySuggestedType = 'default-starter';
  } else if (isPadding) {
    whySuggestedType = 'padding';
  }

  // Build human-readable question texts
  const triggeringQuestionTexts = score.triggeringTouchpoints
    .filter(t => !t.startsWith('_padding'))
    .map(t => TOUCHPOINT_LABELS[t] || t);

  return {
    moduleId: score.moduleId,
    moduleName: module.name,
    moduleCode: MODULE_ID_TO_CODE[score.moduleId] || score.moduleId,
    journeyTheme: module.journeyTheme,
    estimatedTime: module.estimatedTime,
    score: score.score,
    whySuggested: {
      type: whySuggestedType,
      triggeringTouchpoints: score.triggeringTouchpoints.filter(t => !t.startsWith('_padding')),
      triggeringQuestionTexts,
    },
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function moduleCodesToIds(codes: string[]): string[] {
  return codes.map(code => CODE_TO_MODULE_ID[code] || code);
}

export function moduleIdsToCodes(ids: string[]): string[] {
  return ids.map(id => MODULE_ID_TO_CODE[id] || id);
}

export function groupModulesByJourney(modules: RecommendedModule[]): JourneyGroup[] {
  const groups: JourneyGroup[] = [
    { phase: 'before-arrival', label: 'Before arrival', modules: [] },
    { phase: 'during-visit', label: 'During visit', modules: [] },
    { phase: 'after-visit', label: 'After visit', modules: [] },
  ];

  modules.forEach(module => {
    const group = groups.find(g => g.phase === module.journeyTheme);
    if (group) {
      group.modules.push(module);
    }
  });

  // Filter out empty groups
  return groups.filter(g => g.modules.length > 0);
}

// ============================================================================
// DEPTH RECOMMENDATION
// ============================================================================

export interface DepthRecommendation {
  recommendedDepth: 'foundation' | 'detailed';
  touchpointCount: number;
  phaseCount: number;
  reasoning: string;
}

export function calculateDepthRecommendation(
  selectedTouchpoints: string[]
): DepthRecommendation {
  const selectedPhases = new Set<string>();

  selectedTouchpoints.forEach(touchpointId => {
    const question = DISCOVERY_QUESTIONS.find(q => q.touchpointId === touchpointId);
    if (question) {
      selectedPhases.add(question.journeyPhase);
    }
  });

  const touchpointCount = selectedTouchpoints.length;
  const phaseCount = selectedPhases.size;
  const hasMultiplePhases = phaseCount >= 2;
  const hasManyTouchpoints = touchpointCount >= 6;

  const recommendedDepth = (hasManyTouchpoints && hasMultiplePhases) ? 'detailed' : 'foundation';

  const reasoning = recommendedDepth === 'detailed'
    ? `You selected ${touchpointCount} touchpoints across ${phaseCount} journey phases. A detailed review will give you comprehensive guidance.`
    : `You selected ${touchpointCount} touchpoint${touchpointCount !== 1 ? 's' : ''}. A foundation review will help you get started quickly.`;

  return {
    recommendedDepth,
    touchpointCount,
    phaseCount,
    reasoning,
  };
}
