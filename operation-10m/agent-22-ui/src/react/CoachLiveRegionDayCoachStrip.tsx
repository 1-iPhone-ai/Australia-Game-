import React from 'react';
import type { CoachLiveRegionDayCoach } from '../engine/coach-live-region-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function CoachLiveRegionDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: CoachLiveRegionDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="coach-live-region-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-neutral-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
