import React from 'react';
import type { LegacyNavPatchCoverageDayCoach } from '../engine/legacy-nav-patch-coverage-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function LegacyNavPatchCoverageDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: LegacyNavPatchCoverageDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="legacy-nav-patch-coverage-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-stone-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
