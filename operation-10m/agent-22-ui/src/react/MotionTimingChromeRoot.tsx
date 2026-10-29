import React from 'react';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { InterfaceExperienceLevel } from '../types/progression.js';
import { resolveAccessibleChromeShellProfile } from '../engine/accessible-chrome-shell.js';

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
  const shell = resolveAccessibleChromeShellProfile({
    accessibility,
    interfaceLevel,
    preferredDensityTier,
  });

  return (
    <div
      data-testid="motion-timing-chrome-root"
      style={shell.style}
      {...shell.dataAttributes}
      data-ui-density={shell.density.tier}
    >
      {children}
    </div>
  );
}
