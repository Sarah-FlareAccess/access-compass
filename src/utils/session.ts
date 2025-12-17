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

// Clear session (start again)
export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(ACTIONS_KEY);
  localStorage.removeItem(EVIDENCE_KEY);
  localStorage.removeItem(CLARIFICATIONS_KEY);
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
