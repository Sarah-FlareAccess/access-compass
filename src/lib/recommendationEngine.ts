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
  ModuleScore,
  RecommendedModule,
  RecommendationResult,
  RecommendationWarning,
  JourneyGroup,
  CalibrationData,
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
  description: string;
}

export const MODULES: ModuleDefinition[] = [
  // Before they arrive (4 modules)
  { id: 'B1', name: 'Pre-visit information', journeyTheme: 'before-arrival', estimatedTime: 12,
    description: 'Helps customers plan their visit with confidence. Relevant if people research you online before arriving.' },
  { id: 'B4.1', name: 'Website basics', journeyTheme: 'before-arrival', estimatedTime: 15,
    description: 'Ensures your website works for everyone. Relevant if customers find you through your website.' },
  { id: 'B4.2', name: 'Booking systems and forms', journeyTheme: 'before-arrival', estimatedTime: 10,
    description: 'Makes online booking accessible. Relevant if you take bookings or have online forms.' },
  { id: 'B4.3', name: 'Video and social media', journeyTheme: 'before-arrival', estimatedTime: 10,
    description: 'Ensures your content reaches everyone. Relevant if you use video or social media marketing.' },
  // Getting in and moving around (4 modules)
  { id: 'A1', name: 'Arrival, parking and drop-off', journeyTheme: 'during-visit', estimatedTime: 15,
    description: 'Helps customers get to your door. Relevant if you have a physical location customers visit.' },
  { id: 'A2', name: 'Entry and doors', journeyTheme: 'during-visit', estimatedTime: 12,
    description: 'Ensures everyone can get inside. Relevant if your entrance has steps, heavy doors, or narrow access.' },
  { id: 'A3a', name: 'Paths and aisles', journeyTheme: 'during-visit', estimatedTime: 12,
    description: 'Makes moving around easy. Relevant if customers navigate through your space.' },
  { id: 'A3b', name: 'Queues and busy times', journeyTheme: 'during-visit', estimatedTime: 10,
    description: 'Manages crowds comfortably. Relevant if customers wait in line or you have peak periods.' },
  // During the visit (5 modules)
  { id: 'A4', name: 'Seating, furniture and layout', journeyTheme: 'during-visit', estimatedTime: 12,
    description: 'Provides comfortable options for all. Relevant if customers sit, dine, or spend time in your space.' },
  { id: 'A5', name: 'Toilets and amenities', journeyTheme: 'during-visit', estimatedTime: 15,
    description: 'Ensures facilities work for everyone. Relevant if you have customer toilets or changing facilities.' },
  { id: 'A6', name: 'Lighting, sound and sensory environment', journeyTheme: 'during-visit', estimatedTime: 12,
    description: 'Creates a comfortable atmosphere. Relevant if your space has music, lighting, or could be overwhelming.' },
  { id: 'B2', name: 'Signage and wayfinding', journeyTheme: 'during-visit', estimatedTime: 12,
    description: 'Helps people find their way. Relevant if customers need to navigate or find specific areas.' },
  { id: 'B3', name: 'Menus and printed materials', journeyTheme: 'during-visit', estimatedTime: 10,
    description: 'Makes information readable for all. Relevant if you have menus, brochures, or price lists.' },
  // Service and support (4 modules)
  { id: 'C1', name: 'Customer service and staff confidence', journeyTheme: 'during-visit', estimatedTime: 15,
    description: 'Prepares your team to help everyone. Relevant for any business with customer-facing staff.' },
  { id: 'C2', name: 'Bookings, payments and flexibility', journeyTheme: 'during-visit', estimatedTime: 10,
    description: 'Makes transactions smooth for all. Relevant if customers book, pay, or need flexible options.' },
  { id: 'A7', name: 'Safety and emergencies', journeyTheme: 'during-visit', estimatedTime: 12,
    description: 'Keeps everyone safe. Relevant if you need evacuation plans or safety procedures.' },
  { id: 'C3', name: 'Learning from your customers', journeyTheme: 'after-visit', estimatedTime: 10,
    description: 'Helps you improve over time. Relevant if you want ongoing feedback to guide improvements.' },
];

// Module IDs now match codes directly (no mapping needed)
// This is kept for backward compatibility
export const MODULE_ID_TO_CODE: Record<string, string> = {
  'B1': 'B1',
  'B4.1': 'B4.1',
  'B4.2': 'B4.2',
  'B4.3': 'B4.3',
  'A1': 'A1',
  'A2': 'A2',
  'A3a': 'A3a',
  'A3b': 'A3b',
  'A4': 'A4',
  'A5': 'A5',
  'A6': 'A6',
  'B2': 'B2',
  'B3': 'B3',
  'C1': 'C1',
  'C2': 'C2',
  'A7': 'A7',
  'C3': 'C3',
};

export const CODE_TO_MODULE_ID: Record<string, string> = { ...MODULE_ID_TO_CODE };

// ============================================================================
// DISCOVERY -> MODULE MAPPING TABLE
// ============================================================================

