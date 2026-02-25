import { useState } from 'react';
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
        <span className="page-footer-text">
          Access Compass by Flare Access
        </span>
        <span className="page-footer-divider"></span>
        <ReportProblemTrigger
          variant="footer"
          onClick={() => setShowReportProblem(true)}
        />
        <span className="page-footer-divider"></span>
        <a href="mailto:support@accesscompass.com.au" className="page-footer-help-link">
          Need help?
        </a>
      </footer>

      <ReportProblem
        isOpen={showReportProblem}
        onClose={() => setShowReportProblem(false)}
      />
    </>
  );
}
