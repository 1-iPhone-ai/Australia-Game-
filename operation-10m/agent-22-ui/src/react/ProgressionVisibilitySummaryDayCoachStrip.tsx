import React from 'react';
import type { ProgressionVisibilitySummaryDayCoach } from '../engine/progression-visibility-summary-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ProgressionVisibilitySummaryDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ProgressionVisibilitySummaryDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="progression-visibility-summary-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-blue-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
