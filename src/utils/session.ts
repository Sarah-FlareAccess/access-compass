// Session Management using localStorage with Supabase cloud sync
import { v4 as uuidv4 } from 'uuid';
import type {
  Session,
  Action,
  Evidence,
  Clarification,
  BusinessSnapshot,
  ModuleType,
  DiscoveryResponses,
  Constraints,
  DiscoveryData,
  RecommendationResult,
  ReviewMode,
} from '../types';
import { supabase, isSupabaseEnabled } from './supabase';
import { syncRecord, deleteRecord } from './cloudSync';

// Helper: get current authenticated user ID from Supabase client (non-React)
async function getCurrentUserId(): Promise<string | undefined> {
  if (!isSupabaseEnabled() || !supabase) return undefined;
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id;
  } catch {
    return undefined;
  }
}

// Helper: get current org ID
async function getCurrentOrgId(): Promise<string | undefined> {
  if (!isSupabaseEnabled() || !supabase) return undefined;
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user?.id) return undefined;
    const { data: membership } = await supabase
      .from('organisation_memberships')
      .select('organisation_id')
      .eq('user_id', data.user.id)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();
    return membership?.organisation_id;
  } catch {
    return undefined;
  }
}

// Background sync helper (fire-and-forget)
function bgSync(table: string, data: Record<string, unknown>) {
  getCurrentUserId().then(userId => {
    if (!userId) return;
    getCurrentOrgId().then(orgId => {
      syncRecord(table, data, userId, orgId).catch(() => {});
    });
  });
}

function bgDelete(table: string, filters: Record<string, unknown>) {
  getCurrentUserId().then(userId => {
    if (!userId) return;
    deleteRecord(table, filters, userId).catch(() => {});
  });
}

const SESSION_KEY = 'access_compass_session';
const ACTIONS_KEY = 'access_compass_actions';
const EVIDENCE_KEY = 'access_compass_evidence';
const CLARIFICATIONS_KEY = 'access_compass_clarifications';

// Initialize a new session
export const initializeSession = (): Session => {
  const existingSession = getSession();
  if (existingSession) {
    return existingSession;
  }

  const newSession: Session = {
    session_id: uuidv4(),
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    business_snapshot: {} as BusinessSnapshot,
    selected_modules: [],
    discovery_responses: {},
    constraints: {} as Constraints,
    ai_response: null,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  return newSession;
};

// Get current session
export const getSession = (): Session | null => {
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) return null;
  return JSON.parse(sessionData);
};

// Update session
export const updateSession = (updates: Partial<Session>): Session => {
  const session = getSession() || initializeSession();
  const updatedSession = {
    ...session,
    ...updates,
    last_updated: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));

  if (updates.business_snapshot) {
    const snap = updates.business_snapshot;
    bgSync('sessions', {
      session_id: updatedSession.session_id,
      organisation_name: snap.organisation_name || null,
      organisation_type: snap.business_types?.[0] || snap.business_type || null,
      size: snap.organisation_size || null,
      business_snapshot: snap,
    });
  }

  return updatedSession;
};

// Update business snapshot
export const updateBusinessSnapshot = (snapshot: BusinessSnapshot): Session => {
  return updateSession({ business_snapshot: snapshot });
};

// Update selected modules
export const updateSelectedModules = (modules: ModuleType[]): Session => {
  return updateSession({ selected_modules: modules });
};

// Update discovery responses
export const updateDiscoveryResponses = (responses: DiscoveryResponses): Session => {
  return updateSession({ discovery_responses: responses });
};

// Update constraints
export const updateConstraints = (constraints: Constraints): Session => {
  return updateSession({ constraints });
};

// ===== DISCOVERY DATA =====

const DISCOVERY_KEY = 'access_compass_discovery';
const DISCOVERY_PROGRESS_KEY = 'access_compass_discovery_progress';

