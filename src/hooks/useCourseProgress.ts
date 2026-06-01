import { useCallback, useEffect, useState } from 'react';
import type { LessonContentBlock, TrainingCourse } from '../data/training/types';

const STEP_RE = /^Step\s+(\d+)\s*[:.\s]/i;

function getBlockHeading(block: LessonContentBlock): string | undefined {
  if (block.type === 'text') return block.heading;
  if (block.type === 'exercise') return block.exercise?.title;
  if (block.type === 'checklist') return block.checklist?.title;
  return undefined;
}

function countSteps(blocks: LessonContentBlock[]): number {
  let count = 0;
  blocks.forEach((b) => {
    const h = getBlockHeading(b);
    if (h && STEP_RE.test(h)) count++;
  });
  return count;
}

function readCompletedSteps(courseId: string, lessonId: string): number {
  try {
    const raw = localStorage.getItem(`ac:step-progress:${courseId}:${lessonId}`);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((n) => typeof n === 'number').length;
  } catch {
    /* ignore */
  }
  return 0;
}

export interface LessonProgress {
  lessonId: string;
  order: number;
  title: string;
  totalSteps: number;
  completedSteps: number;
}

export interface CourseProgress {
  lessons: LessonProgress[];
  totalSteps: number;
  completedSteps: number;
}

function calculateProgress(course: TrainingCourse): CourseProgress {
  const lessons = course.lessons.map((lesson) => ({
    lessonId: lesson.id,
    order: lesson.order,
    title: lesson.title,
    totalSteps: countSteps(lesson.contentBlocks),
    completedSteps: readCompletedSteps(course.id, lesson.id),
  }));

  const totalSteps = lessons.reduce((sum, l) => sum + l.totalSteps, 0);
  const completedSteps = lessons.reduce((sum, l) => sum + Math.min(l.completedSteps, l.totalSteps), 0);

  return { lessons, totalSteps, completedSteps };
}

export function useCourseProgress(course: TrainingCourse): CourseProgress {
  const [progress, setProgress] = useState(() => calculateProgress(course));

  const recalc = useCallback(() => {
    setProgress(calculateProgress(course));
  }, [course]);

  useEffect(() => {
    recalc();
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.courseId === course.id) recalc();
    };
    window.addEventListener('ac:step-progress-changed', handler);
    window.addEventListener('storage', recalc);
    window.addEventListener('focus', recalc);
    return () => {
      window.removeEventListener('ac:step-progress-changed', handler);
      window.removeEventListener('storage', recalc);
      window.removeEventListener('focus', recalc);
    };
  }, [course, recalc]);

  return progress;
}
