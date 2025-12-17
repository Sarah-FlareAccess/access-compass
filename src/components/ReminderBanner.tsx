/**
 * ReminderBanner Component
 *
 * Displays contextual reminders throughout the checklist experience
 * to reinforce that this is a self-review tool, not a certification.
 */

import './ReminderBanner.css';

export type ReminderType = 'info' | 'guidance' | 'professional';

interface ReminderBannerProps {
  type?: ReminderType;
  message?: string;
  showIcon?: boolean;
  compact?: boolean;
}

const defaultMessages: Record<ReminderType, string> = {
  info: 'Remember: This is a self-review tool to help you identify and prioritise accessibility improvements.',
  guidance: 'Your answers help create a starting point for improvement—professional verification may be needed for complex issues.',
  professional: 'For compliance verification or complex accessibility requirements, consider engaging a qualified access consultant.',
};

const icons: Record<ReminderType, string> = {
  info: 'ℹ️',
  guidance: '💡',
  professional: '👤',
};

export default function ReminderBanner({
  type = 'info',
  message,
  showIcon = true,
  compact = false,
}: ReminderBannerProps) {
  const displayMessage = message || defaultMessages[type];

  return (
    <div className={`reminder-banner reminder-${type} ${compact ? 'compact' : ''}`}>
      {showIcon && <span className="reminder-icon">{icons[type]}</span>}
      <p className="reminder-text">{displayMessage}</p>
    </div>
  );
}
