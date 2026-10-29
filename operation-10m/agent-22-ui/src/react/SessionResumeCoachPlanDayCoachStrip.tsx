import React from 'react';
import type { SessionResumeCoachPlanDayCoach } from '../engine/session-resume-coach-plan-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function SessionResumeCoachPlanDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: SessionResumeCoachPlanDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="session-resume-coach-plan-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-green-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
