import React from 'react';
import type { MilestoneForecastRosterDayCoach } from '../engine/milestone-forecast-roster-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function MilestoneForecastRosterDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: MilestoneForecastRosterDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="milestone-forecast-roster-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-purple-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
