/**
 * Branching Logic Hook
 *
 * Handles conditional question visibility based on previous answers.
 * Questions can have showWhen/hideWhen conditions that reference other questions.
 */

import { useMemo, useCallback } from 'react';
import type { QuestionResponse } from './useModuleProgress';

export interface BranchCondition {
  questionId: string;
  // Can be standard ResponseOption values OR custom option IDs from single-select/multi-select questions
  answers: string[];
}

// Help content for visual examples, videos, and educational materials
export interface HelpExample {
  type: 'good' | 'poor' | 'info';
  imageUrl?: string; // Path in /public folder, e.g., '/help/signage-good.jpg'
  caption: string;
  details?: string;
}

export interface HelpContent {
  title?: string; // Override default "Understanding [question topic]"
  summary?: string; // Brief explanation
  examples?: HelpExample[];
  videoUrl?: string; // Vimeo URL
  videoCaption?: string;
  tips?: string[]; // Quick tips list
  learnMoreUrl?: string; // External resource link
  learnMoreText?: string; // Custom link text (default: "Learn more")
  learnMoreNote?: string; // Disclaimer or usage instructions for the external link
}

export interface BranchingQuestion {
  id: string;
  text: string;
  helpText?: string;
  example?: string;
  type: 'yes-no-unsure' | 'measurement' | 'text' | 'multi-select' | 'single-select' | 'link-input' | 'evidence' | 'url-analysis' | 'media-analysis';
  category?: 'lived-experience' | 'operational' | 'information' | 'measurement' | 'policy' | 'evidence' | 'employment' | 'training' | 'procurement' | 'improvement';
  reviewMode?: 'pulse-check' | 'deep-dive' | 'both';
  impactLevel?: 'high' | 'medium' | 'low';
  safetyRelated?: boolean;
  showWhen?: BranchCondition;
  hideWhen?: BranchCondition;
  isEntryPoint?: boolean;
  options?: {
    id: string;
    label: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
    // Specific recommendation text to include in report when this option is selected
    recommendation?: string;
  }[];
  // Controls how this question appears in summaries
  // 'action-planning' = responses go to areasToExplore (for follow-up questions about improvements)
  summaryBehavior?: 'action-planning';
  measurementUnit?: string;
  measurementGuidance?: {
    min?: number;
    max?: number;
    ideal?: number;
    interpretation?: string;
  };
  // Evidence upload support
  supportsEvidence?: boolean;
  evidenceTypes?: ('photo' | 'document' | 'link')[];
  evidenceHint?: string; // e.g., "Upload a photo of the entrance" or "Attach your accessibility policy"
  // Media analysis support
  mediaAnalysisType?: string; // Pre-selected media type (e.g., 'menu', 'signage', 'lighting')
  mediaAnalysisHint?: string; // Help text for media analysis
  // Rich help content for visual examples and videos
  helpContent?: HelpContent;
  // Whether this question has multiple elements that can be partially met
  allowPartial?: boolean;
  // Custom placeholder text for the "partially" description field
  partialPlaceholder?: string;
}

interface UseBranchingLogicProps {
  questions: BranchingQuestion[];
  responses: QuestionResponse[];
  reviewMode: 'pulse-check' | 'deep-dive';
}

interface UseBranchingLogicReturn {
  visibleQuestions: BranchingQuestion[];
  isQuestionVisible: (questionId: string) => boolean;
  getQuestionsByBranch: () => {
    entry: BranchingQuestion[];
    followUp: BranchingQuestion[];
    hidden: BranchingQuestion[];
  };
  getNextQuestion: (currentQuestionId: string) => BranchingQuestion | null;
  getPreviousQuestion: (currentQuestionId: string) => BranchingQuestion | null;
}

