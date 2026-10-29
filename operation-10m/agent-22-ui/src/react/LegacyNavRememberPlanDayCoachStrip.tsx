import React from 'react';
import type { LegacyNavRememberPlanDayCoach } from '../engine/legacy-nav-remember-plan-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LegacyNavRememberPlanDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LegacyNavRememberPlanDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="legacy-nav-remember-plan-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-orange-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
