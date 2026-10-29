import React from 'react';
import type { MilestoneForecastBreadthDayCoach } from '../engine/milestone-forecast-breadth-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function MilestoneForecastBreadthDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: MilestoneForecastBreadthDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="milestone-forecast-breadth-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-purple-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
