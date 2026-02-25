// Session Management using localStorage
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
  saveActions(filtered);
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
};

export const deleteEvidence = (id: string): boolean => {
  const allEvidence = getEvidence();
  const filtered = allEvidence.filter((e) => e.id !== id);
  if (filtered.length === allEvidence.length) return false;
  localStorage.setItem(EVIDENCE_KEY, JSON.stringify(filtered));
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
