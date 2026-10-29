import React from 'react';
import type { PacingImmediateBatchDayCoach } from '../engine/pacing-immediate-batch-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PacingImmediateBatchDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PacingImmediateBatchDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="pacing-immediate-batch-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-fuchsia-700/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
