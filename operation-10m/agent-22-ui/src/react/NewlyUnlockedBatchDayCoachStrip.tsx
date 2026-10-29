import React from 'react';
import type { NewlyUnlockedBatchDayCoach } from '../engine/newly-unlocked-batch-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function NewlyUnlockedBatchDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: NewlyUnlockedBatchDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="newly-unlocked-batch-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-yellow-500/40 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
