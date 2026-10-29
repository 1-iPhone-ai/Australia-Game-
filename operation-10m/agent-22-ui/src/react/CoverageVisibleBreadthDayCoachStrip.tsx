import React from 'react';
import type { CoverageVisibleBreadthDayCoach } from '../engine/coverage-visible-breadth-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function CoverageVisibleBreadthDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: CoverageVisibleBreadthDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="coverage-visible-breadth-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-lime-700/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
