import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { computeProgressionCoverage } from './progression-coach.js';

export interface ProgressionVisibilitySummaryDayCoach {
  visibleCount: number;
  previewCount: number;
  hiddenCount: number;
  coachCopy: string | null;
}

export function buildProgressionVisibilitySummaryDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
}): ProgressionVisibilitySummaryDayCoach {
  const stats = computeProgressionCoverage(input.signals, input.policy);
  let coachCopy: string | null = null;
  if (input.nextGameDay <= 5 || stats.preview > 0) {
    coachCopy = `Day ${input.nextGameDay}: ${stats.visible} visible, ${stats.preview} preview, ${stats.hidden} hidden interface panels.`;
  }
  return {
    visibleCount: stats.visible,
    previewCount: stats.preview,
    hiddenCount: stats.hidden,
    coachCopy,
  };
}
