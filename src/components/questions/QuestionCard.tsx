/**
 * QuestionCard Component
 *
 * Displays a single question with appropriate answer options
 * based on the question type (yes-no-unsure, measurement, text, etc.)
 */

import { useState, useCallback, useEffect } from 'react';
import type { QuestionResponse, EvidenceFile } from '../../hooks/useModuleProgress';
import type { BranchingQuestion } from '../../hooks/useBranchingLogic';
import type { MediaAnalysisResult, MediaAnalysisType } from '../../types/mediaAnalysis';
import { UrlAnalysisInput } from './UrlAnalysisInput';
import { EvidenceUpload } from './EvidenceUpload';
import { MediaAnalysisInput } from './MediaAnalysisInput';
import { HelpPanel } from './HelpPanel';
import { getHelpContent, generateDefaultHelpContent } from '../../data/helpContent';
import {
  RESPONSE_LABELS,
  RESPONSE_CSS_CLASSES,
  UNABLE_TO_CHECK_HELPER,
  type ResponseOption,
} from '../../constants/responseOptions';
import './questions.css';
import './help-panel.css';

/**
 * Extract the first sentence from help text for brief display under the question.
 * Full text goes into the "See examples & tips" panel.
 */
function getShortHelpText(helpText: string | undefined): string | undefined {
  if (!helpText) return undefined;

  // Find first sentence ending with . or ! or ?
  const match = helpText.match(/^[^.!?]+[.!?]/);
  if (match) {
    return match[0].trim();
  }

  // If no sentence found, return first 80 chars with ellipsis
  if (helpText.length > 80) {
    return helpText.slice(0, 80).trim() + '...';
  }

  return helpText;
}

interface QuestionCardProps {
  question: BranchingQuestion;
  currentResponse?: QuestionResponse;
  onAnswer: (response: QuestionResponse) => void;
  questionNumber: number;
  totalQuestions: number;
  moduleName: string;
}

