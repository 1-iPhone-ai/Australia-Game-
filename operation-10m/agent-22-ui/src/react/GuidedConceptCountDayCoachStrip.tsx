import React from 'react';
import type { GuidedConceptCountDayCoach } from '../engine/guided-concept-count-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function GuidedConceptCountDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: GuidedConceptCountDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="guided-concept-count-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-fuchsia-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
