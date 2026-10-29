import type { InterfaceExperienceLevel } from '../types/progression.js';
import {
  resolveLayoutPresetEvolution,
  suggestLayoutPresetForInterfaceLevel,
  type V94LayoutPreset,
} from './layout-preset-evolution.js';
import type { UiDensityTier } from './ui-density-progression.js';

export interface LayoutPresetDensityRecommendation {
  preset: V94LayoutPreset;
  suggestedDensity: UiDensityTier;
  coachCopy: string;
}

const PRESET_DENSITY: Record<V94LayoutPreset, UiDensityTier> = {
  Clean: 'spacious',
  Assisted: 'comfortable',
  Advanced: 'compact',
  Developer: 'compact',
  'Current/Custom': 'comfortable',
};

export function recommendDensityForLayoutPreset(preset: V94LayoutPreset | undefined): UiDensityTier {
  if (!preset) return 'comfortable';
  return PRESET_DENSITY[preset] ?? 'comfortable';
}

export function buildLayoutPresetDensityRecommendation(input: {
  layoutPreset?: V94LayoutPreset;
  interfaceLevel: InterfaceExperienceLevel;
  preferredTier?: UiDensityTier | null;
}): LayoutPresetDensityRecommendation {
  const preset =
    input.layoutPreset ?? suggestLayoutPresetForInterfaceLevel(input.interfaceLevel);
  const suggestedDensity = input.preferredTier ?? recommendDensityForLayoutPreset(preset);
  const evolution = resolveLayoutPresetEvolution(preset);

  return {
    preset,
    suggestedDensity,
    coachCopy: `${evolution.coachSummary} Recommended density: ${suggestedDensity}.`,
  };
}

export function layoutDensityMismatchCopy(
  preset: V94LayoutPreset | undefined,
  activeDensity: UiDensityTier
): string | null {
  const recommended = recommendDensityForLayoutPreset(preset);
  if (activeDensity === recommended) return null;
  return `Layout preset ${preset ?? 'Assisted'} pairs best with ${recommended} density (currently ${activeDensity}).`;
}