// Maps touchpoint IDs to module codes
// Each touchpoint can trigger multiple relevant modules
export const TOUCHPOINT_TO_MODULES: Record<string, string[]> = {
  // Before arrival touchpoints
  'finding-online': ['B4.1', 'B1', 'B4.3'],           // Website, pre-visit info, video/social
  'booking': ['B4.2', 'B4.1', 'C2'],                  // Booking systems, website, payments
  'planning-visit': ['B1', 'B4.1'],                   // Pre-visit info, website
  'costs-policies': ['C2', 'B1'],                     // Payments/flexibility, pre-visit info
  'enquiries': ['C1', 'B1'],                          // Customer service, pre-visit info

  // During visit touchpoints
  'getting-in': ['A1', 'A2', 'A3a', 'A3b'],           // Arrival, entry, paths, queues
  'using-space': ['A4', 'A5', 'A3b'],                 // Seating, toilets, queues
  'wayfinding': ['B2', 'A3a', 'B3'],                  // Signage, paths, printed materials
  'sensory': ['A6', 'A4'],                            // Sensory environment, seating
  'staff-interaction': ['C1', 'C2', 'A7'],            // Customer service, payments, safety

  // After visit touchpoints
  'feedback': ['C3', 'C1'],                           // Learning from customers, service
  'staying-connected-touchpoint': ['C3', 'B4.3'],     // Learning, video/social
  'return-visits': ['C3', 'C2'],                      // Learning, payments/flexibility
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
  'tourism': ['A1', 'C1', 'B1', 'A3a'],
  'hospitality': ['C1', 'A4', 'A6', 'A1'],
  'accommodation': ['B4.2', 'A5', 'A1', 'C1'],
  'events': ['A1', 'A3a', 'C1', 'A6'],
  'retail': ['A1', 'A3a', 'C1', 'B4.2'],
  'corporate': ['B4.1', 'B1', 'C1', 'A3a'],
  'local-government': ['B4.1', 'B1', 'C2', 'C1'],
  'health': ['C1', 'A1', 'A5', 'C2'],
  'education': ['B1', 'C1', 'A3a', 'B4.1'],
  'cafe-restaurant': ['C1', 'A4', 'A6', 'A1', 'B3'],
  'tour-operator': ['C1', 'A1', 'A3a', 'B1'],
  'attraction-museum-gallery': ['A1', 'A3a', 'C1', 'A6', 'B2'],
  'visitor-centre': ['B1', 'C1', 'A1', 'A3a'],
  'other': ['C1', 'B1', 'A1'],
};

// Service type priority for tie-breaking
export const SERVICE_TYPE_PRIORITY: Record<string, string[]> = {
  'restaurant': ['A6', 'A4', 'C1', 'A1', 'B3'],
  'cafe': ['A6', 'A4', 'C1', 'A1', 'B3'],
  'bar': ['A6', 'A4', 'C1', 'A1'],
  'hotel': ['A5', 'A1', 'C1', 'B4.2'],
  'tour': ['C1', 'A1', 'A3a', 'B1'],
  'corporate': ['B4.1', 'B1', 'C1', 'A3a'],
  'retail': ['A1', 'A3a', 'C1', 'B4.2'],
  'event': ['A1', 'A6', 'A3a', 'C1'],
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
  _serviceType: string,
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

function toRecommendedModule(score: ModuleScore, _discoveryData: DiscoveryData | null): RecommendedModule {
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
  recommendedDepth: 'pulse-check' | 'deep-dive';
  touchpointCount: number;
  phaseCount: number;
  reasoning: string;
}

/**
 * Calculate recommended review depth based on touchpoints and calibration data
 *
 * Deep Dive indicators:
 * - Many touchpoints (6+) across multiple phases
 * - Moderate or significant budget
 * - Team or external support approach
 * - Ready to act now or soon
 *
 * Pulse Check indicators:
 * - Fewer touchpoints
 * - Minimal budget
 * - Working independently
 * - Exploring/later timing
 */
export function calculateDepthRecommendation(
  selectedTouchpoints: string[],
  calibrationData?: CalibrationData | null
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

  // Scoring system: positive = Deep Dive, negative = Pulse Check
  let depthScore = 0;

  // Touchpoint complexity signals
  if (touchpointCount >= 8) depthScore += 2;
  else if (touchpointCount >= 6) depthScore += 1;
  else if (touchpointCount <= 3) depthScore -= 1;

  if (phaseCount >= 3) depthScore += 1;
  else if (phaseCount === 1) depthScore -= 1;

  // Calibration signals (if provided)
  if (calibrationData) {
    const { budget, workApproach, timing } = calibrationData;

    // Budget signals
    if (budget === 'significant') depthScore += 2;
    else if (budget === 'moderate') depthScore += 1;
    else if (budget === 'minimal') depthScore -= 1;

    // Work approach signals
    if (workApproach === 'external-support') depthScore += 2;
    else if (workApproach === 'with-team') depthScore += 1;
    else if (workApproach === 'myself') depthScore -= 1;

    // Timing signals
    if (timing === 'now') depthScore += 1;
    else if (timing === 'later') depthScore -= 1;
  }

  // Determine recommendation
  const recommendedDepth = depthScore >= 2 ? 'deep-dive' : 'pulse-check';

  // Generate reasoning
  let reasoning: string;
  if (recommendedDepth === 'deep-dive') {
    if (calibrationData?.workApproach === 'external-support' || calibrationData?.workApproach === 'with-team') {
      reasoning = 'With team or external support available, Deep Dive will help you build a structured plan everyone can work from.';
    } else if (touchpointCount >= 6 && phaseCount >= 2) {
      reasoning = `With ${touchpointCount} touchpoints across ${phaseCount} journey phases, Deep Dive will give you comprehensive guidance.`;
    } else {
      reasoning = 'Based on your situation, Deep Dive will help you build a structured plan you can actually deliver.';
    }
  } else {
    if (calibrationData?.timing === 'later') {
      reasoning = 'Since you\'re exploring for now, Pulse Check will help you understand priorities without overcommitting.';
    } else if (calibrationData?.workApproach === 'myself') {
      reasoning = 'Working independently, Pulse Check gives you clear direction you can act on right away.';
    } else {
      reasoning = `With ${touchpointCount} touchpoint${touchpointCount !== 1 ? 's' : ''} selected, Pulse Check will help you get started quickly.`;
    }
  }

  return {
    recommendedDepth,
    touchpointCount,
    phaseCount,
    reasoning,
  };
}
