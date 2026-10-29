import React from 'react';
import type { ProgressionCoverageTierDayCoach } from '../engine/progression-coverage-tier-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ProgressionCoverageTierDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ProgressionCoverageTierDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="progression-coverage-tier-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-sky-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
