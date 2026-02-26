/**
 * Help Content Index
 *
 * Exports all help content and provides lookup functions
 * for accessing help by question ID, module, or DIAP category.
 */

import type {
  HelpContent,
  ModuleCode,
  DIAPCategory,
} from './types';

import { beforeArrivalHelp } from './before-arrival';
import { duringVisitHelp } from './during-visit';
import { gettingInHelp } from './getting-in';
import { serviceSupportHelp } from './service-support';
import { toiletsAmenitiesHelp } from './toilets-amenities';
import { organisationHelp } from './organisation';
import { eventsHelp } from './events';

// Combine all help content into a single array
export const allHelpContent: HelpContent[] = [
  ...beforeArrivalHelp,
  ...duringVisitHelp,
  ...gettingInHelp,
  ...serviceSupportHelp,
  ...toiletsAmenitiesHelp,
  ...organisationHelp,
  ...eventsHelp,
];

// Create lookup map for fast access by question ID
const helpByQuestionId = new Map<string, HelpContent>();
allHelpContent.forEach((content) => {
  helpByQuestionId.set(content.questionId, content);
  content.coveredQuestionIds?.forEach((qId) => {
    if (!helpByQuestionId.has(qId)) {
      helpByQuestionId.set(qId, content);
    }
  });
});

/**
 * Get help content for a specific question ID
 */
export function getHelpByQuestionId(questionId: string): HelpContent | undefined {
  return helpByQuestionId.get(questionId);
}

/**
 * Check if help content exists for a question ID
 */
export function hasHelpContent(questionId: string): boolean {
  return helpByQuestionId.has(questionId);
}

/**
 * Get all help content for a specific module
 */
export function getHelpByModule(moduleCode: ModuleCode): HelpContent[] {
  return allHelpContent.filter((content) => content.moduleCode === moduleCode);
}

/**
 * Get all help content for a DIAP category
 */
export function getHelpByDIAPCategory(category: DIAPCategory): HelpContent[] {
  return allHelpContent.filter((content) => content.diapCategory === category);
}

/**
 * Search help content by keywords
 */
export function searchHelp(query: string): HelpContent[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  return allHelpContent.filter((content) => {
    // Search in title, summary, and keywords
    const searchableText = [
      content.title,
      content.summary,
      content.questionText,
      ...(content.keywords || []),
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(lowerQuery);
  });
}

/**
 * Get all question IDs that have help content
 */
export function getQuestionIdsWithHelp(): string[] {
  return Array.from(helpByQuestionId.keys());
}

/**
 * Get help content statistics
 */
export function getHelpStats(): {
  totalQuestions: number;
  byModule: Record<string, number>;
  byCategory: Record<string, number>;
} {
  const byModule: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  allHelpContent.forEach((content) => {
    byModule[content.moduleCode] = (byModule[content.moduleCode] || 0) + 1;
    byCategory[content.diapCategory] = (byCategory[content.diapCategory] || 0) + 1;
  });

  return {
    totalQuestions: allHelpContent.length,
    byModule,
    byCategory,
  };
}

// Re-export types
export * from './types';

// Re-export individual help modules for direct access
export { beforeArrivalHelp } from './before-arrival';
export { duringVisitHelp } from './during-visit';
export { gettingInHelp } from './getting-in';
export { serviceSupportHelp } from './service-support';
export { toiletsAmenitiesHelp } from './toilets-amenities';
export { organisationHelp } from './organisation';
export { eventsHelp } from './events';
