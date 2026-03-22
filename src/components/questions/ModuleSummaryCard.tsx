/**
 * ModuleSummaryCard Component
 *
 * Clean completion screen: stats overview, next-step signposts,
 * and completion confirmation. Detailed findings live in the report.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, FileText, ClipboardList } from 'lucide-react';
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
  assignedTo?: string;
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
  const { doingWell, priorityActions, areasToExplore } = summary;

  const highCount = priorityActions.filter((a) => a.priority === 'high').length;

  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [completedBy, setCompletedBy] = useState(assignedTo || '');
  const [completedByRole, setCompletedByRole] = useState('');

  const { showConfetti, triggerConfetti, handleConfettiComplete } = useConfetti();

  const handleCompleteClick = () => {
    setShowCompletionForm(true);
  };

  const handleConfirmComplete = () => {
    triggerConfetti();
    setTimeout(() => {
      onComplete({
        completedBy: completedBy.trim(),
        completedByRole: completedByRole.trim() || undefined,
      });
    }, 300);
  };

  return (
    <>
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
            <span className="module-code-badge">{moduleCode}</span> {moduleName}
          </p>
          <p className="summary-stats-brief">
            {totalQuestionsAnswered} question{totalQuestionsAnswered !== 1 ? 's' : ''} answered
          </p>
        </div>

        {/* Stats tiles */}
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
        </div>

        {/* High priority callout - only if there are high-priority items */}
        {highCount > 0 && (
          <div className="summary-high-callout" role="status">
            <strong>{highCount} high-priority action{highCount !== 1 ? 's' : ''} identified.</strong>
            {' '}These relate to mandatory compliance requirements and should be addressed first.
          </div>
        )}

        {/* What to do next */}
        <div className="summary-next-steps">
          <h3 className="summary-next-heading">What to do next</h3>
          <div className="summary-next-grid">
            <Link to="/report" className="summary-next-card">
              <BarChart3 size={20} aria-hidden="true" />
              <div>
                <strong>View report</strong>
                <span>See detailed findings, recommendations, and compliance references for this module.</span>
              </div>
            </Link>
            <Link to="/diap" className="summary-next-card">
              <ClipboardList size={20} aria-hidden="true" />
              <div>
                <strong>View action plan</strong>
                <span>Priority actions have been added to your DIAP. Assign owners and set timelines.</span>
              </div>
            </Link>
            <Link to="/resources" className="summary-next-card">
              <FileText size={20} aria-hidden="true" />
              <div>
                <strong>Browse resources</strong>
                <span>Step-by-step guides and practical tips for addressing each finding.</span>
              </div>
            </Link>
          </div>
        </div>

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
              <span className="field-hint">e.g., Jane Smith</span>
              <input
                type="text"
                id="completedBy"
                value={completedBy}
                onChange={(e) => setCompletedBy(e.target.value)}
                autoFocus
              />
            </div>

            <div className="completion-field">
              <label htmlFor="completedByRole">Role (optional)</label>
              <span className="field-hint">e.g., Visitor Experience Manager</span>
              <input
                type="text"
                id="completedByRole"
                value={completedByRole}
                onChange={(e) => setCompletedByRole(e.target.value)}
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
      </div>
    </>
  );
}
