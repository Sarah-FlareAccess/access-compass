/**
 * QuestionFlow Component
 *
 * Manages the flow through questions in a module with branching logic.
 * Handles navigation, progress tracking, and summary generation.
 */

import { useState, useCallback, useMemo } from 'react';
import { QuestionCard } from './QuestionCard';
import { ModuleSummaryCard } from './ModuleSummaryCard';
import { ReviewSummary } from './ReviewSummary';
import { useBranchingLogic, needsProfessionalReview } from '../../hooks/useBranchingLogic';
import type { QuestionResponse, ModuleSummary, ActionItem, CompletionMetadata } from '../../hooks/useModuleProgress';
import type { BranchingQuestion } from '../../hooks/useBranchingLogic';
import './questions.css';

interface QuestionFlowProps {
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  questions: BranchingQuestion[];
  reviewMode: 'pulse-check' | 'deep-dive';
  initialResponses?: QuestionResponse[];
  onSaveResponse: (response: QuestionResponse) => void;
  onComplete: (summary: ModuleSummary, metadata: CompletionMetadata) => void;
  onBack: () => void;
  assignedTo?: string; // Pre-fill "completed by" with assigned person
}

export function QuestionFlow({
  moduleId: _moduleId,
  moduleName,
  moduleCode,
  questions,
  reviewMode,
  initialResponses = [],
  onSaveResponse,
  onComplete,
  onBack,
  assignedTo,
}: QuestionFlowProps) {
  const [responses, setResponses] = useState<QuestionResponse[]>(initialResponses);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showReviewSummary, setShowReviewSummary] = useState(false);

  // Use branching logic to determine visible questions
  const { visibleQuestions } = useBranchingLogic({
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
        professionalReview.push(convertQuestionToStatement(question.text));
      }

      // Determine response sentiment for categorization
      const sentiment = categorizeResponseSentiment(response, question);

      // Categorize based on answer type
      if (response.answer === 'yes') {
        doingWell.push(convertQuestionToStatement(question.text));
      } else if (response.answer === 'no') {
        // Generate high/medium priority action item
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
      } else if (response.answer === 'partially') {
        // Partially in place - acknowledge progress but note improvement needed
        const statement = convertQuestionToStatement(question.text);
        const partialDescription = response.notes?.trim();

        // Add to "Going well" with description if provided
        if (partialDescription) {
          doingWell.push(`${statement} (partially in place): ${partialDescription}`);
        } else {
          doingWell.push(`${statement} (partially in place)`);
        }

        // Also add a lower-priority action to complete implementation
        priorityActions.push({
          questionId: question.id,
          questionText: question.text,
          action: `Complete improvements to: ${statement.toLowerCase()}`,
          priority: 'low',
          timeframe: 'Within 6 months',
          impactStatement: partialDescription
            ? `Current status: ${partialDescription}`
            : 'Partial measures are in place. Complete implementation for full accessibility.',
        });
      } else if (response.answer === 'unable-to-check' || response.answer === 'not-sure') {
        // Unable to check / not sure - needs follow-up
        areasToExplore.push(convertQuestionToStatement(question.text));
      } else if (response.mediaAnalysis) {
        // Media analysis response - acknowledge evidence provided
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
          // needs-improvement or not-assessable
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
        // Handle multi-select, single-select, links, and URL analysis
        if (sentiment === 'positive') {
          const statement = convertQuestionToStatement(question.text);
          const details = getResponseDetails(response, question);
          doingWell.push(details ? `${statement} (${details})` : statement);
        } else if (sentiment === 'negative') {
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
        } else if (sentiment === 'neutral') {
          areasToExplore.push(convertQuestionToStatement(question.text));
        }
      }

      // Handle measurement responses
      if (response.measurement && question.measurementGuidance) {
        const { value } = response.measurement;
        const { min, max: _max, ideal } = question.measurementGuidance;

        if (min !== undefined && value < min) {
          priorityActions.push({
            questionId: question.id,
            questionText: question.text,
            action: `Improve measurement to meet minimum requirement of ${min}${question.measurementUnit}`,
            priority: question.safetyRelated ? 'high' : 'medium',
            timeframe: 'Within 3 months',
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
  }, [responses, questions]);

  // Handle completing the module
  const handleComplete = useCallback((metadata: CompletionMetadata) => {
    const summary = generateSummary();
    onComplete(summary, metadata);
  }, [generateSummary, onComplete]);

  // Show review summary view
  if (showReviewSummary) {
    return (
      <ReviewSummary
        moduleName={moduleName}
        moduleCode={moduleCode}
        questions={questions}
        responses={responses}
        onBack={() => {
          setShowReviewSummary(false);
          setShowSummary(true);
        }}
        onEditAnswer={(questionId) => {
          // Find the question index and go to it
          const questionIndex = visibleQuestions.findIndex(q => q.id === questionId);
          if (questionIndex >= 0) {
            setCurrentIndex(questionIndex);
            setShowReviewSummary(false);
            setShowSummary(false);
          }
        }}
      />
    );
  }

  // Show summary view
  if (showSummary) {
    const summary = generateSummary();
    return (
      <ModuleSummaryCard
        moduleName={moduleName}
        moduleCode={moduleCode}
        summary={summary}
        totalQuestionsAnswered={responses.length}
        onComplete={handleComplete}
        onReviewAnswers={() => {
          setShowSummary(false);
          setShowReviewSummary(true);
        }}
        assignedTo={assignedTo}
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

// Helper functions for response analysis and summary generation

/**
 * Categorize the sentiment of a response (positive/negative/neutral)
 * based on the selected options or values
 */
function categorizeResponseSentiment(
  response: QuestionResponse,
  question: BranchingQuestion
): 'positive' | 'negative' | 'neutral' | null {
  // Handle yes/no answers
  if (response.answer) {
    return null; // Handled separately in generateSummary
  }

  // Handle multi-select and single-select
  if (response.multiSelectValues && response.multiSelectValues.length > 0) {
    const selectedOptionIds = response.multiSelectValues;
    const selectedLabels = selectedOptionIds
      .map(id => question.options?.find(opt => opt.id === id)?.label || id)
      .join(' ');

    // Positive indicators
    const positiveKeywords = [
      'yes', 'consistently', 'confident', 'multiple', 'all', 'excellent',
      'good', 'very', 'always', 'easy', 'clear', 'accessible'
    ];

    // Negative indicators
    const negativeKeywords = [
      'no', 'none', 'limited', 'poor', 'never', 'difficult', 'hard',
      'inaccessible', 'missing', 'lack'
    ];

    // Neutral/uncertain indicators
    const neutralKeywords = [
      'sometimes', 'somewhat', 'not sure', 'unsure', 'maybe', 'partially',
      'moderate', 'fair', 'average'
    ];

    const lowerLabels = selectedLabels.toLowerCase();

    // Check for neutral indicators FIRST (they take priority over positive/negative)
    // This ensures "somewhat confident" is neutral, not positive
    if (neutralKeywords.some(keyword => lowerLabels.includes(keyword))) {
      return 'neutral';
    }

    // Check for negative indicators
    if (negativeKeywords.some(keyword => lowerLabels.includes(keyword))) {
      return 'negative';
    }

    // Check for positive indicators
    if (positiveKeywords.some(keyword => lowerLabels.includes(keyword))) {
      return 'positive';
    }

    // If multiple options selected (multi-select), generally positive
    if (selectedOptionIds.length > 1) {
      return 'positive';
    }
  }

  // Handle URL analysis
  if (response.urlAnalysis) {
    const score = response.urlAnalysis.overallScore;
    if (score >= 70) return 'positive';
    if (score >= 40) return 'neutral';
    return 'negative';
  }

  // Handle link values - presence of link is slightly positive
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
  // For single-select, show the selected option
  if (response.multiSelectValues && response.multiSelectValues.length === 1) {
    const optionId = response.multiSelectValues[0];
    const option = question.options?.find(opt => opt.id === optionId);
    return option?.label || null;
  }

  // For multi-select with few options, show count
  if (response.multiSelectValues && response.multiSelectValues.length > 1) {
    return `${response.multiSelectValues.length} selected`;
  }

  // For URL analysis, show score
  if (response.urlAnalysis) {
    return `${response.urlAnalysis.overallScore}/100`;
  }

  return null;
}

// Helper functions for generating action items and converting questions to statements

/**
 * Convert a question to a statement format for better readability
 * E.g., "Do you have accessible parking?" → "You have accessible parking"
 */
function convertQuestionToStatement(questionText: string): string {
  let statement = questionText;

  // Remove question mark
  statement = statement.replace(/\?$/, '');

  // Convert various question formats to statements
  const conversions: Array<[RegExp, string]> = [
    // Do questions
    [/^Do you have /i, 'You have '],
    [/^Do you /i, 'You '],
    [/^Do staff /i, 'Staff '],
    [/^Do customers /i, 'Customers '],
    [/^Do visitors /i, 'Visitors '],
    [/^Do people /i, 'People '],
    [/^Do your /i, 'Your '],
    [/^Does your /i, 'Your '],
    [/^Does /i, 'Your business '],

    // Are questions
    [/^Are you /i, 'You are '],
    [/^Are your /i, 'Your '],
    [/^Are staff /i, 'Staff are '],
    [/^Are customers /i, 'Customers are '],
    [/^Are visitors /i, 'Visitors are '],
    [/^Are there /i, 'There are '],
    [/^Are /i, 'There are '],

    // Is questions
    [/^Is your /i, 'Your '],
    [/^Is there /i, 'There is '],
    [/^Is /i, 'Your business '],

    // Can questions
    [/^Can you /i, 'You can '],
    [/^Can your /i, 'Your '],
    [/^Can customers /i, 'Customers can '],
    [/^Can visitors /i, 'Visitors can '],
    [/^Can people /i, 'People can '],
    [/^Can staff /i, 'Staff can '],
    [/^Can all /i, 'All '],
    [/^Can /i, 'Customers can '],

    // Have/Has questions
    [/^Have you /i, 'You have '],
    [/^Have your /i, 'Your '],
    [/^Has your /i, 'Your '],

    // Would/Could questions
    [/^Would you like /i, 'You would like '],
    [/^Would you /i, 'You would '],
    [/^Could you /i, 'You could '],

    // What questions - convert to statements maintaining the verb
    [/^What types? of (.+?) do you currently (.+)/i, 'You currently $2 $1'],
    [/^What types? of (.+?) do you (.+)/i, 'You $2 $1'],
    [/^What (.+?) do you currently (.+)/i, 'You currently $2 $1'],
    [/^What (.+?) do you (.+)/i, 'You $2 $1'],

    // How questions - convert to statements
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

  // Ensure first letter is capitalized
  statement = statement.charAt(0).toUpperCase() + statement.slice(1);

  return statement;
}

function generateActionText(questionText: string): string {
  // Convert to statement and use as action description
  const statement = convertQuestionToStatement(questionText);

  // For "no" answers, we want to address the gap
  // Convert positive statement to action needed
  let action = statement;

  // Convert "You have" to "Provide"
  action = action.replace(/^You have /i, 'Provide ');
  action = action.replace(/^You are /i, 'Ensure you are ');
  action = action.replace(/^You can /i, 'Ensure you can ');
  action = action.replace(/^You /i, 'Ensure you ');

  // Convert "Your [thing] is/are" to "Ensure your [thing] is/are"
  action = action.replace(/^Your (.+?) (is|are) /i, 'Ensure your $1 $2 ');
  action = action.replace(/^Your /i, 'Review your ');

  // Convert "There is/are" to "Provide"
  action = action.replace(/^There (is|are) /i, 'Provide ');

  // Convert "Customers/Visitors can" to "Ensure customers/visitors can"
  action = action.replace(/^(Customers|Visitors|People|Staff|All) can /i, 'Ensure $1 can ');

  // Ensure first letter is capitalized
  action = action.charAt(0).toUpperCase() + action.slice(1);

  return action;
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
