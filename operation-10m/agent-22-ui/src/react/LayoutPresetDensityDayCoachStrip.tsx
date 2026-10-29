import React from 'react';
import type { LayoutPresetDensityDayCoach } from '../engine/layout-preset-density-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LayoutPresetDensityDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LayoutPresetDensityDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="layout-preset-density-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-preset={coach.preset}
    >
      {coach.coachCopy}
    </div>
  );
}
