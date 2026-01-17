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
  { id: 'DQ11a', text: 'Do you offer service adjustments or flexible options for customers?', journeyPhase: 'during-visit', touchpointId: 'service-flexibility' },
  { id: 'DQ12', text: 'Do you support customers with assistance animals or specific support needs?', journeyPhase: 'during-visit', touchpointId: 'staff-interaction' },
  { id: 'DQ13', text: 'Do you collect feedback or handle complaints?', journeyPhase: 'after-visit', touchpointId: 'feedback' },
  { id: 'DQ14', text: 'Do you use surveys or feedback forms?', journeyPhase: 'after-visit', touchpointId: 'surveys-forms' },
  { id: 'DQ14a', text: 'Do customers leave online reviews or ratings?', journeyPhase: 'after-visit', touchpointId: 'online-reviews' },
  { id: 'DQ14b', text: 'Do you stay connected with customers after their visit?', journeyPhase: 'after-visit', touchpointId: 'staying-connected-touchpoint' },
  { id: 'DQ14c', text: 'Do you send newsletters or marketing emails?', journeyPhase: 'after-visit', touchpointId: 'newsletters-email' },
  { id: 'DQ14d', text: 'Do you offer discounts, promotions, or special offers?', journeyPhase: 'after-visit', touchpointId: 'offers-promotions' },
  { id: 'DQ14e', text: 'Do you have a loyalty or rewards program?', journeyPhase: 'after-visit', touchpointId: 'loyalty-programs' },
  { id: 'DQ14f', text: 'Do you have a referral program?', journeyPhase: 'after-visit', touchpointId: 'referrals' },
  // Policy and operations touchpoints
  { id: 'DQ15', text: 'Do you have accessibility policies or statements?', journeyPhase: 'policy-operations', touchpointId: 'accessibility-policy' },
  { id: 'DQ16', text: 'Do staff receive accessibility training?', journeyPhase: 'policy-operations', touchpointId: 'staff-training' },
  { id: 'DQ17', text: 'Is accessibility considered in procurement and partnerships?', journeyPhase: 'policy-operations', touchpointId: 'procurement-partnerships' },
  { id: 'DQ18', text: 'Do you track and improve accessibility over time?', journeyPhase: 'policy-operations', touchpointId: 'continuous-improvement' },
  { id: 'DQ19', text: 'Do you actively recruit or employ people with disability?', journeyPhase: 'policy-operations', touchpointId: 'inclusive-employment' },
  { id: 'DQ20', text: 'Do you provide workplace adjustments for employees?', journeyPhase: 'policy-operations', touchpointId: 'workplace-adjustments' },
  { id: 'DQ21', text: 'Do you require accessibility standards from suppliers?', journeyPhase: 'policy-operations', touchpointId: 'supplier-accessibility' },
  { id: 'DQ22', text: 'Do you report on accessibility progress?', journeyPhase: 'policy-operations', touchpointId: 'accessibility-reporting' },
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
  cost: number; // Placeholder cost in AUD
}

