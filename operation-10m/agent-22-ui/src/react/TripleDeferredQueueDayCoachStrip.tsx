import React from 'react';
import type { TripleDeferredQueueDayCoach } from '../engine/triple-deferred-queue-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function TripleDeferredQueueDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: TripleDeferredQueueDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="triple-deferred-queue-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-800/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
