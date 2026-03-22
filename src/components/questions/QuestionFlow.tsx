/**
 * QuestionFlow Component
 *
 * Manages the flow through questions in a module with branching logic.
 * Handles navigation, progress tracking, and summary generation.
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QuestionCard } from './QuestionCard';
import { ModuleSummaryCard } from './ModuleSummaryCard';
import { ReviewSummary } from './ReviewSummary';
import { useBranchingLogic } from '../../hooks/useBranchingLogic';
import type { QuestionResponse, ModuleSummary, CompletionMetadata } from '../../hooks/useModuleProgress';
import type { BranchingQuestion } from '../../hooks/useBranchingLogic';
import ReminderBanner from '../ReminderBanner';
import { generateModuleSummary } from '../../utils/generateModuleSummary';
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
  complianceNote?: string;
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
  complianceNote,
}: QuestionFlowProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [responses, setResponses] = useState<QuestionResponse[]>(initialResponses);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showReviewSummary, setShowReviewSummary] = useState(() => {
    if (searchParams.get('view') === 'review') {
      // Clean up the URL param after reading it
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('view');
      setSearchParams(newParams, { replace: true });
      return true;
    }
    return false;
  });
  const questionContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top and move focus to question when it changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => {
      const heading = questionContainerRef.current?.querySelector<HTMLElement>('[data-question-heading]');
      if (heading) heading.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Use branching logic to determine visible questions
  const { visibleQuestions } = useBranchingLogic({
    questions,
    responses,
    reviewMode,
  });

  // Resume from first unanswered question when returning to a module
  const [hasResumed, setHasResumed] = useState(false);
  useEffect(() => {
    if (hasResumed || initialResponses.length === 0) return;
    const responseIds = new Set(initialResponses.map(r => r.questionId));
    const firstUnanswered = visibleQuestions.findIndex(q => !responseIds.has(q.id));
    if (firstUnanswered > 0) {
      setCurrentIndex(firstUnanswered);
    }
    setHasResumed(true);
  }, [visibleQuestions, initialResponses, hasResumed]);

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

  // Generate summary from responses using shared utility
  const generateSummary = useCallback((): ModuleSummary => {
    return generateModuleSummary(responses, questions);
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

      {complianceNote && currentIndex === 0 && (
        <ReminderBanner type="professional" message={complianceNote} />
      )}

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
      <div ref={questionContainerRef}>
        <QuestionCard
          question={currentQuestion}
          currentResponse={currentResponse}
          onAnswer={handleAnswer}
          questionNumber={currentIndex + 1}
          totalQuestions={visibleQuestions.length}
          moduleName={moduleName}
        />
      </div>

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



// Helper functions for generating action items and converting questions to statements

/**
 * Convert a question to an exploratory statement for "areas to explore" (unsure responses)
 * E.g., "Do you have accessible parking?" → "Check if you have accessible parking"
 * E.g., "Are emojis placed at the end?" → "Check if emojis are placed at the end"
 */

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
    // Do questions (specific subjects first, generic fallback last)
    [/^Do you have /i, 'You have '],
    [/^Do you /i, 'You '],
    [/^Do staff /i, 'Staff '],
    [/^Do customers /i, 'Customers '],
    [/^Do visitors /i, 'Visitors '],
    [/^Do people /i, 'People '],
    [/^Do your /i, 'Your '],
    [/^Does your /i, 'Your '],
    [/^Does the /i, 'The '],
    [/^Does /i, 'Your business '],
    // Generic "Do [noun]..." fallback (e.g. "Do content warnings appear..." → "Content warnings appear...")
    [/^Do /i, ''],

    // Are questions
    [/^Are you /i, 'You are '],
    [/^Are your /i, 'Your '],
    [/^Are staff /i, 'Staff are '],
    [/^Are customers /i, 'Customers are '],
    [/^Are visitors /i, 'Visitors are '],
    [/^Are there /i, 'There are '],
    [/^Are the /i, 'The '],
    [/^Are all /i, 'All '],
    [/^Are /i, 'There are '],

    // Is questions
    [/^Is your /i, 'Your '],
    [/^Is there /i, 'There is '],
    [/^Is the /i, 'The '],
    [/^Is /i, 'Your business '],

    // Can questions
    [/^Can you /i, 'You can '],
    [/^Can your /i, 'Your '],
    [/^Can customers /i, 'Customers can '],
    [/^Can visitors /i, 'Visitors can '],
    [/^Can people /i, 'People can '],
    [/^Can staff /i, 'Staff can '],
    [/^Can all /i, 'All '],
    [/^Can the /i, 'The '],
    [/^Can /i, 'Customers can '],

    // Have/Has questions
    [/^Have you /i, 'You have '],
    [/^Have your /i, 'Your '],
    [/^Has your /i, 'Your '],
    [/^Has the /i, 'The '],

    // Would/Could questions
    [/^Would you like /i, 'You would like '],
    [/^Would you /i, 'You would '],
    [/^Could you /i, 'You could '],

    // What questions - convert to statements maintaining the verb
    [/^What have you /i, 'You have '],
    [/^What has your /i, 'Your '],
    [/^What types? of (.+?) do you currently (.+)/i, 'You currently $2 $1'],
    [/^What types? of (.+?) do you (.+)/i, 'You $2 $1'],
    [/^What types? of (.+?) have you (.+)/i, 'You have $2 $1'],
    [/^What (.+?) do you currently (.+)/i, 'You currently $2 $1'],
    [/^What (.+?) do you (.+)/i, 'You $2 $1'],
    [/^What (.+?) have you (.+)/i, 'You have $2 $1'],

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

