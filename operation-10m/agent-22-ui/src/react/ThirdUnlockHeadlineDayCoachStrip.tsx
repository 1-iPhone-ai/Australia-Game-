import React from 'react';
import type { ThirdUnlockHeadlineDayCoach } from '../engine/third-unlock-headline-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ThirdUnlockHeadlineDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ThirdUnlockHeadlineDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="third-unlock-headline-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-800/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
