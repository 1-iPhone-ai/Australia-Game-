import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { UiDensityTier } from './ui-density-progression.js';
import { assessTextScaleReadability } from './text-scale-readability-coach.js';

export interface TextScaleReadabilityDayCoach {
  needsSpaciousDensity: boolean;
  coachCopy: string | null;
}

export function buildTextScaleReadabilityDayCoach(input: {
  accessibility: AccessibilitySettingsSnapshot;
  activeDensity: UiDensityTier;
  nextGameDay: number;
}): TextScaleReadabilityDayCoach {
  const assessment = assessTextScaleReadability({
    accessibility: input.accessibility,
    activeDensity: input.activeDensity,
  });

  let coachCopy = assessment.coachCopy;
  if (coachCopy) {
    coachCopy = `Day ${input.nextGameDay}: ${coachCopy}`;
  }

  return {
    needsSpaciousDensity: assessment.needsSpaciousDensity,
    coachCopy,
  };
}
