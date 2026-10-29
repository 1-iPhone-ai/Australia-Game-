import type { ProgressionCoverageSnapshot } from './progression-coverage-snapshot.js';

export interface PreviewHeavyCoverageDayCoach {
  previewCount: number;
  visibleCount: number;
  coachCopy: string | null;
}

export function buildPreviewHeavyCoverageDayCoach(input: {
  snapshot: Pick<ProgressionCoverageSnapshot, 'preview' | 'visible'>;
  nextGameDay: number;
}): PreviewHeavyCoverageDayCoach {
  if (input.snapshot.preview <= input.snapshot.visible || input.snapshot.preview < 2) {
    return {
      previewCount: input.snapshot.preview,
      visibleCount: input.snapshot.visible,
      coachCopy: null,
    };
  }
  return {
    previewCount: input.snapshot.preview,
    visibleCount: input.snapshot.visible,
    coachCopy: `Day ${input.nextGameDay}: ${input.snapshot.preview} panels in preview vs ${input.snapshot.visible} visible — unlock hints show what is left.`,
  };
}
