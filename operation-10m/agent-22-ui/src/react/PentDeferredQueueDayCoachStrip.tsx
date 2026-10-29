import React from 'react';
import type { PentDeferredQueueDayCoach } from '../engine/pent-deferred-queue-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PentDeferredQueueDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PentDeferredQueueDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="pent-deferred-queue-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-950/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
