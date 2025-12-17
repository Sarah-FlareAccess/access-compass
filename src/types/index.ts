// Access Compass - Type Definitions

export type BusinessType =
  | 'cafe-restaurant'
  | 'accommodation'
  | 'tour-operator'
  | 'attraction-museum-gallery'
  | 'visitor-centre'
  | 'other';

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

export interface BusinessSnapshot {
  business_type: BusinessType;
  user_role: UserRole;
  has_physical_venue: boolean;
  has_online_presence: boolean;
  serves_public_customers: boolean;
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
