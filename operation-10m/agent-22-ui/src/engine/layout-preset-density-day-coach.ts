import type { InterfaceExperienceLevel } from '../types/progression.js';
import type { V94LayoutPreset } from './layout-preset-evolution.js';
import type { UiDensityTier } from './ui-density-progression.js';
import {
  buildLayoutPresetDensityRecommendation,
  layoutDensityMismatchCopy,
} from './layout-preset-density-bridge.js';

export interface LayoutPresetDensityDayCoach {
  preset: V94LayoutPreset;
  suggestedDensity: UiDensityTier;
  coachCopy: string | null;
}

export function buildLayoutPresetDensityDayCoach(input: {
  layoutPreset?: V94LayoutPreset;
  interfaceLevel: InterfaceExperienceLevel;
  activeDensity: UiDensityTier;
  preferredTier?: UiDensityTier | null;
  nextGameDay: number;
}): LayoutPresetDensityDayCoach {
  const recommendation = buildLayoutPresetDensityRecommendation({
    layoutPreset: input.layoutPreset,
    interfaceLevel: input.interfaceLevel,
    preferredTier: input.preferredTier,
  });
  const mismatch = layoutDensityMismatchCopy(input.layoutPreset, input.activeDensity);

  let coachCopy: string | null = null;
  if (mismatch) {
    coachCopy = `Day ${input.nextGameDay}: ${mismatch}`;
  } else if (input.nextGameDay <= 3) {
    coachCopy = `Day ${input.nextGameDay}: ${recommendation.coachCopy}`;
  }

  return {
    preset: recommendation.preset,
    suggestedDensity: recommendation.suggestedDensity,
    coachCopy,
  };
}