export interface StoredDiscoveryData {
  discovery_data: DiscoveryData;
  recommendation_result: RecommendationResult;
  review_mode: ReviewMode;
  recommended_modules: string[];
  // Calibration data (optional)
  budget_range?: string;
  work_approach?: string;
  action_timing?: string;
}

// Get discovery data
export const getDiscoveryData = (): StoredDiscoveryData | null => {
  const data = localStorage.getItem(DISCOVERY_KEY);
  if (!data) return null;
  return JSON.parse(data);
};

// Save discovery data
export const saveDiscoveryData = (data: StoredDiscoveryData): void => {
  localStorage.setItem(DISCOVERY_KEY, JSON.stringify(data));

  const session = getSession();
  if (session?.session_id) {
    bgSync('discovery_data', {
      session_id: session.session_id,
      review_mode: data.review_mode || null,
      recommended_modules: data.recommended_modules || [],
      budget_range: data.budget_range || null,
      work_approach: data.work_approach || null,
      action_timing: data.action_timing || null,
      recommendation_result: data.recommendation_result || null,
      selected_touchpoints: data.discovery_data?.selectedTouchpoints || [],
      selected_sub_touchpoints: data.discovery_data?.selectedSubTouchpoints || [],
    });
  }
};

// Update discovery data
export const updateDiscoveryData = (updates: Partial<StoredDiscoveryData>): StoredDiscoveryData => {
  const existing = getDiscoveryData() || {
    discovery_data: { selectedTouchpoints: [], selectedSubTouchpoints: [] },
    recommendation_result: {} as RecommendationResult,
    review_mode: 'pulse-check' as ReviewMode,
    recommended_modules: [],
  };

  const updated = { ...existing, ...updates };
  saveDiscoveryData(updated);
  return updated;
};

// Clear discovery data
export const clearDiscoveryData = (): void => {
  localStorage.removeItem(DISCOVERY_KEY);
};

// ===== IN-PROGRESS DISCOVERY (auto-save) =====

export interface DiscoveryProgress {
  selectedTouchpoints: string[];
  selectedSubTouchpoints: string[];
  notApplicablePhases: string[];
  customSelectedModules: string[];
  currentStep: 'touchpoints' | 'recommendation';
  businessContext: {
    hasPhysicalVenue: boolean | null;
    hasOnlinePresence: boolean | null;
    servesPublicCustomers: boolean | null;
    hasOnlineServices: boolean | null;
    offersExperiences: boolean | null;
    offersAccommodation: boolean | null;
    assessmentType?: 'business' | 'event' | 'both';
  };
  lastUpdated: string;
}

// Get in-progress discovery data
export const getDiscoveryProgress = (): DiscoveryProgress | null => {
  const data = localStorage.getItem(DISCOVERY_PROGRESS_KEY);
  if (!data) return null;
  return JSON.parse(data);
};

// Save in-progress discovery data
export const saveDiscoveryProgress = (progress: DiscoveryProgress): void => {
  localStorage.setItem(DISCOVERY_PROGRESS_KEY, JSON.stringify({
    ...progress,
    lastUpdated: new Date().toISOString(),
  }));

  const session = getSession();
  if (session?.session_id) {
    bgSync('discovery_progress', {
      session_id: session.session_id,
      selected_touchpoints: progress.selectedTouchpoints || [],
      selected_sub_touchpoints: progress.selectedSubTouchpoints || [],
      not_applicable_phases: progress.notApplicablePhases || [],
      custom_selected_modules: progress.customSelectedModules || [],
      current_step: progress.currentStep || 'touchpoints',
      business_context: progress.businessContext || {},
    });
  }
};

// Clear in-progress discovery data (called when discovery is completed)
export const clearDiscoveryProgress = (): void => {
  localStorage.removeItem(DISCOVERY_PROGRESS_KEY);
};

// Clear session (start again)
export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(ACTIONS_KEY);
  localStorage.removeItem(EVIDENCE_KEY);
  localStorage.removeItem(CLARIFICATIONS_KEY);
  localStorage.removeItem(DISCOVERY_KEY);
};

// ===== ACTIONS =====

