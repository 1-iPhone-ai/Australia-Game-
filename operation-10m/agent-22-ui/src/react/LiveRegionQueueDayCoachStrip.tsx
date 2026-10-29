import React from 'react';
import type { LiveRegionQueueDayCoach } from '../engine/live-region-queue-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LiveRegionQueueDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LiveRegionQueueDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="live-region-queue-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-purple-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
