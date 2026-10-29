import React from 'react';
import type { OnboardingHighlightRosterDayCoach } from '../engine/onboarding-highlight-roster-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function OnboardingHighlightRosterDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: OnboardingHighlightRosterDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="onboarding-highlight-roster-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-pink-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
