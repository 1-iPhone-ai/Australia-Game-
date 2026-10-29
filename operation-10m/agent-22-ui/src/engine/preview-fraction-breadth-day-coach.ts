import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface PreviewFractionBreadthDayCoach {
  previewFraction: number;
  coachCopy: string | null;
}

export function buildPreviewFractionBreadthDayCoach(input: {
  snapshot: ProgressionCoverageSnapshot;
  nextGameDay: number;
}): PreviewFractionBreadthDayCoach {
  const previewFraction =
    input.snapshot.total > 0 ? input.snapshot.preview / input.snapshot.total : 0;
  if (input.nextGameDay > 20 || previewFraction < 0.28) {
    return { previewFraction, coachCopy: null };
  }
  return {
    previewFraction,
    coachCopy: `Day ${input.nextGameDay}: Preview fraction ${Math.round(previewFraction * 100)}% — breadth coaching surfaces panels warming up before full unlock.`,
  };
}
