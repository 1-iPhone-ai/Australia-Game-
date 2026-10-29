import React from 'react';
import type { ShowAllPhaseRiskDayCoach } from '../engine/show-all-phase-risk-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ShowAllPhaseRiskDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ShowAllPhaseRiskDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="show-all-phase-risk-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-amber-700/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
