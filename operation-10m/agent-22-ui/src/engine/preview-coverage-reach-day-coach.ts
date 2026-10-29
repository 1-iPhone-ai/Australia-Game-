import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface PreviewCoverageBreadthDayCoach {
  coverageRatio: number;
  coachCopy: string | null;
}

export function buildPreviewCoverageBreadthDayCoach(input: {
  snapshot: ProgressionCoverageSnapshot;
  nextGameDay: number;
}): PreviewCoverageBreadthDayCoach {
  const coverageRatio = input.snapshot.total > 0 ? input.snapshot.coverageRatio : 0;
  if (input.nextGameDay > 22 || coverageRatio < 0.55) {
    return { coverageRatio, coachCopy: null };
  }
  return {
    coverageRatio,
    coachCopy: `Day ${input.nextGameDay}: Preview coverage ${Math.round(coverageRatio * 100)}% — reach coaching tracks panels approaching full visibility.`,
  };
}
