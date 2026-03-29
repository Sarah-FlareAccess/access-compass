import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReportProblem, ReportProblemTrigger } from './ReportProblem';
import './PageFooter.css';

interface PageFooterProps {
  showDivider?: boolean;
}

export function PageFooter({ showDivider = true }: PageFooterProps) {
  const [showReportProblem, setShowReportProblem] = useState(false);

  return (
    <>
      <footer className={`page-footer ${showDivider ? 'with-divider' : ''}`}>
        <div className="page-footer-brand">
          <img src="/images/access-compass-logo.png" alt="" className="page-footer-logo" />
          <span className="page-footer-text">
            Access Compass <span className="page-footer-byline">by Flare Access</span>
          </span>
        </div>
        <div className="page-footer-links">
          <Link to="/accessibility" className="page-footer-link">
            Accessibility
          </Link>
          <span className="page-footer-divider"></span>
          <ReportProblemTrigger
            variant="footer"
            onClick={() => setShowReportProblem(true)}
          />
          <span className="page-footer-divider"></span>
          <a href="mailto:support@accesscompass.com.au" className="page-footer-help-link">
            Need help?
          </a>
        </div>
      </footer>

      <ReportProblem
        isOpen={showReportProblem}
        onClose={() => setShowReportProblem(false)}
      />
    </>
  );
}
