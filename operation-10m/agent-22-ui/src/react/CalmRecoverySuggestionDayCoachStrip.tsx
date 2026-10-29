import React from 'react';
import type { CalmRecoverySuggestionDayCoach } from '../engine/calm-recovery-suggestion-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function CalmRecoverySuggestionDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: CalmRecoverySuggestionDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="calm-recovery-suggestion-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-green-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
