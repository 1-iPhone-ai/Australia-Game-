import React from 'react';
import type { HexDeferredQueueDayCoach } from '../engine/hex-deferred-queue-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function HexDeferredQueueDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: HexDeferredQueueDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="hex-deferred-queue-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-amber-950/60 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
