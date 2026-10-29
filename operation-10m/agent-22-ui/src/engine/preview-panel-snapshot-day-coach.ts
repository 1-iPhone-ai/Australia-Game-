import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface PreviewPanelSnapshotDayCoach {
  previewCount: number;
  coachCopy: string | null;
}

export function buildPreviewPanelSnapshotDayCoach(input: {
  snapshot: ProgressionCoverageSnapshot;
  nextGameDay: number;
}): PreviewPanelSnapshotDayCoach {
  if (input.nextGameDay > 15 || input.snapshot.preview < 2) {
    return { previewCount: input.snapshot.preview, coachCopy: null };
  }
  return {
    previewCount: input.snapshot.preview,
    coachCopy: `Day ${input.nextGameDay}: ${input.snapshot.preview} panels sit in preview — unlock hints stay visible without full chrome.`,
  };
}
