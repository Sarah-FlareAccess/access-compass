import { useState, useEffect, useCallback, useRef } from 'react';
import type { TrainingProgress, CourseProgress } from '../data/training/types';
import { isSupabaseEnabled } from '../utils/supabase';
import { syncRecord, fetchRecord, resolveByTimestamp } from '../utils/cloudSync';
import { useAuthSafe } from '../contexts/AuthContext';

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
  const { userId, organisationId } = useAuthSafe();
  const userIdRef = useRef(userId);
  const orgIdRef = useRef(organisationId);

  useEffect(() => {
    userIdRef.current = userId;
    orgIdRef.current = organisationId;
  }, [userId, organisationId]);

  // Sync progress to cloud (debounced via effect)
  const syncProgressToCloud = useCallback((data: TrainingProgress) => {
    if (!userIdRef.current) return;
    syncRecord('training_progress', {
      courses: data.courses,
      viewed_resources: data.viewedResources,
    }, userIdRef.current, orgIdRef.current).catch(() => {});
  }, []);

  // Load on mount + merge from cloud
  useEffect(() => {
    const load = async () => {
      const localData = getLocalProgress();
      setProgress(localData);

      if (isSupabaseEnabled() && userId) {
        const { data: cloudRow } = await fetchRecord<Record<string, unknown>>(
          'training_progress', userId, {}
        );

        if (cloudRow) {
          const cloudUpdatedAt = cloudRow.updated_at as string | undefined;
          // Simple merge: if cloud has courses we don't have locally, add them
          const cloudCourses = (cloudRow.courses as Record<string, CourseProgress>) || {};
          const cloudViewed = (cloudRow.viewed_resources as string[]) || [];

          let hasChanges = false;
          const merged = { ...localData };

          // Merge courses (keep whichever has more progress)
          for (const [courseId, cloudCourse] of Object.entries(cloudCourses)) {
            const localCourse = localData.courses[courseId];
            if (!localCourse) {
              merged.courses[courseId] = cloudCourse;
              hasChanges = true;
            } else if (cloudCourse.completedLessons.length > localCourse.completedLessons.length) {
              merged.courses[courseId] = cloudCourse;
              hasChanges = true;
            }
          }

          // Merge viewed resources (union)
          const allViewed = new Set([...localData.viewedResources, ...cloudViewed]);
          if (allViewed.size > localData.viewedResources.length) {
            merged.viewedResources = Array.from(allViewed);
            hasChanges = true;
          }

          if (hasChanges) {
            setProgress(merged);
            saveLocalProgress(merged);
          }
        }
      }

      setIsLoading(false);
    };

    load();
  }, [userId]);

  // Auto-sync when progress changes (debounced)
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!initialLoadDone.current) {
      if (!isLoading) initialLoadDone.current = true;
      return;
    }
    if (!userIdRef.current) return;

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      syncProgressToCloud(progress);
    }, 2000);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [progress, isLoading, syncProgressToCloud]);

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