export const MODULES: ModuleDefinition[] = [
  // Before they arrive (6 modules)
  { id: 'B1', name: 'Pre-visit information', journeyTheme: 'before-arrival', estimatedTime: 12, cost: 85,
    description: 'Helps customers plan their visit with confidence. Relevant if people research you online before arriving.' },
  { id: 'B4.1', name: 'Website basics', journeyTheme: 'before-arrival', estimatedTime: 15, cost: 120,
    description: 'Ensures your website works for everyone. Relevant if customers find you through your website.' },
  { id: 'B4.2', name: 'Booking & ticketing systems', journeyTheme: 'before-arrival', estimatedTime: 12, cost: 75,
    description: 'Makes online booking accessible. Relevant if you take bookings or have online forms.' },
  { id: 'B4.3', name: 'Social media, video & audio', journeyTheme: 'before-arrival', estimatedTime: 10, cost: 65,
    description: 'Ensures your content reaches everyone. Relevant if you use video or social media marketing.' },
  { id: 'B5', name: 'Communication and language', journeyTheme: 'before-arrival', estimatedTime: 12, cost: 80,
    description: 'Ensures clear, accessible communication. Relevant if you communicate with customers in writing or speech.' },
  { id: 'B6', name: 'Marketing and representation', journeyTheme: 'before-arrival', estimatedTime: 10, cost: 70,
    description: 'Ensures inclusive marketing and representation. Relevant if you create marketing materials or campaigns.' },
  // Getting in and moving around (4 modules)
  { id: 'A1', name: 'Arrival, parking and drop-off', journeyTheme: 'during-visit', estimatedTime: 15, cost: 110,
    description: 'Helps customers get to your door. Relevant if you have a physical location customers visit.' },
  { id: 'A2', name: 'Entry and doors', journeyTheme: 'during-visit', estimatedTime: 12, cost: 95,
    description: 'Ensures everyone can get inside. Relevant if your entrance has steps, heavy doors, or narrow access.' },
  { id: 'A3a', name: 'Paths and aisles', journeyTheme: 'during-visit', estimatedTime: 12, cost: 85,
    description: 'Makes moving around easy. Relevant if customers navigate through your space.' },
  { id: 'A3b', name: 'Queues and busy times', journeyTheme: 'during-visit', estimatedTime: 10, cost: 65,
    description: 'Manages crowds comfortably. Relevant if customers wait in line or you have peak periods.' },
  // During the visit (5 modules)
  { id: 'A4', name: 'Seating, furniture and layout', journeyTheme: 'during-visit', estimatedTime: 12, cost: 95,
    description: 'Provides comfortable options for all. Relevant if customers sit, dine, or spend time in your space.' },
  { id: 'A5', name: 'Toilets and amenities', journeyTheme: 'during-visit', estimatedTime: 15, cost: 120,
    description: 'Ensures facilities work for everyone. Relevant if you have customer toilets or changing facilities.' },
  { id: 'A6', name: 'Lighting, sound and sensory environment', journeyTheme: 'during-visit', estimatedTime: 12, cost: 95,
    description: 'Creates a comfortable atmosphere. Relevant if your space has music, lighting, or could be overwhelming.' },
  { id: 'A6a', name: 'Equipment and resources', journeyTheme: 'during-visit', estimatedTime: 12, cost: 90,
    description: 'Ensures equipment and resources are accessible. Relevant if customers use equipment, technology, or resources at your venue.' },
  { id: 'B2', name: 'Signage and wayfinding', journeyTheme: 'during-visit', estimatedTime: 12, cost: 85,
    description: 'Helps people find their way. Relevant if customers need to navigate or find specific areas.' },
  { id: 'B3', name: 'Menus and printed materials', journeyTheme: 'during-visit', estimatedTime: 10, cost: 65,
    description: 'Makes information readable for all. Relevant if you have menus, brochures, or price lists.' },
  // Service and support (4 modules)
  { id: 'C1', name: 'Customer service and staff confidence', journeyTheme: 'during-visit', estimatedTime: 15, cost: 130,
    description: 'Prepares your team to help everyone. Relevant for any business with customer-facing staff.' },
  { id: 'C2', name: 'Bookings and ticketing', journeyTheme: 'during-visit', estimatedTime: 10, cost: 75,
    description: 'Makes transactions smooth for all. Relevant if customers book, pay, or need flexible options.' },
  { id: 'A7', name: 'Safety and emergencies', journeyTheme: 'during-visit', estimatedTime: 12, cost: 95,
    description: 'Keeps everyone safe. Relevant if you need evacuation plans or safety procedures.' },
  { id: 'C3', name: 'Feedback and reviews', journeyTheme: 'after-visit', estimatedTime: 10, cost: 65,
    description: 'Gathering accessible feedback and managing reviews. Relevant if you collect surveys, ratings, or online reviews.' },
  { id: 'C4', name: 'Staying connected', journeyTheme: 'after-visit', estimatedTime: 10, cost: 70,
    description: 'Accessible ongoing engagement with customers. Relevant if you send newsletters, promotions, or have loyalty programs.' },
  // Policy and operations (5 modules)
  { id: 'P1', name: 'Policy and inclusion', journeyTheme: 'policy-operations', estimatedTime: 15, cost: 140,
    description: 'Formalises your accessibility commitment. Relevant if you want documented policies and inclusion statements.' },
  { id: 'P2', name: 'Employing people with disability', journeyTheme: 'policy-operations', estimatedTime: 20, cost: 160,
    description: 'Creates an inclusive workplace. Relevant if you want to attract, hire, and support employees with disability.' },
  { id: 'P3', name: 'Staff training and awareness', journeyTheme: 'policy-operations', estimatedTime: 15, cost: 130,
    description: 'Builds disability confidence across your team. Relevant if you want consistent, respectful service from all staff.' },
  { id: 'P4', name: 'Accessible procurement', journeyTheme: 'policy-operations', estimatedTime: 12, cost: 110,
    description: 'Ensures suppliers and partners meet accessibility standards. Relevant if you purchase products, services, or work with contractors.' },
  { id: 'P5', name: 'Continuous improvement and reporting', journeyTheme: 'policy-operations', estimatedTime: 12, cost: 100,
    description: 'Tracks progress and drives ongoing improvement. Relevant if you want to measure, report, and improve accessibility over time.' },
];

