import React from 'react';
import type { PacingDeferredTripleDayCoach } from '../engine/pacing-deferred-triple-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PacingDeferredTripleDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PacingDeferredTripleDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="pacing-deferred-triple-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-950/60 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
