import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { buildProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface ProgressionCoverageDayCoach {
  coverageRatio: number;
  tierLabel: 'early' | 'mid' | 'late';
  coachCopy: string | null;
}

export function buildProgressionCoverageDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
}): ProgressionCoverageDayCoach {
  const snapshot = buildProgressionCoverageSnapshot(input.signals, input.policy);
  const coachCopy = snapshot.coachCopy ? `Day ${input.nextGameDay}: ${snapshot.coachCopy}` : null;

  return {
    coverageRatio: snapshot.coverageRatio,
    tierLabel: snapshot.tierLabel,
    coachCopy,
  };
}
