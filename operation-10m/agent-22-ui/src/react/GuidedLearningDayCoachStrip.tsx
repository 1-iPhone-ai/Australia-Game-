import React from 'react';
import type { GuidedLearningDayCoach } from '../engine/guided-learning-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function GuidedLearningDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: GuidedLearningDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="guided-learning-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
