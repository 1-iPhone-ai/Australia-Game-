import React from 'react';
import type { ProgressionCoverageDeltaDayCoach } from '../engine/progression-coverage-delta-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ProgressionCoverageDeltaDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ProgressionCoverageDeltaDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="progression-coverage-delta-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-teal-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
