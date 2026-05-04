import type { QuestionResponse } from '../hooks/useModuleProgress';

interface ModuleProgressLite {
  moduleId: string;
  moduleCode?: string;
  responses: QuestionResponse[];
}

const MODULE_PROGRESS_KEY = 'access_compass_module_progress';

export interface RelatedResponseMatch {
  questionId: string;
  moduleId: string;
  moduleCode?: string;
  response: QuestionResponse;
}

export function findFirstRelatedResponse(relatedQuestionIds: string[]): RelatedResponseMatch | null {
  if (!relatedQuestionIds || relatedQuestionIds.length === 0) return null;

  let raw: string | null = null;
  try {
    raw = localStorage.getItem(MODULE_PROGRESS_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  let progress: Record<string, ModuleProgressLite>;
  try {
    progress = JSON.parse(raw);
  } catch {
    return null;
  }

  for (const targetId of relatedQuestionIds) {
    for (const moduleId of Object.keys(progress)) {
      const entry = progress[moduleId];
      const responses = entry?.responses;
      if (!Array.isArray(responses)) continue;
      const match = responses.find(r => r.questionId === targetId);
      if (match) {
        return {
          questionId: targetId,
          moduleId,
          moduleCode: entry.moduleCode,
          response: match,
        };
      }
    }
  }

  return null;
}
