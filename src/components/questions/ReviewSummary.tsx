/**
 * Review Summary Component
 *
 * Shows a detailed summary of all responses in a module
 * for review before completing.
 */

import type { QuestionResponse } from '../../hooks/useModuleProgress';
import type { BranchingQuestion } from '../../hooks/useBranchingLogic';
import './review-summary.css';

interface ReviewSummaryProps {
  moduleName: string;
  moduleCode: string;
  questions: BranchingQuestion[];
  responses: QuestionResponse[];
  onBack: () => void;
  onEditAnswer: (questionId: string) => void;
}

export function ReviewSummary({
  moduleName,
  moduleCode,
  questions,
  responses,
  onBack,
  onEditAnswer,
}: ReviewSummaryProps) {
  // Calculate statistics
  const stats = {
    total: responses.length,
    yes: responses.filter(r => r.answer === 'yes').length,
    no: responses.filter(r => r.answer === 'no').length,
    notSure: responses.filter(r => r.answer === 'not-sure').length,
    tooHard: responses.filter(r => r.answer === 'too-hard').length,
    withNotes: responses.filter(r => r.notes && r.notes.trim()).length,
    measurements: responses.filter(r => r.measurement).length,
    urlAnalysis: responses.filter(r => r.urlAnalysis).length,
  };

  const getAnswerLabel = (response: QuestionResponse): string => {
    if (response.answer === 'yes') return 'Yes';
    if (response.answer === 'no') return 'No';
    if (response.answer === 'not-sure') return 'Not sure';
    if (response.answer === 'too-hard') return 'Too hard to do';
    if (response.multiSelectValues && response.multiSelectValues.length > 0) {
      return 'Selected options';
    }
    if (response.measurement) return 'Measurement recorded';
    if (response.linkValue) return 'Link provided';
    if (response.urlAnalysis) return 'URL analyzed';
    return 'Response recorded';
  };

  const getAnswerColorClass = (response: QuestionResponse): string => {
    if (response.answer === 'yes') return 'answer-yes';
    if (response.answer === 'no') return 'answer-no';
    if (response.answer === 'not-sure') return 'answer-not-sure';
    if (response.answer === 'too-hard') return 'answer-too-hard';
    return 'answer-other';
  };

  return (
    <div className="review-summary">
      {/* Header */}
      <div className="review-header">
        <button className="btn-back-review" onClick={onBack}>
          ← Back to summary
        </button>
        <div className="review-title">
          <h2>Review Your Responses</h2>
          <p className="review-module">{moduleName} ({moduleCode})</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="review-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Questions Answered</span>
        </div>
        <div className="stat-card stat-yes">
          <span className="stat-value">{stats.yes}</span>
          <span className="stat-label">Yes</span>
        </div>
        <div className="stat-card stat-no">
          <span className="stat-value">{stats.no}</span>
          <span className="stat-label">No</span>
        </div>
        <div className="stat-card stat-not-sure">
          <span className="stat-value">{stats.notSure}</span>
          <span className="stat-label">Not Sure</span>
        </div>
        {stats.tooHard > 0 && (
          <div className="stat-card stat-too-hard">
            <span className="stat-value">{stats.tooHard}</span>
            <span className="stat-label">Too Hard</span>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      {(stats.withNotes > 0 || stats.measurements > 0 || stats.urlAnalysis > 0) && (
        <div className="review-additional-stats">
          {stats.withNotes > 0 && (
            <div className="additional-stat">
              <span className="stat-icon">📝</span>
              <span>{stats.withNotes} response{stats.withNotes !== 1 ? 's' : ''} with notes</span>
            </div>
          )}
          {stats.measurements > 0 && (
            <div className="additional-stat">
              <span className="stat-icon">📏</span>
              <span>{stats.measurements} measurement{stats.measurements !== 1 ? 's' : ''} recorded</span>
            </div>
          )}
          {stats.urlAnalysis > 0 && (
            <div className="additional-stat">
              <span className="stat-icon">🔗</span>
              <span>{stats.urlAnalysis} URL{stats.urlAnalysis !== 1 ? 's' : ''} analyzed</span>
            </div>
          )}
        </div>
      )}

      {/* Response List */}
      <div className="review-responses">
        <h3 className="responses-heading">All Responses</h3>
        {responses.map((response) => {
          const question = questions.find(q => q.id === response.questionId);
          if (!question) return null;

          return (
            <div key={response.questionId} className="response-item">
              <div className="response-question">
                <h4>{question.text}</h4>
                {question.helpText && (
                  <p className="response-help-text">{question.helpText}</p>
                )}
              </div>

              <div className="response-answer">
                <span className={`answer-badge ${getAnswerColorClass(response)}`}>
                  {getAnswerLabel(response)}
                </span>

                {/* Multi-select values */}
                {response.multiSelectValues && response.multiSelectValues.length > 0 && (
                  <div className="response-details">
                    <ul className="selected-options">
                      {response.multiSelectValues.map((optionId, index) => {
                        const option = question.options?.find(o => o.id === optionId);
                        return (
                          <li key={index}>{option?.label || optionId}</li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Other description */}
                {response.otherDescription && (
                  <div className="response-details">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{response.otherDescription}</span>
                  </div>
                )}

                {/* Measurement */}
                {response.measurement && (
                  <div className="response-details">
                    <span className="measurement-value">
                      {response.measurement.value}{response.measurement.unit}
                    </span>
                    <span className="confidence-badge confidence-{response.measurement.confidence}">
                      {response.measurement.confidence.replace('-', ' ')}
                    </span>
                  </div>
                )}

                {/* Link value */}
                {response.linkValue && (
                  <div className="response-details">
                    <a
                      href={response.linkValue}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="response-link"
                    >
                      {response.linkValue}
                    </a>
                  </div>
                )}

                {/* URL Analysis */}
                {response.urlAnalysis && (
                  <div className="response-details url-analysis-summary">
                    <div className="url-analysis-header">
                      <a
                        href={response.urlAnalysis.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="response-link"
                      >
                        {response.urlAnalysis.url}
                      </a>
                      <span className={`score-badge score-${response.urlAnalysis.overallStatus}`}>
                        {response.urlAnalysis.overallScore}/100
                      </span>
                    </div>
                    <p className="url-summary">{response.urlAnalysis.summary}</p>
                  </div>
                )}

                {/* Notes */}
                {response.notes && (
                  <div className="response-notes">
                    <span className="notes-label">Notes:</span>
                    <p className="notes-text">{response.notes}</p>
                  </div>
                )}
              </div>

              <button
                className="btn-edit-response"
                onClick={() => onEditAnswer(response.questionId)}
                title="Edit this answer"
              >
                Edit
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
