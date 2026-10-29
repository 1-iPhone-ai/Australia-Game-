import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface HiddenPanelSnapshotDayCoach {
  hiddenCount: number;
  coachCopy: string | null;
}

export function buildHiddenPanelSnapshotDayCoach(input: {
  snapshot: ProgressionCoverageSnapshot;
  nextGameDay: number;
}): HiddenPanelSnapshotDayCoach {
  if (input.nextGameDay > 14 || input.snapshot.hidden < 4) {
    return { hiddenCount: input.snapshot.hidden, coachCopy: null };
  }
  return {
    hiddenCount: input.snapshot.hidden,
    coachCopy: `Day ${input.nextGameDay}: ${input.snapshot.hidden} evolving UI panels stay hidden until progression catches up.`,
  };
}
