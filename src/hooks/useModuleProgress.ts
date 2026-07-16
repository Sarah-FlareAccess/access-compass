/**
 * Module Progress Hook
 *
 * Manages module progress and question responses.
 * Supports both localStorage and Supabase persistence.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { isSupabaseEnabled } from '../utils/supabase';
import { getSession } from '../utils/session';
import { fetchOrgRecords, syncOrgRecord, resolveByTimestamp, syncSnapshot, fetchSnapshots, deleteSnapshot } from '../utils/cloudSync';
import { migrateEvidenceToStorage } from '../utils/evidenceStorage';
import { useAuthSafe } from '../contexts/AuthContext';
import { useActiveSiteId, getActiveSiteId } from './useSites';
import { moduleProgressKey } from '../utils/moduleProgressStore';
import { logActivityStandalone } from './useActivityLog';
import { getModuleById } from '../data/accessModules';
import type { ResponseOption } from '../constants/responseOptions';

// Evidence file attached to a question
export interface EvidenceFile {
  id: string;
  type: 'photo' | 'document' | 'link';
  name: string;           // Display name
  url?: string;           // For links or uploaded file URLs
  dataUrl?: string;       // Base64 data URL for local storage (photos/docs)
  storagePath?: string;   // Supabase Storage object path (private bucket; signed URL on demand)
  bucket?: string;        // Storage bucket name (defaults to 'evidence-files' if absent)
  mimeType?: string;      // e.g., 'image/jpeg', 'application/pdf'
  size?: number;          // File size in bytes
  uploadedAt: string;     // ISO timestamp
  description?: string;   // Optional description/caption
}

export interface QuestionResponse {
  questionId: string;
  answer: ResponseOption | null;
  notes?: string;
  partialDescription?: string; // Description when 'partially' is selected
  photos?: string[];      // Legacy - kept for backwards compatibility
  evidence?: EvidenceFile[]; // New evidence storage
  // Skip-if-complete: when an answer is sourced from a related org-wide
  // question, this captures the user's choice of scope.
  // 'event-only'  = use this answer just for the current event session
  // 'all-events'  = also apply to future event sessions (org-default flag)
  // 'fresh'       = answered independently (no scope flag set)
  applyScope?: 'event-only' | 'all-events' | 'fresh';
  // The source question ID this answer was inherited from, if any.
  inheritedFromQuestionId?: string;
  measurement?: {
    value: number;
    unit: string;
    confidence: 'confident' | 'somewhat-confident' | 'not-confident';
  };
  multiSelectValues?: string[];
  linkValue?: string;
  otherDescription?: string;
  urlAnalysis?: {
    url: string;
    analysisDate: string;
    overallScore: number;
    overallStatus: 'excellent' | 'good' | 'needs-improvement' | 'missing';
    summary: string;
    strengths: string[];
    improvements: string[];
    parameterResults: Array<{
      parameterId: string;
      parameterName: string;
      status: 'excellent' | 'good' | 'needs-improvement' | 'missing';
      score: number;
      feedback: string;
      suggestions?: string[];
      evidenceFound?: string[];
    }>;
    disclaimer: string;
  };
  // Media analysis results (photos, documents, social media, etc.)
  mediaAnalysis?: {
    id: string;
    analysisType: string;
    inputType: 'photo' | 'document' | 'url' | 'screenshot';
    fileName?: string;
    fileSize?: number;
    url?: string;
    thumbnailDataUrl?: string;
    photoPreviews?: string[];
    analysisDate: string;
    overallScore: number;
    overallStatus: 'excellent' | 'good' | 'needs-improvement' | 'poor' | 'not-assessable';
    summary: string;
    strengths: string[];
    improvements: string[];
    quickWins: string[];
    standardsAssessed: string[];
    needsProfessionalReview: boolean;
    professionalReviewReason?: string;
    disclaimer: string;
  };
  timestamp: string;
}

export interface ModuleOwnership {
  assignedTo?: string;           // Free text - person's name or role
  assignedToEmail?: string;      // Email for future notification capability
  targetCompletionDate?: string; // ISO date string
  completedBy?: string;          // Auto-captured on completion
  completedByRole?: string;      // Optional role/title of completer
}

// Context for a module run (team, department, event, etc.)
export interface ModuleRunContext {
  type: 'team' | 'department' | 'event' | 'location' | 'experience' | 'general' | 'other';
  name: string;           // e.g., "Marketing Team", "Summer Festival 2024", "Main Entrance"
  description?: string;   // Optional additional context
}

// A single run/instance of a module checklist
export interface ModuleRun {
  id: string;                    // Unique run ID (e.g., "run-1699999999999")
  context: ModuleRunContext;     // What this run is for
  startedAt: string;             // ISO timestamp
  completedAt?: string;          // ISO timestamp when completed
  status: 'not-started' | 'in-progress' | 'completed';
  responses: QuestionResponse[];
  summary?: ModuleSummary;
  ownership?: ModuleOwnership;
  confidenceSnapshot?: 'strong' | 'mixed' | 'needs-work';
}

// Comparison result between two runs
export interface RunComparison {
  runA: ModuleRun;
  runB: ModuleRun;
  improvements: string[];        // Questions that improved (no -> yes, etc.)
  regressions: string[];         // Questions that got worse
  unchanged: string[];           // Questions with same answer
  newQuestions: string[];        // Questions only in one run
  overallTrend: 'improving' | 'declining' | 'stable' | 'mixed';
  scoreChange: number;           // Percentage change in positive responses
}

export interface ModuleProgress {
  moduleId: string;
  moduleCode: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
  responses: QuestionResponse[];
  summary?: ModuleSummary;
  // Ownership and accountability
  ownership?: ModuleOwnership;
  // Confidence snapshot for DIAP
  confidenceSnapshot?: 'strong' | 'mixed' | 'needs-work';
  // Multiple runs support
  activeRunId?: string;          // Currently active run ID
  runs?: ModuleRun[];            // History of all runs for this module
}

export interface ExploreItem {
  questionId: string;
  questionText: string;
  action: string;
}

export interface ModuleSummary {
  doingWell: string[];
  /** Question id behind each doingWell entry, same order and length. Lets the
   *  cohort report theme a strength by its content instead of its module.
   *  Optional so existing/legacy summaries stay valid. */
  doingWellIds?: (string | undefined)[];
  priorityActions: ActionItem[];
  areasToExplore: (string | ExploreItem)[];
  professionalReview: string[];
}

