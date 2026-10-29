import React from 'react';
import type { PacingDeferredPairDayCoach } from '../engine/pacing-deferred-pair-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PacingDeferredPairDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PacingDeferredPairDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="pacing-deferred-pair-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-pink-700/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
