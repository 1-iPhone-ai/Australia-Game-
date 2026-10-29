import React from 'react';
import type { FirstUnlockHeadlineDayCoach } from '../engine/first-unlock-headline-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function FirstUnlockHeadlineDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: FirstUnlockHeadlineDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="first-unlock-headline-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
