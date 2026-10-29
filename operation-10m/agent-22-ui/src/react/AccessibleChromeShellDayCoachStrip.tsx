import React from 'react';
import type { AccessibleChromeShellDayCoach } from '../engine/accessible-chrome-shell-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function AccessibleChromeShellDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: AccessibleChromeShellDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="accessible-chrome-shell-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-gray-400/35 rounded p-2"
      data-density-tier={coach.densityTier}
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
