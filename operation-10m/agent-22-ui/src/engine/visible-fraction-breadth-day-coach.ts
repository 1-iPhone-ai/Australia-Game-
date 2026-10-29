import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface VisibleFractionBreadthDayCoach {
  visibleFraction: number;
  coachCopy: string | null;
}

export function buildVisibleFractionBreadthDayCoach(input: {
  snapshot: ProgressionCoverageSnapshot;
  nextGameDay: number;
}): VisibleFractionBreadthDayCoach {
  const visibleFraction =
    input.snapshot.total > 0 ? input.snapshot.visible / input.snapshot.total : 0;
  if (input.nextGameDay > 19 || visibleFraction < 0.35) {
    return { visibleFraction, coachCopy: null };
  }
  return {
    visibleFraction,
    coachCopy: `Day ${input.nextGameDay}: Visible fraction ${Math.round(visibleFraction * 100)}% — breadth coaching highlights panels players can act on today.`,
  };
}
