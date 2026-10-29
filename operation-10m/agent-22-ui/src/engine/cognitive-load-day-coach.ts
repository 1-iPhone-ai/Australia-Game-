import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { assessCognitiveLoad, shouldShowCognitiveLoadCoach } from './cognitive-load-governor.js';

export interface CognitiveLoadDayCoach {
  band: 'light' | 'moderate' | 'heavy';
  shouldSurfaceCoach: boolean;
  coachCopy: string | null;
}

export function buildCognitiveLoadDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  pendingCoachAnnouncements: number;
  nextGameDay: number;
  cognitiveLoadCoachSnoozedUntilDay?: number;
}): CognitiveLoadDayCoach {
  const assessment = assessCognitiveLoad({
    signals: input.signals,
    policy: input.policy,
    pendingCoachAnnouncements: input.pendingCoachAnnouncements,
  });
  const shouldSurfaceCoach = shouldShowCognitiveLoadCoach(
    assessment,
    input.nextGameDay,
    input.cognitiveLoadCoachSnoozedUntilDay
  );

  let coachCopy: string | null = null;
  if (shouldSurfaceCoach && assessment.coachCopy) {
    coachCopy = `Day ${input.nextGameDay}: ${assessment.coachCopy}`;
  }

  return {
    band: assessment.band,
    shouldSurfaceCoach,
    coachCopy,
  };
}
