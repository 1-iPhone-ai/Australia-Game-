import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { resolveHighContrastChromeProfile } from './high-contrast-chrome-policy.js';

export interface HighContrastChromeDayCoach {
  elevated: boolean;
  coachCopy: string | null;
}

export function buildHighContrastChromeDayCoach(input: {
  accessibility: AccessibilitySettingsSnapshot;
  nextGameDay: number;
}): HighContrastChromeDayCoach {
  const profile = resolveHighContrastChromeProfile(input.accessibility);

  let coachCopy: string | null = null;
  if (profile.elevated) {
    coachCopy = `Day ${input.nextGameDay}: elevated contrast chrome (${profile.borderWidthPx}px borders) stays active for accessibility settings.`;
  }

  return {
    elevated: profile.elevated,
    coachCopy,
  };
}
