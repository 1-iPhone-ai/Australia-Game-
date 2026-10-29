import React from 'react';
import type { SixthUnlockHeadlineDayCoach } from '../engine/sixth-unlock-headline-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function SixthUnlockHeadlineDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: SixthUnlockHeadlineDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="sixth-unlock-headline-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-950/50 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
