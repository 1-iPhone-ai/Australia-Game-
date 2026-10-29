import React from 'react';
import type { SingleDeferredCoachLineDayCoach } from '../engine/single-deferred-coach-line-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function SingleDeferredCoachLineDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: SingleDeferredCoachLineDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="single-deferred-coach-line-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
