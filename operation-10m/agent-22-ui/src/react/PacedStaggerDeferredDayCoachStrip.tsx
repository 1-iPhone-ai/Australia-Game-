import React from 'react';
import type { PacedStaggerDeferredDayCoach } from '../engine/paced-stagger-deferred-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PacedStaggerDeferredDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PacedStaggerDeferredDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="paced-stagger-deferred-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
