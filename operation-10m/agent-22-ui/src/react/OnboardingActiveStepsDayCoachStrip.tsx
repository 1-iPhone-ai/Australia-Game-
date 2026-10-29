import React from 'react';
import type { OnboardingActiveStepsDayCoach } from '../engine/onboarding-active-steps-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function OnboardingActiveStepsDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: OnboardingActiveStepsDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="onboarding-active-steps-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-pink-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
