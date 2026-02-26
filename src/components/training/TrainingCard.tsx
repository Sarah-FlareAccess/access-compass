import type { TrainingCourse, TrainingResource, TrainingAccessTier } from '../../data/training/types';
import { getCategoryConfig } from '../../data/training/index';
import './TrainingCard.css';

interface TrainingCardProps {
  item: TrainingCourse | TrainingResource;
  onClick: () => void;
  completionPercentage?: number;
}

function AccessBadge({ tier }: { tier: TrainingAccessTier }) {
  if (tier === 'free') {
    return <span className="training-access-badge badge-free">Free</span>;
  }
  if (tier === 'included') {
    return <span className="training-access-badge badge-included">Deep Dive</span>;
  }
  return <span className="training-access-badge badge-premium">Premium</span>;
}

function isCourse(item: TrainingCourse | TrainingResource): item is TrainingCourse {
  return 'lessons' in item;
}

export function TrainingCard({ item, onClick, completionPercentage }: TrainingCardProps) {
  const categoryConfig = getCategoryConfig(item.category);
  const course = isCourse(item);

  return (
    <button
      className={`training-card${item.featured ? ' training-card-featured' : ''}`}
      onClick={onClick}
      style={{ '--category-color': categoryConfig?.color ?? '#6b7280' } as React.CSSProperties}
    >
      <div className="training-card-header">
        <span className="training-card-category">{categoryConfig?.label ?? item.category}</span>
        <AccessBadge tier={item.accessTier} />
      </div>

      <h3 className="training-card-title">{item.title}</h3>
      {('subtitle' in item && item.subtitle) && (
        <p className="training-card-subtitle">{item.subtitle}</p>
      )}
      <p className="training-card-description">{item.description}</p>

      <div className="training-card-meta">
        {course && (
          <>
            <span className="training-card-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              {(item as TrainingCourse).lessons.length} lessons
            </span>
            <span className="training-card-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {(item as TrainingCourse).totalEstimatedMinutes} min
            </span>
            <span className="training-card-meta-item training-card-skill">
              {(item as TrainingCourse).skillLevel}
            </span>
          </>
        )}
        {!course && 'estimatedMinutes' in item && item.estimatedMinutes && (
          <span className="training-card-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {item.estimatedMinutes} min
          </span>
        )}
        {!course && 'contentType' in item && (
          <span className="training-card-meta-item training-card-type">
            {(item as TrainingResource).contentType}
          </span>
        )}
      </div>

      {completionPercentage !== undefined && completionPercentage > 0 && (
        <div className="training-card-progress">
          <div
            className="training-card-progress-bar"
            role="progressbar"
            aria-valuenow={completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Course ${completionPercentage}% complete`}
          >
            <div
              className="training-card-progress-fill"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="training-card-progress-text">{completionPercentage}%</span>
        </div>
      )}

      <div className="training-card-arrow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </button>
  );
}
