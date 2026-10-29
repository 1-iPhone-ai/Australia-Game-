import React from 'react';
import type { FocusSessionSuppressionDayCoach } from '../engine/focus-session-suppression-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function FocusSessionSuppressionDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: FocusSessionSuppressionDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="focus-session-suppression-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
