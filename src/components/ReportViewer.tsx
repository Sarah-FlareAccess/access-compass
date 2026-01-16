/**
 * Report Viewer Component
 *
 * Displays the accessibility review report in-app with different layouts
 * for pulse-check (1-page summary) vs deep-dive (detailed report).
 */

import type { Report } from '../hooks/useReportGeneration';
import { downloadPDFReport } from '../utils/pdfGenerator';
import { RESPONSE_LABELS } from '../constants/responseOptions';
import './ReportViewer.css';

// Helper function to format analysis type for display
function formatAnalysisType(analysisType: string): string {
  const labels: Record<string, string> = {
    'menu': 'Menu',
    'brochure': 'Brochure',
    'flyer': 'Flyer',
    'large-print': 'Large Print',
    'signage': 'Signage',
    'lighting': 'Lighting',
    'ground-surface': 'Ground Surface',
    'pathway': 'Pathway',
    'entrance': 'Entrance',
    'ramp': 'Ramp',
    'stairs': 'Stairs',
    'door': 'Door',
    'social-media-post': 'Social Media Post',
    'social-media-url': 'Social Media Profile',
    'website-wave': 'Website Audit',
  };
  return labels[analysisType] || analysisType;
}

// Helper function to format status for display
function formatStatus(status: string): string {
  const labels: Record<string, string> = {
    'excellent': 'Excellent',
    'good': 'Good',
    'needs-improvement': 'Needs Improvement',
    'poor': 'Poor',
    'not-assessable': 'Not Assessable',
    'missing': 'Missing',
  };
  return labels[status] || status;
}

interface ReportViewerProps {
  report: Report;
  onClose: () => void;
  onDownload?: () => void;
}

