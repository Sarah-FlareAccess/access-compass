import type { TrainingAccessTier } from '../data/training/types';
import type { AccessLevel } from '../types/access';

export function canAccessTraining(
  contentTier: TrainingAccessTier,
  userAccessLevel?: AccessLevel
): boolean {
  if (contentTier === 'free') return true;
  if (contentTier === 'included') return userAccessLevel === 'deep_dive';
  if (contentTier === 'premium') return userAccessLevel === 'deep_dive';
  return false;
}
