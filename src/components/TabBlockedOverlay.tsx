/**
 * Tab Blocked Overlay
 *
 * Shown when the app is already open in another browser tab.
 * Prevents data conflicts from simultaneous tab usage.
 */

import './TabBlockedOverlay.css';

interface TabBlockedOverlayProps {
  onForceOpen: () => void;
}

export function TabBlockedOverlay({ onForceOpen }: TabBlockedOverlayProps) {
  return (
    <div className="tab-blocked-overlay" role="alertdialog" aria-modal="true" aria-labelledby="tab-blocked-title" aria-describedby="tab-blocked-desc">
      <div className="tab-blocked-card">
        <div className="tab-blocked-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <rect x="6" y="6" width="12" height="8" rx="1" strokeDasharray="3 2" />
          </svg>
        </div>

        <h2 id="tab-blocked-title" className="tab-blocked-title">
          Access Compass is open in another tab
        </h2>

        <p id="tab-blocked-desc" className="tab-blocked-desc">
          To prevent data conflicts, Access Compass can only be used in one browser tab at a time.
          Please switch to the other tab, or close it first.
        </p>

        <button
          className="tab-blocked-btn-primary"
          onClick={onForceOpen}
        >
          Use in this tab instead
        </button>

        <p className="tab-blocked-hint">
          This will close the session in the other tab.
        </p>
      </div>
    </div>
  );
}
