import React from 'react';
import type { CalmRecoveryStatusDayCoach } from '../engine/calm-recovery-status-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function CalmRecoveryStatusDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: CalmRecoveryStatusDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="calm-recovery-status-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-sky-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
