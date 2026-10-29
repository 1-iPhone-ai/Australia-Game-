import React from 'react';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { InterfaceExperienceLevel } from '../types/progression.js';
import { resolveUiDensityProfile } from '../engine/ui-density-progression.js';
import { motionTimingCssVars, resolveMotionTimingProfile } from '../engine/motion-timing-profile.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface MotionTimingChromeRootProps {
  accessibility: AccessibilitySettingsSnapshot;
  interfaceLevel: InterfaceExperienceLevel;
  preferredDensityTier?: 'compact' | 'comfortable' | 'spacious' | null;
  children?: React.ReactNode;
}

export function MotionTimingChromeRoot({
  accessibility,
  interfaceLevel,
  preferredDensityTier,
  children,
}: MotionTimingChromeRootProps): React.ReactElement {
  const density = resolveUiDensityProfile({
    interfaceLevel,
    textScaleMultiplier: accessibility.textScaleMultiplier,
    preferredTier: preferredDensityTier,
  });
  const motion = resolveMotionTimingProfile(accessibility, density);
  const style = {
    ...motionTimingCssVars(motion),
    ...mergeHighContrastChromeStyle(accessibility),
  };

  return (
    <div
      data-testid="motion-timing-chrome-root"
      style={style}
      {...motion.dataAttributes}
    >
      {children}
    </div>
  );
}
