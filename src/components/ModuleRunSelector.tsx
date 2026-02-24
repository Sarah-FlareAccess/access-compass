/**
 * ModuleRunSelector Component
 *
 * Allows users to:
 * - View history of all runs/assessments for a module
 * - Start a new run with context (team, department, event, location, etc.)
 * - Switch between different runs
 * - Compare results between runs
 */

import { useState, useEffect, useRef } from 'react';
import type { ModuleRun, ModuleRunContext } from '../hooks/useModuleProgress';
import { backupDeletedAssessment } from '../utils/assessmentBackup';
import './ModuleRunSelector.css';

const FOCUSABLE_SELECTOR = 'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';

interface ModuleRunSelectorProps {
  moduleId: string;
  moduleName: string;
  runs: ModuleRun[];
  activeRunId?: string;
  onStartNewRun: (context: ModuleRunContext) => void;
  onSwitchRun: (runId: string) => void;
  onDeleteRun: (runId: string) => void;
  onCompareRuns: (runIdA: string, runIdB: string) => void;
  onClose: () => void;
}

const CONTEXT_TYPES: Array<{ id: ModuleRunContext['type']; label: string; description: string }> = [
  { id: 'general', label: 'General assessment', description: 'Standard accessibility review' },
  { id: 'team', label: 'Team', description: 'Assessment by a specific team' },
  { id: 'department', label: 'Department', description: 'Assessment for a department or business unit' },
  { id: 'event', label: 'Event', description: 'Assessment for a specific event or occasion' },
  { id: 'location', label: 'Location', description: 'Assessment for a specific location or area' },
  { id: 'experience', label: 'Experience', description: 'Assessment of a specific customer experience' },
  { id: 'other', label: 'Other', description: 'Custom context' },
];

