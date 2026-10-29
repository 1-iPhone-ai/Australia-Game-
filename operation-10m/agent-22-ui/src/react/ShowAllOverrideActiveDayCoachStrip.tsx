import React from 'react';
import type { ShowAllOverrideActiveDayCoach } from '../engine/show-all-override-active-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ShowAllOverrideActiveDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ShowAllOverrideActiveDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="show-all-override-active-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-yellow-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
