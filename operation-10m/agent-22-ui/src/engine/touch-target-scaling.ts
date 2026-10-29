import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { UiDensityTier } from './ui-density-progression.js';

export interface TouchTargetProfile {
  minHeightPx: number;
  minWidthPx: number;
  hitSlopPx: number;
  dataAttributes: Record<string, string>;
}

const BASE_BY_DENSITY: Record<UiDensityTier, number> = {
  compact: 40,
  comfortable: 44,
  spacious: 48,
};

export function resolveTouchTargetProfile(
  tier: UiDensityTier,
  accessibility: AccessibilitySettingsSnapshot
): TouchTargetProfile {
  let min = BASE_BY_DENSITY[tier];
  if (accessibility.textScaleMultiplier >= 1.15) min += 4;
  if (accessibility.textScaleMultiplier >= 1.35) min += 4;
  const hitSlopPx = tier === 'compact' ? 4 : tier === 'comfortable' ? 6 : 8;

  return {
    minHeightPx: min,
    minWidthPx: min,
    hitSlopPx,
    dataAttributes: {
      'data-touch-min-px': String(min),
      'data-touch-tier': tier,
    },
  };
}

export function touchTargetCssVars(profile: TouchTargetProfile): Record<string, string> {
  return {
    '--evolving-ui-touch-min-px': String(profile.minHeightPx),
    '--evolving-ui-touch-hit-slop-px': String(profile.hitSlopPx),
  };
}

export function meetsMinimumTouchTarget(profile: TouchTargetProfile, requestedPx: number): boolean {
  return requestedPx >= profile.minHeightPx - profile.hitSlopPx;
}
