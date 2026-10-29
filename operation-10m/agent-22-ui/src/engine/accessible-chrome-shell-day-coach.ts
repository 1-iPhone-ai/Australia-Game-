import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { InterfaceExperienceLevel } from '../types/progression.js';
import { resolveAccessibleChromeShellProfile } from './accessible-chrome-shell.js';

export interface AccessibleChromeShellDayCoach {
  densityTier: string;
  reducedMotion: boolean;
  coachCopy: string | null;
}

export function buildAccessibleChromeShellDayCoach(input: {
  accessibility: AccessibilitySettingsSnapshot;
  interfaceLevel: InterfaceExperienceLevel;
  preferredDensityTier?: 'compact' | 'comfortable' | 'spacious' | null;
  nextGameDay: number;
}): AccessibleChromeShellDayCoach {
  const shell = resolveAccessibleChromeShellProfile({
    accessibility: input.accessibility,
    interfaceLevel: input.interfaceLevel,
    preferredDensityTier: input.preferredDensityTier,
  });
  const reducedMotion = shell.dataAttributes['data-motion-reduced'] === 'true';

  let coachCopy: string | null = null;
  if (reducedMotion || input.nextGameDay <= 4) {
    coachCopy = reducedMotion
      ? `Day ${input.nextGameDay}: accessible chrome shell uses ${shell.density.tier} density with reduced motion.`
      : `Day ${input.nextGameDay}: accessible chrome shell tuned for ${shell.density.tier} density.`;
  }

  return {
    densityTier: shell.density.tier,
    reducedMotion,
    coachCopy,
  };
}
