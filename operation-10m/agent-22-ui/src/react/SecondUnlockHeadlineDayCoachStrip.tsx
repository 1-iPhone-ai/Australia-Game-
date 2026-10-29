import React from 'react';
import type { SecondUnlockHeadlineDayCoach } from '../engine/second-unlock-headline-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function SecondUnlockHeadlineDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: SecondUnlockHeadlineDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="second-unlock-headline-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-700/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
