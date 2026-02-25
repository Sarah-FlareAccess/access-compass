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
    '1.1': 'before-arrival',
    '1.2': 'before-arrival',
    '1.3': 'before-arrival',
    '1.4': 'before-arrival',
    '1.5': 'before-arrival',
    '1.6': 'before-arrival',
    '2.1': 'getting-in',
    '2.2': 'getting-in',
    '2.3': 'getting-in',
    '2.4': 'getting-in',
    '3.1': 'during-visit',
    '3.2': 'during-visit',
    '3.3': 'during-visit',
    '3.4': 'during-visit',
    '3.5': 'during-visit',
    '3.6': 'during-visit',
    '3.7': 'during-visit',
    '3.8': 'during-visit',
    '3.9': 'during-visit',
    '4.1': 'service-support',
    '4.2': 'service-support',
    '4.3': 'service-support',
    '4.4': 'service-support',
    '4.5': 'service-support',
    '4.6': 'service-support',
    '4.7': 'service-support',
    '5.1': 'service-support',
    '5.2': 'service-support',
    '5.3': 'service-support',
    '5.4': 'service-support',
    '5.5': 'service-support',
    '6.1': 'service-support',
    '6.2': 'service-support',
    '6.3': 'service-support',
    '6.4': 'service-support',
    '6.5': 'service-support',
  };

  const category = categoryMap[moduleCode];
  if (category && !resourceInfo.hasResource) {
    links.push(`Browse Related Resources → /resources?category=${category}`);
  }

  // Always add link to full resource centre if no specific resource
  if (links.length === 0) {
    links.push('Browse Resource Hub → /resources');
  }

  return links;
}
