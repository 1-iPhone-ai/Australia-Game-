import React from 'react';
import type { ProgressionSignalDeltaDayCoach } from '../engine/progression-signal-delta-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ProgressionSignalDeltaDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ProgressionSignalDeltaDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="progression-signal-delta-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-teal-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
