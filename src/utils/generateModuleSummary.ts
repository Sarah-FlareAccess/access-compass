/**
 * Module Summary Generator
 *
 * Shared utility that generates report summaries from responses and questions.
 * Used by both QuestionFlow (at completion time) and useReportGeneration (at report time).
 * This ensures reports always use the latest question data (e.g., actionText fields).
 */

import type { QuestionResponse } from '../hooks/useModuleProgress';
import type { ModuleSummary, ActionItem, ExploreItem } from '../hooks/useModuleProgress';
import type { BranchingQuestion } from '../hooks/useBranchingLogic';
import { needsProfessionalReview } from '../hooks/useBranchingLogic';
import { calculateQuestionPriority, getTimeframeForPriority } from './priorityCalculation';
import { generateActionText } from '../components/questions/QuestionFlow';

/**
 * Categorize response sentiment for multi-select and other non-yes/no responses
 */
function categorizeResponseSentiment(
  response: QuestionResponse,
  question: BranchingQuestion
): 'positive' | 'negative' | 'neutral' | null {
  if (response.answer) {
    return null;
  }

  if (question.summaryBehavior === 'action-planning') {
    return 'neutral';
  }

  if (response.multiSelectValues && response.multiSelectValues.length > 0) {
    const selectedOptionIds = response.multiSelectValues;

    const selectedOptions = selectedOptionIds
      .map(id => question.options?.find(opt => opt.id === id))
      .filter((opt): opt is NonNullable<typeof opt> => Boolean(opt));

    if (selectedOptions.some(opt => opt.sentiment)) {
      const hasPositive = selectedOptions.some(opt => opt.sentiment === 'positive');
      const hasNegative = selectedOptions.some(opt => opt.sentiment === 'negative');
      const hasNeutral = selectedOptions.some(opt => opt.sentiment === 'neutral');

      if (hasNeutral && !hasPositive) {
        return 'neutral';
      }
      if (hasNeutral && hasPositive) {
        return 'neutral';
      }
      if (hasNegative) {
        return 'negative';
      }
      if (hasPositive) {
        return 'positive';
      }
    }

    const selectedLabels = selectedOptionIds
      .map(id => question.options?.find(opt => opt.id === id)?.label || id)
      .join(' ');

    const positiveKeywords = [
      'yes', 'consistently', 'confident', 'multiple', 'all', 'excellent',
      'good', 'very', 'always', 'easy', 'clear', 'accessible'
    ];

    const negativeKeywords = [
      'no', 'none', 'limited', 'poor', 'never', 'difficult', 'hard',
      'inaccessible', 'missing', 'lack'
    ];

    const neutralKeywords = [
      'sometimes', 'somewhat', 'not sure', 'unsure', 'maybe', 'partially',
      'moderate', 'fair', 'average', 'on request', 'only'
    ];

    const lowerLabels = selectedLabels.toLowerCase();

    if (neutralKeywords.some(keyword => lowerLabels.includes(keyword))) {
      return 'neutral';
    }

    if (negativeKeywords.some(keyword => lowerLabels.includes(keyword))) {
      return 'negative';
    }

    if (positiveKeywords.some(keyword => lowerLabels.includes(keyword))) {
      return 'positive';
    }

    if (selectedOptionIds.length > 1) {
      return 'positive';
    }
  }

  if (response.urlAnalysis) {
    const score = response.urlAnalysis.overallScore;
    if (score >= 70) return 'positive';
    if (score >= 40) return 'neutral';
    return 'negative';
  }

  if (response.linkValue) {
    return 'neutral';
  }

  return null;
}

/**
 * Get a brief detail string for a response to show in summary
 */
function getResponseDetails(
  response: QuestionResponse,
  question: BranchingQuestion
): string | null {
  if (response.multiSelectValues && response.multiSelectValues.length === 1) {
    const optionId = response.multiSelectValues[0];
    const option = question.options?.find(opt => opt.id === optionId);
    return option?.label || null;
  }

  if (response.multiSelectValues && response.multiSelectValues.length > 1) {
    const labels = response.multiSelectValues
      .map(id => question.options?.find(opt => opt.id === id)?.label)
      .filter(Boolean) as string[];
    if (labels.length > 3) {
      return `${labels.slice(0, 2).join(', ')} + ${labels.length - 2} more`;
    }
    return labels.length > 0 ? labels.join(', ') : null;
  }

  if (response.urlAnalysis) {
    return `${response.urlAnalysis.overallScore}/100`;
  }

  return null;
}

