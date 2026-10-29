import React from 'react';
import type { PhaseShellVisibilityDayCoach } from '../engine/phase-shell-visibility-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface PhaseShellVisibilityDayCoachStripProps {
  coach: PhaseShellVisibilityDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}

export function PhaseShellVisibilityDayCoachStrip({
  coach,
  accessibility,
}: PhaseShellVisibilityDayCoachStripProps): React.ReactElement | null {
  if (!coach.coachCopy) return null;

  return (
    <div
      data-testid="phase-shell-visibility-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-phase={coach.phase}
      data-summary={coach.shellSummary}
    >
      {coach.coachCopy}
    </div>
  );
}
