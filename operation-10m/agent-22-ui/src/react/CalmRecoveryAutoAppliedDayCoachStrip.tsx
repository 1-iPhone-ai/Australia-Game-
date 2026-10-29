import React from 'react';
import type { CalmRecoveryAutoAppliedDayCoach } from '../engine/calm-recovery-auto-applied-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function CalmRecoveryAutoAppliedDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: CalmRecoveryAutoAppliedDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="calm-recovery-auto-applied-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-green-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
