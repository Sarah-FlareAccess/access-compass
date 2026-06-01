import { Link } from 'react-router-dom';
import type { TrainingCourse } from '../../data/training/types';
import { useCourseProgress } from '../../hooks/useCourseProgress';
import './CourseProgressTracker.css';

interface Props {
  course: TrainingCourse;
  currentLessonId: string;
}

export function CourseProgressTracker({ course, currentLessonId }: Props) {
  const progress = useCourseProgress(course);
  const overallPct = progress.totalSteps
    ? Math.round((progress.completedSteps / progress.totalSteps) * 100)
    : 0;

  return (
    <nav aria-label="Course progress" className="course-progress-tracker">
      <div className="course-progress-summary">
        <span className="course-progress-summary-headline">
          Course progress
        </span>
        <span className="course-progress-summary-counts">
          <strong>{progress.completedSteps}</strong> of {progress.totalSteps} steps
          {' '}({overallPct}%)
        </span>
      </div>
      <ol className="course-progress-segments">
        {progress.lessons.map((l) => {
          const pct = l.totalSteps
            ? Math.min(100, Math.round((l.completedSteps / l.totalSteps) * 100))
            : 0;
          const isCurrent = l.lessonId === currentLessonId;
          const isDone = l.totalSteps > 0 && l.completedSteps >= l.totalSteps;
          const statusClass = isCurrent
            ? ' is-current'
            : isDone
              ? ' is-done'
              : pct > 0
                ? ' is-partial'
                : '';
          return (
            <li key={l.lessonId} className={`course-progress-segment${statusClass}`}>
              <Link
                to={`/training/course/${course.slug}/lesson/${l.lessonId}`}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Lesson ${l.order}: ${l.title}. ${l.completedSteps} of ${l.totalSteps} steps done.${isCurrent ? ' Current lesson.' : ''}`}
              >
                <span className="segment-bar" aria-hidden="true">
                  <span
                    className="segment-fill"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="segment-meta">
                  <span className="segment-label">Lesson {l.order}</span>
                  <span className="segment-progress">
                    {l.completedSteps}/{l.totalSteps}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
