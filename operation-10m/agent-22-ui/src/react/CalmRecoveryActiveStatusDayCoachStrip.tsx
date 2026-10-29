import React from 'react';
import type { CalmRecoveryActiveStatusDayCoach } from '../engine/calm-recovery-active-status-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function CalmRecoveryActiveStatusDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: CalmRecoveryActiveStatusDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="calm-recovery-active-status-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-green-700/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
