import React from 'react';
import type { LegacyNavMissingPatchDayCoach } from '../engine/legacy-nav-missing-patch-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LegacyNavMissingPatchDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LegacyNavMissingPatchDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="legacy-nav-missing-patch-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-red-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
