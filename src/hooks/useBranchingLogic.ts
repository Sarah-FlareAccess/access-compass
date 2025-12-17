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
  answers: ('yes' | 'no' | 'not-sure' | 'too-hard')[];
}

export interface BranchingQuestion {
  id: string;
  text: string;
  helpText?: string;
  example?: string;
  type: 'yes-no-unsure' | 'measurement' | 'text' | 'multi-select' | 'single-select' | 'link-input' | 'evidence' | 'url-analysis';
  category?: 'lived-experience' | 'operational' | 'information' | 'measurement' | 'policy' | 'evidence';
  reviewMode?: 'pulse-check' | 'deep-dive' | 'both';
  impactLevel?: 'high' | 'medium' | 'low';
  safetyRelated?: boolean;
  showWhen?: BranchCondition;
  hideWhen?: BranchCondition;
  isEntryPoint?: boolean;
  options?: { id: string; label: string }[];
  measurementUnit?: string;
  measurementGuidance?: {
    min?: number;
    max?: number;
    ideal?: number;
    interpretation?: string;
  };
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

    // Check showWhen condition
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
  // "Too hard" always triggers professional review
  if (response.answer === 'too-hard') return true;

  // Safety-related questions with "no" or "not-sure" trigger review
  if (question.safetyRelated && (response.answer === 'no' || response.answer === 'not-sure')) {
    return true;
  }

  // Measurement questions with low confidence
  if (question.type === 'measurement' && response.measurement?.confidence === 'not-confident') {
    return true;
  }

  return false;
}
