import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { InterfaceExperienceLevel } from '../types/progression.js';
import { resolveUiDensityProfile, type UiDensityProfile } from './ui-density-progression.js';
import { motionTimingCssVars, resolveMotionTimingProfile } from './motion-timing-profile.js';
import { resolveTouchTargetProfile, touchTargetCssVars } from './touch-target-scaling.js';
import { mergeHighContrastChromeStyle } from './high-contrast-chrome-policy.js';

export interface AccessibleChromeShellProfile {
  density: UiDensityProfile;
  style: Record<string, string>;
  dataAttributes: Record<string, string>;
}

export function resolveAccessibleChromeShellProfile(input: {
  accessibility: AccessibilitySettingsSnapshot;
  interfaceLevel: InterfaceExperienceLevel;
  preferredDensityTier?: 'compact' | 'comfortable' | 'spacious' | null;
}): AccessibleChromeShellProfile {
  const density = resolveUiDensityProfile({
    interfaceLevel: input.interfaceLevel,
    textScaleMultiplier: input.accessibility.textScaleMultiplier,
    preferredTier: input.preferredDensityTier,
  });
  const motion = resolveMotionTimingProfile(input.accessibility, density);
  const touch = resolveTouchTargetProfile(density.tier, input.accessibility);

  const style = {
    ...motionTimingCssVars(motion),
    ...touchTargetCssVars(touch),
    ...mergeHighContrastChromeStyle(input.accessibility),
  };

  const dataAttributes = {
    ...motion.dataAttributes,
    ...touch.dataAttributes,
  };

  return { density, style, dataAttributes };
}
