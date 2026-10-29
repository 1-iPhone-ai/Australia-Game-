import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface CoverageRatioBreadthDayCoach {
  coverageRatio: number;
  coachCopy: string | null;
}

export function buildCoverageRatioBreadthDayCoach(input: {
  snapshot: ProgressionCoverageSnapshot;
  nextGameDay: number;
}): CoverageRatioBreadthDayCoach {
  if (input.nextGameDay > 18 || input.snapshot.coverageRatio < 0.55) {
    return { coverageRatio: input.snapshot.coverageRatio, coachCopy: null };
  }
  return {
    coverageRatio: input.snapshot.coverageRatio,
    coachCopy: `Day ${input.nextGameDay}: Coverage ratio ${Math.round(input.snapshot.coverageRatio * 100)}% — breadth coaching keeps unlock momentum legible.`,
  };
}
