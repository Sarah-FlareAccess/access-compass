/**
 * Module Progress Hook
 *
 * Manages module progress and question responses.
 * Supports both localStorage and Supabase persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import { getSession } from '../utils/session';
import type { ResponseOption } from '../constants/responseOptions';

// Evidence file attached to a question
export interface EvidenceFile {
  id: string;
  type: 'photo' | 'document' | 'link';
  name: string;           // Display name
  url?: string;           // For links or uploaded file URLs
  dataUrl?: string;       // Base64 data URL for local storage (photos/docs)
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

export interface ModuleSummary {
  doingWell: string[];
  priorityActions: ActionItem[];
  areasToExplore: string[];
  professionalReview: string[];
}

export interface ActionItem {
  questionId: string;
  questionText: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
  impactStatement?: string;
}

const MODULE_PROGRESS_KEY = 'access_compass_module_progress';

// Local storage functions
function getLocalProgress(): Record<string, ModuleProgress> {
  const data = localStorage.getItem(MODULE_PROGRESS_KEY);
  return data ? JSON.parse(data) : {};
}

function saveLocalProgress(progress: Record<string, ModuleProgress>) {
  try {
    localStorage.setItem(MODULE_PROGRESS_KEY, JSON.stringify(progress));
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
        localStorage.setItem(MODULE_PROGRESS_KEY, JSON.stringify(reducedProgress));
        console.warn('Saved progress without evidence data due to storage limits.');
        alert('Storage limit reached. Your answers are saved but uploaded files could not be stored locally. Consider completing your session to sync data.');
      } catch (retryError) {
        console.error('Failed to save even reduced progress:', retryError);
        alert('Unable to save progress. Please try refreshing the page or clearing browser data.');
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

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Load from localStorage first
        const localProgress = getLocalProgress();
        setProgress(localProgress);

        // If Supabase is enabled, sync from cloud
        if (isSupabaseEnabled() && supabase) {
          const session = getSession();
          if (session?.session_id) {
            const { data: cloudProgress, error: supabaseError } = await supabase
              .from('module_progress')
              .select('*')
              .eq('session_id', session.session_id);

            // Skip cloud sync if table doesn't exist or other error (silently fall back)
            if (supabaseError) {
              // Table doesn't exist yet - this is expected if migrations haven't been run
            } else if (cloudProgress && cloudProgress.length > 0) {
              const cloudMap: Record<string, ModuleProgress> = {};
              cloudProgress.forEach(p => {
                cloudMap[p.module_id] = {
                  moduleId: p.module_id,
                  moduleCode: p.module_code,
                  status: p.status,
                  startedAt: p.started_at,
                  completedAt: p.completed_at,
                  responses: p.responses || [],
                  summary: p.summary,
                };
              });

              // Merge with local (local takes precedence for newer data)
              const merged = { ...cloudMap, ...localProgress };
              setProgress(merged);
              saveLocalProgress(merged);
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
  }, []);

  // Start a module
  const startModule = useCallback((moduleId: string, moduleCode: string) => {
    setProgress(prev => {
      const existing = prev[moduleId];
      if (existing && existing.status !== 'not-started') {
        return prev; // Already started
      }

      const updated = {
        ...prev,
        [moduleId]: {
          moduleId,
          moduleCode,
          status: 'in-progress' as const,
          startedAt: new Date().toISOString(),
          responses: existing?.responses || [],
        },
      };

      saveLocalProgress(updated);
      return updated;
    });
  }, []);

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

      const updated = {
        ...prev,
        [moduleId]: {
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
        },
      };

      saveLocalProgress(updated);
      return updated;
    });
  }, []);

  // Update module ownership (assignment and target date)
  const updateModuleOwnership = useCallback((moduleId: string, ownership: Partial<ModuleOwnership>) => {
    setProgress(prev => {
      const existing = prev[moduleId] || {
        moduleId,
        moduleCode: moduleId,
        status: 'not-started' as const,
        responses: [],
      };

      const updated = {
        ...prev,
        [moduleId]: {
          ...existing,
          ownership: {
            ...existing.ownership,
            ...ownership,
          },
        },
      };

      saveLocalProgress(updated);
      return updated;
    });
  }, []);

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

      const updated = {
        ...prev,
        [moduleId]: {
          ...existing,
          responses: updatedResponses,
        },
      };

      saveLocalProgress(updated);
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

  // Sync to cloud
  const syncToCloud = useCallback(async () => {
    if (!isSupabaseEnabled() || !supabase) return;

    const session = getSession();
    if (!session?.session_id) return;

    try {
      const progressEntries = Object.values(progress);

      for (const entry of progressEntries) {
        await supabase.from('module_progress').upsert({
          session_id: session.session_id,
          module_id: entry.moduleId,
          module_code: entry.moduleCode,
          status: entry.status,
          started_at: entry.startedAt,
          completed_at: entry.completedAt,
          responses: entry.responses,
          summary: entry.summary,
        });
      }
    } catch (err) {
      console.error('Error syncing module progress:', err);
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

    return runId;
  }, [progress]);

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

    return runId;
  }, []);

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
