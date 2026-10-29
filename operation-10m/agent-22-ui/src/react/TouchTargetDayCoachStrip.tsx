import React from 'react';
import type { TouchTargetDayCoach } from '../engine/touch-target-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface TouchTargetDayCoachStripProps {
  coach: TouchTargetDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}

export function TouchTargetDayCoachStrip({
  coach,
  accessibility,
}: TouchTargetDayCoachStripProps): React.ReactElement | null {
  if (!coach.coachCopy) return null;

  return (
    <div
      data-testid="touch-target-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-lime-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-touch-min-px={coach.minTouchPx}
    >
      {coach.coachCopy}
    </div>
  );
}
