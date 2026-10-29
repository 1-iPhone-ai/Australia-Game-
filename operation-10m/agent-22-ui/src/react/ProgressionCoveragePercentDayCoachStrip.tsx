import React from 'react';
import type { ProgressionCoveragePercentDayCoach } from '../engine/progression-coverage-percent-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ProgressionCoveragePercentDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ProgressionCoveragePercentDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="progression-coverage-percent-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-sky-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
