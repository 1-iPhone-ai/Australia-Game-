import React from 'react';
import type { LegacyNavRememberAppliedDayCoach } from '../engine/legacy-nav-remember-applied-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LegacyNavRememberAppliedDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LegacyNavRememberAppliedDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="legacy-nav-remember-applied-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-orange-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
