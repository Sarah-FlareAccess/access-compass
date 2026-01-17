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

  // Progress calculation - only count responses for questions that still exist
  const progress = useMemo(() => {
    const validQuestionIds = new Set(visibleQuestions.map(q => q.id));
    const validResponses = responses.filter(r => validQuestionIds.has(r.questionId));
    const answered = validResponses.length;
    const total = visibleQuestions.length;
    return {
      answered,
      total,
      percentage: total > 0 ? Math.round((answered / total) * 100) : 0,
    };
  }, [responses, visibleQuestions]);

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
        // Unable to check / not sure - needs follow-up (use exploratory phrasing)
        areasToExplore.push(convertQuestionToExploreStatement(question.text));
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
          areasToExplore.push(convertQuestionToExploreStatement(question.text));
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
        totalQuestionsAnswered={progress.answered}
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
 * Convert a question to an exploratory statement for "areas to explore" (unsure responses)
 * E.g., "Do you have accessible parking?" → "Check if you have accessible parking"
 * E.g., "Are emojis placed at the end?" → "Check if emojis are placed at the end"
 */
function convertQuestionToExploreStatement(questionText: string): string {
  let statement = questionText;

  // Remove question mark
  statement = statement.replace(/\?$/, '');

  // Convert various question formats to exploratory statements
  const conversions: Array<[RegExp, string]> = [
    // Do questions
    [/^Do you have /i, 'Check if you have '],
    [/^Do you /i, 'Check if you '],
    [/^Do staff /i, 'Check if staff '],
    [/^Do customers /i, 'Check if customers '],
    [/^Do visitors /i, 'Check if visitors '],
    [/^Do people /i, 'Check if people '],
    [/^Do your /i, 'Check if your '],
    [/^Does your /i, 'Check if your '],
    [/^Does /i, 'Check if your business '],

    // Are questions
    [/^Are you /i, 'Check if you are '],
    [/^Are your /i, 'Check if your '],
    [/^Are staff /i, 'Check if staff are '],
    [/^Are customers /i, 'Check if customers are '],
    [/^Are visitors /i, 'Check if visitors are '],
    [/^Are there /i, 'Check if there are '],
    [/^Are /i, 'Check if there are '],

    // Is questions
    [/^Is your /i, 'Check if your '],
    [/^Is there /i, 'Check if there is '],
    [/^Is /i, 'Check if '],

    // Can questions
    [/^Can you /i, 'Check if you can '],
    [/^Can your /i, 'Check if your '],
    [/^Can customers /i, 'Check if customers can '],
    [/^Can visitors /i, 'Check if visitors can '],
    [/^Can people /i, 'Check if people can '],
    [/^Can staff /i, 'Check if staff can '],
    [/^Can all /i, 'Check if all '],
    [/^Can /i, 'Check if customers can '],

    // Have/Has questions
    [/^Have you /i, 'Check if you have '],
    [/^Have your /i, 'Check if your '],
    [/^Has your /i, 'Check if your '],

    // What/How questions - use "Review" instead of "Check if"
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

  // If no pattern matched, prefix with "Check if"
  if (!statement.startsWith('Check') && !statement.startsWith('Review')) {
    statement = 'Check if ' + statement.charAt(0).toLowerCase() + statement.slice(1);
  }

  // Ensure first letter is capitalized
  statement = statement.charAt(0).toUpperCase() + statement.slice(1);

  return statement;
}

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
  // Remove question mark for processing
  const cleanQuestion = questionText.replace(/\?$/, '').trim();
  const lowerQuestion = cleanQuestion.toLowerCase();

  // Specific action text patterns for common question types
  // These provide clear, actionable recommendations rather than restated questions

  // Ownership and responsibility questions
  if (lowerQuestion.includes('who is responsible') || lowerQuestion.includes('who maintains')) {
    return 'Identify a person or team responsible for maintaining accessibility information';
  }

  // Staff training questions
  if (lowerQuestion.includes('staff') && (lowerQuestion.includes('training') || lowerQuestion.includes('trained'))) {
    if (lowerQuestion.includes('disability awareness') || lowerQuestion.includes('accessibility')) {
      return 'Provide disability awareness training to all customer-facing staff';
    }
    if (lowerQuestion.includes('assistance animal') || lowerQuestion.includes('service animal')) {
      return 'Train staff on assistance animal policies and how to welcome customers with assistance animals';
    }
    if (lowerQuestion.includes('evacuation') || lowerQuestion.includes('emergency')) {
      return 'Train staff on emergency evacuation procedures for people with disability';
    }
    return 'Provide relevant accessibility training to staff';
  }

  // Staff confidence and knowledge questions
  if (lowerQuestion.includes('staff') && (lowerQuestion.includes('confident') || lowerQuestion.includes('know how'))) {
    if (lowerQuestion.includes('respond') || lowerQuestion.includes('enquir')) {
      return 'Develop guidance for staff on responding to accessibility enquiries';
    }
    if (lowerQuestion.includes('assist') || lowerQuestion.includes('support')) {
      return 'Provide staff with clear guidelines on offering assistance to customers with disability';
    }
    return 'Build staff confidence through training and clear accessibility guidelines';
  }

  // Guidance and documentation questions
  if (lowerQuestion.includes('guidance') && lowerQuestion.includes('managed')) {
    return 'Document accessibility guidance and make it accessible to all staff';
  }

  // Escalation questions
  if (lowerQuestion.includes('escalation') || (lowerQuestion.includes('doesn\'t know') && lowerQuestion.includes('answer'))) {
    return 'Establish a clear escalation path for accessibility questions staff cannot answer';
  }

  // Feedback questions
  if (lowerQuestion.includes('feedback') && lowerQuestion.includes('accuracy')) {
    return 'Create a simple process for customers to provide feedback on accessibility information';
  }
  if (lowerQuestion.includes('feedback') && lowerQuestion.includes('accessib')) {
    return 'Establish accessible channels for customers to provide accessibility feedback';
  }

  // Consistency questions
  if (lowerQuestion.includes('consistent') && lowerQuestion.includes('platform')) {
    return 'Audit and align accessibility information across all platforms and channels';
  }

  // Limitations and negative disclosure questions
  if (lowerQuestion.includes('limitations') || lowerQuestion.includes('barriers that still exist')) {
    return 'Clearly communicate known accessibility limitations on your website and materials';
  }

  // Contact channel questions
  if (lowerQuestion.includes('contact') && (lowerQuestion.includes('variety') || lowerQuestion.includes('ways'))) {
    return 'Provide multiple contact options for accessibility enquiries (phone, email, online form)';
  }
  if (lowerQuestion.includes('contact') && lowerQuestion.includes('without calling')) {
    return 'Offer non-phone contact options such as email, online chat, or contact forms';
  }
  if (lowerQuestion.includes('proactively invite') && lowerQuestion.includes('question')) {
    return 'Add prompts inviting accessibility questions on your website and booking confirmations';
  }
  if (lowerQuestion.includes('tested') && lowerQuestion.includes('contact channel')) {
    return 'Test contact channels for accessibility and address any barriers identified';
  }

  // Accessibility information questions
  if (lowerQuestion.includes('accessibility information') && lowerQuestion.includes('available')) {
    return 'Create and publish accessibility information for customers before they visit';
  }
  if (lowerQuestion.includes('accessibility information') && lowerQuestion.includes('published')) {
    return 'Publish accessibility information on a dedicated, easy-to-find page';
  }
  if (lowerQuestion.includes('easy') && lowerQuestion.includes('find') && lowerQuestion.includes('accessib')) {
    return 'Make accessibility information findable within one or two clicks from your homepage';
  }
  if (lowerQuestion.includes('written') && (lowerQuestion.includes('customer') || lowerQuestion.includes('compliance'))) {
    return 'Rewrite accessibility information to focus on helping customers plan their visit';
  }
  if (lowerQuestion.includes('accurate') && lowerQuestion.includes('up to date')) {
    return 'Establish a process for regularly reviewing and updating accessibility information';
  }
  if (lowerQuestion.includes('last reviewed') || lowerQuestion.includes('last updated')) {
    return 'Schedule regular reviews of accessibility information (at least every 6 months)';
  }
  if (lowerQuestion.includes('checked against') || lowerQuestion.includes('verified')) {
    return 'Verify accessibility information through site inspections or customer feedback';
  }

  // Physical access questions
  if (lowerQuestion.includes('physical access') && lowerQuestion.includes('details')) {
    return 'Add specific physical access details including measurements, photos, and route descriptions';
  }
  if (lowerQuestion.includes('what to expect') && lowerQuestion.includes('sensory')) {
    return 'Describe the sensory environment including noise levels, lighting, and crowd expectations';
  }

  // Parking questions
  if (lowerQuestion.includes('accessible parking')) {
    if (lowerQuestion.includes('close') || lowerQuestion.includes('near')) {
      return 'Relocate accessible parking spaces closer to the main entrance';
    }
    if (lowerQuestion.includes('designated') || lowerQuestion.includes('have')) {
      return 'Provide designated accessible parking spaces that meet Australian Standards';
    }
    return 'Review and improve accessible parking provision';
  }

  // Entrance and door questions
  if (lowerQuestion.includes('entrance') && lowerQuestion.includes('step-free')) {
    return 'Provide step-free access to the main entrance';
  }
  if (lowerQuestion.includes('door') && lowerQuestion.includes('width')) {
    return 'Ensure entrance doors provide a minimum 850mm clear opening width';
  }
  if (lowerQuestion.includes('door') && (lowerQuestion.includes('easy to open') || lowerQuestion.includes('automatic'))) {
    return 'Install automatic doors or reduce door opening force for easier access';
  }

  // Toilet questions
  if (lowerQuestion.includes('accessible toilet')) {
    if (lowerQuestion.includes('clear') || lowerQuestion.includes('storage')) {
      return 'Keep the accessible toilet clear of storage and obstacles at all times';
    }
    return 'Ensure accessible toilet facilities meet Australian Standards requirements';
  }

  // Familiarisation visit questions
  if (lowerQuestion.includes('familiarisation') || lowerQuestion.includes('orientation session')) {
    if (lowerQuestion.includes('barrier')) {
      return 'Address barriers to offering familiarisation visits and develop a simple process';
    }
    if (lowerQuestion.includes('communicated')) {
      return 'Promote familiarisation visit availability on your website and in booking communications';
    }
    return 'Offer familiarisation visits or orientation sessions for customers who need them';
  }

  // Transport questions
  if (lowerQuestion.includes('transport') && lowerQuestion.includes('information')) {
    return 'Provide detailed accessible transport information including the approach to your venue';
  }
  if (lowerQuestion.includes('last 50 metres') || lowerQuestion.includes('final approach')) {
    return 'Document the final approach to your venue including surfaces, distances, and any obstacles';
  }

  // Equipment and resources questions
  if (lowerQuestion.includes('equipment') && lowerQuestion.includes('offer')) {
    return 'Provide accessible equipment such as wheelchairs, sensory kits, or communication aids';
  }
  if (lowerQuestion.includes('equipment') && lowerQuestion.includes('customer') && lowerQuestion.includes('know')) {
    return 'Communicate available equipment on your website and in pre-visit information';
  }
  if (lowerQuestion.includes('quiet space') || lowerQuestion.includes('chill-out')) {
    return 'Designate a quiet space where customers can take a break from sensory stimulation';
  }
  if (lowerQuestion.includes('sensory kit') || lowerQuestion.includes('sensory support')) {
    return 'Provide sensory support items such as ear plugs, fidget tools, or sunglasses';
  }

  // Signage questions
  if (lowerQuestion.includes('signage') && lowerQuestion.includes('clear')) {
    return 'Improve signage with high contrast, clear fonts, and consistent placement';
  }

  // Emergency questions
  if (lowerQuestion.includes('emergency') && lowerQuestion.includes('procedure')) {
    return 'Develop emergency procedures that include specific provisions for people with disability';
  }
  if (lowerQuestion.includes('alarm') && (lowerQuestion.includes('visual') || lowerQuestion.includes('audible'))) {
    return 'Install both visual and audible emergency alarms throughout the venue';
  }

  // Policy questions
  if (lowerQuestion.includes('policy') && lowerQuestion.includes('assistance animal')) {
    return 'Develop and communicate a clear assistance animal policy';
  }
  if (lowerQuestion.includes('disability inclusion') && lowerQuestion.includes('plan')) {
    return 'Develop a Disability Inclusion Action Plan with measurable goals and timeframes';
  }

  // Website and digital questions
  if (lowerQuestion.includes('keyboard') && lowerQuestion.includes('access')) {
    return 'Ensure all website functionality is accessible via keyboard navigation';
  }
  if (lowerQuestion.includes('alt text') || lowerQuestion.includes('image description')) {
    return 'Add meaningful alt text or descriptions to all images on your website';
  }
  if (lowerQuestion.includes('caption') || lowerQuestion.includes('subtitle')) {
    return 'Add captions or subtitles to all video content';
  }
  if (lowerQuestion.includes('contrast') && lowerQuestion.includes('text')) {
    return 'Improve colour contrast between text and background to meet WCAG standards';
  }

  // Hearing and communication questions
  if (lowerQuestion.includes('hearing loop') || lowerQuestion.includes('assisted listening')) {
    return 'Install hearing loop or assistive listening systems in key service areas';
  }
  if (lowerQuestion.includes('auslan') || lowerQuestion.includes('sign language')) {
    return 'Establish a process for arranging Auslan interpretation when needed';
  }

  // Companion card questions
  if (lowerQuestion.includes('companion card')) {
    return 'Register as a Companion Card affiliate to support customers who need attendant care';
  }

  // Large print and alternative format questions
  if (lowerQuestion.includes('large print')) {
    return 'Provide large print versions of key materials (minimum 18pt font)';
  }
  if (lowerQuestion.includes('alternative format') || lowerQuestion.includes('easy read')) {
    return 'Create alternative format versions of key information (Easy Read, Plain English)';
  }

  // Fallback: Use improved generic conversion
  const statement = convertQuestionToStatement(cleanQuestion);
  let action = statement;

  // Convert "You have" to "Provide"
  action = action.replace(/^You have /i, 'Provide ');
  action = action.replace(/^You are /i, 'Ensure you are ');
  action = action.replace(/^You can /i, 'Ensure you can ');
  action = action.replace(/^You /i, 'Ensure you ');
  action = action.replace(/^Your (.+?) (is|are) /i, 'Ensure your $1 $2 ');
  action = action.replace(/^Your /i, 'Review your ');
  action = action.replace(/^There (is|are) /i, 'Provide ');
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