/**
 * Convert a question to a statement format for better readability
 */
export function convertQuestionToStatement(questionText: string): string {
  let statement = questionText;

  // Strip question mark and trailing prompt text
  statement = statement.replace(/\?.*$/, '');
  statement = statement.replace(/[.:]\s*(select all that apply|choose all|tick all).*$/i, '');

  const conversions: Array<[RegExp, string]> = [
    [/^Do you have /i, 'You have '],
    [/^Do you /i, 'You '],
    [/^Do staff /i, 'Staff '],
    [/^Do customers /i, 'Customers '],
    [/^Do visitors /i, 'Visitors '],
    [/^Do people /i, 'People '],
    [/^Do your /i, 'Your '],
    [/^Does your (.+?) have /i, 'Your $1 has '],
    [/^Does the (.+?) have /i, 'The $1 has '],
    [/^Does your /i, 'Your '],
    [/^Does the /i, 'The '],
    [/^Does /i, 'Your business '],
    [/^Do /i, ''],
    [/^Are you /i, 'You are '],
    [/^Are your /i, 'Your '],
    [/^Are staff /i, 'Staff are '],
    [/^Are customers /i, 'Customers are '],
    [/^Are visitors /i, 'Visitors are '],
    [/^Are there /i, 'There are '],
    [/^Are the /i, 'The '],
    [/^Are all /i, 'All '],
    [/^Are /i, 'There are '],
    [/^Is your /i, 'Your '],
    [/^Is there /i, 'There is '],
    [/^Is the /i, 'The '],
    [/^Is /i, 'Your business '],
    [/^Can you /i, 'You can '],
    [/^Can your /i, 'Your '],
    [/^Can customers /i, 'Customers can '],
    [/^Can visitors /i, 'Visitors can '],
    [/^Can people /i, 'People can '],
    [/^Can staff /i, 'Staff can '],
    [/^Can all /i, 'All '],
    [/^Can the /i, 'The '],
    [/^Can /i, 'Customers can '],
    [/^Have you /i, 'You have '],
    [/^Have your /i, 'Your '],
    [/^Has your /i, 'Your '],
    [/^Has the /i, 'The '],
    [/^Would you like /i, 'You would like '],
    [/^Would you /i, 'You would '],
    [/^Could you /i, 'You could '],
    [/^What have you /i, 'You have '],
    [/^What has your /i, 'Your '],
    [/^What types? of (.+?) do you currently (.+)/i, 'You currently $2 $1'],
    [/^What types? of (.+?) do you (.+)/i, 'You $2 $1'],
    [/^What types? of (.+?) have you (.+)/i, 'You have $2 $1'],
    [/^What (.+?) do you currently (.+)/i, 'You currently $2 $1'],
    [/^What (.+?) do you (.+)/i, 'You $2 $1'],
    [/^What (.+?) have you (.+)/i, 'You have $2 $1'],
    [/^How confident are you that (.+)/i, 'You are confident that $1'],
    [/^How confident are you (.+)/i, 'You are confident $1'],
    [/^How (.+?) are you that (.+)/i, 'You are $1 that $2'],
    [/^How (.+?) are you (.+)/i, 'You are $1 $2'],
    [/^How (.+?) is your (.+)/i, 'Your $2 is $1'],
    [/^How (.+?) do you (.+)/i, 'You $2 $1'],
  ];

  for (const [pattern, replacement] of conversions) {
    if (pattern.test(statement)) {
      statement = statement.replace(pattern, replacement);
      break;
    }
  }

  statement = statement.charAt(0).toUpperCase() + statement.slice(1);

  return statement;
}

/**
 * Convert a question to an exploratory statement for "areas to explore"
 */
