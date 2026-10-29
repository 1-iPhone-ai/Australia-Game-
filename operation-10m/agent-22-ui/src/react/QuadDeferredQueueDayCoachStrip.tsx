import React from 'react';
import type { QuadDeferredQueueDayCoach } from '../engine/quad-deferred-queue-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function QuadDeferredQueueDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: QuadDeferredQueueDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="quad-deferred-queue-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-900/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
