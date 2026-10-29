import React from 'react';
import type { TextScaleDensityAppliedDayCoach } from '../engine/text-scale-density-applied-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function TextScaleDensityAppliedDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: TextScaleDensityAppliedDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="text-scale-density-applied-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-teal-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
