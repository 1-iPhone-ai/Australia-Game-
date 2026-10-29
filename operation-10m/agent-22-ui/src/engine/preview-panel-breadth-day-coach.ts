import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface PreviewPanelBreadthDayCoach {
  previewCount: number;
  coachCopy: string | null;
}

export function buildPreviewPanelBreadthDayCoach(input: {
  snapshot: ProgressionCoverageSnapshot;
  nextGameDay: number;
}): PreviewPanelBreadthDayCoach {
  if (input.nextGameDay > 13 || input.snapshot.preview < 3) {
    return { previewCount: input.snapshot.preview, coachCopy: null };
  }
  return {
    previewCount: input.snapshot.preview,
    coachCopy: `Day ${input.nextGameDay}: ${input.snapshot.preview} panels in preview mode — unlock coaching stays readable without full layout weight.`,
  };
}