export function useBranchingLogic({
  questions,
  responses,
  reviewMode,
}: UseBranchingLogicProps): UseBranchingLogicReturn {

  // Build a map of questionId -> response for quick lookup
  const responseMap = useMemo(() => {
    const map: Record<string, QuestionResponse> = {};
    responses.forEach(r => {
      map[r.questionId] = r;
    });
    return map;
  }, [responses]);

  // Check if a condition is met
  const isConditionMet = useCallback((condition: BranchCondition): boolean => {
    const response = responseMap[condition.questionId];
    if (!response || !response.answer) return false;
    return condition.answers.includes(response.answer as any);
  }, [responseMap]);

  // Check if a question should be visible
  const isQuestionVisible = useCallback((questionId: string): boolean => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return false;

    // Check review mode filter
    if (question.reviewMode) {
      if (question.reviewMode === 'pulse-check' && reviewMode === 'deep-dive') {
        // Pulse check questions visible in both modes
      } else if (question.reviewMode === 'deep-dive' && reviewMode === 'pulse-check') {
        // Deep dive questions hidden in pulse check mode
        return false;
      }
      // 'both' is always visible
    }

    // Check hideWhen condition (takes precedence)
    if (question.hideWhen && isConditionMet(question.hideWhen)) {
      return false;
    }

    // Check showWhen condition - applies in both pulse-check and deep-dive modes
    // If a question has a showWhen condition, it should only appear when that condition is met
    // (e.g., follow-up questions for "no" answers shouldn't show when user answered "yes")
    if (question.showWhen) {
      return isConditionMet(question.showWhen);
    }

    // No conditions = always visible (unless filtered by reviewMode)
    return true;
  }, [questions, reviewMode, isConditionMet]);

  // Get all visible questions
  const visibleQuestions = useMemo(() => {
    return questions.filter(q => isQuestionVisible(q.id));
  }, [questions, isQuestionVisible]);

  // Categorize questions by branch type
  const getQuestionsByBranch = useCallback(() => {
    const entry: BranchingQuestion[] = [];
    const followUp: BranchingQuestion[] = [];
    const hidden: BranchingQuestion[] = [];

    questions.forEach(question => {
      if (!isQuestionVisible(question.id)) {
        hidden.push(question);
      } else if (question.isEntryPoint || !question.showWhen) {
        entry.push(question);
      } else {
        followUp.push(question);
      }
    });

    return { entry, followUp, hidden };
  }, [questions, isQuestionVisible]);

  // Get next visible question
  const getNextQuestion = useCallback((currentQuestionId: string): BranchingQuestion | null => {
    const currentIndex = visibleQuestions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex === -1 || currentIndex >= visibleQuestions.length - 1) {
      return null;
    }
    return visibleQuestions[currentIndex + 1];
  }, [visibleQuestions]);

  // Get previous visible question
  const getPreviousQuestion = useCallback((currentQuestionId: string): BranchingQuestion | null => {
    const currentIndex = visibleQuestions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex <= 0) {
      return null;
    }
    return visibleQuestions[currentIndex - 1];
  }, [visibleQuestions]);

  return {
    visibleQuestions,
    isQuestionVisible,
    getQuestionsByBranch,
    getNextQuestion,
    getPreviousQuestion,
  };
}

/**
 * Helper to generate clarification prompts for "not sure" answers
 */
export function generateClarificationPrompt(questionText: string): string {
  const baseText = questionText
    .replace(/^Do you |^Does your |^Are |^Is |^Can /i, '')
    .replace(/\?$/, '');

  return `You weren't sure whether ${baseText.toLowerCase()}. This is a common area to explore next.`;
}

/**
 * Helper to determine if a question triggers professional review
 */
export function needsProfessionalReview(
  question: BranchingQuestion,
  response: QuestionResponse
): boolean {
  // "Unable to check" always triggers professional review
  if (response.answer === 'unable-to-check') return true;

  // Safety-related questions with "no" trigger review (unable-to-check already handled above)
  if (question.safetyRelated && response.answer === 'no') {
    return true;
  }

  // Measurement questions with low confidence
  if (question.type === 'measurement' && response.measurement?.confidence === 'not-confident') {
    return true;
  }

  return false;
}
