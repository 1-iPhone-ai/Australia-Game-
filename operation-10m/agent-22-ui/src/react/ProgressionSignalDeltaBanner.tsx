import React from 'react';
import type { ProgressionSignalDelta } from '../engine/progression-signal-delta.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface ProgressionSignalDeltaBannerProps {
  delta: ProgressionSignalDelta;
  accessibility: AccessibilitySettingsSnapshot;
}

export function ProgressionSignalDeltaBanner({
  delta,
  accessibility,
}: ProgressionSignalDeltaBannerProps): React.ReactElement | null {
  if (!delta.coachCopy) return null;

  return (
    <div
      data-testid="progression-signal-delta-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-fuchsia-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-interface-level-changed={delta.interfaceLevelChanged ? 'true' : 'false'}
    >
      {delta.coachCopy}
    </div>
  );
}
