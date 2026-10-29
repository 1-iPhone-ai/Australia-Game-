import React from 'react';
import type { LegacyNavAutoRememberDayCoach } from '../engine/legacy-nav-auto-remember-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LegacyNavAutoRememberDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LegacyNavAutoRememberDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="legacy-nav-auto-remember-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-stone-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
