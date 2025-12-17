/**
 * ModuleSummaryCard Component
 *
 * Displays a summary of module completion including:
 * - What's going well
 * - Priority actions
 * - Areas to explore
 * - Items needing professional review
 */

import type { ModuleSummary } from '../../hooks/useModuleProgress';
import './questions.css';

interface ModuleSummaryCardProps {
  moduleName: string;
  moduleCode: string;
  summary: ModuleSummary;
  onComplete: () => void;
  onReviewAnswers: () => void;
}

export function ModuleSummaryCard({
  moduleName,
  moduleCode,
  summary,
  onComplete,
  onReviewAnswers,
}: ModuleSummaryCardProps) {
  const { doingWell, priorityActions, areasToExplore, professionalReview } = summary;

  const highPriorityCount = priorityActions.filter((a) => a.priority === 'high').length;
  const mediumPriorityCount = priorityActions.filter((a) => a.priority === 'medium').length;
  const lowPriorityCount = priorityActions.filter((a) => a.priority === 'low').length;

  return (
    <div className="module-summary">
      <div className="summary-header">
        <div className="summary-icon">
          <span>&#10003;</span>
        </div>
        <h2 className="summary-title">Module Complete</h2>
        <p className="summary-module-name">
          {moduleName} ({moduleCode})
        </p>
      </div>

      {/* What's Going Well */}
      {doingWell.length > 0 && (
        <div className="summary-section summary-doing-well">
          <div className="section-header">
            <span className="section-icon doing-well-icon">&#10003;</span>
            <h3 className="section-title">What's going well</h3>
            <span className="section-count">{doingWell.length}</span>
          </div>
          <ul className="summary-list">
            {doingWell.slice(0, 5).map((item, index) => (
              <li key={index} className="summary-item doing-well-item">
                {item}
              </li>
            ))}
            {doingWell.length > 5 && (
              <li className="summary-more">
                +{doingWell.length - 5} more items
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Priority Actions */}
      {priorityActions.length > 0 && (
        <div className="summary-section summary-actions">
          <div className="section-header">
            <span className="section-icon actions-icon">!</span>
            <h3 className="section-title">Priority actions</h3>
            <div className="priority-badges">
              {highPriorityCount > 0 && (
                <span className="priority-badge high">{highPriorityCount} high</span>
              )}
              {mediumPriorityCount > 0 && (
                <span className="priority-badge medium">{mediumPriorityCount} medium</span>
              )}
              {lowPriorityCount > 0 && (
                <span className="priority-badge low">{lowPriorityCount} low</span>
              )}
            </div>
          </div>
          <ul className="summary-list action-list">
            {priorityActions.slice(0, 5).map((action, index) => (
              <li key={index} className={`action-item priority-${action.priority}`}>
                <div className="action-content">
                  <span className="action-text">{action.action}</span>
                  <span className="action-timeframe">{action.timeframe}</span>
                </div>
                {action.impactStatement && (
                  <p className="action-impact">{action.impactStatement}</p>
                )}
              </li>
            ))}
            {priorityActions.length > 5 && (
              <li className="summary-more">
                +{priorityActions.length - 5} more actions
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Areas to Explore */}
      {areasToExplore.length > 0 && (
        <div className="summary-section summary-explore">
          <div className="section-header">
            <span className="section-icon explore-icon">?</span>
            <h3 className="section-title">Areas to explore</h3>
            <span className="section-count">{areasToExplore.length}</span>
          </div>
          <p className="explore-description">
            You weren't sure about these areas. Consider investigating further or consulting with accessibility experts.
          </p>
          <ul className="summary-list">
            {areasToExplore.slice(0, 3).map((item, index) => (
              <li key={index} className="summary-item explore-item">
                {item}
              </li>
            ))}
            {areasToExplore.length > 3 && (
              <li className="summary-more">
                +{areasToExplore.length - 3} more areas
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Professional Review */}
      {professionalReview.length > 0 && (
        <div className="summary-section summary-professional">
          <div className="section-header">
            <span className="section-icon professional-icon">&#9888;</span>
            <h3 className="section-title">Consider professional review</h3>
            <span className="section-count">{professionalReview.length}</span>
          </div>
          <p className="professional-description">
            These items may benefit from review by an accessibility consultant or expert.
          </p>
          <ul className="summary-list">
            {professionalReview.slice(0, 3).map((item, index) => (
              <li key={index} className="summary-item professional-item">
                {item}
              </li>
            ))}
            {professionalReview.length > 3 && (
              <li className="summary-more">
                +{professionalReview.length - 3} more items
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {doingWell.length === 0 &&
        priorityActions.length === 0 &&
        areasToExplore.length === 0 && (
          <div className="summary-empty">
            <p>No responses recorded for this module.</p>
          </div>
        )}

      {/* Actions */}
      <div className="summary-actions-footer">
        <button className="btn-review" onClick={onReviewAnswers}>
          Review answers
        </button>
        <button className="btn-complete" onClick={onComplete}>
          Complete module
        </button>
      </div>

      {/* DIAP note */}
      <p className="diap-note">
        Priority actions will be automatically added to your Disability Inclusion Action Plan (DIAP).
      </p>
    </div>
  );
}
