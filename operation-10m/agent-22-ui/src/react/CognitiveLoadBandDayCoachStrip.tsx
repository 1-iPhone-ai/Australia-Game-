import React from 'react';
import type { CognitiveLoadBandDayCoach } from '../engine/cognitive-load-band-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function CognitiveLoadBandDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: CognitiveLoadBandDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="cognitive-load-band-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-red-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
