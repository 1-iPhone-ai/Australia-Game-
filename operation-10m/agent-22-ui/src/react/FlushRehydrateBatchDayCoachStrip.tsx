import React from 'react';
import type { FlushRehydrateBatchDayCoach } from '../engine/flush-rehydrate-batch-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function FlushRehydrateBatchDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: FlushRehydrateBatchDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="flush-rehydrate-batch-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-cyan-700/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
