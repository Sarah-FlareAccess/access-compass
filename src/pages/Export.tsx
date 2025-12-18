import { Link, useNavigate } from 'react-router-dom';
import { getSession, clearSession, getDiscoveryData } from '../utils/session';
import { useState, useEffect, useMemo } from 'react';
import { useReportGeneration } from '../hooks/useReportGeneration';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { ReportViewer } from '../components/ReportViewer';
import { downloadPDFReport } from '../utils/pdfGenerator';
import type { ReviewMode } from '../types/index';
import type { Report } from '../hooks';

export default function Export() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [discoveryData, setDiscoveryData] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [, setIsLoading] = useState(true);

  // Report options
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includePhotos, setIncludePhotos] = useState(true);

  // Load session and discovery data
  useEffect(() => {
    try {
      const currentSession = getSession();
      const currentDiscovery = getDiscoveryData();

      if (!currentSession || !currentSession.session_id) {
        navigate('/');
        return;
      }

      setSession(currentSession);
      setDiscoveryData(currentDiscovery);
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Get selected modules
  const selectedModuleIds: string[] = useMemo(() => {
    if (discoveryData?.recommended_modules?.length > 0) {
      return discoveryData.recommended_modules;
    }
    if (session?.selected_modules?.length > 0) {
      return session.selected_modules;
    }
    return [];
  }, [discoveryData, session]);

  // Get review mode
  const reviewMode: ReviewMode = discoveryData?.review_mode || 'pulse-check';
  const isPulseCheck = reviewMode === 'pulse-check';

  // Initialize report generation
  const { generateReport, isReady } = useReportGeneration(selectedModuleIds);
  const { progress } = useModuleProgress(selectedModuleIds);

  // Check if user has completed any modules
  const hasCompletedModules = useMemo(() => {
    return Object.values(progress).some(p => p.status === 'completed');
  }, [progress]);

  const organisationName = session?.business_snapshot?.organisation_name || 'Your Organisation';

  const handleViewReport = () => {
    if (!isReady) return;
    const report = generateReport(reviewMode, organisationName);

    // Apply filters based on options
    const filteredReport = {
      ...report,
      questionNotes: includeNotes ? report.questionNotes : [],
      questionEvidence: includePhotos ? report.questionEvidence : [],
    };

    setCurrentReport(filteredReport);
    setShowReport(true);
  };

  const handleDownloadPDF = () => {
    if (!currentReport) return;
    downloadPDFReport(currentReport);
  };

  const handleStartAgain = () => {
    if (window.confirm('This will clear your current session and start fresh. Continue?')) {
      clearSession();
      navigate('/');
    }
  };

  if (!session) {
    return (
      <div className="export-page">
        <div className="container">
          <div className="loading-state">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="export-page">
        <div className="export-container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1>Your Accessibility Report</h1>
            <p className="helper-text">
              {isPulseCheck
                ? 'Download and share your 1-page summary with your team'
                : 'Download and share your detailed report with stakeholders'}
            </p>
          </div>

          {!hasCompletedModules && (
            <div
              className="card"
              style={{
                border: '2px solid var(--warm-orange)',
                background: 'rgba(230, 119, 0, 0.05)',
                marginBottom: '30px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📋</div>
              <h3>No modules completed yet</h3>
              <p style={{ color: 'var(--steel-gray)', margin: '12px 0' }}>
                Complete at least one module to generate your accessibility report.
              </p>
              <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '12px' }}>
                Go to Dashboard
              </Link>
            </div>
          )}

          {/* Report Options */}
          {hasCompletedModules && (
            <div className="card" style={{ marginBottom: '30px' }}>
              <h2 style={{ marginBottom: '16px' }}>Report Options</h2>
              <p style={{ color: 'var(--steel-gray)', marginBottom: '20px' }}>
                Choose what to include in your report:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeNotes}
                    onChange={(e) => setIncludeNotes(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '2px' }}>Include your notes</strong>
                    <span style={{ fontSize: '14px', color: 'var(--steel-gray)' }}>
                      Notes and observations you recorded during the self-review
                    </span>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includePhotos}
                    onChange={(e) => setIncludePhotos(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '2px' }}>Include photos and documents</strong>
                    <span style={{ fontSize: '14px', color: 'var(--steel-gray)' }}>
                      Evidence photos and documents you uploaded as supporting evidence
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {hasCompletedModules && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
              {/* View in App */}
              <div className="card">
                <div style={{ fontSize: '3rem', marginBottom: '20px', textAlign: 'center' }}>👀</div>
                <h2>View Report in App</h2>
                <p style={{ color: 'var(--steel-gray)', marginBottom: '20px' }}>
                  {isPulseCheck
                    ? 'Read your 1-page pulse check summary directly in the app before downloading'
                    : 'Review your detailed deep-dive report with findings, priorities, and resources'}
                </p>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Report Type:</strong> {isPulseCheck ? 'Pulse Check Summary' : 'Deep Dive Report'}
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <strong>Content:</strong> {isPulseCheck ? '~1 page' : '8-12 pages'}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleViewReport}
                  disabled={!isReady}
                >
                  View Report
                </button>
              </div>

              {/* Download PDF */}
              <div className="card">
                <div style={{ fontSize: '3rem', marginBottom: '20px', textAlign: 'center' }}>📄</div>
                <h2>Download PDF</h2>
                <p style={{ color: 'var(--steel-gray)', marginBottom: '20px' }}>
                  {isPulseCheck
                    ? 'Download a 1-page PDF summary—perfect for team briefings and quick sharing'
                    : 'Download a comprehensive PDF report with detailed findings, action steps, and resource links'}
                </p>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Format:</strong> PDF
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <strong>Size:</strong> {isPulseCheck ? '~200 KB' : '~600 KB'}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const report = generateReport(reviewMode, organisationName);
                    const filteredReport = {
                      ...report,
                      questionNotes: includeNotes ? report.questionNotes : [],
                      questionEvidence: includePhotos ? report.questionEvidence : [],
                    };
                    setCurrentReport(filteredReport);
                    setTimeout(() => handleDownloadPDF(), 100);
                  }}
                  disabled={!isReady}
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}

          {/* Report Content Preview */}
          {hasCompletedModules && (
            <div className="card" style={{ marginBottom: '40px' }}>
              <h2>What's included in your report</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#22c55e' }}>✓ What's going well</h3>
                  <p style={{ fontSize: '14px', color: 'var(--steel-gray)', margin: 0 }}>
                    Strengths and positive accessibility features you already have in place
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#ef4444' }}>⚡ Priority actions</h3>
                  <p style={{ fontSize: '14px', color: 'var(--steel-gray)', margin: 0 }}>
                    High-impact improvements with timeframes and priorities
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#fbbf24' }}>🔍 Areas to explore</h3>
                  <p style={{ fontSize: '14px', color: 'var(--steel-gray)', margin: 0 }}>
                    Opportunities to clarify and potentially improve accessibility
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#7c3aed' }}>📋 Suggested next steps</h3>
                  <p style={{ fontSize: '14px', color: 'var(--steel-gray)', margin: 0 }}>
                    Practical guidance on what to do now and what to plan for later
                  </p>
                </div>
                {!isPulseCheck && (
                  <>
                    <div>
                      <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#3b82f6' }}>🔬 Detailed findings</h3>
                      <p style={{ fontSize: '14px', color: 'var(--steel-gray)', margin: 0 }}>
                        In-depth analysis of issues with reasoning and recommended actions
                      </p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#8b5cf6' }}>🔗 Resource links</h3>
                      <p style={{ fontSize: '14px', color: 'var(--steel-gray)', margin: 0 }}>
                        Direct links to relevant resources and guidance (coming soon)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Suggested Next Steps */}
          {hasCompletedModules && (
            <div className="card" style={{ marginBottom: '40px' }}>
              <h2>Suggested Next Steps</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#1a1a2e' }}>Things you can explore now</h3>
                  <ul style={{ paddingLeft: '20px', margin: 0, lineHeight: '1.8' }}>
                    <li>Review areas marked as opportunities to improve</li>
                    <li>Clarify any "Not sure" responses with your team</li>
                    <li>Identify quick wins that require minimal effort</li>
                    <li>Share this report with relevant stakeholders</li>
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#1a1a2e' }}>Things to plan for later</h3>
                  <ul style={{ paddingLeft: '20px', margin: 0, lineHeight: '1.8' }}>
                    <li>Schedule improvements that need budget or time</li>
                    <li>Complete any modules you haven't reviewed yet</li>
                    <li>Consider a more detailed review if needed</li>
                    <li>Set review dates to track progress</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* When Professional Support May Help */}
          {hasCompletedModules && (
            <div
              className="card"
              style={{
                border: '2px solid #7c3aed',
                background: 'rgba(124, 58, 237, 0.03)',
                marginBottom: '40px',
              }}
            >
              <h2>When professional support may help</h2>
              <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
                Based on your self-review, you may benefit from professional advice if:
              </p>
              <ul style={{ paddingLeft: '20px', margin: '0 0 20px 0', lineHeight: '1.8' }}>
                <li>You've identified structural barriers that are hard to change</li>
                <li>You're unsure how different access elements work together</li>
                <li>You're planning significant changes or improvements</li>
                <li>You need confidence explaining decisions to management, council, or stakeholders</li>
                <li>You've received accessibility-related feedback or complaints</li>
              </ul>
              <p style={{ margin: '16px 0 0 0', lineHeight: '1.6', fontStyle: 'italic' }}>
                This self-review is designed to support learning and planning. Seeking professional
                advice doesn't mean you've failed — it's a normal next step for many organisations.
              </p>
              <div style={{ marginTop: '20px' }}>
                <a href="#" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>
                  Learn about professional support →
                </a>
                <span style={{ color: 'var(--steel-gray)', marginLeft: '12px', fontSize: '14px' }}>
                  (Coming soon)
                </span>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div
            className="card"
            style={{
              border: '2px solid var(--warm-orange)',
              background: 'rgba(230, 119, 0, 0.05)',
              marginBottom: '40px',
            }}
          >
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.5rem' }}>ℹ️</div>
              <div>
                <strong style={{ display: 'block', marginBottom: '10px' }}>Important disclaimer</strong>
                <p style={{ margin: '0 0 10px 0' }}>
                  This guidance is for information only. It is not legal advice, a compliance
                  certificate, or a substitute for professional accessibility auditing. Actions are
                  suggestions based on your responses.
                </p>
                <p style={{ margin: 0 }}>
                  This review is indicative only and based on self-reported information. It does not
                  verify accuracy or confirm compliance with accessibility standards or legal requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              ← Back to dashboard
            </Link>
            <button className="btn btn-secondary" onClick={handleStartAgain}>
              Start again
            </button>
          </div>
        </div>
      </div>

      {/* Report Viewer Modal */}
      {showReport && currentReport && (
        <ReportViewer
          report={currentReport}
          onClose={() => setShowReport(false)}
          onDownload={handleDownloadPDF}
        />
      )}
    </>
  );
}
