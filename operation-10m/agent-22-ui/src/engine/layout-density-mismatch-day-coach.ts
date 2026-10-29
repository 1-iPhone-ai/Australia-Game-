import type { V94LayoutPreset } from './layout-preset-evolution.js';
import type { UiDensityTier } from './ui-density-progression.js';
import { layoutDensityMismatchCopy } from './layout-preset-density-bridge.js';

export interface LayoutDensityMismatchDayCoach {
  activeDensity: UiDensityTier;
  coachCopy: string | null;
}

export function buildLayoutDensityMismatchDayCoach(input: {
  layoutPreset: V94LayoutPreset | undefined;
  activeDensity: UiDensityTier;
  nextGameDay: number;
}): LayoutDensityMismatchDayCoach {
  const base = layoutDensityMismatchCopy(input.layoutPreset, input.activeDensity);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return {
    activeDensity: input.activeDensity,
    coachCopy,
  };
}