export function convertQuestionToExploreStatement(questionText: string): string {
  let statement = questionText;

  // Strip question mark and trailing prompt text
  statement = statement.replace(/\?.*$/, '');
  statement = statement.replace(/[.:]\s*(select all that apply|choose all|tick all).*$/i, '');

  const conversions: Array<[RegExp, string]> = [
    [/^Do you have /i, 'Check if you have '],
    [/^Do you /i, 'Check if you '],
    [/^Do staff /i, 'Check if staff '],
    [/^Do customers /i, 'Check if customers '],
    [/^Do visitors /i, 'Check if visitors '],
    [/^Do people /i, 'Check if people '],
    [/^Do your /i, 'Check if your '],
    [/^Does your (.+?) have /i, 'Check if your $1 has '],
    [/^Does the (.+?) have /i, 'Check if the $1 has '],
    [/^Does your /i, 'Check if your '],
    [/^Does the /i, 'Check if the '],
    [/^Does /i, 'Check if your business '],
    [/^Do /i, 'Check if '],
    [/^Are you /i, 'Check if you are '],
    [/^Are your /i, 'Check if your '],
    [/^Are staff /i, 'Check if staff are '],
    [/^Are customers /i, 'Check if customers are '],
    [/^Are visitors /i, 'Check if visitors are '],
    [/^Are there /i, 'Check if there are '],
    [/^Are the /i, 'Check if the '],
    [/^Are all /i, 'Check if all '],
    [/^Are /i, 'Check if there are '],
    [/^Is your /i, 'Check if your '],
    [/^Is there /i, 'Check if there is '],
    [/^Is the /i, 'Check if the '],
    [/^Is /i, 'Check if '],
    [/^Can you /i, 'Check if you can '],
    [/^Can your /i, 'Check if your '],
    [/^Can customers /i, 'Check if customers can '],
    [/^Can visitors /i, 'Check if visitors can '],
    [/^Can people /i, 'Check if people can '],
    [/^Can staff /i, 'Check if staff can '],
    [/^Can all /i, 'Check if all '],
    [/^Can the /i, 'Check if the '],
    [/^Can /i, 'Check if customers can '],
    [/^Have you /i, 'Check if you have '],
    [/^Have your /i, 'Check if your '],
    [/^Has your /i, 'Check if your '],
    [/^Has the /i, 'Check if the '],
    [/^What have you /i, 'Review what you have '],
    [/^What /i, 'Review what '],
    [/^How /i, 'Review how '],
    [/^When /i, 'Check when '],
    [/^Where /i, 'Check where '],
  ];

  for (const [pattern, replacement] of conversions) {
    if (pattern.test(statement)) {
      statement = statement.replace(pattern, replacement);
      break;
    }
  }

  if (!statement.startsWith('Check') && !statement.startsWith('Review')) {
    statement = 'Check if ' + statement.charAt(0).toLowerCase() + statement.slice(1);
  }

  statement = statement.charAt(0).toUpperCase() + statement.slice(1);

  return statement;
}

/**
 * Generate impact statement for a question
 */
function generateImpactStatement(question: BranchingQuestion): string {
  if (question.safetyRelated) {
    return 'This is safety-related and may affect customer wellbeing.';
  }

  const categoryStatements: Record<string, string> = {
    'lived-experience': 'This affects the lived experience of disabled customers.',
    operational: 'This relates to how your business operates day-to-day.',
    information: 'This affects how customers access information about your business.',
    measurement: 'This is a measurable accessibility standard.',
    policy: 'This relates to your accessibility policies and procedures.',
  };

  return categoryStatements[question.category || ''] || 'This affects customer accessibility.';
}

/**
 * Generate a module summary from responses and questions.
 * Pure function (no React hooks) so it can be called from anywhere.
 */
