import React from 'react';
import type { ShowAllProgressiveSafetyDayCoach } from '../engine/show-all-progressive-safety-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ShowAllProgressiveSafetyDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ShowAllProgressiveSafetyDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="show-all-progressive-safety-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-yellow-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
