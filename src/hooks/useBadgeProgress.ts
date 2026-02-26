import { useMemo } from 'react';

export type BadgeLevel = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export interface BadgeProgress {
  level: BadgeLevel;
  previousLevel: BadgeLevel;
  percentage: number;
  completedModules: number;
  totalModules: number;
  nextLevelAt: number | null;
  isNewMilestone: boolean;
}

const THRESHOLDS: { level: BadgeLevel; min: number }[] = [
  { level: 'platinum', min: 100 },
  { level: 'gold', min: 75 },
  { level: 'silver', min: 50 },
  { level: 'bronze', min: 25 },
];

function getLevel(percentage: number): BadgeLevel {
  for (const { level, min } of THRESHOLDS) {
    if (percentage >= min) return level;
  }
  return 'none';
}

function getNextThreshold(percentage: number): number | null {
  const thresholds = [25, 50, 75, 100];
  for (const t of thresholds) {
    if (percentage < t) return t;
  }
  return null;
}

const MILESTONE_KEY = 'access_compass_badge_milestone';

function getStoredMilestone(): BadgeLevel {
  try {
    return (localStorage.getItem(MILESTONE_KEY) as BadgeLevel) || 'none';
  } catch {
    return 'none';
  }
}

export function markMilestoneSeen(level: BadgeLevel): void {
  try {
    localStorage.setItem(MILESTONE_KEY, level);
  } catch {
    // localStorage unavailable
  }
}

export function useBadgeProgress(
  progress: Record<string, { status: string }>
): BadgeProgress {
  return useMemo(() => {
    const entries = Object.values(progress);
    const totalModules = entries.length;
    const completedModules = entries.filter(p => p.status === 'completed').length;
    const percentage = totalModules > 0
      ? Math.round((completedModules / totalModules) * 100)
      : 0;

    const level = getLevel(percentage);
    const previousLevel = getStoredMilestone();
    const nextLevelAt = getNextThreshold(percentage);

    const levelOrder: BadgeLevel[] = ['none', 'bronze', 'silver', 'gold', 'platinum'];
    const isNewMilestone =
      level !== 'none' &&
      levelOrder.indexOf(level) > levelOrder.indexOf(previousLevel);

    return {
      level,
      previousLevel,
      percentage,
      completedModules,
      totalModules,
      nextLevelAt,
      isNewMilestone,
    };
  }, [progress]);
}
