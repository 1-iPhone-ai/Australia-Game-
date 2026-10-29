import React from 'react';
import type { LegacyNavProgressionHiddenDayCoach } from '../engine/legacy-nav-progression-hidden-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LegacyNavProgressionHiddenDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LegacyNavProgressionHiddenDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="legacy-nav-progression-hidden-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-orange-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