export interface ActionItem {
  questionId: string;
  questionText: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  impactStatement?: string;
  complianceLevel?: 'mandatory' | 'best-practice' | 'wcag-aa' | 'dda-compliant';
  safetyRelated?: boolean;
}

// Local storage functions. Progress is namespaced per active site (see
// moduleProgressStore): callbacks omit siteId and default to the live active
// site, while the load effect pins its reads/writes to the site it fetched for.
function getLocalProgress(siteId: string | null = getActiveSiteId()): Record<string, ModuleProgress> {
  try {
    const data = localStorage.getItem(moduleProgressKey(siteId));
    return data ? JSON.parse(data) : {};
  } catch {
    // Corrupted blob (truncated by quota, manual tampering). Fall back to
    // empty rather than crash app init; cloud restore rehydrates on signin.
    return {};
  }
}

function saveLocalProgress(progress: Record<string, ModuleProgress>, siteId: string | null = getActiveSiteId()) {
  try {
    localStorage.setItem(moduleProgressKey(siteId), JSON.stringify(progress));
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Clearing evidence data to free space...');

      // Try to save without evidence data to free up space
      const reducedProgress: Record<string, ModuleProgress> = {};
      for (const [key, module] of Object.entries(progress)) {
        reducedProgress[key] = {
          ...module,
          responses: module.responses.map(r => ({
            ...r,
            evidence: undefined, // Remove evidence to save space
          })),
        };
      }

      try {
        localStorage.setItem(moduleProgressKey(siteId), JSON.stringify(reducedProgress));
        console.warn('Saved progress without evidence data due to storage limits.');
        window.dispatchEvent(new CustomEvent('access-compass:storage-warning', {
          detail: {
            level: 'warning',
            message: 'Your answers are saved, but large files (like photos) couldn\'t be stored on this device. They\'ll sync to the cloud when you finish or sign in.',
          },
        }));
      } catch (retryError) {
        console.error('Failed to save even reduced progress:', retryError);
        window.dispatchEvent(new CustomEvent('access-compass:storage-warning', {
          detail: {
            level: 'error',
            message: 'We couldn\'t save your latest changes on this device. Try refreshing the page or signing in so your work syncs to the cloud.',
          },
        }));
      }
    } else {
      console.error('Error saving to localStorage:', error);
    }
  }
}

export interface CompletionMetadata {
  completedBy?: string;
  completedByRole?: string;
}

interface UseModuleProgressReturn {
  progress: Record<string, ModuleProgress>;
  isLoading: boolean;

  // Module actions
  startModule: (moduleId: string, moduleCode: string) => void;
  completeModule: (moduleId: string, summary?: ModuleSummary, completionMetadata?: CompletionMetadata) => void;

  // Ownership actions
  updateModuleOwnership: (moduleId: string, ownership: Partial<ModuleOwnership>) => void;

  // Response actions
  saveResponse: (moduleId: string, response: QuestionResponse) => void;
  getResponse: (moduleId: string, questionId: string) => QuestionResponse | undefined;