export const getActions = (): Action[] => {
  const actionsData = localStorage.getItem(ACTIONS_KEY);
  if (!actionsData) return [];
  return JSON.parse(actionsData);
};

export const saveActions = (actions: Action[]): void => {
  localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
  // Sync each action to cloud
  const session = getSession();
  for (const action of actions) {
    bgSync('actions', {
      id: action.id,
      session_id: action.session_id || session?.session_id,
      priority: action.priority,
      category: action.category,
      title: action.title,
      why_matters: action.why_matters,
      effort: action.effort,
      cost_band: action.cost_band,
      how_to_steps: action.how_to_steps || [],
      example: action.example || null,
      owner: action.owner || null,
      timeframe: action.timeframe || null,
      status: action.status,
      notes: action.notes || null,
      created_at: action.created_at,
    });
  }
};

export const getActionById = (id: string): Action | null => {
  const actions = getActions();
  return actions.find((action) => action.id === id) || null;
};

export const updateAction = (id: string, updates: Partial<Action>): Action | null => {
  const actions = getActions();
  const index = actions.findIndex((action) => action.id === id);
  if (index === -1) return null;

  actions[index] = { ...actions[index], ...updates };
  saveActions(actions);
  return actions[index];
};

export const deleteAction = (id: string): boolean => {
  const actions = getActions();
  const filtered = actions.filter((action) => action.id !== id);
  if (filtered.length === actions.length) return false;
  localStorage.setItem(ACTIONS_KEY, JSON.stringify(filtered));
  bgDelete('actions', { id });
  return true;
};

// ===== EVIDENCE =====

export const getEvidence = (): Evidence[] => {
  const evidenceData = localStorage.getItem(EVIDENCE_KEY);
  if (!evidenceData) return [];
  return JSON.parse(evidenceData);
};

export const getEvidenceByActionId = (actionId: string): Evidence[] => {
  const allEvidence = getEvidence();
  return allEvidence.filter((e) => e.action_id === actionId);
};

export const addEvidence = (evidence: Evidence): void => {
  const allEvidence = getEvidence();
  allEvidence.push(evidence);
  localStorage.setItem(EVIDENCE_KEY, JSON.stringify(allEvidence));
  bgSync('evidence', {
    id: evidence.id,
    action_id: evidence.action_id,
    type: evidence.type,
    filename: evidence.filename || null,
    url: evidence.url || null,
    uploaded_at: evidence.uploaded_at,
  });
};

export const deleteEvidence = (id: string): boolean => {
  const allEvidence = getEvidence();
  const filtered = allEvidence.filter((e) => e.id !== id);
  if (filtered.length === allEvidence.length) return false;
  localStorage.setItem(EVIDENCE_KEY, JSON.stringify(filtered));
  bgDelete('evidence', { id });
  return true;
};

// ===== CLARIFICATIONS =====

export const getClarifications = (): Clarification[] => {
  const clarificationsData = localStorage.getItem(CLARIFICATIONS_KEY);
  if (!clarificationsData) return [];
  return JSON.parse(clarificationsData);
};

export const saveClarifications = (clarifications: Clarification[]): void => {
  localStorage.setItem(CLARIFICATIONS_KEY, JSON.stringify(clarifications));
  const session = getSession();
  for (const c of clarifications) {
    bgSync('clarifications', {
      id: c.id,
      session_id: c.session_id || session?.session_id,
      question: c.question,
      module: c.module,
      why_matters: c.why_matters || null,
      how_to_check: c.how_to_check || null,
      resolved: c.resolved,
      resolved_at: c.resolved_at || null,
    });
  }
};

export const updateClarification = (
  id: string,
  updates: Partial<Clarification>
): Clarification | null => {
  const clarifications = getClarifications();
  const index = clarifications.findIndex((c) => c.id === id);
  if (index === -1) return null;

  clarifications[index] = { ...clarifications[index], ...updates };
  saveClarifications(clarifications);
  return clarifications[index];
};
