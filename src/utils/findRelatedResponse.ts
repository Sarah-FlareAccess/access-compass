import type { QuestionResponse } from '../hooks/useModuleProgress';
import { readActiveModuleProgressRaw } from './moduleProgressStore';

interface ModuleProgressLite {
  moduleId: string;
  moduleCode?: string;
  responses: QuestionResponse[];
}

export interface RelatedResponseMatch {
  questionId: string;
  moduleId: string;
  moduleCode?: string;
  response: QuestionResponse;
}

export function findFirstRelatedResponse(relatedQuestionIds: string[]): RelatedResponseMatch | null {
  if (!relatedQuestionIds || relatedQuestionIds.length === 0) return null;

  // Scoped to the active site so related-response reuse stays within the venue
  // currently being assessed (multi-site orgs).
  const raw = readActiveModuleProgressRaw();
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
