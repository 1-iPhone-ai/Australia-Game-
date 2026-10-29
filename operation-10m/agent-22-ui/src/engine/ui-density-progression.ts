import type { InterfaceExperienceLevel } from '../types/progression.js';
import type { V94LayoutPreset } from './layout-preset-evolution.js';

export type UiDensityTier = 'compact' | 'comfortable' | 'spacious';

export interface UiDensityProfile {
  tier: UiDensityTier;
  gapScale: number;
  railPaddingClass: string;
  panelPaddingClass: string;
  coachSummary: string;
}

const DENSITY_BY_TIER: Record<UiDensityTier, Omit<UiDensityProfile, 'tier'>> = {
  compact: {
    gapScale: 0.85,
    railPaddingClass: 'px-1 py-0.5 gap-0.5',
    panelPaddingClass: 'p-2 gap-1',
    coachSummary: 'Compact density fits more panels on screen with tighter spacing.',
  },
  comfortable: {
    gapScale: 1,
    railPaddingClass: 'px-2 py-1 gap-1',
    panelPaddingClass: 'p-3 gap-2',
    coachSummary: 'Comfortable density balances readability and information density.',
  },
  spacious: {
    gapScale: 1.15,
    railPaddingClass: 'px-3 py-2 gap-2',
    panelPaddingClass: 'p-4 gap-3',
    coachSummary: 'Spacious density increases touch targets and breathing room.',
  },
};

export function listEligibleDensityTiers(level: InterfaceExperienceLevel): UiDensityTier[] {
  switch (level) {
    case 'simple':
      return ['comfortable', 'spacious'];
    case 'guided':
      return ['compact', 'comfortable', 'spacious'];
    case 'advanced':
    case 'expert':
      return ['compact', 'comfortable', 'spacious'];
    default:
      return ['comfortable'];
  }
}

export function resolveUiDensityProfile(input: {
  interfaceLevel: InterfaceExperienceLevel;
  layoutPreset?: V94LayoutPreset;
  textScaleMultiplier?: number;
  preferredTier?: UiDensityTier | null;
}): UiDensityProfile {
  const eligible = listEligibleDensityTiers(input.interfaceLevel);
  let tier: UiDensityTier = input.preferredTier && eligible.includes(input.preferredTier)
    ? input.preferredTier
    : 'comfortable';

  if (!input.preferredTier) {
    if (input.interfaceLevel === 'simple') tier = 'spacious';
    if (input.layoutPreset === 'Developer') tier = 'compact';
    if ((input.textScaleMultiplier ?? 1) >= 1.2 && tier === 'compact') tier = 'comfortable';
  }

  if (!eligible.includes(tier)) tier = eligible[0] ?? 'comfortable';
  return { tier, ...DENSITY_BY_TIER[tier] };
}

export function densityLayoutClassNames(profile: UiDensityProfile): {
  container: string;
  rail: string;
  panel: string;
} {
  return {
    container: `ui-density-${profile.tier} gap-[${Math.round(profile.gapScale * 100)}%]`,
    rail: profile.railPaddingClass,
    panel: profile.panelPaddingClass,
  };
}

export function cycleUiDensityTier(current: UiDensityTier, level: InterfaceExperienceLevel): UiDensityTier {
  const eligible = listEligibleDensityTiers(level);
  const idx = eligible.indexOf(current);
  if (idx < 0) return eligible[0] ?? 'comfortable';
  return eligible[(idx + 1) % eligible.length] ?? 'comfortable';
}
