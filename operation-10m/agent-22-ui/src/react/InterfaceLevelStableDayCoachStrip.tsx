import React from 'react';
import type { InterfaceLevelStableDayCoach } from '../engine/interface-level-stable-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function InterfaceLevelStableDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: InterfaceLevelStableDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="interface-level-stable-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-teal-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
