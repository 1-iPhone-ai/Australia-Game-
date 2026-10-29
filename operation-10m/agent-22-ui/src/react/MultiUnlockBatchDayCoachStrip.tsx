import React from 'react';
import type { MultiUnlockBatchDayCoach } from '../engine/multi-unlock-batch-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function MultiUnlockBatchDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: MultiUnlockBatchDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="multi-unlock-batch-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-amber-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