export function generateActionText(questionText: string): string {
  // Remove question mark for processing
  const cleanQuestion = questionText.replace(/\?$/, '').trim();
  const lowerQuestion = cleanQuestion.toLowerCase();

  // Specific action text patterns for common question types
  // These provide clear, actionable recommendations rather than restated questions

  // Ownership and responsibility questions
  if (lowerQuestion.includes('who is responsible') || lowerQuestion.includes('who maintains')) {
    if (lowerQuestion.includes('accessibility information')) {
      return 'Assign a named person or team responsible for maintaining accessibility information';
    }
    if (lowerQuestion.includes('booking') || lowerQuestion.includes('request')) {
      return 'Assign clear ownership for reviewing and responding to accessibility requests';
    }
    if (lowerQuestion.includes('on the day') || lowerQuestion.includes('event')) {
      return 'Designate a named accessibility lead for on-the-day operations';
    }
    return 'Identify a person or team responsible for accessibility in this area';
  }

  // Staff training questions
  if (lowerQuestion.includes('staff') && (lowerQuestion.includes('training') || lowerQuestion.includes('trained'))) {
    if (lowerQuestion.includes('disability awareness') && (lowerQuestion.includes('onboarding') || lowerQuestion.includes('new staff'))) {
      return 'Include accessibility training in the standard new staff onboarding process';
    }
    if (lowerQuestion.includes('disability awareness') && (lowerQuestion.includes('contractor') || lowerQuestion.includes('casual') || lowerQuestion.includes('agency'))) {
      return 'Extend disability awareness training to contractors, casuals, and agency staff';
    }
    if (lowerQuestion.includes('disability awareness') && (lowerQuestion.includes('volunteer'))) {
      return 'Provide disability awareness training to all event staff and volunteers';
    }
    if (lowerQuestion.includes('disability awareness') || lowerQuestion.includes('inclusion training')) {
      return 'Provide disability awareness training to all customer-facing staff';
    }
    if (lowerQuestion.includes('lived experience')) {
      return 'Arrange training delivered by people with lived experience of disability';
    }
    if (lowerQuestion.includes('national relay') || lowerQuestion.includes('nrs')) {
      return 'Train staff on receiving and handling calls via the National Relay Service';
    }
    if (lowerQuestion.includes('assistance animal') || lowerQuestion.includes('service animal')) {
      return 'Train staff on assistance animal policies and how to welcome customers with assistance animals';
    }
    if (lowerQuestion.includes('evacuation') || lowerQuestion.includes('emergency')) {
      return 'Train staff on emergency evacuation procedures for people with disability';
    }
    if (lowerQuestion.includes('communication board') || lowerQuestion.includes('communicate differently')) {
      return 'Train staff on using communication boards and supporting diverse communication styles';
    }
    if (lowerQuestion.includes('speech') || lowerQuestion.includes('aac')) {
      return 'Provide training on communicating with customers who have speech differences or use AAC devices';
    }
    if (lowerQuestion.includes('communication strateg')) {
      return 'Train staff in multiple communication strategies (visual, written, gestural)';
    }
    if (lowerQuestion.includes('condescending') || lowerQuestion.includes('over-helpful')) {
      return 'Train staff on offering respectful, non-condescending assistance';
    }
    if (lowerQuestion.includes('language') && lowerQuestion.includes('terminolog')) {
      return 'Train staff on respectful disability language and person-first terminology';
    }
    if (lowerQuestion.includes('interpret') && lowerQuestion.includes('request')) {
      return 'Train staff to interpret and respond to accessibility requests from bookings';
    }
    if (lowerQuestion.includes('accessibility') && lowerQuestion.includes('customer-facing')) {
      return 'Ensure all customer-facing staff complete disability awareness training';
    }
    return 'Provide relevant accessibility training to staff';
  }

  // Staff confidence and knowledge questions
  if (lowerQuestion.includes('staff') && (lowerQuestion.includes('confident') || lowerQuestion.includes('know how') || lowerQuestion.includes('aware'))) {
    if (lowerQuestion.includes('respond') || lowerQuestion.includes('enquir')) {
      return 'Develop guidance for staff on responding to accessibility enquiries';
    }
    if (lowerQuestion.includes('entering') || lowerQuestion.includes('enter the building')) {
      return 'Train staff on assisting customers who need support entering the building';
    }
    if (lowerQuestion.includes('queue') || lowerQuestion.includes('priority access')) {
      return 'Train staff on accommodating customers who need queue assistance or priority access';
    }
    if (lowerQuestion.includes('assistance animal') || lowerQuestion.includes('welcome')) {
      return 'Train staff on welcoming and assisting customers with assistance animals';
    }
    if (lowerQuestion.includes('deaf') || lowerQuestion.includes('hard of hearing')) {
      return 'Train staff on communicating with customers who are Deaf or hard of hearing';
    }
    if (lowerQuestion.includes('extra time') || lowerQuestion.includes('cognitive')) {
      return 'Train staff on supporting customers who need extra time or have cognitive differences';
    }
    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('evacuation')) {
      return 'Develop specific procedures for staff to assist customers with different needs during evacuations';
    }
    if (lowerQuestion.includes('parking') || lowerQuestion.includes('entry point')) {
      return 'Train staff to direct customers to accessible parking and entry points';
    }
    if (lowerQuestion.includes('document') || lowerQuestion.includes('heading') || lowerQuestion.includes('alt text')) {
      return 'Train document-creating staff on using heading styles, alt text, and accessible structure';
    }
    if (lowerQuestion.includes('equipment') || lowerQuestion.includes('feature')) {
      return 'Train staff on operating all on-site accessibility features and equipment';
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

  // Feedback questions (check self-checkout before broad feedback match)
  if (lowerQuestion.includes('self-checkout') || lowerQuestion.includes('self checkout')) {
    return 'Ensure self-checkout machines are accessible: appropriate screen height, audio output, and wheelchair-compatible layout';
  }
  if (lowerQuestion.includes('feedback') && lowerQuestion.includes('accuracy')) {
    return 'Create a simple process for customers to provide feedback on accessibility information';
  }
  if (lowerQuestion.includes('feedback')) {
    if (lowerQuestion.includes('survey') || lowerQuestion.includes('form')) {
      return 'Audit and improve the accessibility of your surveys and feedback forms';
    }
    if (lowerQuestion.includes('track') || lowerQuestion.includes('pattern')) {
      return 'Set up a system to track and analyse patterns in accessibility feedback';
    }
    if (lowerQuestion.includes('act on') || lowerQuestion.includes('review')) {
      return 'Establish a regular schedule for reviewing and acting on accessibility feedback';
    }
    if (lowerQuestion.includes('communicate') || lowerQuestion.includes('improvement')) {
      return 'Communicate improvements you have made in response to accessibility feedback';
    }
    if (lowerQuestion.includes('complaint') || lowerQuestion.includes('handling')) {
      return 'Create a clear, documented process for handling accessibility complaints and feedback';
    }
    if (lowerQuestion.includes('event') || lowerQuestion.includes('during and after')) {
      return 'Provide accessible feedback mechanisms during and after the event';
    }
    if (lowerQuestion.includes('multiple') || lowerQuestion.includes('channel')) {
      return 'Provide multiple accessible channels for feedback and complaints';
    }
    if (lowerQuestion.includes('way') || lowerQuestion.includes('method')) {
      return 'Create a visible, easy-to-use method for customers to provide accessibility feedback';
    }
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
  if (lowerQuestion.includes('contact') && lowerQuestion.includes('page') && lowerQuestion.includes('accessible')) {
    return 'Make your contact page keyboard navigable, screen reader compatible, and CAPTCHA-free';
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
    if (lowerQuestion.includes('booking') || lowerQuestion.includes('field') || lowerQuestion.includes('labelled')) {
      return 'Clearly label and position the accessibility requirements field in your booking form';
    }
    if (lowerQuestion.includes('website') || lowerQuestion.includes('homepage')) {
      return 'Position accessibility information prominently on your website (footer link, main navigation)';
    }
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
    if (lowerQuestion.includes('path') || lowerQuestion.includes('smooth') || lowerQuestion.includes('level')) {
      return 'Ensure the path from accessible parking to the entrance is smooth, level, and obstacle-free';
    }
    if (lowerQuestion.includes('directional') || lowerQuestion.includes('signage')) {
      return 'Install directional signage guiding visitors to accessible parking';
    }
    if (lowerQuestion.includes('busy') || lowerQuestion.includes('blocked')) {
      return 'Implement procedures to keep accessible parking available during busy periods';
    }
    if (lowerQuestion.includes('surface') || lowerQuestion.includes('slip')) {
      return 'Ensure accessible parking surfaces are firm, level, and slip-resistant';
    }
    if (lowerQuestion.includes('marked') || lowerQuestion.includes('marking')) {
      return 'Mark accessible parking with both ground markings and vertical signage to Australian Standards';
    }
    if (lowerQuestion.includes('event')) {
      return 'Provide accessible parking or a designated drop-off zone at the event venue';
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
    if (lowerQuestion.includes('toilet')) {
      return 'Ensure toilet doors are easy to open and lock from inside, including for wheelchair users';
    }
    if (lowerQuestion.includes('internal')) {
      return 'Ensure internal doors can be opened with limited hand strength (lever handles, reduced force)';
    }
    if (lowerQuestion.includes('stay open') || lowerQuestion.includes('long enough')) {
      return 'Adjust automatic door timing to remain open long enough for slow-moving visitors';
    }
    return 'Install automatic doors or reduce door opening force for easier access';
  }

  // Toilet questions
  if (lowerQuestion.includes('accessible toilet') || (lowerQuestion.includes('toilet') && lowerQuestion.includes('facilities'))) {
    if (lowerQuestion.includes('clear') || lowerQuestion.includes('storage')) {
      return 'Keep the accessible toilet clear of storage and obstacles at all times';
    }
    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('alarm')) {
      return 'Install an emergency alarm in the accessible toilet';
    }
    if (lowerQuestion.includes('ambulant')) {
      return 'Provide an ambulant accessible toilet in addition to the main accessible toilet';
    }
    if (lowerQuestion.includes('sanitary') || lowerQuestion.includes('waste bin') || lowerQuestion.includes('disposal')) {
      return 'Ensure sanitary disposal and waste bins are within reach in the accessible toilet';
    }
    if (lowerQuestion.includes('nearest') || lowerQuestion.includes('where') || lowerQuestion.includes('know')) {
      return 'Identify and document the location of the nearest accessible toilet';
    }
    if (lowerQuestion.includes('event')) {
      return 'Provide accessible toilets at the event venue';
    }
    return 'Provide at least one accessible toilet that meets Australian Standards';
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
    if (lowerQuestion.includes('specific') || lowerQuestion.includes('accessibility needs')) {
      return 'Make transport information specific to accessibility needs (step-free routes, drop-off points)';
    }
    if (lowerQuestion.includes('last 50') || lowerQuestion.includes('final')) {
      return 'Describe the last 50 metres from transport stops to your entrance (surfaces, gradients, obstacles)';
    }
    return 'Provide detailed accessible transport information including the approach to your venue';
  }
  if (lowerQuestion.includes('last 50 metres') || lowerQuestion.includes('final approach')) {
    return 'Document the final approach to your venue including surfaces, distances, and any obstacles';
  }

  // Equipment and resources questions
  if (lowerQuestion.includes('equipment')) {
    if (lowerQuestion.includes('help you offer') || lowerQuestion.includes('what would help')) {
      return 'Identify and address barriers to offering more accessibility equipment and resources';
    }
    if (lowerQuestion.includes('assistive technology')) {
      return 'Provide assistive technology or equipment that customers can use (portable hearing loops, magnifiers)';
    }
    if (lowerQuestion.includes('customer') && lowerQuestion.includes('know')) {
      return 'Communicate available equipment on your website and in pre-visit information';
    }
    if (lowerQuestion.includes('offer') || lowerQuestion.includes('resource')) {
      return 'Provide equipment and resources customers can borrow or use during their visit';
    }
  }
  if (lowerQuestion.includes('quiet space') || lowerQuestion.includes('chill-out') || lowerQuestion.includes('low-sensory')) {
    if (lowerQuestion.includes('sensory regulation') || lowerQuestion.includes('feature')) {
      return 'Equip the quiet space with sensory regulation features (dim lighting, soft furnishings, minimal noise)';
    }
    if (lowerQuestion.includes('communication') || lowerQuestion.includes('calmer environment')) {
      return 'Provide a quiet space for private or calmer communication with customers';
    }
    if (lowerQuestion.includes('overwhelmed')) {
      return 'Ensure a quiet space is available and sign-posted for customers who become overwhelmed';
    }
    if (lowerQuestion.includes('event')) {
      return 'Provide a quiet space or low-sensory area at the event venue';
    }
    return 'Designate a quiet space where customers can take a break from sensory stimulation';
  }
  if (lowerQuestion.includes('sensory kit') || lowerQuestion.includes('sensory support')) {
    return 'Provide sensory support items such as ear plugs, fidget tools, or sunglasses';
  }

  // Signage questions
  if (lowerQuestion.includes('signage') && lowerQuestion.includes('clear')) {
    if (lowerQuestion.includes('wayfinding') && lowerQuestion.includes('destination')) {
      return 'Install clear wayfinding signage to toilets, lifts, service areas, and other key destinations';
    }
    if (lowerQuestion.includes('toilet') || lowerQuestion.includes('tactile') || lowerQuestion.includes('braille')) {
      return 'Ensure toilet signage is clear with tactile and Braille elements as required by Australian Standards';
    }
    if (lowerQuestion.includes('approach') || lowerQuestion.includes('entrance')) {
      return 'Install clear signage on the approach to your venue and at the main entrance';
    }
    if (lowerQuestion.includes('event')) {
      return 'Provide clear, accessible wayfinding signage at all event locations';
    }
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

  // Hearing loop and assistive listening (BEFORE caption to avoid false matches)
  if (lowerQuestion.includes('hearing loop') || lowerQuestion.includes('assisted listening') || lowerQuestion.includes('assistive listening')) {
    if (lowerQuestion.includes('sign') || lowerQuestion.includes('symbol')) {
      return 'Display the international hearing loop symbol at all hearing loop locations';
    }
    if (lowerQuestion.includes('tested') || lowerQuestion.includes('maintained') || lowerQuestion.includes('maintenance')) {
      return 'Establish a regular testing and maintenance schedule for hearing loops';
    }
    if (lowerQuestion.includes('where') || lowerQuestion.includes('installed') || lowerQuestion.includes('coverage')) {
      return 'Extend hearing loop coverage to all key service and customer areas';
    }
    if (lowerQuestion.includes('event')) {
      return 'Ensure hearing loop coverage is adequate for the full event space';
    }
    return 'Install hearing loop or assistive listening systems in key service areas';
  }

  // Website and digital questions
  if (lowerQuestion.includes('keyboard')) {
    if (lowerQuestion.includes('break') || lowerQuestion.includes('fail') || lowerQuestion.includes('step')) {
      return 'Identify and fix the specific points where keyboard access breaks down';
    }
    if (lowerQuestion.includes('focus') || lowerQuestion.includes('see which')) {
      return 'Ensure all interactive elements show a visible focus indicator when navigating by keyboard';
    }
    if (lowerQuestion.includes('contact page')) {
      return 'Make your contact page keyboard navigable, screen reader compatible, and CAPTCHA-free';
    }
    if (lowerQuestion.includes('booking')) {
      return 'Ensure the entire booking process can be completed using only a keyboard';
    }
    if (lowerQuestion.includes('video') || lowerQuestion.includes('playback')) {
      return 'Ensure video players can be controlled using keyboard and assistive technology';
    }
    if (lowerQuestion.includes('access')) {
      return 'Ensure all website functionality is accessible via keyboard navigation';
    }
  }

  // Alt text and image descriptions
  if (lowerQuestion.includes('alt text') || lowerQuestion.includes('image description')) {
    if (lowerQuestion.includes('consistently') || lowerQuestion.includes('how consistently')) {
      return 'Ensure alt text is consistently added to every image on your website';
    }
    if (lowerQuestion.includes('who') && lowerQuestion.includes('add')) {
      return 'Assign clear responsibility for adding alt text to images, with quality checks';
    }
    if (lowerQuestion.includes('social media') || lowerQuestion.includes('posting')) {
      return 'Add alt text to all social media image posts';
    }
    if (lowerQuestion.includes('preserved') || lowerQuestion.includes('reposting')) {
      return 'Check that alt text is preserved when reposting or cross-posting content';
    }
    if (lowerQuestion.includes('carousel') || lowerQuestion.includes('multi-image')) {
      return 'Add alt text to every image in carousel and multi-image social media posts';
    }
    if (lowerQuestion.includes('visual content') || lowerQuestion.includes('photos')) {
      return 'Ensure all published visual content has alt text on photos and captions on videos';
    }
    if (lowerQuestion.includes('pdf') || lowerQuestion.includes('document') || lowerQuestion.includes('tagged')) {
      return 'Create accessible PDFs with proper tagging, heading structure, and alt text';
    }
    return 'Add meaningful alt text or descriptions to all images on your website';
  }

  // Caption and subtitle questions
  if (lowerQuestion.includes('caption') || lowerQuestion.includes('subtitle') || lowerQuestion.includes('surtitle')) {
    if (lowerQuestion.includes('type of caption')) {
      return 'Upgrade to professional (not auto-generated) captions for videos';
    }
    if (lowerQuestion.includes('speaker identification') || lowerQuestion.includes('sound description')) {
      return 'Add speaker identification and non-speech sound descriptions to video captions';
    }
    if (lowerQuestion.includes('synchronised') || lowerQuestion.includes('synchronized')) {
      return 'Improve caption synchronisation timing to match audio accurately';
    }
    if (lowerQuestion.includes('easy to read') || (lowerQuestion.includes('caption') && lowerQuestion.includes('contrast') && lowerQuestion.includes('size'))) {
      return 'Ensure captions use high-contrast text, appropriate size, and a clear readable font';
    }
    if (lowerQuestion.includes('cart') && lowerQuestion.includes('provider')) {
      return 'Establish a relationship with a CART or captioning service provider';
    }
    if (lowerQuestion.includes('register') || lowerQuestion.includes('book') || lowerQuestion.includes('needs')) {
      return 'Add a captioning needs question to event registration and tour booking forms';
    }
    if (lowerQuestion.includes('real-time') || lowerQuestion.includes('live presentation') || lowerQuestion.includes('tour')) {
      return 'Arrange real-time CART captioning for live presentations, tours, and events';
    }
    if (lowerQuestion.includes('meeting space') || lowerQuestion.includes('auslan')) {
      return 'Ensure meeting spaces can support Auslan interpreters and captioning services';
    }
    if (lowerQuestion.includes('live captioning') && lowerQuestion.includes('displayed')) {
      return 'Plan and test the display method for live captioning at your event';
    }
    if (lowerQuestion.includes('performance') || lowerQuestion.includes('sung')) {
      return 'Provide live captioning or surtitles for spoken and sung performances';
    }
    if (lowerQuestion.includes('audio-described') || lowerQuestion.includes('audio described')) {
      return 'Add captions and audio descriptions to all marketing and communications video content';
    }
    if (lowerQuestion.includes('multimedia') || lowerQuestion.includes('on-site') || lowerQuestion.includes('venue')) {
      return 'Add captions to all on-site and in-venue multimedia content';
    }
    return 'Add captions or subtitles to all video content';
  }

  // Colour contrast
  if (lowerQuestion.includes('contrast') && lowerQuestion.includes('text')) {
    if (lowerQuestion.includes('image') || lowerQuestion.includes('social media')) {
      return 'Ensure text overlaid on social media images meets minimum contrast requirements';
    }
    if (lowerQuestion.includes('sign')) {
      return 'Ensure on-site signage has adequate colour contrast between text and background';
    }
    return 'Improve colour contrast between text and background to meet WCAG standards';
  }

  // Auslan / sign language
  if (lowerQuestion.includes('auslan') || lowerQuestion.includes('sign language')) {
    if (lowerQuestion.includes('content') || lowerQuestion.includes('communication')) {
      return 'Include Auslan content in key marketing and communication materials';
    }
    if (lowerQuestion.includes('training') || lowerQuestion.includes('deaf')) {
      return 'Include Auslan awareness and Deaf communication strategies in staff training';
    }
    if (lowerQuestion.includes('positioned') || lowerQuestion.includes('visibility') || lowerQuestion.includes('sightline')) {
      return 'Position Auslan interpreters for optimal visibility with clear sightlines and good lighting';
    }
    return 'Establish a process and provider relationship for arranging Auslan interpretation on request';
  }

  // Companion card questions
  if (lowerQuestion.includes('companion card')) {
    if (lowerQuestion.includes('ticket') || lowerQuestion.includes('discount') || lowerQuestion.includes('free')) {
      return 'Offer free or discounted companion tickets for Companion Card holders';
    }
    if (lowerQuestion.includes('streamlined') || lowerQuestion.includes('access pass')) {
      return 'Accept Companion Card and other access passes for streamlined entry processing';
    }
    return 'Register as a Companion Card affiliate to support customers who need attendant care';
  }

  // Large print questions
  if (lowerQuestion.includes('large print')) {
    if (lowerQuestion.includes('upload') || lowerQuestion.includes('verification')) {
      return 'Upload your large print materials for review and verification';
    }
    if (lowerQuestion.includes('request') && lowerQuestion.includes('product')) {
      return 'Enable customers to request product information in large print, verbal, or digital formats';
    }
    if (lowerQuestion.includes('automatically') || lowerQuestion.includes('preference')) {
      return 'Configure systems to automatically apply customer format preferences';
    }
    return 'Provide large print versions (minimum 18pt) of key on-site materials';
  }

  // Alternative format and Easy Read questions
  if (lowerQuestion.includes('alternative format') || lowerQuestion.includes('easy read')) {
    if (lowerQuestion.includes('booking') || lowerQuestion.includes('plain language')) {
      return 'Provide booking information in plain language or Easy Read format';
    }
    if (lowerQuestion.includes('let') && lowerQuestion.includes('know')) {
      return 'Communicate the availability of alternative formats on your website and materials';
    }
    if (lowerQuestion.includes('which') && lowerQuestion.includes('currently')) {
      return 'Expand the range of alternative formats available for key documents';
    }
    if (lowerQuestion.includes('process') && lowerQuestion.includes('request')) {
      return 'Establish a clear, advertised process for customers to request alternative formats';
    }
    if (lowerQuestion.includes('pictures') || lowerQuestion.includes('symbols') || lowerQuestion.includes('sign')) {
      return 'Add pictures, symbols, or Easy Read formats to key on-site signs';
    }
    if (lowerQuestion.includes('up to date') || lowerQuestion.includes('change')) {
      return 'Establish a process to update alternative format materials whenever standard versions change';
    }
    if (lowerQuestion.includes('on-site') || lowerQuestion.includes('on site')) {
      return 'Expand the range of on-site alternative format materials available';
    }
    if (lowerQuestion.includes('proactively') || lowerQuestion.includes('rather than waiting')) {
      return 'Train staff to proactively offer alternative format materials to customers';
    }
    if (lowerQuestion.includes('handling') || lowerQuestion.includes('what is your')) {
      return 'Document and streamline your process for handling alternative format requests';
    }
    if (lowerQuestion.includes('important document') || lowerQuestion.includes('key document')) {
      return 'Create a process for providing important documents in alternative formats on request';
    }
    return 'Offer key information in alternative formats (Easy Read, Plain English, audio)';
  }

  // Fallback: Use improved generic conversion
  const statement = convertQuestionToStatement(cleanQuestion);
  let action = statement;

  // "You have [past participle]..." → "Ensure you have [past participle]..." (not "Provide tested...")
  // "You have [noun]..." → "Provide [noun]..."
  if (/^You have \w+(ed|en|t) /i.test(action)) {
    action = action.replace(/^You have /i, 'Ensure you have ');
  } else {
    action = action.replace(/^You have /i, 'Provide ');
  }
  action = action.replace(/^You are /i, 'Ensure you are ');
  action = action.replace(/^You can /i, 'Ensure you can ');
  action = action.replace(/^You currently /i, 'Ensure you ');
  action = action.replace(/^You /i, 'Ensure you ');
  action = action.replace(/^Your (.+?) (is|are) /i, 'Ensure your $1 $2 ');
  action = action.replace(/^Your /i, 'Review your ');
  action = action.replace(/^There (is|are) /i, 'Provide ');
  action = action.replace(/^The /i, 'Ensure the ');
  action = action.replace(/^(Customers|Visitors|People|Staff|All) (can|are|have) /i, 'Ensure $1 $2 ');
  // Generic noun subjects (e.g. "Content warnings appear..." → "Ensure content warnings appear...")
  if (/^[A-Z][a-z]/.test(action) && !/^(Provide|Ensure|Review|Establish|Create|Develop|Install|Improve|Address|Test|Check|Add|Build|Designate|Offer|Promote|Document|Register|Schedule|Verify|Audit|Communicate|Relocate|Keep|Train) /i.test(action)) {
    action = 'Ensure ' + action.charAt(0).toLowerCase() + action.slice(1);
  }

  // Ensure first letter is capitalized
  action = action.charAt(0).toUpperCase() + action.slice(1);

  return action;
}

