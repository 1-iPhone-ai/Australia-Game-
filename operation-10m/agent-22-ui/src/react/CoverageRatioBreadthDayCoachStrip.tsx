import React from 'react';
import type { CoverageRatioBreadthDayCoach } from '../engine/coverage-ratio-breadth-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function CoverageRatioBreadthDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: CoverageRatioBreadthDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="coverage-ratio-breadth-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-emerald-950/60 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
