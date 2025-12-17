/**
 * QuestionFlow Component
 *
 * Manages the flow through questions in a module with branching logic.
 * Handles navigation, progress tracking, and summary generation.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { QuestionCard } from './QuestionCard';
import { ModuleSummaryCard } from './ModuleSummaryCard';
import { useBranchingLogic, needsProfessionalReview } from '../../hooks/useBranchingLogic';
import type { QuestionResponse, ModuleSummary, ActionItem } from '../../hooks/useModuleProgress';
import type { BranchingQuestion } from '../../hooks/useBranchingLogic';
import './questions.css';

interface QuestionFlowProps {
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  questions: BranchingQuestion[];
  reviewMode: 'foundation' | 'detailed';
  initialResponses?: QuestionResponse[];
  onSaveResponse: (response: QuestionResponse) => void;
  onComplete: (summary: ModuleSummary) => void;
  onBack: () => void;
}

export function QuestionFlow({
  moduleId,
  moduleName,
  moduleCode,
  questions,
  reviewMode,
  initialResponses = [],
  onSaveResponse,
  onComplete,
  onBack,
}: QuestionFlowProps) {
  const [responses, setResponses] = useState<QuestionResponse[]>(initialResponses);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Use branching logic to determine visible questions
  const { visibleQuestions, getNextQuestion, getPreviousQuestion } = useBranchingLogic({
    questions,
    responses,
    reviewMode,
  });

  // Get current question
  const currentQuestion = visibleQuestions[currentIndex];

  // Get current response if any
  const currentResponse = useMemo(() => {
    if (!currentQuestion) return undefined;
    return responses.find((r) => r.questionId === currentQuestion.id);
  }, [currentQuestion, responses]);

  // Progress calculation
  const progress = useMemo(() => {
    const answered = responses.length;
    const total = visibleQuestions.length;
    return {
      answered,
      total,
      percentage: total > 0 ? Math.round((answered / total) * 100) : 0,
    };
  }, [responses.length, visibleQuestions.length]);

  // Handle answer submission
  const handleAnswer = useCallback(
    (response: QuestionResponse) => {
      // Update local state
      setResponses((prev) => {
        const existingIndex = prev.findIndex((r) => r.questionId === response.questionId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = response;
          return updated;
        }
        return [...prev, response];
      });

      // Save to parent
      onSaveResponse(response);

      // Move to next question
      if (currentIndex < visibleQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // All questions answered, show summary
        setShowSummary(true);
      }
    },
    [currentIndex, visibleQuestions.length, onSaveResponse]
  );

  // Navigate to previous question
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onBack();
    }
  }, [currentIndex, onBack]);

  // Generate summary from responses
  const generateSummary = useCallback((): ModuleSummary => {
    const doingWell: string[] = [];
    const priorityActions: ActionItem[] = [];
    const areasToExplore: string[] = [];
    const professionalReview: string[] = [];

    responses.forEach((response) => {
      const question = questions.find((q) => q.id === response.questionId);
      if (!question) return;

      // Check if needs professional review
      if (needsProfessionalReview(question, response)) {
        professionalReview.push(question.text);
      }

      // Categorize based on answer
      if (response.answer === 'yes') {
        doingWell.push(question.text);
      } else if (response.answer === 'no') {
        // Generate action item
        const priority = question.safetyRelated
          ? 'high'
          : question.impactLevel || 'medium';

        priorityActions.push({
          questionId: question.id,
          questionText: question.text,
          action: generateActionText(question.text),
          priority: priority as 'high' | 'medium' | 'low',
          timeframe: priority === 'high' ? 'Within 1 month' : priority === 'medium' ? 'Within 3 months' : 'Within 6 months',
          impactStatement: generateImpactStatement(question),
        });
      } else if (response.answer === 'not-sure') {
        areasToExplore.push(question.text);
      }

      // Handle measurement responses
      if (response.measurement && question.measurementGuidance) {
        const { value } = response.measurement;
        const { min, max, ideal } = question.measurementGuidance;

        if (min !== undefined && value < min) {
          priorityActions.push({
            questionId: question.id,
            questionText: question.text,
            action: `Improve measurement to meet minimum requirement of ${min}${question.measurementUnit}`,
            priority: question.safetyRelated ? 'high' : 'medium',
            timeframe: 'Within 3 months',
          });
        } else if (ideal !== undefined && value >= ideal) {
          doingWell.push(`${question.text} (${value}${question.measurementUnit})`);
        }
      }
    });

    return {
      doingWell,
      priorityActions,
      areasToExplore,
      professionalReview,
    };
  }, [responses, questions]);

  // Handle completing the module
  const handleComplete = useCallback(() => {
    const summary = generateSummary();
    onComplete(summary);
  }, [generateSummary, onComplete]);

  // Show summary view
  if (showSummary) {
    const summary = generateSummary();
    return (
      <ModuleSummaryCard
        moduleName={moduleName}
        moduleCode={moduleCode}
        summary={summary}
        onComplete={handleComplete}
        onReviewAnswers={() => {
          setShowSummary(false);
          setCurrentIndex(0);
        }}
      />
    );
  }

  // No visible questions
  if (!currentQuestion) {
    return (
      <div className="question-flow-empty">
        <h2>No questions available</h2>
        <p>There are no questions available for this module with the current settings.</p>
        <button className="btn-back" onClick={onBack}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="question-flow">
      {/* Progress bar */}
      <div className="flow-progress-bar">
        <div
          className="flow-progress-fill"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      {/* Navigation header */}
      <div className="flow-navigation-header">
        <button className="flow-back-btn" onClick={handlePrevious}>
          {currentIndex === 0 ? 'Exit module' : 'Previous'}
        </button>
        <span className="flow-progress-text">
          {progress.answered} of {progress.total} answered
        </span>
      </div>

      {/* Question card */}
      <QuestionCard
        question={currentQuestion}
        currentResponse={currentResponse}
        onAnswer={handleAnswer}
        questionNumber={currentIndex + 1}
        totalQuestions={visibleQuestions.length}
        moduleName={moduleName}
      />

      {/* Skip to summary link */}
      {progress.answered >= Math.floor(visibleQuestions.length * 0.5) && (
        <div className="skip-to-summary">
          <button onClick={() => setShowSummary(true)}>
            Skip to summary ({visibleQuestions.length - progress.answered} questions remaining)
          </button>
        </div>
      )}
    </div>
  );
}

// Helper functions for generating action items
function generateActionText(questionText: string): string {
  // Remove question markers and convert to action
  let action = questionText
    .replace(/^Do you have |^Does your |^Is there |^Are there |^Can |^Have you /i, '')
    .replace(/\?$/, '');

  // Capitalize first letter
  action = action.charAt(0).toUpperCase() + action.slice(1);

  return `Review and address: ${action}`;
}

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
