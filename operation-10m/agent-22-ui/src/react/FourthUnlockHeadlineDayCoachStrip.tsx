import React from 'react';
import type { FourthUnlockHeadlineDayCoach } from '../engine/fourth-unlock-headline-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function FourthUnlockHeadlineDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: FourthUnlockHeadlineDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="fourth-unlock-headline-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-900/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
