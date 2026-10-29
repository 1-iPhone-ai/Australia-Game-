import React from 'react';
import type { AttentionDeferralDayCoach } from '../engine/attention-deferral-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function AttentionDeferralDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: AttentionDeferralDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="attention-deferral-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-amber-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
