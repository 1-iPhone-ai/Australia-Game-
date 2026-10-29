import React from 'react';
import type { ProgressionCoverageDayCoach } from '../engine/progression-coverage-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ProgressionCoverageDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ProgressionCoverageDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="progression-coverage-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-cyan-500/30 rounded p-2"
      data-coverage-tier={coach.tierLabel}
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
