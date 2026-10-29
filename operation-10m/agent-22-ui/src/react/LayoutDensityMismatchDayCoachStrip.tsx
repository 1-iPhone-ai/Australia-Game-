import React from 'react';
import type { LayoutDensityMismatchDayCoach } from '../engine/layout-density-mismatch-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LayoutDensityMismatchDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LayoutDensityMismatchDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="layout-density-mismatch-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-orange-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
