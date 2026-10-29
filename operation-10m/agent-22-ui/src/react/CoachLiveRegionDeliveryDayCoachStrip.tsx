import React from 'react';
import type { CoachLiveRegionDeliveryDayCoach } from '../engine/coach-live-region-delivery-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function CoachLiveRegionDeliveryDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: CoachLiveRegionDeliveryDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="coach-live-region-delivery-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
