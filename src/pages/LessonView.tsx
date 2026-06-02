import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseBySlug } from '../data/training/index';
import { LessonContentRenderer } from '../components/training/LessonContentRenderer';
import { LessonNotesPanel } from '../components/training/LessonNotesPanel';
import { CourseProgressTracker } from '../components/training/CourseProgressTracker';
import { useTrainingProgress } from '../hooks/useTrainingProgress';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { usePageTitle } from '../hooks/usePageTitle';
import { PageFooter } from '../components/PageFooter';
import './LessonView.css';

export default function LessonView() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();

  const course = useMemo(() => getCourseBySlug(slug ?? ''), [slug]);
  const lesson = useMemo(
    () => course?.lessons.find((l) => l.id === lessonId),
    [course, lessonId]
  );

  usePageTitle(lesson?.title ?? 'Lesson');

  const {
    isLessonCompleted,
    completeLesson,
    completeCourse,
    startCourse,
    getCourseProgress,
  } = useTrainingProgress();

  if (!course || !lesson) {
    return (
      <div className="lesson-view">
        <div className="lesson-not-found">
          <h1>Lesson not found</h1>
          <Link to="/training">Back to Training Hub</Link>
        </div>
      </div>
    );
  }

  // Training-tier gate disabled. Access is managed manually for now.
  const canAccess = true;

  const lessonIndex = course.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : null;
  const isCompleted = isLessonCompleted(course.id, lesson.id);
  const progress = getCourseProgress(course.id);

  const handleMarkComplete = () => {
    if (!progress || progress.status === 'not-started') {
      startCourse(course.id);
    }
    completeLesson(course.id, lesson.id);

    // Auto-complete course if all lessons done
    const completedAfterThis = [
      ...(progress?.completedLessons ?? []),
      lesson.id,
    ];
    const uniqueCompleted = [...new Set(completedAfterThis)];
    if (uniqueCompleted.length >= course.lessons.length) {
      completeCourse(course.id);
    }
  };

  // Auto-mark the lesson complete when every step in it has been ticked.
  // Keeps the course-detail lesson card in sync with the step tracker.
  // Undoing a step does not un-complete the lesson.
  const courseProgress = useCourseProgress(course);
  const lessonStepInfo = courseProgress.lessons.find((l) => l.lessonId === lesson.id);
  const allStepsDone = !!lessonStepInfo
    && lessonStepInfo.totalSteps > 0
    && lessonStepInfo.completedSteps >= lessonStepInfo.totalSteps;
  useEffect(() => {
    if (allStepsDone && !isLessonCompleted(course.id, lesson.id)) {
      handleMarkComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allStepsDone]);

  // Locked lesson view
  if (!canAccess) {
    return (
      <div className="lesson-view">
        <nav aria-label="Breadcrumb" className="lesson-breadcrumb">
          <ol>
            <li><Link to="/training">Training Hub</Link></li>
            <li><Link to={`/training/course/${course.slug}`}>{course.title}</Link></li>
            <li aria-current="page">{lesson.title}</li>
          </ol>
        </nav>

        <div className="lesson-locked-overlay">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <h1 className="lesson-locked-title">This lesson requires premium access</h1>
          <p className="lesson-locked-text">
            Upgrade to Deep Dive to unlock all lessons in this course.
          </p>
          <Link to="/decision" className="lesson-locked-cta">Upgrade to Deep Dive</Link>
          <Link to={`/training/course/${course.slug}`} className="lesson-locked-back">
            Back to course overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-view">
      <a href="#lesson-content" className="lesson-skip-link">Skip to lesson content</a>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="lesson-breadcrumb">
        <ol>
          <li><Link to="/training">Training Hub</Link></li>
          <li><Link to={`/training/course/${course.slug}`}>{course.title}</Link></li>
          <li aria-current="page">{lesson.title}</li>
        </ol>
      </nav>

      {/* Course progress tracker - carries across all lessons */}
      <CourseProgressTracker course={course} currentLessonId={lesson.id} />

      {/* Lesson header */}
      <div className="lesson-header">
        <h1 className="lesson-title">{lesson.title}</h1>
        {lesson.subtitle && <p className="lesson-subtitle">{lesson.subtitle}</p>}
        <div className="lesson-meta">
          <span className="lesson-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {lesson.estimatedMinutes} min
          </span>
        </div>
      </div>

      {/* Content blocks. Key forces a remount on lesson change so step
          progress and other lesson-scoped state re-initialise from the
          new lesson's storage instead of carrying over from the prior. */}
      <div id="lesson-content" tabIndex={-1}>
        <LessonContentRenderer
          key={lesson.id}
          blocks={lesson.contentBlocks}
          courseId={course.id}
          lessonId={lesson.id}
        />
      </div>

      {/* Mark complete */}
      <div className="lesson-complete-section">
        {isCompleted ? (
          <div className="lesson-completed-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Lesson completed
          </div>
        ) : (
          <button className="lesson-complete-btn" onClick={handleMarkComplete}>
            Mark as complete
          </button>
        )}
      </div>

      {/* Prev / Next navigation */}
      <nav className="lesson-nav" aria-label="Lesson navigation">
        {prevLesson ? (
          <Link
            to={`/training/course/${course.slug}/lesson/${prevLesson.id}`}
            className="lesson-nav-link lesson-nav-prev"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            <span className="lesson-nav-text">
              <span className="lesson-nav-label">Previous</span>
              <span className="lesson-nav-title">{prevLesson.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {nextLesson ? (
          <Link
            to={`/training/course/${course.slug}/lesson/${nextLesson.id}`}
            className="lesson-nav-link lesson-nav-next"
            onClick={() => { if (!isCompleted) handleMarkComplete(); }}
          >
            <span className="lesson-nav-text">
              <span className="lesson-nav-label">Next</span>
              <span className="lesson-nav-title">{nextLesson.title}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        ) : (
          <Link
            to={`/training/course/${course.slug}`}
            className="lesson-nav-link lesson-nav-next"
            onClick={() => { if (!isCompleted) handleMarkComplete(); }}
          >
            <span className="lesson-nav-text">
              <span className="lesson-nav-label">Finished</span>
              <span className="lesson-nav-title">Back to course</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        )}
      </nav>

      <PageFooter />
      <LessonNotesPanel courseId={course.id} courseTitle={course.title} />
    </div>
  );
}
