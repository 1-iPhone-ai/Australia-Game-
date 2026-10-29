import React from 'react';
import type { ImmediateCoachBatchDayCoach } from '../engine/immediate-coach-batch-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ImmediateCoachBatchDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ImmediateCoachBatchDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="immediate-coach-batch-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
