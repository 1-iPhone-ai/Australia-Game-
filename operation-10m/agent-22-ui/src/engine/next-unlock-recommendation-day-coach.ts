import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { listNextUnlockRecommendations } from './progression-coach.js';

export interface NextUnlockRecommendationDayCoach {
  recommendationCount: number;
  coachCopy: string | null;
}

export function buildNextUnlockRecommendationDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
  limit?: number;
}): NextUnlockRecommendationDayCoach {
  const recs = listNextUnlockRecommendations(input.signals, input.policy, input.limit ?? 3);
  if (!recs.length) {
    return { recommendationCount: 0, coachCopy: null };
  }
  const coachCopy = `Day ${input.nextGameDay}: Next unlock focus — ${recs[0].headline}`;
  return {
    recommendationCount: recs.length,
    coachCopy,
  };
}
