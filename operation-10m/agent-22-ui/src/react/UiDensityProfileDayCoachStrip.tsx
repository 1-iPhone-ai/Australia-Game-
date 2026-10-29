import React from 'react';
import type { UiDensityProfileDayCoach } from '../engine/ui-density-profile-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function UiDensityProfileDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: UiDensityProfileDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="ui-density-profile-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-slate-500/35 rounded p-2"
      data-density-tier={coach.densityTier}
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
