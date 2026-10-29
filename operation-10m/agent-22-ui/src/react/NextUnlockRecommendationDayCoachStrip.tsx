import React from 'react';
import type { NextUnlockRecommendationDayCoach } from '../engine/next-unlock-recommendation-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function NextUnlockRecommendationDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: NextUnlockRecommendationDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="next-unlock-recommendation-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
