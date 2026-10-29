import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface TotalPanelBreadthDayCoach {
  totalCount: number;
  coachCopy: string | null;
}

export function buildTotalPanelBreadthDayCoach(input: {
  snapshot: ProgressionCoverageSnapshot;
  nextGameDay: number;
}): TotalPanelBreadthDayCoach {
  if (input.nextGameDay > 17 || input.snapshot.total < 8) {
    return { totalCount: input.snapshot.total, coachCopy: null };
  }
  return {
    totalCount: input.snapshot.total,
    coachCopy: `Day ${input.nextGameDay}: ${input.snapshot.total} panels tracked in coverage — breadth coaching keeps the evolving roster legible.`,
  };
}
