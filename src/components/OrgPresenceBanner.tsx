/**
 * Org Presence Banner
 *
 * Shows a subtle banner when other organisation members are currently
 * using the app. Helps teams coordinate and avoid duplicate work.
 */

import { useState } from 'react';
import './OrgPresenceBanner.css';

interface ActiveMember {
  userId: string;
  email: string;
  deviceLabel: string;
  lastSeenAt: string;
}

interface OrgPresenceBannerProps {
  members: ActiveMember[];
}

export function OrgPresenceBanner({ members }: OrgPresenceBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || members.length === 0) return null;

  const count = members.length;
  const label = count === 1
    ? 'Another team member is currently using Access Compass.'
    : `${count} other team members are currently using Access Compass.`;

  return (
    <div className="org-presence-banner" role="status" aria-live="polite">
      <div className="org-presence-main">
        <span className="org-presence-dot" aria-hidden="true" />
        <span className="org-presence-text">
          {label} If you are both editing the same items, the most recent save will be kept.
        </span>
      </div>
      <button
        className="org-presence-dismiss"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}
