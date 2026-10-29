import React from 'react';
import type { HeptDeferredQueueDayCoach } from '../engine/hept-deferred-queue-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function HeptDeferredQueueDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: HeptDeferredQueueDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="hept-deferred-queue-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-950/60 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
