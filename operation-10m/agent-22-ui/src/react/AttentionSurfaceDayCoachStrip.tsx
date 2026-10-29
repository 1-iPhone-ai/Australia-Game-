import React from 'react';
import type { AttentionSurfaceDayCoach } from '../engine/attention-surface-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function AttentionSurfaceDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: AttentionSurfaceDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="attention-surface-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-orange-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
