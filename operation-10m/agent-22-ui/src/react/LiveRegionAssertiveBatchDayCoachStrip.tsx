import React from 'react';
import type { LiveRegionAssertiveBatchDayCoach } from '../engine/live-region-assertive-batch-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LiveRegionAssertiveBatchDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LiveRegionAssertiveBatchDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="live-region-assertive-batch-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-rose-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
