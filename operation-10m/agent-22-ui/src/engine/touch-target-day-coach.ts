import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { UiDensityTier } from './ui-density-progression.js';
import { resolveTouchTargetProfile } from './touch-target-scaling.js';

export interface TouchTargetDayCoach {
  minTouchPx: number;
  coachCopy: string | null;
}

export function buildTouchTargetDayCoach(input: {
  densityTier: UiDensityTier;
  accessibility: AccessibilitySettingsSnapshot;
  nextGameDay: number;
}): TouchTargetDayCoach {
  const profile = resolveTouchTargetProfile(input.densityTier, input.accessibility);

  let coachCopy: string | null = null;
  if (input.accessibility.textScaleMultiplier >= 1.15) {
    coachCopy = `Day ${input.nextGameDay}: touch targets stay at ${profile.minHeightPx}px minimum for ${input.densityTier} density with text scale.`;
  }

  return {
    minTouchPx: profile.minHeightPx,
    coachCopy,
  };
}
