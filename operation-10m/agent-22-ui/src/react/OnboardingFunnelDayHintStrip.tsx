import React from 'react';
import type { OnboardingFunnelDayHint } from '../engine/onboarding-funnel-day-hint.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function OnboardingFunnelDayHintStrip({
  hint,
  accessibility,
}: {
  hint: OnboardingFunnelDayHint;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!hint.coachCopy) return null;
  return (
    <div
      data-testid="onboarding-funnel-day-hint"
      role="status"
      aria-live="polite"
      className="text-xs border border-green-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-active-steps={hint.activeStepCount}
    >
      {hint.coachCopy}
    </div>
  );
}
