import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseBySlug } from '../data/training/index';
import { LessonCard } from '../components/training/LessonCard';
import { TrainingProgressBar } from '../components/training/TrainingProgressBar';
import { DownloadBlock } from '../components/training/DownloadBlock';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import { canAccessTraining } from '../utils/trainingAccess';
import { PageFooter } from '../components/PageFooter';
import './CourseDetail.css';

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { accessState } = useAuth();

  const course = useMemo(() => getCourseBySlug(slug ?? ''), [slug]);
  usePageTitle(course?.title ?? 'Course');

  const {
    getCourseProgress,
    getCourseCompletionPercentage,
    getLastLesson,
    isLessonCompleted,
    startCourse,
  } = useTrainingProgress();

  if (!course) {
    return (
      <div className="course-detail">
        <div className="course-not-found">
          <h1>Course not found</h1>
          <Link to="/training">Back to Training Hub</Link>
        </div>
      </div>
    );
  }

  const progress = getCourseProgress(course.id);
  const completionPct = getCourseCompletionPercentage(course.id, course.lessons.length);
  const lastLessonId = getLastLesson(course.id);
  const canAccess = canAccessTraining(course.accessTier, accessState.accessLevel);

  const getCtaLabel = () => {
    if (!progress || progress.status === 'not-started') return 'Start Course';
    if (progress.status === 'completed') return 'Review Course';
    return 'Continue Learning';
  };

  const getCtaTarget = (): string => {
    if (lastLessonId) {
      return `/training/course/${course.slug}/lesson/${lastLessonId}`;
    }
    if (course.lessons.length > 0) {
      return `/training/course/${course.slug}/lesson/${course.lessons[0].id}`;
    }
    return `/training/course/${course.slug}`;
  };

  const handleStartOrContinue = () => {
    if (!progress || progress.status === 'not-started') {
      startCourse(course.id);
    }
    navigate(getCtaTarget());
  };

  const handleLessonClick = (lessonId: string) => {
    navigate(`/training/course/${course.slug}/lesson/${lessonId}`);
  };

  const isLessonLocked = (lessonIndex: number, lessonTier: string, isPreview?: boolean): boolean => {
    if (isPreview) return false;
    if (lessonTier === 'free') return false;
    return !canAccess;
  };

  const skillBadgeClass =
    course.skillLevel === 'beginner'
      ? 'skill-beginner'
      : course.skillLevel === 'intermediate'
        ? 'skill-intermediate'
        : 'skill-advanced';

  return (
    <div className="course-detail">
      {/* Back nav */}
      <Link to="/training" className="course-back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Training Hub
      </Link>

      {/* Course header */}
      <div className="course-header">
        <div className="course-header-content">
          <span className={`course-skill-badge ${skillBadgeClass}`}>
            {course.skillLevel}
          </span>
          <h1 className="course-title">{course.title}</h1>
          {course.subtitle && <p className="course-subtitle">{course.subtitle}</p>}
          <p className="course-description">{course.description}</p>

          <div className="course-meta">
            <span className="course-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              {course.lessons.length} lessons
            </span>
            <span className="course-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {course.totalEstimatedMinutes} minutes
            </span>
            {course.author && (
              <span className="course-meta-item">By {course.author}</span>
            )}
          </div>

          {/* CTA */}
          <button className="course-cta-btn" onClick={handleStartOrContinue}>
            {getCtaLabel()}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {progress && progress.status !== 'not-started' && (
        <TrainingProgressBar percentage={completionPct} />
      )}

      {/* Learning outcomes */}
      {course.learningOutcomes.length > 0 && (
        <section className="course-outcomes">
          <h2 className="course-section-heading">What you will learn</h2>
          <ul className="course-outcomes-list">
            {course.learningOutcomes.map((outcome, i) => (
              <li key={i} className="course-outcome-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {outcome}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Prerequisites */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <section className="course-prereqs">
          <h2 className="course-section-heading">Prerequisites</h2>
          <ul className="course-prereqs-list">
            {course.prerequisites.map((prereq, i) => (
              <li key={i}>{prereq}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Course downloads */}
      {course.courseDownloads && course.courseDownloads.length > 0 && (
        <section className="course-downloads">
          <h2 className="course-section-heading">Course Materials</h2>
          <div className="course-downloads-list">
            {course.courseDownloads.map((dl, i) => (
              <DownloadBlock key={i} download={dl} />
            ))}
          </div>
        </section>
      )}

      {/* Lesson list */}
      <section className="course-lessons">
        <h2 className="course-section-heading">Lessons</h2>
        <ol className="course-lessons-list">
          {course.lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isCompleted={isLessonCompleted(course.id, lesson.id)}
              isLocked={isLessonLocked(index, lesson.accessTier, lesson.isPreview)}
              isCurrent={lastLessonId === lesson.id}
              onClick={() => {
                if (!isLessonLocked(index, lesson.accessTier, lesson.isPreview)) {
                  handleLessonClick(lesson.id);
                }
              }}
            />
          ))}
        </ol>
      </section>

      {/* Lock overlay for non-access users */}
      {!canAccess && (
        <div className="course-lock-notice" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <div className="course-lock-text">
            <strong>This is a premium course.</strong> Upgrade to Deep Dive to unlock all lessons.
          </div>
          <Link to="/decision" className="course-lock-cta">Upgrade</Link>
        </div>
      )}

      <PageFooter />
    </div>
  );
}
