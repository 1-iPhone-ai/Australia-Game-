import React from 'react';
import type { GuidedLearningPanelDayCoach } from '../engine/guided-learning-panel-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function GuidedLearningPanelDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: GuidedLearningPanelDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="guided-learning-panel-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-lime-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
