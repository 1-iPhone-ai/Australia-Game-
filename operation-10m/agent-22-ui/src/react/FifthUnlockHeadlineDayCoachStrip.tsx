import React from 'react';
import type { FifthUnlockHeadlineDayCoach } from '../engine/fifth-unlock-headline-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function FifthUnlockHeadlineDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: FifthUnlockHeadlineDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="fifth-unlock-headline-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-950/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
