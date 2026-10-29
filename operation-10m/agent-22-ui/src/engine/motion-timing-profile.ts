import { deriveMotionPolicy } from '../a11y/focus-management.js';
import type { AccessibilitySettingsSnapshot, MotionPolicy } from '../types/accessibility.js';
import type { UiDensityProfile } from './ui-density-progression.js';

export interface MotionTimingProfile {
  policy: MotionPolicy;
  /** Recommended max CSS transition duration for chrome surfaces. */
  transitionDurationMs: number;
  /** Delay between staggered unlock / coach announcements. */
  staggerStepMs: number;
  /** Host may map to `data-*` hooks for global stylesheets. */
  dataAttributes: Record<string, string>;
}

const DENSITY_TRANSITION_MS: Record<UiDensityProfile['tier'], number> = {
  compact: 120,
  comfortable: 180,
  spacious: 220,
};

const DENSITY_STAGGER_MS: Record<UiDensityProfile['tier'], number> = {
  compact: 80,
  spacious: 140,
  comfortable: 110,
};

export function resolveMotionTimingProfile(
  accessibility: AccessibilitySettingsSnapshot,
  density: UiDensityProfile
): MotionTimingProfile {
  const policy = deriveMotionPolicy(accessibility);
  const baseTransition = DENSITY_TRANSITION_MS[density.tier];
  const baseStagger = DENSITY_STAGGER_MS[density.tier];

  const transitionDurationMs = policy.allowTransitions
    ? baseTransition
    : 0;
  const staggerStepMs = policy.allowTransformAnimations ? baseStagger : 0;

  const scale = accessibility.textScaleMultiplier >= 1.15 ? 1.1 : 1;

  return {
    policy,
    transitionDurationMs: Math.round(transitionDurationMs * scale),
    staggerStepMs: Math.round(staggerStepMs * scale),
    dataAttributes: {
      'data-motion-reduced': policy.allowTransitions ? 'false' : 'true',
      'data-ui-density': density.tier,
      'data-motion-transition-ms': String(Math.round(transitionDurationMs * scale)),
    },
  };
}

export function motionTimingCssVars(profile: MotionTimingProfile): Record<string, string> {
  return {
    '--evolving-ui-transition-ms': String(profile.transitionDurationMs),
    '--evolving-ui-stagger-ms': String(profile.staggerStepMs),
  };
}
