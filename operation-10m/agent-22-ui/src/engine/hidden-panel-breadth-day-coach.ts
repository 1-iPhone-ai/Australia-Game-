import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface HiddenPanelBreadthDayCoach {
  hiddenCount: number;
  coachCopy: string | null;
}

export function buildHiddenPanelBreadthDayCoach(input: {
  snapshot: ProgressionCoverageSnapshot;
  nextGameDay: number;
}): HiddenPanelBreadthDayCoach {
  if (input.nextGameDay > 15 || input.snapshot.hidden < 5) {
    return { hiddenCount: input.snapshot.hidden, coachCopy: null };
  }
  return {
    hiddenCount: input.snapshot.hidden,
    coachCopy: `Day ${input.nextGameDay}: ${input.snapshot.hidden} panels stay hidden — breadth coaching keeps unlock expectations honest.`,
  };
}
