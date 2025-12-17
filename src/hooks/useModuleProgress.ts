/**
 * Module Progress Hook
 *
 * Manages module progress and question responses.
 * Supports both localStorage and Supabase persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import { getSession } from '../utils/session';

export interface QuestionResponse {
  questionId: string;
  answer: 'yes' | 'no' | 'not-sure' | 'too-hard' | null;
  notes?: string;
  photos?: string[];
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
  timestamp: string;
}

export interface ModuleOwnership {
  assignedTo?: string;           // Free text - person's name or role
  assignedToEmail?: string;      // Email for future notification capability
  targetCompletionDate?: string; // ISO date string
  completedBy?: string;          // Auto-captured on completion
  completedByRole?: string;      // Optional role/title of completer
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
  localStorage.setItem(MODULE_PROGRESS_KEY, JSON.stringify(progress));
}

interface CompletionMetadata {
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

            // Skip cloud sync if table doesn't exist or other error
            if (supabaseError) {
              console.log('Supabase module_progress not available, using local storage');
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
    const unsureCount = responses.filter(r => r.answer === 'not-sure' || r.answer === 'too-hard').length;
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
    syncToCloud,
  };
}
