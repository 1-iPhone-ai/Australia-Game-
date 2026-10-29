import React from 'react';
import type { PacingDeferredQuadDayCoach } from '../engine/pacing-deferred-quad-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PacingDeferredQuadDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PacingDeferredQuadDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="pacing-deferred-quad-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-950/60 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
