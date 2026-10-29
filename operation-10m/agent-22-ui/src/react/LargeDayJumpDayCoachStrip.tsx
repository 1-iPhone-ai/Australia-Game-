import React from 'react';
import type { LargeDayJumpDayCoach } from '../engine/large-day-jump-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LargeDayJumpDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LargeDayJumpDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="large-day-jump-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-yellow-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
