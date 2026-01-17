/**
 * ModuleSummaryCard Component
 *
 * Displays a summary of module completion including:
 * - What's going well
 * - Priority actions
 * - Areas to explore
 * - Items needing professional review
 */

import { useState } from 'react';
import type { ModuleSummary, CompletionMetadata } from '../../hooks/useModuleProgress';
import { Confetti, useConfetti } from '../Confetti';
import './questions.css';

export type { CompletionMetadata };

interface ModuleSummaryCardProps {
  moduleName: string;
  moduleCode: string;
  summary: ModuleSummary;
  totalQuestionsAnswered: number;
  onComplete: (metadata: CompletionMetadata) => void;
  onReviewAnswers: () => void;
  assignedTo?: string; // Pre-fill completedBy with assigned person
}

export function ModuleSummaryCard({
  moduleName,
  moduleCode,
  summary,
  totalQuestionsAnswered,
  onComplete,
  onReviewAnswers,
  assignedTo,
}: ModuleSummaryCardProps) {
  const { doingWell, priorityActions, areasToExplore, professionalReview } = summary;

  const highPriorityCount = priorityActions.filter((a) => a.priority === 'high').length;
  const mediumPriorityCount = priorityActions.filter((a) => a.priority === 'medium').length;
  const lowPriorityCount = priorityActions.filter((a) => a.priority === 'low').length;

  // Completion confirmation state
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [completedBy, setCompletedBy] = useState(assignedTo || '');
  const [completedByRole, setCompletedByRole] = useState('');

  // Expansion state for "show more" sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Confetti celebration
  const { showConfetti, triggerConfetti, handleConfettiComplete } = useConfetti();

  const handleCompleteClick = () => {
    setShowCompletionForm(true);
  };

  const handleConfirmComplete = () => {
    // Trigger celebration confetti
    triggerConfetti();

    // Complete after a short delay to let celebration start
    setTimeout(() => {
      onComplete({
        completedBy: completedBy.trim(),
        completedByRole: completedByRole.trim() || undefined,
      });
    }, 300);
  };

  return (
    <>
      {/* Celebration confetti on completion */}
      <Confetti
        isActive={showConfetti}
        onComplete={handleConfettiComplete}
        pieceCount={60}
        duration={3500}
      />

      <div className="module-summary">
        <div className="summary-header">
          <div className="summary-icon">
            <span>&#10003;</span>
          </div>
          <h2 className="summary-title">Module Complete</h2>
          <p className="summary-module-name">
            {moduleName} ({moduleCode})
          </p>
          <p className="summary-stats-brief">
            {totalQuestionsAnswered} question{totalQuestionsAnswered !== 1 ? 's' : ''} answered
            {priorityActions.length > 0 && (
              <> · {priorityActions.length} action{priorityActions.length !== 1 ? 's' : ''} identified</>
            )}
          </p>
        </div>

      {/* Quick Overview */}
      <div className="summary-overview">
        <div className="overview-item overview-success">
          <span className="overview-number">{doingWell.length}</span>
          <span className="overview-label">Going well</span>
        </div>
        <div className="overview-item overview-actions">
          <span className="overview-number">{priorityActions.length}</span>
          <span className="overview-label">Priority actions</span>
        </div>
        <div className="overview-item overview-explore">
          <span className="overview-number">{areasToExplore.length}</span>
          <span className="overview-label">To explore</span>
        </div>
        {professionalReview.length > 0 && (
          <div className="overview-item overview-review">
            <span className="overview-number">{professionalReview.length}</span>
            <span className="overview-label">Professional review</span>
          </div>
        )}
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
            {(expandedSections['doingWell'] ? doingWell : doingWell.slice(0, 5)).map((item, index) => (
              <li key={index} className="summary-item doing-well-item">
                {item}
              </li>
            ))}
            {doingWell.length > 5 && (
              <li className="summary-more">
                <button
                  className="expand-toggle"
                  onClick={() => toggleSection('doingWell')}
                  aria-expanded={expandedSections['doingWell']}
                >
                  {expandedSections['doingWell']
                    ? 'Show less'
                    : `+${doingWell.length - 5} more items`}
                </button>
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
            {(expandedSections['actions'] ? priorityActions : priorityActions.slice(0, 5)).map((action, index) => (
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
                <button
                  className="expand-toggle"
                  onClick={() => toggleSection('actions')}
                  aria-expanded={expandedSections['actions']}
                >
                  {expandedSections['actions']
                    ? 'Show less'
                    : `+${priorityActions.length - 5} more actions`}
                </button>
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
            {(expandedSections['explore'] ? areasToExplore : areasToExplore.slice(0, 3)).map((item, index) => (
              <li key={index} className="summary-item explore-item">
                {item}
              </li>
            ))}
            {areasToExplore.length > 3 && (
              <li className="summary-more">
                <button
                  className="expand-toggle"
                  onClick={() => toggleSection('explore')}
                  aria-expanded={expandedSections['explore']}
                >
                  {expandedSections['explore']
                    ? 'Show less'
                    : `+${areasToExplore.length - 3} more areas`}
                </button>
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
            {(expandedSections['professional'] ? professionalReview : professionalReview.slice(0, 3)).map((item, index) => (
              <li key={index} className="summary-item professional-item">
                {item}
              </li>
            ))}
            {professionalReview.length > 3 && (
              <li className="summary-more">
                <button
                  className="expand-toggle"
                  onClick={() => toggleSection('professional')}
                  aria-expanded={expandedSections['professional']}
                >
                  {expandedSections['professional']
                    ? 'Show less'
                    : `+${professionalReview.length - 3} more items`}
                </button>
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
      {!showCompletionForm ? (
        <div className="summary-actions-footer">
          <button className="btn-review" onClick={onReviewAnswers}>
            Review answers
          </button>
          <button className="btn-complete" onClick={handleCompleteClick}>
            Complete module
          </button>
        </div>
      ) : (
        <div className="completion-form">
          <h4 className="completion-form-title">Confirm Completion</h4>
          <p className="completion-form-desc">
            Record who completed this module for your records.
          </p>

          <div className="completion-field">
            <label htmlFor="completedBy">Completed by</label>
            <input
              type="text"
              id="completedBy"
              value={completedBy}
              onChange={(e) => setCompletedBy(e.target.value)}
              placeholder="e.g., Jane Smith"
              autoFocus
            />
          </div>

          <div className="completion-field">
            <label htmlFor="completedByRole">Role (optional)</label>
            <input
              type="text"
              id="completedByRole"
              value={completedByRole}
              onChange={(e) => setCompletedByRole(e.target.value)}
              placeholder="e.g., Visitor Experience Manager"
            />
          </div>

          <div className="completion-form-note">
            Completion date will be recorded automatically.
          </div>

          <div className="completion-form-actions">
            <button
              className="btn-cancel"
              onClick={() => setShowCompletionForm(false)}
            >
              Back
            </button>
            <button
              className="btn-confirm-complete"
              onClick={handleConfirmComplete}
            >
              Confirm & Complete
            </button>
          </div>
        </div>
      )}

      {/* DIAP note */}
        <p className="diap-note">
          Priority actions will be automatically added to your Disability Inclusion Action Plan (DIAP).
        </p>
      </div>
    </>
  );
}
