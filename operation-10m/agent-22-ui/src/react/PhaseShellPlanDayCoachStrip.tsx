import React from 'react';
import type { PhaseShellPlanDayCoach } from '../engine/phase-shell-plan-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PhaseShellPlanDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PhaseShellPlanDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="phase-shell-plan-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-slate-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
