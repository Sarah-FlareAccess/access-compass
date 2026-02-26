import type { TrainingLesson, TrainingAccessTier } from '../../data/training/types';

interface LessonCardProps {
  lesson: TrainingLesson;
  isCompleted: boolean;
  isLocked: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

function LessonAccessBadge({ tier, isPreview, isLocked }: { tier: TrainingAccessTier; isPreview?: boolean; isLocked: boolean }) {
  if (isPreview) {
    return <span className="training-access-badge badge-free">Free Preview</span>;
  }
  if (isLocked && tier === 'premium') {
    return (
      <span className="lesson-lock-icon" aria-label="Locked: requires premium access">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </span>
    );
  }
  return null;
}

export function LessonCard({ lesson, isCompleted, isLocked, isCurrent, onClick }: LessonCardProps) {
  return (
    <li className={`lesson-card${isCurrent ? ' lesson-card-current' : ''}${isLocked ? ' lesson-card-locked' : ''}`}>
      <button
        className="lesson-card-button"
        onClick={onClick}
        disabled={isLocked}
        aria-current={isCurrent ? 'true' : undefined}
      >
        <span className="lesson-card-number" aria-hidden="true">
          {isCompleted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            lesson.order
          )}
        </span>

        <div className="lesson-card-content">
          <span className="lesson-card-title">
            {lesson.title}
            {isCompleted && <span className="sr-only"> (completed)</span>}
          </span>
          <span className="lesson-card-meta">
            {lesson.estimatedMinutes} min
            {lesson.subtitle && <> &middot; {lesson.subtitle}</>}
          </span>
        </div>

        <div className="lesson-card-actions">
          <LessonAccessBadge tier={lesson.accessTier} isPreview={lesson.isPreview} isLocked={isLocked} />
        </div>
      </button>
    </li>
  );
}
