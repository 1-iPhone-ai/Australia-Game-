import React from 'react';
import type { ResponsiveNavRailDayCoach } from '../engine/responsive-nav-rail-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ResponsiveNavRailDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ResponsiveNavRailDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="responsive-nav-rail-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-blue-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-overflow-count={coach.overflowCount}
    >
      {coach.coachCopy}
    </div>
  );
}
