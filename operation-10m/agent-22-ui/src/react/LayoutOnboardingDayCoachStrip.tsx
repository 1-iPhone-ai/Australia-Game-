import React from 'react';
import type { LayoutOnboardingDayCoach } from '../engine/layout-onboarding-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LayoutOnboardingDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LayoutOnboardingDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="layout-onboarding-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-orange-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
