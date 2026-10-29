import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface CoverageVisibleBreadthDayCoach {
  visibleCount: number;
  coachCopy: string | null;
}

export function buildCoverageVisibleBreadthDayCoach(input: {
  snapshot: ProgressionCoverageSnapshot;
  nextGameDay: number;
}): CoverageVisibleBreadthDayCoach {
  if (input.nextGameDay > 12 || input.snapshot.visible < 6) {
    return { visibleCount: input.snapshot.visible, coachCopy: null };
  }
  return {
    visibleCount: input.snapshot.visible,
    coachCopy: `Day ${input.nextGameDay}: ${input.snapshot.visible} panels are fully visible — keyboard and screen reader routes expand accordingly.`,
  };
}
