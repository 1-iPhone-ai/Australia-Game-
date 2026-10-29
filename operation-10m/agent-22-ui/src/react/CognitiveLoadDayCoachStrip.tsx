import React from 'react';
import type { CognitiveLoadDayCoach } from '../engine/cognitive-load-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface CognitiveLoadDayCoachStripProps {
  coach: CognitiveLoadDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}

export function CognitiveLoadDayCoachStrip({
  coach,
  accessibility,
}: CognitiveLoadDayCoachStripProps): React.ReactElement | null {
  if (!coach.coachCopy) return null;

  return (
    <div
      data-testid="cognitive-load-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-rose-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-load-band={coach.band}
    >
      {coach.coachCopy}
    </div>
  );
}
