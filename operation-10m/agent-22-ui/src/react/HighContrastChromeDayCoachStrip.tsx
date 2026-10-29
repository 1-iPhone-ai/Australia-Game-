import React from 'react';
import type { HighContrastChromeDayCoach } from '../engine/high-contrast-chrome-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface HighContrastChromeDayCoachStripProps {
  coach: HighContrastChromeDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}

export function HighContrastChromeDayCoachStrip({
  coach,
  accessibility,
}: HighContrastChromeDayCoachStripProps): React.ReactElement | null {
  if (!coach.coachCopy) return null;

  return (
    <div
      data-testid="high-contrast-chrome-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-hc-elevated={coach.elevated ? 'true' : 'false'}
    >
      {coach.coachCopy}
    </div>
  );
}