// Module IDs now match codes directly (no mapping needed)
// This is kept for backward compatibility
export const MODULE_ID_TO_CODE: Record<string, string> = {
  'B1': 'B1',
  'B4.1': 'B4.1',
  'B4.2': 'B4.2',
  'B4.3': 'B4.3',
  'B5': 'B5',
  'B6': 'B6',
  'A1': 'A1',
  'A2': 'A2',
  'A3a': 'A3a',
  'A3b': 'A3b',
  'A4': 'A4',
  'A5': 'A5',
  'A6': 'A6',
  'A6a': 'A6a',
  'B2': 'B2',
  'B3': 'B3',
  'C1': 'C1',
  'C2': 'C2',
  'A7': 'A7',
  'C3': 'C3',
  'C4': 'C4',
  'P1': 'P1',
  'P2': 'P2',
  'P3': 'P3',
  'P4': 'P4',
  'P5': 'P5',
};

export const CODE_TO_MODULE_ID: Record<string, string> = { ...MODULE_ID_TO_CODE };

// ============================================================================
// DISCOVERY -> MODULE MAPPING TABLE
// ============================================================================

// Maps touchpoint IDs to module codes
// Each touchpoint can trigger multiple relevant modules
export const TOUCHPOINT_TO_MODULES: Record<string, string[]> = {
  // Before arrival touchpoints
  'finding-online': ['B4.1', 'B1', 'B4.3', 'B6'],     // Website, pre-visit info, video/social, marketing
  'booking': ['B4.2', 'B4.1', 'C2'],                  // Booking systems, website, payments
  'planning-visit': ['B1', 'B4.1'],                   // Pre-visit info, website
  'costs-policies': ['C2', 'B1'],                     // Payments/flexibility, pre-visit info
  'enquiries': ['C1', 'B1', 'B5'],                    // Customer service, pre-visit info, communication

  // During visit touchpoints
  'getting-in': ['A1', 'A2', 'A3a', 'A3b'],           // Arrival, entry, paths, queues
  'using-space': ['A4', 'A5', 'A3b', 'A6a'],          // Seating, toilets, queues, equipment
  'wayfinding': ['B2', 'A3a', 'B3'],                  // Signage, paths, printed materials
  'sensory': ['A6', 'A4', 'A6a'],                     // Sensory environment, seating, equipment
  'staff-interaction': ['C1', 'C2', 'A7', 'B5'],      // Customer service, payments, safety, communication
  'service-flexibility': ['C1', 'C2'],                // Customer service, payments/flexibility

  // After visit touchpoints
  'feedback': ['C3'],                                 // Feedback and reviews
  'surveys-forms': ['C3'],                            // Feedback and reviews
  'online-reviews': ['C3'],                           // Feedback and reviews
  'staying-connected-touchpoint': ['C4', 'B4.3'],     // Staying connected, video/social
  'newsletters-email': ['C4', 'B4.3'],                // Staying connected
  'offers-promotions': ['C4', 'C2'],                  // Staying connected, payments
  'loyalty-programs': ['C4', 'C2'],                   // Staying connected, payments
  'referrals': ['C4'],                                // Staying connected
  'return-visits': ['C4', 'C3'],                      // Staying connected, feedback

  // Policy and operations touchpoints
  'accessibility-policy': ['P1'],                     // Accessibility policy and commitment
  'staff-training': ['P3', 'C1'],                     // Staff training + customer service
  'procurement-partnerships': ['P4'],                 // Accessible procurement
  'continuous-improvement': ['P5', 'C3'],             // Continuous improvement + learning
  'inclusive-employment': ['P2'],                     // Employing people with disability
  'workplace-adjustments': ['P2', 'P1'],              // Employment + policy
  'supplier-accessibility': ['P4'],                   // Accessible procurement
  'accessibility-reporting': ['P5', 'P1'],            // Reporting + policy
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
  'service-flexibility': 'You offer adjustments or flexible service options',
  'feedback': 'You collect feedback or handle complaints',
  'surveys-forms': 'You use surveys or feedback forms',
  'online-reviews': 'Customers leave online reviews or ratings',
  'staying-connected-touchpoint': 'You stay connected after visits',
  'newsletters-email': 'You send newsletters or marketing emails',
  'offers-promotions': 'You offer discounts or promotions',
  'loyalty-programs': 'You have a loyalty or rewards program',
  'referrals': 'You have a referral program',
  'return-visits': 'You encourage return visits',
  // Policy and operations
  'accessibility-policy': 'You have or want accessibility policies',
  'staff-training': 'Staff receive accessibility training',
  'procurement-partnerships': 'Accessibility is considered in procurement',
  'continuous-improvement': 'You track and improve accessibility over time',
  'inclusive-employment': 'You recruit or employ people with disability',
  'workplace-adjustments': 'You provide workplace adjustments for employees',
  'supplier-accessibility': 'You require accessibility standards from suppliers',
  'accessibility-reporting': 'You report on accessibility progress',
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

  // MODE C: Discovery explicitly completed but nothing applies
  // User went through discovery and marked everything as N/A - respect their choice
  if (discoveryData?.explicitlyCompleted && discoveryData.selectedTouchpoints.length === 0) {
    return {
      mode: 'no-modules-applicable',
      recommendedModules: [],
      alsoRelevant: [],
      warnings: [{
        type: 'nothing-applicable',
        message: "Based on your responses, none of our current modules apply to your business. This is unusual - please review your discovery answers or contact support if you need assistance.",
      }],
      reasoning: "You've indicated that none of the customer touchpoints apply to your business. No modules have been recommended.",
      confidenceLevel: 'high',
    };
  }

  // MODE B: No discovery data - require discovery to be completed
  if (!discoveryData || discoveryData.selectedTouchpoints.length === 0) {
    return {
      mode: 'no-modules-applicable',
      recommendedModules: [],
      alsoRelevant: [],
      warnings: [{
        type: 'discovery-incomplete',
        message: "Complete the discovery process to receive personalised module recommendations based on your customer touchpoints.",
      }],
      reasoning: "No touchpoints have been selected. Complete discovery to get recommendations.",
      confidenceLevel: 'low',
    };
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

  // EDGE CASE: No modules meet threshold based on selections
  if (meetingThreshold.length === 0) {
    return {
      mode: 'no-modules-applicable',
      recommendedModules: [],
      alsoRelevant: [],
      warnings: [{
        type: 'all-no',
        message: "Based on your touchpoint selections, no modules strongly match your business. Consider reviewing your discovery answers or selecting additional touchpoints.",
      }],
      reasoning: "Your selected touchpoints didn't trigger any module recommendations. This may indicate the touchpoints you selected don't have associated modules yet.",
      confidenceLevel: 'low',
    };
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
      message: `Accessibility touches many parts of your business (${recommended.length} modules). Identify the modules that you can complete the easiest or that will have the highest impact. You can always save and come back to them at any time.`,
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
    .map(p => {
      if (p === 'before-arrival') return 'before they arrive';
      if (p === 'during-visit') return 'during their visit';
      if (p === 'after-visit') return 'staying connected';
      if (p === 'policy-operations') return 'policy and operations';
      return p;
    })
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
    'policy-operations': 0,
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
    { phase: 'policy-operations', label: 'Policy and operations', modules: [] },
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