export function ModuleRunSelector({
  moduleId,
  moduleName,
  runs,
  activeRunId,
  onStartNewRun,
  onSwitchRun,
  onDeleteRun,
  onCompareRuns,
  onClose,
}: ModuleRunSelectorProps) {
  const [view, setView] = useState<'list' | 'new' | 'compare'>('list');
  const [newRunContext, setNewRunContext] = useState<ModuleRunContext>({
    type: 'general',
    name: '',
    description: '',
  });
  const [compareSelection, setCompareSelection] = useState<{ runA?: string; runB?: string }>({});
  const [deleteConfirm, setDeleteConfirm] = useState<ModuleRun | null>(null);
  const [exportedBeforeDelete, setExportedBeforeDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState<{ recoveryCode?: string; assessmentName: string } | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-focus close button on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstFocusable = modalRef.current?.querySelector<HTMLElement>('.close-btn');
      firstFocusable?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Focus trap and Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleStartNewRun = () => {
    if (!newRunContext.name.trim()) {
      // Use default name based on type
      const defaultName = CONTEXT_TYPES.find(t => t.id === newRunContext.type)?.label || 'Assessment';
      const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
      newRunContext.name = `${defaultName} - ${date}`;
    }
    onStartNewRun(newRunContext);
    onClose();
  };

  const handleCompare = () => {
    if (compareSelection.runA && compareSelection.runB) {
      onCompareRuns(compareSelection.runA, compareSelection.runB);
    }
  };

  const handleExportRun = (run: ModuleRun, format: 'json' | 'csv' | 'pdf' = 'json') => {
    const baseFilename = `${moduleName.replace(/\s+/g, '-')}_${run.context.name.replace(/\s+/g, '-')}_${new Date().toISOString().split('T')[0]}`;

    if (format === 'json') {
      const exportData = {
        exportedAt: new Date().toISOString(),
        moduleName,
        assessment: {
          id: run.id,
          context: run.context,
          startedAt: run.startedAt,
          completedAt: run.completedAt,
          status: run.status,
          responses: run.responses,
          summary: run.summary,
          ownership: run.ownership,
          confidenceSnapshot: run.confidenceSnapshot,
        },
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `${baseFilename}.json`);
    } else if (format === 'csv') {
      const csvContent = generateCSV(run);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, `${baseFilename}.csv`);
    } else if (format === 'pdf') {
      generatePDF(run);
    }

    setExportedBeforeDelete(true);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSV = (run: ModuleRun): string => {
    const rows: string[][] = [];

    // Header info
    rows.push(['Assessment Export']);
    rows.push(['Module', moduleName]);
    rows.push(['Assessment Name', run.context.name]);
    rows.push(['Type', getContextTypeLabel(run.context.type)]);
    rows.push(['Status', run.status]);
    rows.push(['Started', formatDate(run.startedAt)]);
    rows.push(['Completed', run.completedAt ? formatDate(run.completedAt) : 'In progress']);
    rows.push(['Exported', new Date().toLocaleDateString('en-AU')]);
    rows.push([]);

    // Responses header
    rows.push(['Question ID', 'Answer', 'Notes', 'Timestamp']);

    // Response data
    run.responses.forEach(response => {
      rows.push([
        response.questionId,
        response.answer || '',
        response.notes || '',
        response.timestamp || ''
      ]);
    });

    // Summary section
    if (run.summary) {
      rows.push([]);
      rows.push(['Summary']);
      rows.push(['Strengths']);
      run.summary.doingWell.forEach(item => rows.push(['', item]));
      rows.push(['Priority Actions']);
      run.summary.priorityActions.forEach(item => rows.push(['', item.action, item.priority, item.timeframe]));
      rows.push(['Areas to Explore']);
      run.summary.areasToExplore.forEach(item => rows.push(['', item]));
    }

    // Convert to CSV string with proper escaping
    return rows.map(row =>
      row.map(cell => {
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ).join('\n');
  };

  const generatePDF = (run: ModuleRun) => {
    // Create a printable HTML document and open print dialog
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download PDF');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${moduleName} - ${run.context.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #1e293b; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
          h2 { color: #475569; margin-top: 30px; }
          .meta { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .meta-item { margin: 8px 0; }
          .meta-label { font-weight: bold; color: #64748b; }
          .response { border-bottom: 1px solid #e2e8f0; padding: 12px 0; }
          .question-id { color: #64748b; font-size: 0.85em; }
          .answer { font-weight: 500; color: #1e293b; }
          .answer.yes { color: #166534; }
          .answer.no { color: #991b1b; }
          .answer.partially { color: #92400e; }
          .notes { color: #64748b; font-style: italic; margin-top: 5px; }
          .summary-section { background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .summary-section.actions { background: #fef3c7; }
          .summary-section.explore { background: #eff6ff; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 0.85em; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>${moduleName}</h1>
        <div class="meta">
          <div class="meta-item"><span class="meta-label">Assessment:</span> ${run.context.name}</div>
          <div class="meta-item"><span class="meta-label">Type:</span> ${getContextTypeLabel(run.context.type)}</div>
          <div class="meta-item"><span class="meta-label">Status:</span> ${run.status}</div>
          <div class="meta-item"><span class="meta-label">Started:</span> ${formatDate(run.startedAt)}</div>
          ${run.completedAt ? `<div class="meta-item"><span class="meta-label">Completed:</span> ${formatDate(run.completedAt)}</div>` : ''}
          <div class="meta-item"><span class="meta-label">Questions Answered:</span> ${run.responses.length}</div>
        </div>

        ${run.summary ? `
          <h2>Summary</h2>
          ${run.summary.doingWell.length > 0 ? `
            <div class="summary-section">
              <strong>Strengths (${run.summary.doingWell.length})</strong>
              <ul>${run.summary.doingWell.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
          ` : ''}
          ${run.summary.priorityActions.length > 0 ? `
            <div class="summary-section actions">
              <strong>Priority Actions (${run.summary.priorityActions.length})</strong>
              <ul>${run.summary.priorityActions.map(item => `<li><strong>${item.priority}:</strong> ${item.action}</li>`).join('')}</ul>
            </div>
          ` : ''}
          ${run.summary.areasToExplore.length > 0 ? `
            <div class="summary-section explore">
              <strong>Areas to Explore (${run.summary.areasToExplore.length})</strong>
              <ul>${run.summary.areasToExplore.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
          ` : ''}
        ` : ''}

        <h2>Responses</h2>
        ${run.responses.map(r => `
          <div class="response">
            <div class="question-id">${r.questionId}</div>
            <div class="answer ${r.answer}">${r.answer || 'Not answered'}</div>
            ${r.notes ? `<div class="notes">${r.notes}</div>` : ''}
          </div>
        `).join('')}

        <div class="footer">
          <p>Exported from Access Compass on ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not completed';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getContextTypeLabel = (type: ModuleRunContext['type']) => {
    return CONTEXT_TYPES.find(t => t.id === type)?.label || type;
  };

  const getStatusBadge = (status: ModuleRun['status']) => {
    switch (status) {
      case 'completed':
        return <span className="run-status-badge completed">Completed</span>;
      case 'in-progress':
        return <span className="run-status-badge in-progress">In progress</span>;
      default:
        return <span className="run-status-badge not-started">Not started</span>;
    }
  };

  const getConfidenceBadge = (confidence?: ModuleRun['confidenceSnapshot']) => {
    if (!confidence) return null;
    const labels = {
      strong: 'Strong',
      mixed: 'Mixed',
      'needs-work': 'Needs work',
    };
    return (
      <span className={`run-confidence-badge ${confidence}`}>
        {labels[confidence]}
      </span>
    );
  };

  return (
    <div className="run-selector-overlay" onClick={onClose}>
      <div ref={modalRef} className="run-selector-modal" role="dialog" aria-modal="true" aria-label="Assessment History" onClick={(e) => e.stopPropagation()}>
        <div className="run-selector-header">
          <h2>Assessment History</h2>
          <p className="module-name">{moduleName}</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Tab navigation */}
        <div className="run-selector-tabs">
          <button
            className={`tab ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            History ({runs.length})
          </button>
          <button
            className={`tab ${view === 'new' ? 'active' : ''}`}
            onClick={() => setView('new')}
          >
            New Assessment
          </button>
          {runs.length >= 2 && (
            <button
              className={`tab ${view === 'compare' ? 'active' : ''}`}
              onClick={() => setView('compare')}
            >
              Compare
            </button>
          )}
        </div>

        <div className="run-selector-content">
          {/* List View */}
          {view === 'list' && (
            <div className="runs-list">
              {runs.length === 0 ? (
                <div className="empty-state">
                  <p>No assessments yet</p>
                  <p className="hint">Start your first assessment to begin tracking progress</p>
                  <button className="btn-primary" onClick={() => setView('new')}>
                    Start new assessment
                  </button>
                </div>
              ) : (
                <>
                  {runs.map(run => (
                    <div
                      key={run.id}
                      className={`run-card ${run.id === activeRunId ? 'active' : ''}`}
                    >
                      <div className="run-card-header">
                        <div className="run-info">
                          <h3>{run.context.name}</h3>
                          <span className="run-type">{getContextTypeLabel(run.context.type)}</span>
                        </div>
                        <div className="run-badges">
                          {getStatusBadge(run.status)}
                          {getConfidenceBadge(run.confidenceSnapshot)}
                        </div>
                      </div>

                      {run.context.description && (
                        <p className="run-description">{run.context.description}</p>
                      )}

                      <div className="run-meta">
                        <span className="run-date">
                          Started: {formatDate(run.startedAt)}
                        </span>
                        {run.completedAt && (
                          <span className="run-date">
                            Completed: {formatDate(run.completedAt)}
                          </span>
                        )}
                        <span className="run-responses">
                          {run.responses.length} questions answered
                        </span>
                      </div>

                      {run.summary && (
                        <div className="run-summary-preview">
                          <span className="summary-stat positive">
                            {run.summary.doingWell.length} strengths
                          </span>
                          <span className="summary-stat action">
                            {run.summary.priorityActions.length} actions
                          </span>
                        </div>
                      )}

                      <div className="run-actions">
                        {run.id !== activeRunId ? (
                          <button
                            className="btn-secondary"
                            onClick={() => onSwitchRun(run.id)}
                          >
                            Load this assessment
                          </button>
                        ) : (
                          <span className="current-label">Currently viewing</span>
                        )}
                        <button
                          className="btn-delete"
                          onClick={() => {
                            setDeleteConfirm(run);
                            setExportedBeforeDelete(false);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* New Run View */}
          {view === 'new' && (
            <div className="new-run-form">
              <p className="form-intro">
                Start a new assessment to track progress over time, compare different teams or departments,
                or evaluate recurring events.
              </p>

              <div className="form-group">
                <label htmlFor="context-type">What is this assessment for?</label>
                <select
                  id="context-type"
                  value={newRunContext.type}
                  onChange={(e) => setNewRunContext({
                    ...newRunContext,
                    type: e.target.value as ModuleRunContext['type'],
                  })}
                >
                  {CONTEXT_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="context-name">
                  {newRunContext.type === 'team' && 'Team name'}
                  {newRunContext.type === 'department' && 'Department name'}
                  {newRunContext.type === 'event' && 'Event name'}
                  {newRunContext.type === 'location' && 'Location name'}
                  {newRunContext.type === 'experience' && 'Experience name'}
                  {newRunContext.type === 'general' && 'Assessment name'}
                  {newRunContext.type === 'other' && 'Name'}
                </label>
                <span className="field-hint">
                  {newRunContext.type === 'team' ? 'e.g., Front of house team' :
                    newRunContext.type === 'department' ? 'e.g., Customer service' :
                    newRunContext.type === 'event' ? 'e.g., Summer Festival 2024' :
                    newRunContext.type === 'location' ? 'e.g., Main entrance' :
                    newRunContext.type === 'experience' ? 'e.g., Booking process' :
                    'e.g., Q1 2024 Review'}
                </span>
                <input
                  id="context-name"
                  type="text"
                  value={newRunContext.name}
                  onChange={(e) => setNewRunContext({ ...newRunContext, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="context-description">Description (optional)</label>
                <span className="field-hint">Add any notes about this assessment...</span>
                <textarea
                  id="context-description"
                  value={newRunContext.description || ''}
                  onChange={(e) => setNewRunContext({ ...newRunContext, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setView('list')}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleStartNewRun}>
                  Start assessment
                </button>
              </div>
            </div>
          )}

          {/* Compare View */}
          {view === 'compare' && (
            <div className="compare-view">
              <p className="form-intro">
                Compare two assessments to track progress, identify improvements, and see where more work is needed.
              </p>

              <div className="compare-selectors">
                <div className="form-group">
                  <label htmlFor="compare-run-a">First assessment (earlier)</label>
                  <select
                    id="compare-run-a"
                    value={compareSelection.runA || ''}
                    onChange={(e) => setCompareSelection({ ...compareSelection, runA: e.target.value })}
                  >
                    <option value="">Select an assessment...</option>
                    {runs.map(run => (
                      <option key={run.id} value={run.id} disabled={run.id === compareSelection.runB}>
                        {run.context.name} ({formatDate(run.completedAt || run.startedAt)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="compare-arrow">→</div>

                <div className="form-group">
                  <label htmlFor="compare-run-b">Second assessment (later)</label>
                  <select
                    id="compare-run-b"
                    value={compareSelection.runB || ''}
                    onChange={(e) => setCompareSelection({ ...compareSelection, runB: e.target.value })}
                  >
                    <option value="">Select an assessment...</option>
                    {runs.map(run => (
                      <option key={run.id} value={run.id} disabled={run.id === compareSelection.runA}>
                        {run.context.name} ({formatDate(run.completedAt || run.startedAt)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setView('list')}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleCompare}
                  disabled={!compareSelection.runA || !compareSelection.runB}
                >
                  Compare assessments
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="delete-modal-overlay">
            <div className="delete-modal">
              <div className="delete-modal-icon">⚠️</div>
              <h3>Delete Assessment?</h3>
              <p className="delete-warning">
                You are about to permanently delete this assessment and all its data:
              </p>
              <div className="delete-details">
                <div className="delete-detail-item">
                  <span className="detail-label">Assessment:</span>
                  <span className="detail-value">{deleteConfirm.context.name}</span>
                </div>
                <div className="delete-detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{getContextTypeLabel(deleteConfirm.context.type)}</span>
                </div>
                <div className="delete-detail-item">
                  <span className="detail-label">Responses:</span>
                  <span className="detail-value">{deleteConfirm.responses.length} questions answered</span>
                </div>
                {deleteConfirm.completedAt && (
                  <div className="delete-detail-item">
                    <span className="detail-label">Completed:</span>
                    <span className="detail-value">{formatDate(deleteConfirm.completedAt)}</span>
                  </div>
                )}
              </div>

              {/* Export options */}
              <div className="delete-export-section">
                <p className="export-prompt">
                  <strong>Download a backup first?</strong> Save your data before deleting.
                </p>
                <div className="export-buttons">
                  <button
                    className={`btn-export-option ${exportedBeforeDelete ? 'exported' : ''}`}
                    onClick={() => handleExportRun(deleteConfirm, 'csv')}
                    title="Best for spreadsheets (Excel, Google Sheets)"
                  >
                    CSV
                  </button>
                  <button
                    className={`btn-export-option ${exportedBeforeDelete ? 'exported' : ''}`}
                    onClick={() => handleExportRun(deleteConfirm, 'pdf')}
                    title="Best for printing or sharing"
                  >
                    PDF
                  </button>
                  <button
                    className={`btn-export-option ${exportedBeforeDelete ? 'exported' : ''}`}
                    onClick={() => handleExportRun(deleteConfirm, 'json')}
                    title="Full data backup (can be re-imported)"
                  >
                    JSON
                  </button>
                </div>
                {exportedBeforeDelete && (
                  <p className="export-success">Backup downloaded</p>
                )}
              </div>

              <div className="delete-recovery-info">
                <p>
                  <strong>Recovery option:</strong> After deletion, you'll receive a recovery code valid for <strong>30 days</strong>.
                  Save this code - it's your only way to request data recovery if needed.
                </p>
              </div>

              <p className="delete-permanent-warning">
                Once you close the next screen, <strong>the recovery code cannot be retrieved</strong>.
                Make sure to save it or download a backup above.
              </p>

              <div className="delete-modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Keep assessment
                </button>
                <button
                  className="btn-danger"
                  disabled={isDeleting}
                  onClick={async () => {
                    setIsDeleting(true);
                    const assessmentName = deleteConfirm.context.name;
                    let recoveryCode = 'N/A';

                    try {
                      // Backup to Supabase before deleting (optional - don't block on failure)
                      // Add 5 second timeout to prevent indefinite hanging
                      const backupPromise = backupDeletedAssessment(
                        moduleId,
                        moduleName,
                        deleteConfirm
                      );
                      const timeoutPromise = new Promise<{ success: false; recoveryCode?: string }>((resolve) =>
                        setTimeout(() => resolve({ success: false }), 5000)
                      );

                      const result = await Promise.race([backupPromise, timeoutPromise]);
                      recoveryCode = result.recoveryCode || 'N/A';
                    } catch (err) {
                      console.error('Error during backup:', err);
                    }

                    // Always proceed with local deletion
                    onDeleteRun(deleteConfirm.id);
                    setDeleteConfirm(null);
                    setIsDeleting(false);

                    // Show success modal
                    setDeletionSuccess({
                      recoveryCode,
                      assessmentName,
                    });
                  }}
                >
                  {isDeleting ? 'Deleting...' : 'Delete permanently'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deletion Success Modal with Recovery Code */}
        {deletionSuccess && (
          <div className="delete-modal-overlay">
            <div className="delete-modal success-modal">
              <div className="delete-modal-icon">✓</div>
              <h3>Assessment Deleted</h3>
              <p className="success-message">
                "{deletionSuccess.assessmentName}" has been deleted.
              </p>

              {deletionSuccess.recoveryCode ? (
                <div className="recovery-code-section">
                  <p className="recovery-prompt">
                    <strong>Save your recovery code:</strong>
                  </p>
                  <div className="recovery-code-display">
                    <code>{deletionSuccess.recoveryCode}</code>
                    <button
                      className="btn-copy"
                      onClick={() => {
                        navigator.clipboard.writeText(deletionSuccess.recoveryCode || '');
                        const btn = document.querySelector('.btn-copy');
                        if (btn) {
                          btn.textContent = 'Copied!';
                          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
                        }
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <p className="recovery-info">
                    This code is valid for <strong>30 days</strong>. If you need to recover this assessment,
                    contact support with this code. <strong>Once you close this window, the code cannot be retrieved.</strong>
                  </p>
                </div>
              ) : (
                <div className="recovery-code-section no-code">
                  <p className="recovery-warning">
                    Unable to create a recovery backup. If you downloaded a local backup, you can use that to restore your data.
                  </p>
                </div>
              )}

              <div className="delete-modal-actions">
                <button
                  className="btn-primary"
                  onClick={() => setDeletionSuccess(null)}
                >
                  {deletionSuccess.recoveryCode ? 'I\'ve saved the code' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
