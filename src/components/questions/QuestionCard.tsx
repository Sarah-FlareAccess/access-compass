/**
 * QuestionCard Component
 *
 * Displays a single question with appropriate answer options
 * based on the question type (yes-no-unsure, measurement, text, etc.)
 */

import { useState, useCallback } from 'react';
import type { QuestionResponse } from '../../hooks/useModuleProgress';
import type { BranchingQuestion } from '../../hooks/useBranchingLogic';
import './questions.css';

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
  const [linkValue, setLinkValue] = useState(currentResponse?.linkValue || '');

  const handleYesNoAnswer = useCallback(
    (answer: 'yes' | 'no' | 'not-sure' | 'too-hard') => {
      const response: QuestionResponse = {
        questionId: question.id,
        answer,
        notes: notes.trim() || undefined,
        timestamp: new Date().toISOString(),
      };
      onAnswer(response);
    },
    [question.id, notes, onAnswer]
  );

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
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, question.measurementUnit, measurementValue, measurementConfidence, notes, onAnswer]);

  const handleMultiSelectSubmit = useCallback(() => {
    const response: QuestionResponse = {
      questionId: question.id,
      answer: null,
      multiSelectValues: selectedOptions,
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, selectedOptions, notes, onAnswer]);

  const handleSingleSelectSubmit = useCallback(
    (optionId: string) => {
      const response: QuestionResponse = {
        questionId: question.id,
        answer: null,
        multiSelectValues: [optionId],
        notes: notes.trim() || undefined,
        timestamp: new Date().toISOString(),
      };
      onAnswer(response);
    },
    [question.id, notes, onAnswer]
  );

  const handleLinkSubmit = useCallback(() => {
    const response: QuestionResponse = {
      questionId: question.id,
      answer: null,
      linkValue: linkValue.trim() || undefined,
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    onAnswer(response);
  }, [question.id, linkValue, notes, onAnswer]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

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
      <div className="question-header">
        <div className="question-meta">
          <span className="module-name">{moduleName}</span>
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
        <p className="question-help-text">{question.helpText}</p>
      )}

      {question.example && (
        <div className="question-example">
          <span className="example-label">Example:</span> {question.example}
        </div>
      )}

      {/* Yes/No/Unsure Question Type */}
      {question.type === 'yes-no-unsure' && (
        <div className="answer-options">
          <button
            className={`answer-btn answer-yes ${
              currentResponse?.answer === 'yes' ? 'selected' : ''
            }`}
            onClick={() => handleYesNoAnswer('yes')}
          >
            Yes
          </button>
          <button
            className={`answer-btn answer-no ${
              currentResponse?.answer === 'no' ? 'selected' : ''
            }`}
            onClick={() => handleYesNoAnswer('no')}
          >
            No
          </button>
          <button
            className={`answer-btn answer-not-sure ${
              currentResponse?.answer === 'not-sure' ? 'selected' : ''
            }`}
            onClick={() => handleYesNoAnswer('not-sure')}
          >
            Not sure
          </button>
          <button
            className={`answer-btn answer-too-hard ${
              currentResponse?.answer === 'too-hard' ? 'selected' : ''
            }`}
            onClick={() => handleYesNoAnswer('too-hard')}
          >
            Too hard to do
          </button>
        </div>
      )}

      {/* Measurement Question Type */}
      {question.type === 'measurement' && (
        <div className="measurement-input">
          <div className="measurement-field">
            <input
              type="number"
              value={measurementValue}
              onChange={(e) => setMeasurementValue(e.target.value)}
              placeholder="Enter measurement"
              className="measurement-value-input"
            />
            <span className="measurement-unit">
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
                className={`confidence-btn ${
                  measurementConfidence === 'confident' ? 'selected' : ''
                }`}
                onClick={() => setMeasurementConfidence('confident')}
              >
                Confident
              </button>
              <button
                className={`confidence-btn ${
                  measurementConfidence === 'somewhat-confident' ? 'selected' : ''
                }`}
                onClick={() => setMeasurementConfidence('somewhat-confident')}
              >
                Somewhat confident
              </button>
              <button
                className={`confidence-btn ${
                  measurementConfidence === 'not-confident' ? 'selected' : ''
                }`}
                onClick={() => setMeasurementConfidence('not-confident')}
              >
                Not confident
              </button>
            </div>
          </div>

          <button
            className="submit-btn"
            onClick={handleMeasurementSubmit}
            disabled={!measurementValue}
          >
            Submit measurement
          </button>
        </div>
      )}

      {/* Multi-select Question Type */}
      {question.type === 'multi-select' && question.options && (
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
          <button
            className="submit-btn"
            onClick={handleMultiSelectSubmit}
            disabled={selectedOptions.length === 0}
          >
            Continue
          </button>
        </div>
      )}

      {/* Single-select Question Type */}
      {question.type === 'single-select' && question.options && (
        <div className="single-select-options">
          {question.options.map((option) => (
            <button
              key={option.id}
              className="single-select-option"
              onClick={() => handleSingleSelectSubmit(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Link Input Question Type */}
      {question.type === 'link-input' && (
        <div className="link-input-section">
          <input
            type="url"
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            placeholder="https://..."
            className="link-input"
          />
          <button
            className="submit-btn"
            onClick={handleLinkSubmit}
          >
            {linkValue ? 'Submit' : 'Skip'}
          </button>
        </div>
      )}

      {/* Text Input Question Type */}
      {question.type === 'text' && (
        <div className="text-input-section">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your response..."
            className="text-input"
            rows={4}
          />
          <button
            className="submit-btn"
            onClick={() => {
              const response: QuestionResponse = {
                questionId: question.id,
                answer: null,
                notes: notes.trim() || undefined,
                timestamp: new Date().toISOString(),
              };
              onAnswer(response);
            }}
          >
            {notes.trim() ? 'Submit' : 'Skip'}
          </button>
        </div>
      )}

      {/* Notes section for non-text questions */}
      {question.type !== 'text' && (
        <div className="notes-section">
          <label htmlFor="question-notes">Add notes (optional)</label>
          <input
            type="text"
            id="question-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional details..."
          />
        </div>
      )}
    </div>
  );
}
