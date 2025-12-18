/**
 * Resource Link Utilities
 *
 * Generates links to the Resource Centre for use in reports
 * and throughout the application.
 */

import { hasHelpContent, getHelpByQuestionId } from '../data/help';

/**
 * Generate a link to a specific resource in the Resource Centre
 */
export function getResourceLink(questionId: string): string {
  return `/resources?resource=${encodeURIComponent(questionId)}`;
}

/**
 * Generate a link to the Resource Centre filtered by category
 */
export function getCategoryLink(category: string): string {
  return `/resources?category=${encodeURIComponent(category)}`;
}

/**
 * Generate a link to the Resource Centre filtered by DIAP category
 */
export function getDIAPCategoryLink(diapCategory: string): string {
  return `/resources?diap=${encodeURIComponent(diapCategory)}`;
}

/**
 * Check if a resource exists for a question and return link info
 */
export function getResourceInfo(questionId: string): {
  hasResource: boolean;
  link: string | null;
  title: string | null;
} {
  if (!hasHelpContent(questionId)) {
    return { hasResource: false, link: null, title: null };
  }

  const content = getHelpByQuestionId(questionId);
  return {
    hasResource: true,
    link: getResourceLink(questionId),
    title: content?.title || null,
  };
}

/**
 * Generate resource links for report recommendations
 * Returns formatted links for inclusion in the report
 */
export function getReportResourceLinks(questionId: string, moduleCode: string): string[] {
  const links: string[] = [];

  // Check if we have specific help content for this question
  const resourceInfo = getResourceInfo(questionId);
  if (resourceInfo.hasResource && resourceInfo.title) {
    links.push(`View Guide: ${resourceInfo.title} → /resources?resource=${questionId}`);
  }

  // Add category-based resource link
  const categoryMap: Record<string, string> = {
    'B1': 'before-arrival',
    'B4.1': 'before-arrival',
    'B4.2': 'before-arrival',
    'B4.3': 'before-arrival',
    'A1': 'getting-in',
    'A2': 'getting-in',
    'A3a': 'getting-in',
    'A3b': 'getting-in',
    'A4': 'during-visit',
    'A5': 'during-visit',
    'A6': 'during-visit',
    'B2': 'during-visit',
    'B3': 'during-visit',
    'C1': 'service-support',
    'C2': 'service-support',
    'A7': 'service-support',
    'C3': 'service-support',
    'P1': 'service-support',
  };

  const category = categoryMap[moduleCode];
  if (category && !resourceInfo.hasResource) {
    links.push(`Browse Related Resources → /resources?category=${category}`);
  }

  // Always add link to full resource centre if no specific resource
  if (links.length === 0) {
    links.push('Browse Resource Centre → /resources');
  }

  return links;
}
