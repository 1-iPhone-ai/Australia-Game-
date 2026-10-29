import React from 'react';
import type { NearestMilestoneEtaDayCoach } from '../engine/nearest-milestone-eta-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function NearestMilestoneEtaDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: NearestMilestoneEtaDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="nearest-milestone-eta-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
