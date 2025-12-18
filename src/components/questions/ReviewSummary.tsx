/**
 * Review Summary Component
 *
 * Shows a detailed summary of all responses in a module
 * for review before completing.
 */

import type { QuestionResponse } from '../../hooks/useModuleProgress';
import type { BranchingQuestion } from '../../hooks/useBranchingLogic';
import { RESPONSE_LABELS, RESPONSE_CSS_CLASSES } from '../../constants/responseOptions';
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
    partially: responses.filter(r => r.answer === 'partially').length,
    no: responses.filter(r => r.answer === 'no').length,
    unableToCheck: responses.filter(r => r.answer === 'unable-to-check').length,
    withNotes: responses.filter(r => r.notes && r.notes.trim()).length,
    measurements: responses.filter(r => r.measurement).length,
    urlAnalysis: responses.filter(r => r.urlAnalysis).length,
  };

  const getAnswerLabel = (response: QuestionResponse): string => {
    if (response.answer && response.answer in RESPONSE_LABELS) {
      return RESPONSE_LABELS[response.answer as keyof typeof RESPONSE_LABELS];
    }
    if (response.multiSelectValues && response.multiSelectValues.length > 0) {
      return 'Selected options';
    }
    if (response.measurement) return 'Measurement recorded';
    if (response.linkValue) return 'Link provided';
    if (response.urlAnalysis) return 'URL analyzed';
    return 'Response recorded';
  };

  const getAnswerColorClass = (response: QuestionResponse): string => {
    if (response.answer && response.answer in RESPONSE_CSS_CLASSES) {
      return RESPONSE_CSS_CLASSES[response.answer as keyof typeof RESPONSE_CSS_CLASSES];
    }
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
        {stats.partially > 0 && (
          <div className="stat-card stat-partial">
            <span className="stat-value">{stats.partially}</span>
            <span className="stat-label">Partially</span>
          </div>
        )}
        <div className="stat-card stat-no">
          <span className="stat-value">{stats.no}</span>
          <span className="stat-label">No</span>
        </div>
        {stats.unableToCheck > 0 && (
          <div className="stat-card stat-unable">
            <span className="stat-value">{stats.unableToCheck}</span>
            <span className="stat-label">To Confirm</span>
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

                {/* Media Analysis */}
                {response.mediaAnalysis && (
                  <div className="response-details media-analysis-summary">
                    <div className="media-analysis-header">
                      <span className="media-type">
                        {response.mediaAnalysis.analysisType.charAt(0).toUpperCase() +
                         response.mediaAnalysis.analysisType.slice(1)} Analysis
                      </span>
                      <span className={`score-badge score-${response.mediaAnalysis.overallStatus}`}>
                        {response.mediaAnalysis.overallScore}/100
                      </span>
                    </div>
                    <p className="media-summary">{response.mediaAnalysis.summary}</p>
                    {response.mediaAnalysis.photoPreviews && response.mediaAnalysis.photoPreviews.length > 0 && (
                      <div className="media-previews">
                        {response.mediaAnalysis.photoPreviews.map((preview, idx) => (
                          <img key={idx} src={preview} alt={`Photo ${idx + 1}`} className="media-preview-thumb" />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Notes / Partial description */}
                {response.notes && (
                  <div className="response-notes">
                    <span className="notes-label">
                      {response.answer === 'partially' ? "What's in place / missing:" : 'Notes:'}
                    </span>
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
