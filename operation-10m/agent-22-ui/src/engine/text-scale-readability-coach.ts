import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { UiDensityTier } from './ui-density-progression.js';
import { resolveTouchTargetProfile } from './touch-target-scaling.js';

export interface TextScaleReadabilityAssessment {
  textScaleMultiplier: number;
  activeDensity: UiDensityTier;
  recommendedDensity: UiDensityTier;
  needsSpaciousDensity: boolean;
  coachCopy: string | null;
}

export function assessTextScaleReadability(input: {
  accessibility: AccessibilitySettingsSnapshot;
  activeDensity: UiDensityTier;
}): TextScaleReadabilityAssessment {
  const scale = input.accessibility.textScaleMultiplier;
  const needsSpaciousDensity = scale >= 1.15;
  const recommendedDensity: UiDensityTier = scale >= 1.35 ? 'spacious' : scale >= 1.15 ? 'comfortable' : input.activeDensity;

  const touch = resolveTouchTargetProfile(input.activeDensity, input.accessibility);
  let coachCopy: string | null = null;

  if (needsSpaciousDensity && input.activeDensity === 'compact') {
    coachCopy = 'Large text scale pairs poorly with compact density — switch to comfortable or spacious.';
  } else if (scale >= 1.35 && touch.minHeightPx < 48) {
    coachCopy = 'Increase touch targets by choosing spacious density with your text scale.';
  } else if (scale <= 1.0 && input.activeDensity === 'spacious') {
    coachCopy = 'Default text scale can use comfortable density to show more panels.';
  }

  return {
    textScaleMultiplier: scale,
    activeDensity: input.activeDensity,
    recommendedDensity,
    needsSpaciousDensity,
    coachCopy,
  };
}
