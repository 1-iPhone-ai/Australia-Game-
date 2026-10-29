import type { InterfaceExperienceLevel } from '../types/progression.js';
import type { V94LayoutPreset } from './layout-preset-evolution.js';
import type { UiDensityTier } from './ui-density-progression.js';
import { resolveUiDensityProfile } from './ui-density-progression.js';

export interface UiDensityProfileDayCoach {
  densityTier: UiDensityTier;
  coachCopy: string | null;
}

export function buildUiDensityProfileDayCoach(input: {
  interfaceLevel: InterfaceExperienceLevel;
  layoutPreset?: V94LayoutPreset;
  textScaleMultiplier?: number;
  preferredTier?: UiDensityTier | null;
  nextGameDay: number;
}): UiDensityProfileDayCoach {
  const profile = resolveUiDensityProfile({
    interfaceLevel: input.interfaceLevel,
    layoutPreset: input.layoutPreset,
    textScaleMultiplier: input.textScaleMultiplier,
    preferredTier: input.preferredTier ?? null,
  });

  let coachCopy: string | null = null;
  if (input.preferredTier || input.nextGameDay <= 4) {
    coachCopy = `Day ${input.nextGameDay}: ${profile.coachSummary}`;
  }

  return {
    densityTier: profile.tier,
    coachCopy,
  };
}
