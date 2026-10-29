import React from 'react';
import type { TextScaleHintPendingDayCoach } from '../engine/text-scale-hint-pending-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function TextScaleHintPendingDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: TextScaleHintPendingDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="text-scale-hint-pending-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-teal-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