  // Progress queries
  getModuleProgress: (moduleId: string) => ModuleProgress | undefined;
  getOverallProgress: () => { completed: number; total: number; percentage: number };

  // Run management (repeat checklist functionality)
  startNewRun: (moduleId: string, moduleCode: string, context: ModuleRunContext) => string;
  getModuleRuns: (moduleId: string) => ModuleRun[];
  switchToRun: (moduleId: string, runId: string) => void;
  deleteRun: (moduleId: string, runId: string) => void;
  compareRuns: (moduleId: string, runIdA: string, runIdB: string) => RunComparison | null;
  archiveCurrentAsRun: (moduleId: string, context: ModuleRunContext) => string | null;

  // Sync
  syncToCloud: () => Promise<void>;
}

export function useModuleProgress(selectedModules: string[] = []): UseModuleProgressReturn {
  const [progress, setProgress] = useState<Record<string, ModuleProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { userId, organisationId } = useAuthSafe();
  const [activeSiteId] = useActiveSiteId();
  const userIdRef = useRef(userId);
  const orgIdRef = useRef(organisationId);
  const siteIdRef = useRef<string | null>(activeSiteId);

  // Keep refs current so callbacks don't need userId/orgId/siteId in deps
  useEffect(() => {
    userIdRef.current = userId;
    orgIdRef.current = organisationId;
    siteIdRef.current = activeSiteId;
  }, [userId, organisationId, activeSiteId]);

  // Background sync a single module's progress to Supabase.
  // Org-scoped per migration 023: writes one canonical row per (org, module)
  // and records last_modified_by_user_id for audit. Anonymous users (no org)
  // remain localStorage-only.
  const syncModuleToCloud = useCallback((_moduleId: string, moduleData: ModuleProgress) => {
    const session = getSession();
    if (!session?.session_id || !userIdRef.current || !orgIdRef.current) return;

    syncOrgRecord('module_progress', {
      session_id: session.session_id,
      module_id: moduleData.moduleId,
      module_code: moduleData.moduleCode,
      status: moduleData.status,
      started_at: moduleData.startedAt,
      completed_at: moduleData.completedAt,
      summary: moduleData.summary || null,
      confidence_snapshot: moduleData.confidenceSnapshot || null,
      completed_by: moduleData.ownership?.completedBy || null,
      completed_by_role: moduleData.ownership?.completedByRole || null,
      assigned_to: moduleData.ownership?.assignedTo || null,
      assigned_to_email: moduleData.ownership?.assignedToEmail || null,
      target_completion_date: moduleData.ownership?.targetCompletionDate || null,
    }, orgIdRef.current, userIdRef.current, siteIdRef.current).catch(() => {
      // Queued for retry automatically
    });
  }, []);

  // Persist a reassessment run to the cloud snapshot table (migration 033),
  // so reassessment history survives browser/device changes. Anonymous users
  // (no org) remain localStorage-only.
  const syncRunToCloud = useCallback((moduleId: string, moduleCode: string, run: ModuleRun) => {
    if (!userIdRef.current || !orgIdRef.current) return;
    syncSnapshot({
      site_id: siteIdRef.current ?? null,
      module_id: moduleId,
      module_code: moduleCode,
      run_id: run.id,
      context: run.context ?? null,
      status: run.status,
      started_at: run.startedAt,
      completed_at: run.completedAt ?? null,
      confidence_snapshot: run.confidenceSnapshot ?? null,
      summary: run.summary ?? null,
      responses: run.responses ?? [],
    }, orgIdRef.current, userIdRef.current).catch(() => {});
  }, []);

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Load from localStorage first (instant). Pin every read/write in this
        // effect to the site we fetch cloud data for, so an in-flight load that
        // races a site switch can't write one site's data into another's blob.
        const loadSiteId = activeSiteId;
        const localProgress = getLocalProgress(loadSiteId);
        setProgress(localProgress);

        // If Supabase is enabled and user is in an org, fetch org-scoped data.
        // Anonymous / no-org users stay on localStorage only.
        if (isSupabaseEnabled() && userId && organisationId) {
          const { data: cloudRows, error: fetchError } = await fetchOrgRecords(
            'module_progress',
            organisationId,
            undefined,
            activeSiteId,
          );

          if (fetchError) {
            console.log('[useModuleProgress] Cloud fetch skipped:', fetchError);
          } else if (cloudRows && cloudRows.length > 0) {
            const merged = { ...localProgress };
            let hasChanges = false;

            for (const row of cloudRows as Record<string, unknown>[]) {
              const moduleId = row.module_id as string;
              const localEntry = localProgress[moduleId];
              const cloudUpdatedAt = row.updated_at as string;
              const localUpdatedAt = localEntry?.completedAt || localEntry?.startedAt;

              // If cloud is newer, use cloud data
              if (!localEntry || resolveByTimestamp(localUpdatedAt, cloudUpdatedAt) === 'cloud') {
                merged[moduleId] = {
                  moduleId,
                  moduleCode: (row.module_code as string) || moduleId,
                  status: (row.status as ModuleProgress['status']) || localEntry?.status || 'not-started',
                  startedAt: row.started_at as string || localEntry?.startedAt,
                  completedAt: row.completed_at as string | undefined || localEntry?.completedAt,
                  responses: localEntry?.responses || [], // Always preserve local responses (not stored in cloud)
                  summary: (row.summary as ModuleSummary) || localEntry?.summary || undefined,
                  confidenceSnapshot: row.confidence_snapshot as ModuleProgress['confidenceSnapshot'] || localEntry?.confidenceSnapshot,
                  ownership: localEntry?.ownership,
                  runs: localEntry?.runs,
                  activeRunId: localEntry?.activeRunId,
                };
                hasChanges = true;
              }
            }

            if (hasChanges) {
              setProgress(merged);
              saveLocalProgress(merged, loadSiteId);
            }
          }

          // Recover responses from module_responses for modules with 0 local responses
          const currentProgress = getLocalProgress(loadSiteId);
          const modulesNeedingRecovery = Object.values(currentProgress)
            .filter(m => m.status !== 'not-started' && (!m.responses || m.responses.length === 0));

          if (modulesNeedingRecovery.length > 0) {
            const { data: responseRows } = await fetchOrgRecords(
              'module_responses',
              organisationId,
              undefined,
              activeSiteId,
            );

            if (responseRows && (responseRows as Record<string, unknown>[]).length > 0) {
              const recovered = { ...currentProgress };
              let hasRecovery = false;

              for (const mod of modulesNeedingRecovery) {
                const modResponses = (responseRows as Record<string, unknown>[])
                  .filter(r => r.module_id === mod.moduleId)
                  .map(r => ({
                    questionId: r.question_id as string,
                    answer: (r.answer as ResponseOption) || null,
                    notes: (r.notes as string) || undefined,
                    partialDescription: (r.partial_description as string) || undefined,
                    otherDescription: (r.other_description as string) || undefined,
                    linkValue: (r.link_value as string) || undefined,
                    timestamp: (r.updated_at as string) || new Date().toISOString(),
                  }));

                if (modResponses.length > 0) {
                  recovered[mod.moduleId] = {
                    ...recovered[mod.moduleId],
                    responses: modResponses,
                  };
                  hasRecovery = true;
                }
              }

              if (hasRecovery) {
                setProgress(recovered);
                saveLocalProgress(recovered, loadSiteId);
              }
            }
          }

          // Hydrate reassessment history from cloud snapshots (migration 033),
          // so run comparison survives a browser clear or device switch.
          // Snapshots are org-wide; filter to the active site so a venue's
          // reassessment history doesn't bleed across sites.
          const { data: snapshotRows } = await fetchSnapshots(organisationId);
          const siteSnapshots = (snapshotRows || []).filter(
            s => ((s.site_id as string | null) ?? null) === (loadSiteId ?? null)
          );
          if (siteSnapshots.length > 0) {
            const withRuns = getLocalProgress(loadSiteId);
            const byModule = new Map<string, ModuleRun[]>();
            for (const s of siteSnapshots) {
              const run: ModuleRun = {
                id: s.run_id as string,
                context: (s.context as ModuleRunContext) || { type: 'general', name: 'Assessment' },
                startedAt: (s.started_at as string) || new Date().toISOString(),
                completedAt: (s.completed_at as string) || undefined,
                status: (s.status as ModuleRun['status']) || 'completed',
                responses: (s.responses as QuestionResponse[]) || [],
                summary: (s.summary as ModuleSummary) || undefined,
                confidenceSnapshot: (s.confidence_snapshot as ModuleRun['confidenceSnapshot']) || undefined,
              };
              const key = s.module_id as string;
              const arr = byModule.get(key) || [];
              arr.push(run);
              byModule.set(key, arr);
            }

            let changed = false;
            for (const [moduleId, cloudRuns] of byModule) {
              const entry = withRuns[moduleId];
              if (!entry) {
                // Snapshots exist but no local progress (fresh device): stub the
                // module so its reassessment history is still visible.
                const code = siteSnapshots.find(s => s.module_id === moduleId)?.module_code as string;
                withRuns[moduleId] = {
                  moduleId,
                  moduleCode: code || moduleId,
                  status: 'not-started',
                  responses: [],
                  runs: cloudRuns,
                };
                changed = true;
                continue;
              }
              const existing = entry.runs || [];
              const existingIds = new Set(existing.map(r => r.id));
              const fresh = cloudRuns.filter(r => !existingIds.has(r.id));
              if (fresh.length > 0) {
                withRuns[moduleId] = { ...entry, runs: [...existing, ...fresh] };
                changed = true;
              }
            }

            if (changed) {
              setProgress(withRuns);
              saveLocalProgress(withRuns, loadSiteId);
            }
          }
        }
      } catch (err) {
        console.error('Error loading module progress:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [userId, organisationId, activeSiteId]);

  // Start a module
  const startModule = useCallback((moduleId: string, moduleCode: string) => {
    // Check if already started BEFORE the state update (avoids StrictMode double-log)
    const currentProgress = getLocalProgress();
    const alreadyStarted = currentProgress[moduleId] && currentProgress[moduleId].status !== 'not-started';

    setProgress(prev => {
      const existing = prev[moduleId];
      if (existing && existing.status !== 'not-started') {
        return prev;
      }

      const moduleData: ModuleProgress = {
        moduleId,
        moduleCode,
        status: 'in-progress' as const,
        startedAt: new Date().toISOString(),
        responses: existing?.responses || [],
      };

      const updated = { ...prev, [moduleId]: moduleData };
      saveLocalProgress(updated);
      syncModuleToCloud(moduleId, moduleData);

      return updated;
    });

    if (!alreadyStarted) {
      const mod = getModuleById(moduleId);
      logActivityStandalone('module-started', {
        moduleId,
        moduleName: mod?.name || moduleCode,
      }, userIdRef.current || undefined);
    }
  }, [syncModuleToCloud]);

  // Calculate confidence snapshot based on responses
  const calculateConfidenceSnapshot = (responses: QuestionResponse[]): 'strong' | 'mixed' | 'needs-work' => {
    if (responses.length === 0) return 'needs-work';

    const yesCount = responses.filter(r => r.answer === 'yes').length;
    const noCount = responses.filter(r => r.answer === 'no').length;
    const unsureCount = responses.filter(r => r.answer === 'unable-to-check').length;
    const total = responses.length;

    const yesPercentage = (yesCount / total) * 100;
    const negativePercentage = ((noCount + unsureCount) / total) * 100;

    if (yesPercentage >= 70) return 'strong';
    if (negativePercentage >= 50) return 'needs-work';
    return 'mixed';
  };

  // Complete a module
  const completeModule = useCallback((moduleId: string, summary?: ModuleSummary, completionMetadata?: CompletionMetadata) => {
    setProgress(prev => {
      const existing = prev[moduleId];
      if (!existing) return prev;

      const confidenceSnapshot = calculateConfidenceSnapshot(existing.responses);

      const moduleData: ModuleProgress = {
        ...existing,
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
        summary,
        confidenceSnapshot,
        ownership: {
          ...existing.ownership,
          completedBy: completionMetadata?.completedBy || existing.ownership?.assignedTo,
          completedByRole: completionMetadata?.completedByRole,
        },
      };

      const updated = { ...prev, [moduleId]: moduleData };
      saveLocalProgress(updated);
      syncModuleToCloud(moduleId, moduleData);

      return updated;
    });

    const mod = getModuleById(moduleId);
    logActivityStandalone('module-completed', {
      moduleId,
      moduleName: mod?.name || moduleId,
    }, userIdRef.current || undefined);
  }, [syncModuleToCloud]);

  // Update module ownership (assignment and target date)
  const updateModuleOwnership = useCallback((moduleId: string, ownership: Partial<ModuleOwnership>) => {
    setProgress(prev => {
      const existing = prev[moduleId] || {
        moduleId,
        moduleCode: moduleId,
        status: 'not-started' as const,
        responses: [],
      };

      const moduleData: ModuleProgress = {
        ...existing,
        ownership: {
          ...existing.ownership,
          ...ownership,
        },
      };

      const updated = { ...prev, [moduleId]: moduleData };
      saveLocalProgress(updated);
      syncModuleToCloud(moduleId, moduleData);
      return updated;
    });
  }, [syncModuleToCloud]);

  // Save a question response
  const saveResponse = useCallback((moduleId: string, response: QuestionResponse) => {
    setProgress(prev => {
      const existing = prev[moduleId] || {
        moduleId,
        moduleCode: moduleId,
        status: 'in-progress' as const,
        startedAt: new Date().toISOString(),
        responses: [],
      };

      // Update or add response
      const responseIndex = existing.responses.findIndex(r => r.questionId === response.questionId);
      const updatedResponses = [...existing.responses];

      if (responseIndex >= 0) {
        updatedResponses[responseIndex] = response;
      } else {
        updatedResponses.push(response);
      }

      const moduleData: ModuleProgress = {
        ...existing,
        responses: updatedResponses,
      };

      const updated = { ...prev, [moduleId]: moduleData };
      saveLocalProgress(updated);

      // Sync individual response to module_responses table.
      // Org-scoped: one canonical row per (org, module, question). The user
      // who most recently edited is captured in last_modified_by_user_id.
      const session = getSession();
      if (session?.session_id && userIdRef.current && orgIdRef.current) {
        syncOrgRecord('module_responses', {
          session_id: session.session_id,
          module_id: moduleId,
          question_id: response.questionId,
          answer: response.answer,
          notes: response.notes || null,
          partial_description: response.partialDescription || null,
          multi_select_values: response.multiSelectValues ? JSON.stringify(response.multiSelectValues) : null,
          other_description: response.otherDescription || null,
          link_value: response.linkValue || null,
          evidence_count: response.evidence?.length || 0,
          measurement_value: response.measurement?.value ?? null,
          measurement_unit: response.measurement?.unit || null,
          measurement_confidence: response.measurement?.confidence || null,
        }, orgIdRef.current, userIdRef.current, siteIdRef.current).catch(() => {});

        // Background: migrate evidence files from base64 to Supabase Storage
        if (response.evidence && response.evidence.length > 0) {
          for (const ev of response.evidence) {
            if (ev.dataUrl && (!ev.url || ev.url.startsWith('data:'))) {
              migrateEvidenceToStorage(
                ev, userIdRef.current, session.session_id, response.questionId
              ).then(result => {
                if (result) {
                  // Update the evidence URL in localStorage (replace base64 with cloud URL)
                  setProgress(prev => {
                    const mod = prev[moduleId];
                    if (!mod) return prev;
                    const respIdx = mod.responses.findIndex(r => r.questionId === response.questionId);
                    if (respIdx < 0) return prev;
                    const evIdx = mod.responses[respIdx].evidence?.findIndex(e => e.id === ev.id);
                    if (evIdx === undefined || evIdx < 0) return prev;

                    const updatedResponses = [...mod.responses];
                    const updatedEvidence = [...(updatedResponses[respIdx].evidence || [])];
                    updatedEvidence[evIdx] = {
                      ...updatedEvidence[evIdx],
                      url: result.url,
                      // Keep dataUrl as offline fallback but it will be cleared on next quota pressure
                    };
                    updatedResponses[respIdx] = { ...updatedResponses[respIdx], evidence: updatedEvidence };

                    const updated = { ...prev, [moduleId]: { ...mod, responses: updatedResponses } };
                    saveLocalProgress(updated);
                    return updated;
                  });
                }
              }).catch(() => {});
            }
          }
        }
      }

      return updated;
    });
  }, []);

  // Get a specific response
  const getResponse = useCallback((moduleId: string, questionId: string): QuestionResponse | undefined => {
    return progress[moduleId]?.responses.find(r => r.questionId === questionId);
  }, [progress]);

  // Get module progress
  const getModuleProgress = useCallback((moduleId: string): ModuleProgress | undefined => {
    return progress[moduleId];
  }, [progress]);

  // Calculate overall progress
  const getOverallProgress = useCallback(() => {
    const total = selectedModules.length || Object.keys(progress).length;
    const completed = Object.values(progress).filter(p => p.status === 'completed').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  }, [progress, selectedModules]);

  // Sync all progress to cloud (full push).
  // Org-scoped per migration 023. Anonymous users without an org are
  // localStorage-only.
  const syncToCloud = useCallback(async () => {
    if (!isSupabaseEnabled() || !userIdRef.current || !orgIdRef.current) return;

    const session = getSession();
    if (!session?.session_id) return;

    const orgId = orgIdRef.current;
    const userIdValue = userIdRef.current;
    const siteIdValue = siteIdRef.current;

    const progressEntries = Object.values(progress);
    const results = await Promise.allSettled(
      progressEntries.map(entry =>
        syncOrgRecord('module_progress', {
          session_id: session.session_id,
          module_id: entry.moduleId,
          module_code: entry.moduleCode,
          status: entry.status,
          started_at: entry.startedAt,
          completed_at: entry.completedAt,
          summary: entry.summary || null,
          confidence_snapshot: entry.confidenceSnapshot || null,
          completed_by: entry.ownership?.completedBy || null,
          completed_by_role: entry.ownership?.completedByRole || null,
          assigned_to: entry.ownership?.assignedTo || null,
          assigned_to_email: entry.ownership?.assignedToEmail || null,
          target_completion_date: entry.ownership?.targetCompletionDate || null,
        }, orgId, userIdValue, siteIdValue)
      )
    );

    const failed = results.filter(r => r.status === 'rejected').length;
    if (failed > 0) {
      console.warn(`[useModuleProgress] ${failed}/${progressEntries.length} modules failed to sync`);
    }
  }, [progress]);

  // ============================================
  // RUN MANAGEMENT FUNCTIONS
  // ============================================

  // Archive current progress as a run (saves current state before starting fresh)
  const archiveCurrentAsRun = useCallback((moduleId: string, context: ModuleRunContext): string | null => {
    const existing = progress[moduleId];
    if (!existing || existing.responses.length === 0) {
      return null; // Nothing to archive
    }

    const runId = `run-${Date.now()}`;
    const newRun: ModuleRun = {
      id: runId,
      context,
      startedAt: existing.startedAt || new Date().toISOString(),
      completedAt: existing.completedAt,
      status: existing.status,
      responses: [...existing.responses],
      summary: existing.summary,
      ownership: existing.ownership,
      confidenceSnapshot: existing.confidenceSnapshot,
    };

    setProgress(prev => {
      const current = prev[moduleId];
      const existingRuns = current?.runs || [];

      const updated = {
        ...prev,
        [moduleId]: {
          ...current,
          runs: [...existingRuns, newRun],
        },
      };

      saveLocalProgress(updated);
      return updated;
    });

    syncRunToCloud(moduleId, existing.moduleCode, newRun);

    return runId;
  }, [progress, syncRunToCloud]);

  // Start a new run with context (team, department, event, etc.)
  const startNewRun = useCallback((moduleId: string, moduleCode: string, context: ModuleRunContext): string => {
    const runId = `run-${Date.now()}`;
    const now = new Date().toISOString();

    setProgress(prev => {
      const existing = prev[moduleId];
      const existingRuns = existing?.runs || [];

      // If there's current progress that's not archived, archive it first
      let runsToSave = [...existingRuns];
      if (existing && existing.responses.length > 0 && existing.status !== 'not-started') {
        // Check if current progress is already saved as a run
        const isAlreadyArchived = existingRuns.some(run =>
          run.startedAt === existing.startedAt &&
          run.responses.length === existing.responses.length
        );

        if (!isAlreadyArchived) {
          // Auto-archive previous progress
          const previousRun: ModuleRun = {
            id: `run-${Date.now() - 1}`,
            context: { type: 'general', name: 'Previous assessment' },
            startedAt: existing.startedAt || now,
            completedAt: existing.completedAt,
            status: existing.status,
            responses: [...existing.responses],
            summary: existing.summary,
            ownership: existing.ownership,
            confidenceSnapshot: existing.confidenceSnapshot,
          };
          runsToSave = [...runsToSave, previousRun];
        }
      }

      // Create new run entry
      const newRun: ModuleRun = {
        id: runId,
        context,
        startedAt: now,
        status: 'in-progress',
        responses: [],
      };

      const updated = {
        ...prev,
        [moduleId]: {
          moduleId,
          moduleCode,
          status: 'in-progress' as const,
          startedAt: now,
          responses: [],
          activeRunId: runId,
          runs: [...runsToSave, newRun],
        },
      };

      saveLocalProgress(updated);
      return updated;
    });

    // Persist every archived run (everything except the new active one) so the
    // reassessment history reaches the cloud. Upserts are idempotent by run_id.
    const saved = getLocalProgress()[moduleId];
    if (saved?.runs) {
      for (const r of saved.runs) {
        if (r.id !== runId) syncRunToCloud(moduleId, moduleCode, r);
      }
    }

    return runId;
  }, [syncRunToCloud]);

  // Get all runs for a module
  const getModuleRuns = useCallback((moduleId: string): ModuleRun[] => {
    const moduleProgress = progress[moduleId];
    if (!moduleProgress) return [];

    const runs = moduleProgress.runs || [];

    // If there's current progress not in runs, include it as "current"
    if (moduleProgress.responses.length > 0) {
      const isCurrentInRuns = runs.some(run => run.id === moduleProgress.activeRunId);
      if (!isCurrentInRuns && moduleProgress.status !== 'not-started') {
        // Add current progress as a virtual run
        const currentRun: ModuleRun = {
          id: moduleProgress.activeRunId || 'current',
          context: { type: 'general', name: 'Current assessment' },
          startedAt: moduleProgress.startedAt || new Date().toISOString(),
          completedAt: moduleProgress.completedAt,
          status: moduleProgress.status,
          responses: moduleProgress.responses,
          summary: moduleProgress.summary,
          ownership: moduleProgress.ownership,
          confidenceSnapshot: moduleProgress.confidenceSnapshot,
        };
        return [...runs, currentRun];
      }
    }

    return runs;
  }, [progress]);

  // Switch to a different run (load its responses)
  const switchToRun = useCallback((moduleId: string, runId: string) => {
    setProgress(prev => {
      const existing = prev[moduleId];
      if (!existing) return prev;

      const runs = existing.runs || [];
      const targetRun = runs.find(r => r.id === runId);
      if (!targetRun) return prev;

      const updated = {
        ...prev,
        [moduleId]: {
          ...existing,
          status: targetRun.status,
          startedAt: targetRun.startedAt,
          completedAt: targetRun.completedAt,
          responses: [...targetRun.responses],
          summary: targetRun.summary,
          ownership: targetRun.ownership,
          confidenceSnapshot: targetRun.confidenceSnapshot,
          activeRunId: runId,
        },
      };

      saveLocalProgress(updated);
      return updated;
    });
  }, []);

  // Delete a run
  const deleteRun = useCallback((moduleId: string, runId: string) => {
    setProgress(prev => {
      const existing = prev[moduleId];
      if (!existing) return prev;

      const runs = existing.runs || [];
      const filteredRuns = runs.filter(r => r.id !== runId);

      // Check if deleting the active run OR the "current" virtual run
      // The "current" virtual run has ID 'current' when activeRunId is undefined
      const isActiveRun = existing.activeRunId === runId ||
        (runId === 'current' && !existing.activeRunId);

      // Also check if we're deleting the currently loaded progress
      // (when progress exists but isn't formally saved as a run)
      const isDeletingCurrentProgress = isActiveRun ||
        (runId === 'current' && existing.responses.length > 0);

      const updated = {
        ...prev,
        [moduleId]: {
          ...existing,
          runs: filteredRuns,
          ...(isDeletingCurrentProgress ? {
            status: 'not-started' as const,
            responses: [],
            summary: undefined,
            completedAt: undefined,
            startedAt: undefined,
            activeRunId: undefined,
            ownership: undefined,
            confidenceSnapshot: undefined,
          } : {}),
        },
      };

      saveLocalProgress(updated);
      return updated;
    });

    // Remove the archived run from the cloud too (no-op if it was the
    // unsynced virtual 'current' run).
    deleteSnapshot(runId).catch(() => {});
  }, []);

  // Compare two runs and generate comparison results
  const compareRuns = useCallback((moduleId: string, runIdA: string, runIdB: string): RunComparison | null => {
    const runs = getModuleRuns(moduleId);
    const runA = runs.find(r => r.id === runIdA);
    const runB = runs.find(r => r.id === runIdB);

    if (!runA || !runB) return null;

    const improvements: string[] = [];
    const regressions: string[] = [];
    const unchanged: string[] = [];
    const newQuestions: string[] = [];

    // Create response maps
    const responsesA = new Map(runA.responses.map(r => [r.questionId, r]));
    const responsesB = new Map(runB.responses.map(r => [r.questionId, r]));

    // Get all unique question IDs
    const allQuestionIds = new Set([...responsesA.keys(), ...responsesB.keys()]);

    // Score helper: higher is better
    const getScore = (answer: string | null): number => {
      if (answer === 'yes') return 3;
      if (answer === 'partially') return 2;
      if (answer === 'unable-to-check' || answer === 'not-sure') return 1;
      if (answer === 'no') return 0;
      return 1; // Default for other responses
    };

    let totalScoreA = 0;
    let totalScoreB = 0;
    let comparableQuestions = 0;

    allQuestionIds.forEach(questionId => {
      const responseA = responsesA.get(questionId);
      const responseB = responsesB.get(questionId);

      if (!responseA && responseB) {
        newQuestions.push(questionId);
      } else if (responseA && !responseB) {
        newQuestions.push(questionId);
      } else if (responseA && responseB) {
        const scoreA = getScore(responseA.answer);
        const scoreB = getScore(responseB.answer);
        totalScoreA += scoreA;
        totalScoreB += scoreB;
        comparableQuestions++;

        if (scoreB > scoreA) {
          improvements.push(questionId);
        } else if (scoreB < scoreA) {
          regressions.push(questionId);
        } else {
          unchanged.push(questionId);
        }
      }
    });

    // Calculate overall trend
    let overallTrend: 'improving' | 'declining' | 'stable' | 'mixed';
    const scoreChange = comparableQuestions > 0
      ? ((totalScoreB - totalScoreA) / (comparableQuestions * 3)) * 100
      : 0;

    if (improvements.length > regressions.length * 2) {
      overallTrend = 'improving';
    } else if (regressions.length > improvements.length * 2) {
      overallTrend = 'declining';
    } else if (improvements.length === 0 && regressions.length === 0) {
      overallTrend = 'stable';
    } else {
      overallTrend = 'mixed';
    }

    return {
      runA,
      runB,
      improvements,
      regressions,
      unchanged,
      newQuestions,
      overallTrend,
      scoreChange: Math.round(scoreChange * 10) / 10,
    };
  }, [getModuleRuns]);

  return {
    progress,
    isLoading,
    startModule,
    completeModule,
    updateModuleOwnership,
    saveResponse,
    getResponse,
    getModuleProgress,
    getOverallProgress,
    // Run management
    startNewRun,
    getModuleRuns,
    switchToRun,
    deleteRun,
    compareRuns,
    archiveCurrentAsRun,
    syncToCloud,
  };
}
