/**
 * RunComparisonView Component
 *
 * Displays a detailed comparison between two assessment runs,
 * showing improvements, regressions, and overall progress trends.
 */

import type { RunComparison } from '../hooks/useModuleProgress';
import type { BranchingQuestion } from '../hooks/useBranchingLogic';
import './RunComparisonView.css';

interface RunComparisonViewProps {
  comparison: RunComparison;
  questions: BranchingQuestion[];
  moduleName: string;
  onClose: () => void;
}

export function RunComparisonView({
  comparison,
  questions,
  moduleName,
  onClose,
}: RunComparisonViewProps) {
  const { runA, runB, improvements, regressions, unchanged, overallTrend, scoreChange } = comparison;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'In progress';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getQuestionText = (questionId: string): string => {
    const question = questions.find(q => q.id === questionId);
    return question?.text || questionId;
  };

  const getResponseLabel = (questionId: string, runResponses: typeof runA.responses): string => {
    const response = runResponses.find(r => r.questionId === questionId);
    if (!response) return 'Not answered';

    // Handle standard response options
    const answer = response.answer;
    if (answer === 'yes') return 'Yes';
    if (answer === 'no') return 'No';
    if (answer === 'partially') return 'Partially';
    if (answer === 'unable-to-check') return 'Unable to check';

    // Handle custom option IDs or any other values
    return answer || 'Answered';
  };

  const getTrendIcon = () => {
    switch (overallTrend) {
      case 'improving': return '↑';
      case 'declining': return '↓';
      case 'stable': return '→';
      default: return '↔';
    }
  };

  const getTrendClass = () => {
    switch (overallTrend) {
      case 'improving': return 'trend-improving';
      case 'declining': return 'trend-declining';
      case 'stable': return 'trend-stable';
      default: return 'trend-mixed';
    }
  };

  const getTrendLabel = () => {
    switch (overallTrend) {
      case 'improving': return 'Improving';
      case 'declining': return 'Declining';
      case 'stable': return 'Stable';
      default: return 'Mixed results';
    }
  };

  return (
    <div className="comparison-overlay">
      <div className="comparison-modal">
        <div className="comparison-header">
          <h2>Comparison Results</h2>
          <p className="module-name">{moduleName}</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="comparison-content">
          {/* Runs being compared */}
          <div className="compared-runs">
            <div className="compared-run run-a">
              <span className="run-label">Earlier</span>
              <h4>{runA.context.name}</h4>
              <span className="run-date">{formatDate(runA.completedAt || runA.startedAt)}</span>
            </div>
            <div className="comparison-arrow">→</div>
            <div className="compared-run run-b">
              <span className="run-label">Later</span>
              <h4>{runB.context.name}</h4>
              <span className="run-date">{formatDate(runB.completedAt || runB.startedAt)}</span>
            </div>
          </div>

          {/* Overall trend */}
          <div className={`trend-summary ${getTrendClass()}`}>
            <div className="trend-icon">{getTrendIcon()}</div>
            <div className="trend-info">
              <h3>{getTrendLabel()}</h3>
              <p>
                {scoreChange > 0 && `+${scoreChange}% improvement in positive responses`}
                {scoreChange < 0 && `${scoreChange}% change in positive responses`}
                {scoreChange === 0 && 'No change in overall score'}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="comparison-stats">
            <div className="stat-card stat-improvements">
              <div className="stat-number">{improvements.length}</div>
              <div className="stat-label">Improvements</div>
            </div>
            <div className="stat-card stat-unchanged">
              <div className="stat-number">{unchanged.length}</div>
              <div className="stat-label">Unchanged</div>
            </div>
            <div className="stat-card stat-regressions">
              <div className="stat-number">{regressions.length}</div>
              <div className="stat-label">Need attention</div>
            </div>
          </div>

          {/* Improvements section */}
          {improvements.length > 0 && (
            <div className="comparison-section improvements">
              <h3>Improvements</h3>
              <p className="section-intro">These areas have improved since the earlier assessment:</p>
              <ul className="question-list">
                {improvements.map(questionId => (
                  <li key={questionId} className="question-item improvement">
                    <span className="question-text">{getQuestionText(questionId)}</span>
                    <div className="response-change">
                      <span className="response old">{getResponseLabel(questionId, runA.responses)}</span>
                      <span className="arrow">→</span>
                      <span className="response new">{getResponseLabel(questionId, runB.responses)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Regressions section */}
          {regressions.length > 0 && (
            <div className="comparison-section regressions">
              <h3>Areas needing attention</h3>
              <p className="section-intro">These areas may need review - responses have changed:</p>
              <ul className="question-list">
                {regressions.map(questionId => (
                  <li key={questionId} className="question-item regression">
                    <span className="question-text">{getQuestionText(questionId)}</span>
                    <div className="response-change">
                      <span className="response old">{getResponseLabel(questionId, runA.responses)}</span>
                      <span className="arrow">→</span>
                      <span className="response new">{getResponseLabel(questionId, runB.responses)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unchanged section (collapsible) */}
          {unchanged.length > 0 && (
            <details className="comparison-section unchanged">
              <summary>
                <h3>Unchanged ({unchanged.length})</h3>
              </summary>
              <p className="section-intro">These areas have remained the same:</p>
              <ul className="question-list">
                {unchanged.slice(0, 10).map(questionId => (
                  <li key={questionId} className="question-item">
                    <span className="question-text">{getQuestionText(questionId)}</span>
                    <span className="response">{getResponseLabel(questionId, runB.responses)}</span>
                  </li>
                ))}
                {unchanged.length > 10 && (
                  <li className="more-items">
                    And {unchanged.length - 10} more...
                  </li>
                )}
              </ul>
            </details>
          )}

          {/* Summary insights */}
          <div className="comparison-insights">
            <h3>Insights</h3>
            <ul>
              {overallTrend === 'improving' && (
                <li className="insight positive">
                  Great progress! You've made improvements in {improvements.length} area{improvements.length !== 1 ? 's' : ''}.
                </li>
              )}
              {overallTrend === 'declining' && (
                <li className="insight attention">
                  Some areas have changed since the last assessment. Consider reviewing the {regressions.length} area{regressions.length !== 1 ? 's' : ''} marked for attention.
                </li>
              )}
              {overallTrend === 'stable' && (
                <li className="insight neutral">
                  Your accessibility position has remained stable between assessments.
                </li>
              )}
              {overallTrend === 'mixed' && (
                <li className="insight neutral">
                  Mixed results - some improvements and some areas needing attention. This is normal as situations change.
                </li>
              )}
              {improvements.length > 0 && regressions.length === 0 && (
                <li className="insight positive">
                  No regressions detected - well done maintaining your accessibility standards.
                </li>
              )}
              {runA.context.type !== runB.context.type && (
                <li className="insight neutral">
                  Note: These assessments were conducted for different contexts ({runA.context.type} vs {runB.context.type}), which may explain some differences.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="comparison-footer">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
