import React from 'react';
import type { DayAdvanceCalmRecoveryDayCoach } from '../engine/day-advance-calm-recovery-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function DayAdvanceCalmRecoveryDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: DayAdvanceCalmRecoveryDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="day-advance-calm-recovery-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-teal-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
