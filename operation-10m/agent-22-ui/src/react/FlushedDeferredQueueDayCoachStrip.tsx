import React from 'react';
import type { FlushedDeferredQueueDayCoach } from '../engine/flushed-deferred-queue-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function FlushedDeferredQueueDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: FlushedDeferredQueueDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="flushed-deferred-queue-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
