import React from 'react';
import type { InterfaceLevelShiftDayCoach } from '../engine/interface-level-shift-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function InterfaceLevelShiftDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: InterfaceLevelShiftDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="interface-level-shift-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-lime-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