export function ReportViewer({ report, onClose, onDownload }: ReportViewerProps) {
  const handleDownload = () => {
    downloadPDFReport(report);
    onDownload?.();
  };
  const isPulseCheck = report.reportType === 'pulse-check';

  return (
    <div className="report-viewer-overlay">
      <div className="report-viewer-container">
        {/* Header with actions */}
        <div className="report-viewer-header">
          <h2>
            {isPulseCheck ? 'Pulse Check Summary' : 'Deep Dive Report'}
          </h2>
          <div className="report-actions">
            <button className="btn-download-report" onClick={handleDownload}>
              Download PDF
            </button>
            <button className="btn-close-report" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Report content */}
        <div className="report-content">
          {/* Cover page */}
          <section className="report-cover">
            <h1 className="report-title">
              Accessibility Self-Review Report
            </h1>
            <div className="report-subtitle">
              {isPulseCheck ? 'Pulse Check Summary' : 'Deep Dive Assessment'}
            </div>
            <div className="report-org-name">{report.organisation}</div>
            <div className="report-date">
              Generated: {new Date(report.generatedAt).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </section>

          {/* Executive Summary */}
          <section className="report-section report-executive-summary">
            <h2>Executive Summary</h2>
            <div className="summary-stats">
              <div className="stat-card">
                <div className="stat-number">{report.executiveSummary.modulesCompleted}</div>
                <div className="stat-label">Modules Completed</div>
              </div>
              <div className="stat-card stat-positive">
                <div className="stat-number">{report.executiveSummary.strengthsCount}</div>
                <div className="stat-label">Strengths Identified</div>
              </div>
              <div className="stat-card stat-action">
                <div className="stat-number">{report.executiveSummary.actionsCount}</div>
                <div className="stat-label">Priority Actions</div>
              </div>
              <div className="stat-card stat-explore">
                <div className="stat-number">{report.executiveSummary.areasToExploreCount}</div>
                <div className="stat-label">Areas to Explore</div>
              </div>
            </div>
            <div className="completion-progress">
              <div className="progress-label">
                Overall Completion: {report.executiveSummary.completionPercentage}%
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${report.executiveSummary.completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Report Context Info */}
            {report.reportContext && report.reportContext.filterType !== 'all' && (
              <div className="report-context-info">
                <span className="context-label">Report filtered by:</span>
                <span className="context-value">
                  {report.reportContext.filterType === 'context'
                    ? report.reportContext.contextName
                    : 'Custom selection'}
                </span>
                <span className="context-modules">
                  ({report.reportContext.modulesIncluded} module{report.reportContext.modulesIncluded !== 1 ? 's' : ''} included)
                </span>
              </div>
            )}
          </section>

          {/* Progress Comparison Section */}
          {report.progressComparison && report.progressComparison.enabled && (
            <section className="report-section report-progress-comparison">
              <h2>Progress Comparison</h2>
              <p className="section-intro">
                Changes compared to previous assessments:
              </p>

              {/* Overall Summary */}
              <div className={`comparison-overall-summary trend-${report.progressComparison.overallSummary.overallTrend}`}>
                <div className="trend-icon">
                  {report.progressComparison.overallSummary.overallTrend === 'improving' && '↑'}
                  {report.progressComparison.overallSummary.overallTrend === 'declining' && '↓'}
                  {report.progressComparison.overallSummary.overallTrend === 'stable' && '→'}
                  {report.progressComparison.overallSummary.overallTrend === 'mixed' && '↔'}
                </div>
                <div className="trend-details">
                  <div className="trend-label">
                    {report.progressComparison.overallSummary.overallTrend === 'improving' && 'Overall Improving'}
                    {report.progressComparison.overallSummary.overallTrend === 'declining' && 'Attention Needed'}
                    {report.progressComparison.overallSummary.overallTrend === 'stable' && 'Stable'}
                    {report.progressComparison.overallSummary.overallTrend === 'mixed' && 'Mixed Results'}
                  </div>
                  <div className="trend-stats">
                    <span className="stat-improving">{report.progressComparison.overallSummary.totalImprovements} improvements</span>
                    <span className="stat-declining">{report.progressComparison.overallSummary.totalRegressions} areas needing attention</span>
                  </div>
                </div>
              </div>

              {/* Module-by-module comparison */}
              <div className="comparison-modules-list">
                {report.progressComparison.comparisons.map((comparison, index) => (
                  <div key={index} className={`comparison-module-card trend-${comparison.trend}`}>
                    <div className="comparison-module-header">
                      <h4>{comparison.moduleName}</h4>
                      <span className={`trend-badge trend-${comparison.trend}`}>
                        {comparison.trend === 'improving' && '↑ Improving'}
                        {comparison.trend === 'declining' && '↓ Attention'}
                        {comparison.trend === 'stable' && '→ Stable'}
                        {comparison.trend === 'mixed' && '↔ Mixed'}
                      </span>
                    </div>
                    <div className="comparison-module-runs">
                      <div className="run-info previous">
                        <span className="run-label">Previous:</span>
                        <span className="run-name">{comparison.previousRun.contextName}</span>
                        {comparison.previousRun.completedAt && (
                          <span className="run-date">
                            ({new Date(comparison.previousRun.completedAt).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })})
                          </span>
                        )}
                      </div>
                      <div className="run-arrow">→</div>
                      <div className="run-info current">
                        <span className="run-label">Current:</span>
                        <span className="run-name">{comparison.currentRun.contextName}</span>
                        {comparison.currentRun.completedAt && (
                          <span className="run-date">
                            ({new Date(comparison.currentRun.completedAt).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="comparison-module-stats">
                      <span className="stat stat-improvements">{comparison.improvements} improved</span>
                      <span className="stat stat-unchanged">{comparison.unchanged} unchanged</span>
                      <span className="stat stat-regressions">{comparison.regressions} need attention</span>
                      {comparison.scoreChange !== 0 && (
                        <span className={`stat stat-score ${comparison.scoreChange > 0 ? 'positive' : 'negative'}`}>
                          {comparison.scoreChange > 0 ? '+' : ''}{comparison.scoreChange}% change
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Module Completion Evidence */}
          {report.moduleEvidence && report.moduleEvidence.length > 0 && (
            <section className="report-section report-module-evidence">
              <h2>Modules Reviewed</h2>
              <p className="section-intro">
                Evidence of completed self-review modules and who completed them:
              </p>
              <div className="module-evidence-list">
                {report.moduleEvidence.map((evidence, index) => (
                  <div key={index} className="module-evidence-card">
                    <div className="module-evidence-header">
                      <div className="module-evidence-name">
                        <span className="module-code">{evidence.moduleCode}</span>
                        <span className="module-name">{evidence.moduleName}</span>
                      </div>
                      {evidence.confidenceSnapshot && (
                        <span className={`confidence-badge confidence-${evidence.confidenceSnapshot}`}>
                          {evidence.confidenceSnapshot === 'strong' ? 'Strong' :
                           evidence.confidenceSnapshot === 'mixed' ? 'Mixed' : 'Needs Work'}
                        </span>
                      )}
                    </div>
                    <div className="module-evidence-meta">
                      {evidence.completedAt && (
                        <div className="evidence-item">
                          <span className="evidence-label">Completed:</span>
                          <span className="evidence-value">
                            {new Date(evidence.completedAt).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                      {evidence.completedBy && (
                        <div className="evidence-item">
                          <span className="evidence-label">By:</span>
                          <span className="evidence-value">
                            {evidence.completedBy}
                            {evidence.completedByRole && ` (${evidence.completedByRole})`}
                          </span>
                        </div>
                      )}
                      {evidence.assignedTo && (
                        <div className="evidence-item">
                          <span className="evidence-label">Assigned to:</span>
                          <span className="evidence-value">{evidence.assignedTo}</span>
                        </div>
                      )}
                    </div>
                    <div className="module-evidence-stats">
                      <span className="stat-positive">{evidence.strengthsCount} strengths</span>
                      <span className="stat-action">{evidence.actionsCount} actions</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* URL Analysis Results */}
          {report.urlAnalysisResults && report.urlAnalysisResults.length > 0 && (
            <section className="report-section report-url-analysis">
              <h2>Website Accessibility Analysis</h2>
              <p className="section-intro">
                Analysis of your online accessibility information:
              </p>
              {report.urlAnalysisResults.map((analysis, index) => (
                <div key={index} className="url-analysis-card">
                  <div className="url-analysis-header">
                    <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="url-link">
                      {analysis.url}
                    </a>
                    <div className="url-analysis-score">
                      <span className={`score-badge score-${analysis.overallStatus}`}>
                        {analysis.overallScore}/100
                      </span>
                      <span className="score-status">
                        {analysis.overallStatus === 'excellent' ? 'Excellent' :
                         analysis.overallStatus === 'good' ? 'Good' :
                         analysis.overallStatus === 'needs-improvement' ? 'Needs Improvement' : 'Missing'}
                      </span>
                    </div>
                  </div>
                  <p className="url-analysis-summary">{analysis.summary}</p>
                  {analysis.strengths.length > 0 && (
                    <div className="url-analysis-strengths">
                      <h4>Strengths</h4>
                      <ul>
                        {analysis.strengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.improvements.length > 0 && (
                    <div className="url-analysis-improvements">
                      <h4>Areas for Improvement</h4>
                      <ul>
                        {analysis.improvements.map((improvement, idx) => (
                          <li key={idx}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Media Analysis Results */}
          {report.mediaAnalysisResults && report.mediaAnalysisResults.length > 0 && (
            <section className="report-section report-media-analysis">
              <h2>Media Analysis Results</h2>
              <p className="section-intro">
                Accessibility analysis of uploaded materials and media:
              </p>
              {report.mediaAnalysisResults.map((analysis, index) => (
                <div key={index} className="media-analysis-card">
                  <div className="media-analysis-header">
                    <div className="media-analysis-type">
                      <span className="analysis-type-badge">
                        {formatAnalysisType(analysis.analysisType)}
                      </span>
                      {analysis.fileName && (
                        <span className="analysis-filename">{analysis.fileName}</span>
                      )}
                      {analysis.url && !analysis.fileName && (
                        <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="analysis-url">
                          {analysis.url}
                        </a>
                      )}
                    </div>
                    <div className="media-analysis-score">
                      <span className={`score-badge score-${analysis.overallStatus}`}>
                        {analysis.overallScore}/100
                      </span>
                      <span className="score-status">
                        {formatStatus(analysis.overallStatus)}
                      </span>
                    </div>
                  </div>

                  {analysis.thumbnailDataUrl && (
                    <div className="media-analysis-thumbnail">
                      <img src={analysis.thumbnailDataUrl} alt="Analysed media thumbnail" />
                    </div>
                  )}

                  <p className="media-analysis-summary">{analysis.summary}</p>

                  {analysis.standardsAssessed.length > 0 && (
                    <div className="media-analysis-standards">
                      <span className="standards-label">Standards:</span>
                      {analysis.standardsAssessed.map((standard, idx) => (
                        <span key={idx} className="standard-badge">{standard}</span>
                      ))}
                    </div>
                  )}

                  {analysis.strengths.length > 0 && (
                    <div className="media-analysis-strengths">
                      <h4>Strengths</h4>
                      <ul>
                        {analysis.strengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.quickWins.length > 0 && (
                    <div className="media-analysis-quickwins">
                      <h4>Quick Wins</h4>
                      <ul>
                        {analysis.quickWins.map((win, idx) => (
                          <li key={idx}>{win}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.improvements.length > 0 && (
                    <div className="media-analysis-improvements">
                      <h4>Areas for Improvement</h4>
                      <ul>
                        {analysis.improvements.map((improvement, idx) => (
                          <li key={idx}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.needsProfessionalReview && (
                    <div className="media-analysis-professional">
                      <strong>Professional Review Recommended:</strong>
                      <p>{analysis.professionalReviewReason}</p>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* User Notes */}
          {report.questionNotes && report.questionNotes.length > 0 && (
            <section className="report-section report-notes">
              <h2>Your Notes & Observations</h2>
              <p className="section-intro">
                Notes recorded during your self-review:
              </p>
              <div className="notes-list">
                {report.questionNotes.map((note, index) => (
                  <div key={index} className="note-card">
                    <div className="note-header">
                      <span className="note-module">{note.moduleName}</span>
                      {note.answer && (
                        <span className={`note-answer answer-${note.answer}`}>
                          {RESPONSE_LABELS[note.answer as keyof typeof RESPONSE_LABELS] || note.answer}
                        </span>
                      )}
                    </div>
                    <div className="note-question">{note.questionText}</div>
                    <div className="note-content">{note.notes}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Evidence Photos & Documents */}
          {report.questionEvidence && report.questionEvidence.length > 0 && (
            <section className="report-section report-evidence">
              <h2>Supporting Evidence</h2>
              <p className="section-intro">
                Photos and documents uploaded during your self-review:
              </p>
              <div className="evidence-grid">
                {report.questionEvidence.map((evidence, index) => (
                  <div key={index} className="evidence-card">
                    <div className="evidence-header">
                      <span className="evidence-type-badge">
                        {evidence.evidenceType === 'photo' ? '📷' :
                         evidence.evidenceType === 'document' ? '📄' : '🔗'}
                        {evidence.evidenceType}
                      </span>
                      <span className="evidence-module">{evidence.moduleName}</span>
                    </div>
                    {evidence.evidenceType === 'photo' && evidence.dataUrl && (
                      <div className="evidence-image">
                        <img src={evidence.dataUrl} alt={evidence.fileName} />
                      </div>
                    )}
                    <div className="evidence-filename">{evidence.fileName}</div>
                    <div className="evidence-question">{evidence.questionText}</div>
                    {evidence.description && (
                      <div className="evidence-description">{evidence.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* What's Going Well */}
          {report.sections.strengths.content.length > 0 && (
            <section className="report-section">
              <h2>{report.sections.strengths.title}</h2>
              <ul className="report-list report-list-positive">
                {(report.sections.strengths.content as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Priority Actions */}
          {report.sections.priorityActions.content.length > 0 && (
            <section className="report-section">
              <h2>{report.sections.priorityActions.title}</h2>
              <ul className="report-list report-list-actions">
                {(report.sections.priorityActions.content as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Quick Wins */}
          {report.quickWins.length > 0 && (
            <section className="report-section">
              <h2>Quick Wins</h2>
              <p className="section-intro">
                These actions offer significant accessibility improvements with minimal effort:
              </p>
              <div className="quick-wins-grid">
                {report.quickWins.map((win, index) => (
                  <div key={index} className="quick-win-card">
                    <div className="quick-win-header">
                      <h3>{win.title}</h3>
                      <div className="quick-win-badges">
                        <span className={`badge-effort ${win.effort}`}>
                          {win.effort} effort
                        </span>
                        <span className={`badge-impact ${win.impact}`}>
                          {win.impact} impact
                        </span>
                      </div>
                    </div>
                    <p>{win.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Areas to Explore */}
          {report.sections.areasToExplore.content.length > 0 && (
            <section className="report-section">
              <h2>{report.sections.areasToExplore.title}</h2>
              <ul className="report-list report-list-explore">
                {(report.sections.areasToExplore.content as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Professional Review */}
          {report.sections.professionalReview.content.length > 0 && (
            <section className="report-section">
              <h2>{report.sections.professionalReview.title}</h2>
              <ul className="report-list report-list-professional">
                {(report.sections.professionalReview.content as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Detailed Findings (Deep Dive Only) */}
          {!isPulseCheck && report.detailedFindings && report.detailedFindings.length > 0 && (
            <section className="report-section report-detailed-findings">
              <h2>Detailed Findings</h2>
              {report.detailedFindings.map((finding, index) => (
                <div key={index} className="finding-module">
                  <h3>{finding.moduleName}</h3>
                  {finding.issues.map((issue, issueIndex) => (
                    <div key={issueIndex} className="finding-issue">
                      <div className="issue-header">
                        <h4>{issue.questionText}</h4>
                        <span className={`priority-badge priority-${issue.priority}`}>
                          {issue.priority} priority
                        </span>
                      </div>
                      <div className="issue-reasoning">
                        <strong>Reasoning:</strong> {issue.reasoning}
                      </div>
                      <div className="issue-actions">
                        <strong>Recommended Actions:</strong>
                        <ul>
                          {issue.recommendedActions.map((action, actionIndex) => (
                            <li key={actionIndex}>{action}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="issue-resources">
                        <strong>Resources:</strong>
                        <ul>
                          {issue.resourceLinks.map((link, linkIndex) => {
                            // Parse resource links in format "Label → /path"
                            const parts = link.split(' → ');
                            if (parts.length === 2 && parts[1].startsWith('/')) {
                              return (
                                <li key={linkIndex}>
                                  <a href={parts[1]} className="resource-link">
                                    {parts[0]}
                                  </a>
                                </li>
                              );
                            }
                            return <li key={linkIndex}>{link}</li>;
                          })}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          )}

          {/* Suggested Next Steps */}
          <section className="report-section report-next-steps">
            <h2>Suggested Next Steps</h2>

            <div className="next-steps-container">
              <div className="next-steps-column">
                <h3>Things you can explore now</h3>
                <ul className="next-steps-list">
                  {report.nextSteps.exploreNow.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>

              <div className="next-steps-column">
                <h3>Things to plan for later</h3>
                <ul className="next-steps-list">
                  {report.nextSteps.planForLater.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Professional Support Section */}
          <section className="report-section report-professional-support">
            <h2>When Professional Support May Help</h2>
            <p className="section-intro">
              Based on your self-review, you may benefit from professional advice if:
            </p>

            <ul className="professional-support-list">
              {report.professionalSupport.indicators
                .filter(indicator => indicator.detected)
                .map((indicator, index) => (
                  <li key={index}>
                    <strong>{indicator.category}:</strong> {indicator.reason}
                  </li>
                ))}
            </ul>

            {report.professionalSupport.recommended && (
              <div className="support-recommendation">
                <p>
                  <strong>Based on your responses, we recommend considering professional support.</strong>
                </p>
              </div>
            )}

            <div className="support-disclaimer">
              <p>
                This self-review is designed to support learning and planning. Seeking professional
                advice doesn't mean you've failed — it's a normal next step for many organisations.
              </p>
              <p className="support-link">
                <strong>Learn about professional support</strong> (Coming soon)
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="report-section report-disclaimer">
            <h2>Important Disclaimer</h2>
            <p>
              This guidance is for information only. It is not legal advice, a compliance
              certificate, or a substitute for professional accessibility auditing. Actions are
              suggestions based on your responses.
            </p>
            <p>
              This review is indicative only and based on self-reported information. It does not
              verify accuracy or confirm compliance with accessibility standards or legal
              requirements.
            </p>
          </section>

          {/* Footer */}
          <footer className="report-footer">
            <div className="report-branding">
              <strong>Access Compass</strong> by Flare Access
            </div>
            <div className="report-generated">
              Generated {new Date(report.generatedAt).toLocaleDateString('en-AU')}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
