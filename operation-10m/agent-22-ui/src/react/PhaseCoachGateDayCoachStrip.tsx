import React from 'react';
import type { PhaseCoachGateDayCoach } from '../engine/phase-coach-gate-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PhaseCoachGateDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PhaseCoachGateDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="phase-coach-gate-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-purple-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