export function generateModuleSummary(
  responses: QuestionResponse[],
  questions: BranchingQuestion[],
): ModuleSummary {
  const doingWell: string[] = [];
  const priorityActions: ActionItem[] = [];
  const areasToExplore: ExploreItem[] = [];
  const professionalReview: string[] = [];

  responses.forEach((response) => {
    const question = questions.find((q) => q.id === response.questionId);
    if (!question) return;

    if (needsProfessionalReview(question, response)) {
      professionalReview.push(convertQuestionToStatement(question.text));
    }

    const sentiment = categorizeResponseSentiment(response, question);

    if (response.answer === 'yes') {
      doingWell.push(convertQuestionToStatement(question.text));
    } else if (response.answer === 'no') {
      const priority = calculateQuestionPriority({
        complianceLevel: question.complianceLevel,
        safetyRelated: question.safetyRelated,
        impactLevel: question.impactLevel,
        answer: 'no',
      });

      priorityActions.push({
        questionId: question.id,
        questionText: question.text,
        action: question.actionText?.no || generateActionText(question.text),
        priority,
        timeframe: getTimeframeForPriority(priority),
        impactStatement: generateImpactStatement(question),
        complianceLevel: question.complianceLevel,
        safetyRelated: question.safetyRelated,
      });
    } else if (response.answer === 'partially') {
      const statement = convertQuestionToStatement(question.text);
      const partialDescription = response.notes?.trim();

      if (partialDescription) {
        doingWell.push(`${statement} (partially in place): ${partialDescription}`);
      } else {
        doingWell.push(`${statement} (partially in place)`);
      }

      const partialPriority = calculateQuestionPriority({
        complianceLevel: question.complianceLevel,
        safetyRelated: question.safetyRelated,
        impactLevel: question.impactLevel,
        answer: 'partially',
      });

      const partialAction = question.actionText?.partially
        || `Complete improvements to: ${statement.toLowerCase()}`;

      priorityActions.push({
        questionId: question.id,
        questionText: question.text,
        action: partialAction,
        priority: partialPriority,
        timeframe: getTimeframeForPriority(partialPriority),
        impactStatement: partialDescription
          ? `Current status: ${partialDescription}`
          : 'Partial measures are in place. Complete implementation for full accessibility.',
        complianceLevel: question.complianceLevel,
        safetyRelated: question.safetyRelated,
      });
    } else if (response.answer === 'unable-to-check') {
      areasToExplore.push({
        questionId: question.id,
        questionText: question.text,
        action: question.actionText?.unsure || convertQuestionToExploreStatement(question.text),
      });
    } else if (response.mediaAnalysis) {
      const analysisType = response.mediaAnalysis.analysisType || 'item';
      const score = response.mediaAnalysis.overallScore;
      const status = response.mediaAnalysis.overallStatus;

      if (status === 'excellent' || status === 'good') {
        doingWell.push(`${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} analysis: ${score}/100 - ${status}`);
      } else if (status === 'poor') {
        priorityActions.push({
          questionId: question.id,
          questionText: question.text,
          action: `Address ${analysisType} accessibility issues identified in analysis`,
          priority: 'high',
          timeframe: 'Within 1 month',
          impactStatement: `Analysis score: ${score}/100. Significant improvements needed.`,
        });
      } else {
        priorityActions.push({
          questionId: question.id,
          questionText: question.text,
          action: `Review and improve ${analysisType} based on analysis findings`,
          priority: 'medium',
          timeframe: 'Within 3 months',
          impactStatement: `Analysis score: ${score}/100. Some improvements recommended.`,
        });
      }
    } else if (response.multiSelectValues || response.linkValue || response.urlAnalysis) {
      if (sentiment === 'positive') {
        const statement = convertQuestionToStatement(question.text);
        const details = getResponseDetails(response, question);
        doingWell.push(details ? `${statement} (${details})` : statement);
      } else if (sentiment === 'negative') {
        const priority = calculateQuestionPriority({
          complianceLevel: question.complianceLevel,
          safetyRelated: question.safetyRelated,
          impactLevel: question.impactLevel,
          answer: 'no',
        });

        priorityActions.push({
          questionId: question.id,
          questionText: question.text,
          action: question.actionText?.no || generateActionText(question.text),
          priority,
          timeframe: getTimeframeForPriority(priority),
          impactStatement: generateImpactStatement(question),
          complianceLevel: question.complianceLevel,
        });
      } else if (sentiment === 'neutral') {
        areasToExplore.push({
          questionId: question.id,
          questionText: question.text,
          action: question.actionText?.unsure || convertQuestionToExploreStatement(question.text),
        });
      }

      if (response.multiSelectValues && question.options) {
        response.multiSelectValues.forEach((optionId) => {
          const option = question.options?.find((opt) => opt.id === optionId);
          if (option?.recommendation) {
            priorityActions.push({
              questionId: question.id,
              questionText: question.text,
              action: option.recommendation,
              priority: 'medium',
              timeframe: 'Within 3 months',
              impactStatement: `Based on selecting: ${option.label}`,
            });
          }
        });
      }
    }

    if (response.measurement && question.measurementGuidance) {
      const { value } = response.measurement;
      const { min, max: _max, ideal } = question.measurementGuidance;

      if (min !== undefined && value < min) {
        const measPriority = calculateQuestionPriority({
          complianceLevel: question.complianceLevel,
          safetyRelated: question.safetyRelated,
          impactLevel: question.impactLevel,
          answer: 'no',
        });
        priorityActions.push({
          questionId: question.id,
          questionText: question.text,
          action: `Improve measurement to meet minimum requirement of ${min}${question.measurementUnit}`,
          priority: measPriority,
          timeframe: getTimeframeForPriority(measPriority),
        });
      } else if (ideal !== undefined && value >= ideal) {
        const statement = convertQuestionToStatement(question.text);
        doingWell.push(`${statement} (${value}${question.measurementUnit})`);
      }
    }
  });

  return {
    doingWell,
    priorityActions,
    areasToExplore,
    professionalReview,
  };
}
