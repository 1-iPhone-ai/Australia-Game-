import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface ProgressionCoverageTierDayCoach {
  tierLabel: ProgressionCoverageSnapshot['tierLabel'];
  coachCopy: string | null;
}

const TIER_COPY: Record<ProgressionCoverageSnapshot['tierLabel'], string> = {
  early: 'Early-game interface tier — onboarding highlights lead unlock order.',
  mid: 'Mid-game interface tier — milestone unlocks drive the next panels.',
  late: 'Late-game interface tier — most panels are visible or in preview.',
};

export function buildProgressionCoverageTierDayCoach(input: {
  snapshot: ProgressionCoverageSnapshot;
  nextGameDay: number;
}): ProgressionCoverageTierDayCoach {
  const base = TIER_COPY[input.snapshot.tierLabel];
  const coachCopy = `Day ${input.nextGameDay}: ${base}`;
  return {
    tierLabel: input.snapshot.tierLabel,
    coachCopy,
  };
}
