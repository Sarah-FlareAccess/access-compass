import { useState, useEffect, useCallback } from 'react';
import type { TrainingProgress, CourseProgress } from '../data/training/types';

const TRAINING_PROGRESS_KEY = 'access_compass_training_progress';

function getLocalProgress(): TrainingProgress {
  try {
    const stored = localStorage.getItem(TRAINING_PROGRESS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse errors
  }
  return { courses: {}, viewedResources: [] };
}

function saveLocalProgress(data: TrainingProgress): void {
  try {
    localStorage.setItem(TRAINING_PROGRESS_KEY, JSON.stringify(data));
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('Training progress: localStorage quota exceeded');
    }
  }
}

export function useTrainingProgress() {
  const [progress, setProgress] = useState<TrainingProgress>({ courses: {}, viewedResources: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProgress(getLocalProgress());
    setIsLoading(false);
  }, []);

  const startCourse = useCallback((courseId: string) => {
    setProgress((prev) => {
      const existing = prev.courses[courseId];
      if (existing && existing.status !== 'not-started') return prev;
      const updated: TrainingProgress = {
        ...prev,
        courses: {
          ...prev.courses,
          [courseId]: {
            courseId,
            status: 'in-progress',
            startedAt: new Date().toISOString(),
            completedLessons: existing?.completedLessons ?? [],
            lastLessonId: existing?.lastLessonId,
          },
        },
      };
      saveLocalProgress(updated);
      return updated;
    });
  }, []);

  const completeLesson = useCallback((courseId: string, lessonId: string) => {
    setProgress((prev) => {
      const existing = prev.courses[courseId] ?? {
        courseId,
        status: 'in-progress' as const,
        startedAt: new Date().toISOString(),
        completedLessons: [],
      };
      const completedLessons = existing.completedLessons.includes(lessonId)
        ? existing.completedLessons
        : [...existing.completedLessons, lessonId];
      const updated: TrainingProgress = {
        ...prev,
        courses: {
          ...prev.courses,
          [courseId]: {
            ...existing,
            status: existing.status === 'not-started' ? 'in-progress' : existing.status,
            completedLessons,
            lastLessonId: lessonId,
          },
        },
      };
      saveLocalProgress(updated);
      return updated;
    });
  }, []);

  const completeCourse = useCallback((courseId: string) => {
    setProgress((prev) => {
      const existing = prev.courses[courseId];
      if (!existing) return prev;
      const updated: TrainingProgress = {
        ...prev,
        courses: {
          ...prev.courses,
          [courseId]: {
            ...existing,
            status: 'completed',
            completedAt: new Date().toISOString(),
          },
        },
      };
      saveLocalProgress(updated);
      return updated;
    });
  }, []);

  const isLessonCompleted = useCallback(
    (courseId: string, lessonId: string): boolean => {
      return progress.courses[courseId]?.completedLessons.includes(lessonId) ?? false;
    },
    [progress]
  );

  const getCourseProgress = useCallback(
    (courseId: string): CourseProgress | undefined => {
      return progress.courses[courseId];
    },
    [progress]
  );

  const getCourseCompletionPercentage = useCallback(
    (courseId: string, totalLessons: number): number => {
      const course = progress.courses[courseId];
      if (!course || totalLessons === 0) return 0;
      return Math.round((course.completedLessons.length / totalLessons) * 100);
    },
    [progress]
  );

  const getLastLesson = useCallback(
    (courseId: string): string | undefined => {
      return progress.courses[courseId]?.lastLessonId;
    },
    [progress]
  );

  const markResourceViewed = useCallback((resourceId: string) => {
    setProgress((prev) => {
      if (prev.viewedResources.includes(resourceId)) return prev;
      const updated: TrainingProgress = {
        ...prev,
        viewedResources: [...prev.viewedResources, resourceId],
      };
      saveLocalProgress(updated);
      return updated;
    });
  }, []);

  const isResourceViewed = useCallback(
    (resourceId: string): boolean => {
      return progress.viewedResources.includes(resourceId);
    },
    [progress]
  );

  return {
    progress,
    isLoading,
    startCourse,
    completeLesson,
    completeCourse,
    isLessonCompleted,
    getCourseProgress,
    getCourseCompletionPercentage,
    getLastLesson,
    markResourceViewed,
    isResourceViewed,
  };
}