export function QuestionCard({
  question,
  currentResponse,
  onAnswer,
  questionNumber,
  totalQuestions,
  moduleName,
}: QuestionCardProps) {
  const [notes, setNotes] = useState(currentResponse?.notes || '');
  const [measurementValue, setMeasurementValue] = useState<string>(
    currentResponse?.measurement?.value?.toString() || ''
  );
  const [measurementConfidence, setMeasurementConfidence] = useState<
    'confident' | 'somewhat-confident' | 'not-confident'
  >(currentResponse?.measurement?.confidence || 'somewhat-confident');
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    currentResponse?.multiSelectValues || []
  );
  const [selectedSingleOption, setSelectedSingleOption] = useState<string | null>(
    currentResponse?.multiSelectValues?.[0] || null
  );
  const [linkValue, setLinkValue] = useState(currentResponse?.linkValue || '');
  const [otherDescription, setOtherDescription] = useState(currentResponse?.otherDescription || '');
  const [evidence, setEvidence] = useState<EvidenceFile[]>(currentResponse?.evidence || []);

  // Help panel state
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const helpContent = getHelpContent(question.id)
    || question.helpContent
    || generateDefaultHelpContent(question.helpText)
    || {
      title: 'About this question',
      summary: question.helpText || question.text,
      examples: [
        {
          type: 'good' as const,
          imageUrl: '/help/placeholder-good.svg',
          caption: 'Good example',
          details: 'This meets accessibility requirements',
        },
        {
          type: 'poor' as const,
          imageUrl: '/help/placeholder-poor.svg',
          caption: 'Needs improvement',
          details: 'This could be improved for better accessibility',
        },
      ],
      tips: [
        'Take your time to consider the question carefully',
        'Select "Partially" if some elements are in place but not all',
        'Add notes to capture observations for later',
        'Upload photos or documents as supporting evidence',
      ],
    };

  // Selected answer state (for manual continue flow)
  const [selectedAnswer, setSelectedAnswer] = useState<ResponseOption | null>(
    currentResponse?.answer || null
  );

  // Partial answer state
  const [partialDescription, setPartialDescription] = useState(
    currentResponse?.partialDescription || ''
  );
  const [showPartialInput, setShowPartialInput] = useState(
    currentResponse?.answer === 'partially'
  );

  // Notes info tooltip state
  const [showNotesInfo, setShowNotesInfo] = useState(false);

  // Reset all state when question changes
  useEffect(() => {
    setNotes(currentResponse?.notes || '');
    setMeasurementValue(currentResponse?.measurement?.value?.toString() || '');
    setMeasurementConfidence(currentResponse?.measurement?.confidence || 'somewhat-confident');
    setSelectedOptions(currentResponse?.multiSelectValues || []);
    setSelectedSingleOption(currentResponse?.multiSelectValues?.[0] || null);
    setLinkValue(currentResponse?.linkValue || '');
    setOtherDescription(currentResponse?.otherDescription || '');
    setEvidence(currentResponse?.evidence || []);
    setSelectedAnswer(currentResponse?.answer || null);
    setPartialDescription(currentResponse?.partialDescription || '');
    setShowPartialInput(currentResponse?.answer === 'partially');
    setShowNotesInfo(false);
    setIsHelpOpen(false);
  }, [question.id, currentResponse]);

  // Check if "other" option is selected (multi-select)
  const hasOtherSelected = selectedOptions.some(
    (opt) => opt === 'other' || opt.toLowerCase().includes('other')
  );

  // Check if "other" option is selected (single-select)
  const hasSingleOtherSelected = selectedSingleOption
    ? selectedSingleOption === 'other' || selectedSingleOption.toLowerCase().includes('other')
    : false;

  // Handle selecting an answer (just sets state, doesn't submit)
  const handleYesNoSelect = useCallback(
    (answer: ResponseOption) => {
      setSelectedAnswer(answer);
      // If selecting "partially", show the input field
      if (answer === 'partially') {
        setShowPartialInput(true);
      } else {
        // Reset partial state if selecting another answer
        setShowPartialInput(false);
        setPartialDescription('');
      }
    },
    []
  );

  // Submit yes-no-unsure answer (called by Continue button)
  const handleYesNoSubmit = useCallback(() => {
    if (!selectedAnswer) return;

    const response: QuestionResponse = {
      questionId: question.id,
      answer: selectedAnswer,
      partialDescription: selectedAnswer === 'partially' ? (partialDescription.trim() || undefined) : undefined,
      notes: notes.trim() || undefined,
      evidence: evidence.length > 0 ? evidence : undefined,
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, selectedAnswer, partialDescription, notes, evidence, onAnswer]);

  const handleMeasurementSubmit = useCallback(() => {
    if (!measurementValue) return;

    const response: QuestionResponse = {
      questionId: question.id,
      answer: null,
      measurement: {
        value: parseFloat(measurementValue),
        unit: question.measurementUnit || 'mm',
        confidence: measurementConfidence,
      },
      notes: notes.trim() || undefined,
      evidence: evidence.length > 0 ? evidence : undefined,
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, question.measurementUnit, measurementValue, measurementConfidence, notes, evidence, onAnswer]);

  const handleMultiSelectSubmit = useCallback(() => {
    const response: QuestionResponse = {
      questionId: question.id,
      answer: null,
      multiSelectValues: selectedOptions,
      otherDescription: hasOtherSelected && otherDescription.trim() ? otherDescription.trim() : undefined,
      notes: notes.trim() || undefined,
      evidence: evidence.length > 0 ? evidence : undefined,
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, selectedOptions, hasOtherSelected, otherDescription, notes, evidence, onAnswer]);

  const handleSingleSelectClick = useCallback(
    (optionId: string) => {
      // Just select the option, don't submit yet
      setSelectedSingleOption(optionId);
      // Clear other description if switching away from "other"
      const isOther = optionId === 'other' || optionId.toLowerCase().includes('other');
      if (!isOther) {
        setOtherDescription('');
      }
    },
    []
  );

  const handleSingleSelectSubmit = useCallback(() => {
    if (!selectedSingleOption) return;
    const response: QuestionResponse = {
      questionId: question.id,
      answer: null,
      multiSelectValues: [selectedSingleOption],
      otherDescription: hasSingleOtherSelected && otherDescription.trim() ? otherDescription.trim() : undefined,
      notes: notes.trim() || undefined,
      evidence: evidence.length > 0 ? evidence : undefined,
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, selectedSingleOption, hasSingleOtherSelected, otherDescription, notes, evidence, onAnswer]);

  const handleLinkSubmit = useCallback(() => {
    const response: QuestionResponse = {
      questionId: question.id,
      answer: null,
      linkValue: linkValue.trim() || undefined,
      notes: notes.trim() || undefined,
      evidence: evidence.length > 0 ? evidence : undefined,
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, linkValue, notes, evidence, onAnswer]);

  const handleUrlAnalysisSubmit = useCallback((urlAnalysisResult: {
    url: string;
    overallScore: number;
    overallStatus: 'excellent' | 'good' | 'needs-improvement' | 'missing';
    summary: string;
    strengths: string[];
    improvements: string[];
  }) => {
    const response: QuestionResponse = {
      questionId: question.id,
      answer: null,
      urlAnalysis: {
        ...urlAnalysisResult,
        analysisDate: new Date().toISOString(),
        parameterResults: [],
        disclaimer: 'This analysis provides guidance only and should be verified by accessibility professionals.',
      },
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, notes, onAnswer]);

  const handleUrlAnalysisSkip = useCallback(() => {
    const response: QuestionResponse = {
      questionId: question.id,
      answer: null,
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, notes, onAnswer]);

  const handleMediaAnalysisSubmit = useCallback((result: MediaAnalysisResult) => {
    const response: QuestionResponse = {
      questionId: question.id,
      answer: null,
      mediaAnalysis: {
        id: result.id,
        analysisType: result.analysisType,
        inputType: result.inputType,
        fileName: result.fileName,
        fileSize: result.fileSize,
        url: result.url,
        thumbnailDataUrl: result.thumbnailDataUrl,
        photoPreviews: result.photoPreviews,
        analysisDate: result.analysisDate,
        overallScore: result.overallScore,
        overallStatus: result.overallStatus,
        summary: result.summary,
        strengths: result.strengths,
        improvements: result.improvements,
        quickWins: result.quickWins,
        standardsAssessed: result.standardsAssessed,
        needsProfessionalReview: result.needsProfessionalReview,
        professionalReviewReason: result.professionalReviewReason,
        disclaimer: result.disclaimer,
      },
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, notes, onAnswer]);

  const handleMediaAnalysisSkip = useCallback(() => {
    const response: QuestionResponse = {
      questionId: question.id,
      answer: null,
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, notes, onAnswer]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleEvidenceChange = useCallback((newEvidence: EvidenceFile[]) => {
    setEvidence(newEvidence);
  }, []);

  const renderImpactBadge = () => {
    if (!question.impactLevel) return null;
    const colors = {
      high: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626' },
      medium: { bg: 'rgba(251, 191, 36, 0.1)', text: '#d97706' },
      low: { bg: 'rgba(34, 197, 94, 0.1)', text: '#16a34a' },
    };
    const color = colors[question.impactLevel];
    return (
      <span
        className="impact-badge"
        style={{ background: color.bg, color: color.text }}
      >
        {question.impactLevel} impact
      </span>
    );
  };

  const renderSafetyBadge = () => {
    if (!question.safetyRelated) return null;
    return <span className="safety-badge">Safety related</span>;
  };

  return (
    <div className="question-card">
      {/* Module banner - prominent header */}
      <div className="module-banner">
        <h1 className="module-banner-title">{moduleName}</h1>
      </div>

      <div className="question-header">
        <div className="question-meta">
          <span className="question-progress">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <div className="question-badges">
          {renderImpactBadge()}
          {renderSafetyBadge()}
        </div>
      </div>

      <h2 className="question-text">{question.text}</h2>

      {question.helpText && (
        <p className="question-help-text">{getShortHelpText(question.helpText)}</p>
      )}

      {question.example && (
        <div className="question-example">
          <span className="example-label">Example:</span> {question.example}
        </div>
      )}

      {/* Help trigger button - shows if question has help content */}
      {helpContent && (
        <button
          className="help-trigger"
          onClick={() => setIsHelpOpen(true)}
          type="button"
        >
          <span className="help-trigger-icon">?</span>
          See examples &amp; tips
        </button>
      )}

      {/* Yes/No Question Type - 4 main options + Not applicable */}
      {question.type === 'yes-no-unsure' && (
        <>
          {/* Main 2x2 grid */}
          <div className="answer-options">
            <button
              className={`answer-btn ${RESPONSE_CSS_CLASSES['yes']} ${
                selectedAnswer === 'yes' ? 'selected' : ''
              }`}
              onClick={() => handleYesNoSelect('yes')}
            >
              {RESPONSE_LABELS['yes']}
            </button>
            <button
              className={`answer-btn ${RESPONSE_CSS_CLASSES['partially']} ${
                selectedAnswer === 'partially' ? 'selected' : ''
              }`}
              onClick={() => handleYesNoSelect('partially')}
            >
              {RESPONSE_LABELS['partially']}
            </button>
            <button
              className={`answer-btn ${RESPONSE_CSS_CLASSES['no']} ${
                selectedAnswer === 'no' ? 'selected' : ''
              }`}
              onClick={() => handleYesNoSelect('no')}
            >
              {RESPONSE_LABELS['no']}
            </button>
            <button
              className={`answer-btn ${RESPONSE_CSS_CLASSES['unable-to-check']} ${
                selectedAnswer === 'unable-to-check' ? 'selected' : ''
              }`}
              onClick={() => handleYesNoSelect('unable-to-check')}
            >
              {RESPONSE_LABELS['unable-to-check']}
            </button>
          </div>

          {/* Not applicable option - smaller, below the grid */}
          <div className="answer-options-secondary">
            <button
              className={`answer-btn answer-btn-secondary ${RESPONSE_CSS_CLASSES['not-applicable']} ${
                selectedAnswer === 'not-applicable' ? 'selected' : ''
              }`}
              onClick={() => handleYesNoSelect('not-applicable')}
            >
              {RESPONSE_LABELS['not-applicable']}
            </button>
          </div>

          {/* Subtle helper text for Unable to check */}
          {selectedAnswer === 'unable-to-check' && (
            <p className="unable-to-check-helper">{UNABLE_TO_CHECK_HELPER}</p>
          )}

          {/* Partial description input */}
          {showPartialInput && (
            <div className="partial-description-section">
              <label htmlFor="partial-description">
                Please describe what's in place and what's missing:
              </label>
              <textarea
                id="partial-description"
                value={partialDescription}
                onChange={(e) => setPartialDescription(e.target.value)}
                placeholder={question.partialPlaceholder || "Describe what's working and what still needs attention..."}
                rows={3}
              />
              <p className="partial-report-hint">Your description will be included in your report and action plan — the more specific you are, the more tailored your recommendations will be.</p>
            </div>
          )}

          {/* Notes section with info tooltip */}
          <div className="notes-section-enhanced">
            <div className="notes-header">
              <label htmlFor="question-notes-yesno">Add notes (optional)</label>
              <button
                type="button"
                className="notes-info-btn"
                onClick={() => setShowNotesInfo(!showNotesInfo)}
                aria-label="Notes information"
              >
                <span className="info-icon">i</span>
              </button>
            </div>
            {showNotesInfo && (
              <div className="notes-info-tooltip">
                <p>Use this for your own reference: observations, questions, or things to clarify later.</p>
                <p>Notes can be included in your DIAP and report if you choose, or kept separate for your records only.</p>
              </div>
            )}
            <textarea
              id="question-notes-yesno"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, questions, or notes for later..."
              rows={2}
            />
          </div>

          {/* Evidence upload (optional) */}
          <div className="evidence-section-optional">
            <div className="evidence-section-header">
              <span className="evidence-section-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                Add supporting evidence
              </span>
              <span className="evidence-section-optional-badge">Optional</span>
            </div>
            <p className="evidence-section-hint">e.g. screenshots, photos, or documents</p>
            <EvidenceUpload
              evidence={evidence}
              onEvidenceChange={handleEvidenceChange}
              allowedTypes={['photo', 'document']}
              hint="Photos or documents to support your answer"
            />
          </div>

          {/* Continue button */}
          {selectedAnswer && (
            <div className="continue-section">
              <button
                className="btn-continue"
                onClick={handleYesNoSubmit}
                disabled={selectedAnswer === 'partially' && !partialDescription.trim()}
              >
                Continue
              </button>
            </div>
          )}
        </>
      )}

      {/* Measurement Question Type */}
      {question.type === 'measurement' && (
        <>
          <div className="measurement-input">
            <div className="measurement-field">
              <label htmlFor="measurement-value" className="visually-hidden">
                Enter measurement in {question.measurementUnit || 'mm'}
              </label>
              <input
                type="number"
                id="measurement-value"
                value={measurementValue}
                onChange={(e) => setMeasurementValue(e.target.value)}
                placeholder="Enter measurement"
                className="measurement-value-input"
                aria-describedby="measurement-unit"
              />
              <span className="measurement-unit" id="measurement-unit">
                {question.measurementUnit || 'mm'}
              </span>
            </div>

            {question.measurementGuidance && (
              <div className="measurement-guidance">
                {question.measurementGuidance.interpretation && (
                  <p className="guidance-text">
                    {question.measurementGuidance.interpretation}
                  </p>
                )}
                {question.measurementGuidance.ideal && (
                  <p className="guidance-ideal">
                    Recommended: {question.measurementGuidance.ideal}
                    {question.measurementUnit || 'mm'}
                  </p>
                )}
              </div>
            )}

            <div className="confidence-selector">
              <label>How confident are you in this measurement?</label>
              <div className="confidence-options">
                <button
                  type="button"
                  className={`confidence-btn ${
                    measurementConfidence === 'confident' ? 'selected' : ''
                  }`}
                  onClick={() => setMeasurementConfidence('confident')}
                >
                  Confident
                </button>
                <button
                  type="button"
                  className={`confidence-btn ${
                    measurementConfidence === 'somewhat-confident' ? 'selected' : ''
                  }`}
                  onClick={() => setMeasurementConfidence('somewhat-confident')}
                >
                  Somewhat confident
                </button>
                <button
                  type="button"
                  className={`confidence-btn ${
                    measurementConfidence === 'not-confident' ? 'selected' : ''
                  }`}
                  onClick={() => setMeasurementConfidence('not-confident')}
                >
                  Not confident
                </button>
              </div>
            </div>
          </div>

          {/* Notes section with info tooltip */}
          <div className="notes-section-enhanced">
            <div className="notes-header">
              <label htmlFor="question-notes-measurement">Add notes (optional)</label>
              <button
                type="button"
                className="notes-info-btn"
                onClick={() => setShowNotesInfo(!showNotesInfo)}
                aria-label="Notes information"
              >
                <span className="info-icon">i</span>
              </button>
            </div>
            {showNotesInfo && (
              <div className="notes-info-tooltip">
                <p>Use this for your own reference: observations, questions, or things to clarify later.</p>
                <p>Notes can be included in your DIAP and report if you choose, or kept separate for your records only.</p>
              </div>
            )}
            <textarea
              id="question-notes-measurement"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, questions, or notes for later..."
              rows={2}
            />
          </div>

          {/* Evidence upload (optional) */}
          <div className="evidence-section-optional">
            <div className="evidence-section-header">
              <span className="evidence-section-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                Add supporting evidence
              </span>
              <span className="evidence-section-optional-badge">Optional</span>
            </div>
            <p className="evidence-section-hint">e.g. screenshots, photos, or documents</p>
            <EvidenceUpload
              evidence={evidence}
              onEvidenceChange={handleEvidenceChange}
              allowedTypes={['photo', 'document']}
              hint="Photos or documents to support your measurement"
            />
          </div>

          {/* Continue button */}
          {measurementValue && (
            <div className="continue-section">
              <button
                className="btn-continue"
                onClick={handleMeasurementSubmit}
              >
                Continue
              </button>
            </div>
          )}
        </>
      )}

      {/* Multi-select Question Type */}
      {question.type === 'multi-select' && question.options && (
        <>
          <div className="multi-select-options">
            {question.options.map((option) => (
              <label key={option.id} className="multi-select-option">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                />
                <span className="option-label">{option.label}</span>
              </label>
            ))}
            {hasOtherSelected && (
              <div className="other-description-input">
                <label htmlFor="other-description">Please describe:</label>
                <input
                  type="text"
                  id="other-description"
                  value={otherDescription}
                  onChange={(e) => setOtherDescription(e.target.value)}
                  placeholder="Enter details..."
                  className="other-text-input"
                />
              </div>
            )}
          </div>

          {/* Notes section with info tooltip */}
          <div className="notes-section-enhanced">
            <div className="notes-header">
              <label htmlFor="question-notes-multiselect">Add notes (optional)</label>
              <button
                type="button"
                className="notes-info-btn"
                onClick={() => setShowNotesInfo(!showNotesInfo)}
                aria-label="Notes information"
              >
                <span className="info-icon">i</span>
              </button>
            </div>
            {showNotesInfo && (
              <div className="notes-info-tooltip">
                <p>Use this for your own reference: observations, questions, or things to clarify later.</p>
                <p>Notes can be included in your DIAP and report if you choose, or kept separate for your records only.</p>
              </div>
            )}
            <textarea
              id="question-notes-multiselect"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, questions, or notes for later..."
              rows={2}
            />
          </div>

          {/* Evidence upload (optional) */}
          <div className="evidence-section-optional">
            <div className="evidence-section-header">
              <span className="evidence-section-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                Add supporting evidence
              </span>
              <span className="evidence-section-optional-badge">Optional</span>
            </div>
            <p className="evidence-section-hint">e.g. screenshots, photos, or documents</p>
            <EvidenceUpload
              evidence={evidence}
              onEvidenceChange={handleEvidenceChange}
              allowedTypes={['photo', 'document']}
              hint="Photos or documents to support your answer"
            />
          </div>

          {/* Continue button */}
          {selectedOptions.length > 0 && (
            <div className="continue-section">
              <button
                className="btn-continue"
                onClick={handleMultiSelectSubmit}
                disabled={hasOtherSelected && !otherDescription.trim()}
              >
                Continue
              </button>
            </div>
          )}
        </>
      )}

      {/* Single-select Question Type */}
      {question.type === 'single-select' && question.options && (
        <>
          <div className="single-select-section">
            <div className="single-select-options">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`single-select-option ${selectedSingleOption === option.id ? 'selected' : ''}`}
                  onClick={() => handleSingleSelectClick(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {hasSingleOtherSelected && (
              <div className="other-description-input">
                <label htmlFor="single-other-description">Please describe:</label>
                <input
                  type="text"
                  id="single-other-description"
                  value={otherDescription}
                  onChange={(e) => setOtherDescription(e.target.value)}
                  placeholder="Enter details..."
                  className="other-text-input"
                />
              </div>
            )}
          </div>

          {/* Notes section with info tooltip */}
          <div className="notes-section-enhanced">
            <div className="notes-header">
              <label htmlFor="question-notes-singleselect">Add notes (optional)</label>
              <button
                type="button"
                className="notes-info-btn"
                onClick={() => setShowNotesInfo(!showNotesInfo)}
                aria-label="Notes information"
              >
                <span className="info-icon">i</span>
              </button>
            </div>
            {showNotesInfo && (
              <div className="notes-info-tooltip">
                <p>Use this for your own reference: observations, questions, or things to clarify later.</p>
                <p>Notes can be included in your DIAP and report if you choose, or kept separate for your records only.</p>
              </div>
            )}
            <textarea
              id="question-notes-singleselect"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, questions, or notes for later..."
              rows={2}
            />
          </div>

          {/* Evidence upload (optional) */}
          <div className="evidence-section-optional">
            <div className="evidence-section-header">
              <span className="evidence-section-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                Add supporting evidence
              </span>
              <span className="evidence-section-optional-badge">Optional</span>
            </div>
            <p className="evidence-section-hint">e.g. screenshots, photos, or documents</p>
            <EvidenceUpload
              evidence={evidence}
              onEvidenceChange={handleEvidenceChange}
              allowedTypes={['photo', 'document']}
              hint="Photos or documents to support your answer"
            />
          </div>

          {/* Continue button */}
          {selectedSingleOption && (
            <div className="continue-section">
              <button
                className="btn-continue"
                onClick={handleSingleSelectSubmit}
                disabled={hasSingleOtherSelected && !otherDescription.trim()}
              >
                Continue
              </button>
            </div>
          )}
        </>
      )}

      {/* Link Input Question Type */}
      {question.type === 'link-input' && (
        <>
          <div className="link-input-section">
            <label htmlFor="link-input" className="visually-hidden">
              Enter URL
            </label>
            <input
              type="url"
              id="link-input"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder="https://..."
              className="link-input"
            />
          </div>

          {/* Notes section with info tooltip */}
          <div className="notes-section-enhanced">
            <div className="notes-header">
              <label htmlFor="question-notes-link">Add notes (optional)</label>
              <button
                type="button"
                className="notes-info-btn"
                onClick={() => setShowNotesInfo(!showNotesInfo)}
                aria-label="Notes information"
              >
                <span className="info-icon">i</span>
              </button>
            </div>
            {showNotesInfo && (
              <div className="notes-info-tooltip">
                <p>Use this for your own reference: observations, questions, or things to clarify later.</p>
                <p>Notes can be included in your DIAP and report if you choose, or kept separate for your records only.</p>
              </div>
            )}
            <textarea
              id="question-notes-link"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, questions, or notes for later..."
              rows={2}
            />
          </div>

          {/* Evidence upload (optional) */}
          <div className="evidence-section-optional">
            <div className="evidence-section-header">
              <span className="evidence-section-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                Add supporting evidence
              </span>
              <span className="evidence-section-optional-badge">Optional</span>
            </div>
            <p className="evidence-section-hint">e.g. screenshots, photos, or documents</p>
            <EvidenceUpload
              evidence={evidence}
              onEvidenceChange={handleEvidenceChange}
              allowedTypes={['photo', 'document']}
              hint="Photos or documents to support your answer"
            />
          </div>

          {/* Continue button */}
          <div className="continue-section">
            <button
              className="btn-continue"
              onClick={handleLinkSubmit}
            >
              {linkValue ? 'Continue' : 'Skip'}
            </button>
          </div>
        </>
      )}

      {/* Text Input Question Type */}
      {question.type === 'text' && (
        <>
          <div className="text-input-section">
            <div className="notes-header">
              <label htmlFor="question-text-input">Your response</label>
              <button
                type="button"
                className="notes-info-btn"
                onClick={() => setShowNotesInfo(!showNotesInfo)}
                aria-label="Notes information"
              >
                <span className="info-icon">i</span>
              </button>
            </div>
            {showNotesInfo && (
              <div className="notes-info-tooltip">
                <p>Use this for your own reference: observations, questions, or things to clarify later.</p>
                <p>This response can be included in your DIAP and report if you choose.</p>
              </div>
            )}
            <textarea
              id="question-text-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter your response..."
              className="text-input"
              rows={4}
            />
          </div>

          {/* Evidence upload (optional) */}
          <div className="evidence-section-optional">
            <div className="evidence-section-header">
              <span className="evidence-section-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                Add supporting evidence
              </span>
              <span className="evidence-section-optional-badge">Optional</span>
            </div>
            <p className="evidence-section-hint">e.g. screenshots, photos, or documents</p>
            <EvidenceUpload
              evidence={evidence}
              onEvidenceChange={handleEvidenceChange}
              allowedTypes={['photo', 'document']}
              hint="Photos or documents to support your response"
            />
          </div>

          {/* Continue button */}
          <div className="continue-section">
            <button
              className="btn-continue"
              onClick={() => {
                const response: QuestionResponse = {
                  questionId: question.id,
                  answer: null,
                  notes: notes.trim() || undefined,
                  evidence: evidence.length > 0 ? evidence : undefined,
                  timestamp: new Date().toISOString(),
                };
                onAnswer(response);
              }}
            >
              {notes.trim() ? 'Continue' : 'Skip'}
            </button>
          </div>
        </>
      )}

      {/* URL Analysis Question Type */}
      {question.type === 'url-analysis' && (
        <UrlAnalysisInput
          currentValue={currentResponse?.urlAnalysis}
          onSubmit={handleUrlAnalysisSubmit}
          onSkip={handleUrlAnalysisSkip}
        />
      )}

      {/* Media Analysis Question Type */}
      {question.type === 'media-analysis' && (
        <MediaAnalysisInput
          preselectedType={question.mediaAnalysisType as MediaAnalysisType | undefined}
          currentValue={currentResponse?.mediaAnalysis ? {
            id: currentResponse.mediaAnalysis.id,
            analysisType: currentResponse.mediaAnalysis.analysisType as MediaAnalysisType,
            inputType: currentResponse.mediaAnalysis.inputType,
            fileName: currentResponse.mediaAnalysis.fileName,
            fileSize: currentResponse.mediaAnalysis.fileSize,
            url: currentResponse.mediaAnalysis.url,
            thumbnailDataUrl: currentResponse.mediaAnalysis.thumbnailDataUrl,
            photoPreviews: currentResponse.mediaAnalysis.photoPreviews,
            analysisDate: currentResponse.mediaAnalysis.analysisDate,
            analysisVersion: '1.0',
            overallScore: currentResponse.mediaAnalysis.overallScore,
            overallStatus: currentResponse.mediaAnalysis.overallStatus,
            summary: currentResponse.mediaAnalysis.summary,
            strengths: currentResponse.mediaAnalysis.strengths,
            improvements: currentResponse.mediaAnalysis.improvements,
            quickWins: currentResponse.mediaAnalysis.quickWins,
            standardsAssessed: currentResponse.mediaAnalysis.standardsAssessed,
            needsProfessionalReview: currentResponse.mediaAnalysis.needsProfessionalReview,
            professionalReviewReason: currentResponse.mediaAnalysis.professionalReviewReason,
            disclaimer: currentResponse.mediaAnalysis.disclaimer,
            criteriaResults: [],
          } : undefined}
          onAnalysisComplete={handleMediaAnalysisSubmit}
          onSkip={handleMediaAnalysisSkip}
          hint={question.mediaAnalysisHint}
        />
      )}

      {/* Help Panel */}
      {helpContent && (
        <HelpPanel
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          content={helpContent}
          questionText={question.text}
        />
      )}
    </div>
  );
}
