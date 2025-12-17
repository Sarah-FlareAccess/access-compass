// Access Compass - Type Definitions

export type BusinessType =
  | 'attractions'
  | 'leisure-recreation'
  | 'hospitality'
  | 'events-venues'
  | 'retail'
  | 'local-government'
  | 'health-wellness'
  | 'education-training'
  | 'other';

export type OrganisationSize = 'small' | 'medium' | 'large';

export type UserRole =
  | 'owner'
  | 'manager'
  | 'operations-lead'
  | 'other';

export type ModuleType =
  | 'physical-access'
  | 'communication-information'
  | 'customer-service-staff'
  | 'online-bookings'
  | 'wayfinding-signage'
  | 'sensory-considerations'
  | 'emergency-safety';

export type AnswerType = 'yes' | 'no' | 'not_sure' | 'not_applicable';

export type Priority = 'act_now' | 'plan_next' | 'consider_later';

export type EffortLevel = 'low' | 'medium' | 'high';

export type CostBand = '$0-500' | '$500-2k' | '$2k-10k' | '$10k+';

export type ActionStatus = 'not_started' | 'in_progress' | 'complete' | 'on_hold';

export type EvidenceType = 'photo' | 'pdf' | 'link';

export type BudgetRange =
  | 'under_500'
  | '500_2k'
  | '2k_10k'
  | '10k_plus'
  | 'not_sure';

export type Capacity =
  | 'diy'
  | 'some_support'
  | 'hire_help'
  | 'not_sure';

export type Timeframe =
  | 'now'
  | 'soon'
  | 'later'
  | 'exploring';

// Calibration question types (pre-pathway decision)
export type InvestmentLevel = 'minimal' | 'moderate' | 'significant' | 'not-sure';
export type WorkApproach = 'myself' | 'with-team' | 'external-support';
export type ActionTiming = 'now' | 'next-3-months' | 'later';

export interface CalibrationData {
  budget?: InvestmentLevel;
  workApproach?: WorkApproach;
  timing?: ActionTiming;
}

export interface BusinessSnapshot {
  organisation_name: string;
  organisation_size: OrganisationSize;
  business_types: BusinessType[];
  user_role: UserRole;
  has_physical_venue: boolean;
  has_online_presence: boolean;
  serves_public_customers: boolean;
  // Legacy support
  business_type?: BusinessType;
}

export interface QuestionResponse {
  answer: AnswerType;
  notes?: string;
}

export interface DiscoveryResponses {
  [module: string]: {
    [question: string]: QuestionResponse;
  };
}

export interface Constraints {
  budget_range: BudgetRange;
  capacity: Capacity;
  timeframe: Timeframe;
  additional_notes?: string;
}

export interface Session {
  session_id: string;
  created_at: string;
  last_updated: string;
  business_snapshot: BusinessSnapshot;
  selected_modules: ModuleType[];
  discovery_responses: DiscoveryResponses;
  constraints: Constraints;
  ai_response: any | null;
}

export interface Action {
  id: string;
  session_id: string;
  priority: Priority;
  category: string; // module name
  title: string;
  why_matters: string;
  effort: EffortLevel;
  cost_band: CostBand;
  how_to_steps: string[];
  example: string;
  owner?: string;
  timeframe?: string;
  status: ActionStatus;
  notes?: string;
  created_at: string;
}

export interface Evidence {
  id: string;
  action_id: string;
  type: EvidenceType;
  filename?: string;
  url: string;
  file_data?: string; // base64 for MVP
  uploaded_at: string;
}

export interface Clarification {
  id: string;
  session_id: string;
  question: string;
  module: string;
  why_matters: string;
  how_to_check: string;
  resolved: boolean;
  resolved_at?: string;
}

export interface Question {
  id: string;
  module: ModuleType;
  question_text: string;
  helper_text?: string;
  conditional_logic?: string;
}

export interface Module {
  id: ModuleType;
  title: string;
  icon: string;
  description: string;
  recommended_if: (snapshot: BusinessSnapshot) => boolean;
}

// ============================================================================
// DISCOVERY TYPES (from Access Navigator)
// ============================================================================

export type JourneyPhase = 'before-arrival' | 'during-visit' | 'after-visit';

export type ReviewMode = 'pulse-check' | 'deep-dive';

export type DiscoveryResponse = 'yes' | 'no' | 'not-sure';

export interface SubTouchpoint {
  id: string;
  label: string;
}

export interface Touchpoint {
  id: string;
  label: string;
  description: string;
  subTouchpoints?: SubTouchpoint[];
  moduleMapping: string[];
}

export interface TouchpointBlock {
  id: string;
  label: string;
  touchpointIds: string[];
}

export interface JourneyPhaseData {
  id: string;
  label: string;
  subLabel: string;
  description: string;
  icon: string;
  bgColorClass: string;
  touchpoints: Touchpoint[];
  blocks?: TouchpointBlock[];
}

export interface DiscoveryData {
  selectedTouchpoints: string[];
  selectedSubTouchpoints: string[];
  responses?: Record<string, DiscoveryResponse>;
}

export interface ModuleScore {
  moduleId: string;
  score: number;
  triggeringTouchpoints: string[];
  triggeringQuestions: string[];
}

export interface WhySuggested {
  type: 'discovery' | 'default-starter' | 'padding';
  triggeringTouchpoints: string[];
  triggeringQuestionTexts: string[];
  industryName?: string;
}

export interface RecommendedModule {
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  journeyTheme: JourneyPhase;
  estimatedTime: number;
  score: number;
  whySuggested: WhySuggested;
}

export interface RecommendationWarning {
  type: 'many-not-sure' | 'all-no' | 'too-many-modules' | 'discovery-incomplete';
  message: string;
}

export interface RecommendationResult {
  mode: 'discovery-driven' | 'default-starter-set';
  recommendedModules: RecommendedModule[];
  alsoRelevant: RecommendedModule[];
  warnings: RecommendationWarning[];
  reasoning: string;
  confidenceLevel: 'high' | 'medium' | 'low';
}

export interface JourneyGroup {
  phase: JourneyPhase;
  label: string;
  modules: RecommendedModule[];
}

// Extended Session with Discovery
export interface DiscoverySession extends Session {
  discovery_data?: DiscoveryData;
  recommendation_result?: RecommendationResult;
  review_mode?: ReviewMode;
}

// Re-export Media Analysis types
export * from './mediaAnalysis';
