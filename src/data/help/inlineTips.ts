/**
 * Inline Tips Lookup
 *
 * Separated from help/index.ts to avoid pulling accessModules (2.3MB)
 * into every consumer that only needs help content lookups.
 * Only ResourceDetail.tsx uses these functions.
 */

import { accessModules } from '../accessModules';

const inlineTipsByQuestionId = new Map<string, string[]>();
const questionTextById = new Map<string, string>();

for (const mod of accessModules) {
  for (const q of mod.questions) {
    if (q.helpContent?.tips && q.helpContent.tips.length > 0) {
      inlineTipsByQuestionId.set(q.id, q.helpContent.tips);
    }
    questionTextById.set(q.id, q.text);
  }
}

export interface GroupedTips {
  questionText: string;
  tips: string[];
}

export function getInlineTips(questionIds: string[]): string[] {
  const seen = new Set<string>();
  const tips: string[] = [];
  for (const qId of questionIds) {
    const qTips = inlineTipsByQuestionId.get(qId);
    if (qTips) {
      for (const tip of qTips) {
        if (!seen.has(tip)) {
          seen.add(tip);
          tips.push(tip);
        }
      }
    }
  }
  return tips;
}

export function getGroupedInlineTips(questionIds: string[]): GroupedTips[] {
  const seen = new Set<string>();
  const groups: GroupedTips[] = [];
  for (const qId of questionIds) {
    const qTips = inlineTipsByQuestionId.get(qId);
    if (qTips && qTips.length > 0) {
      const uniqueTips: string[] = [];
      for (const tip of qTips) {
        if (!seen.has(tip)) {
          seen.add(tip);
          uniqueTips.push(tip);
        }
      }
      if (uniqueTips.length > 0) {
        const text = questionTextById.get(qId) || qId;
        groups.push({ questionText: text, tips: uniqueTips });
      }
    }
  }
  return groups;
}
