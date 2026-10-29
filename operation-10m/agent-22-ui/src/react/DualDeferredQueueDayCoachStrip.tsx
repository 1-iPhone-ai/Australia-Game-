import React from 'react';
import type { DualDeferredQueueDayCoach } from '../engine/dual-deferred-queue-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function DualDeferredQueueDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: DualDeferredQueueDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="dual-deferred-queue-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-700/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
