import React from 'react';
import type { MotionTimingDayCoach } from '../engine/motion-timing-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function MotionTimingDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: MotionTimingDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="motion-timing-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-fuchsia-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-reduced-motion={coach.reducedMotion ? 'true' : 'false'}
    >
      {coach.coachCopy}
    </div>
  );
}
