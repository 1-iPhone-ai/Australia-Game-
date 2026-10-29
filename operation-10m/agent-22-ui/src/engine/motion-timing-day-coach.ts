import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { UiDensityTier } from './ui-density-progression.js';
import { resolveUiDensityProfile } from './ui-density-progression.js';
import { resolveMotionTimingProfile } from './motion-timing-profile.js';

export interface MotionTimingDayCoach {
  reducedMotion: boolean;
  transitionDurationMs: number;
  coachCopy: string | null;
}

export function buildMotionTimingDayCoach(input: {
  accessibility: AccessibilitySettingsSnapshot;
  densityTier: UiDensityTier;
  interfaceLevel: import('../types/progression.js').InterfaceExperienceLevel;
  nextGameDay: number;
}): MotionTimingDayCoach {
  const density = resolveUiDensityProfile({
    interfaceLevel: input.interfaceLevel,
    preferredTier: input.densityTier,
    textScaleMultiplier: input.accessibility.textScaleMultiplier,
  });
  const motion = resolveMotionTimingProfile(input.accessibility, density);
  const reducedMotion = !motion.policy.allowTransitions;

  let coachCopy: string | null = null;
  if (reducedMotion) {
    coachCopy = `Day ${input.nextGameDay}: reduced-motion settings keep chrome transitions off (${motion.transitionDurationMs}ms).`;
  } else if (input.accessibility.textScaleMultiplier >= 1.2) {
    coachCopy = `Day ${input.nextGameDay}: motion timing stretched to ${motion.transitionDurationMs}ms for text scale.`;
  }

  return {
    reducedMotion,
    transitionDurationMs: motion.transitionDurationMs,
    coachCopy,
  };
}
