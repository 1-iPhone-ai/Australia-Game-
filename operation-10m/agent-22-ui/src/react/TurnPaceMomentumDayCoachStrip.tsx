import React from 'react';
import type { TurnPaceMomentumDayCoach } from '../engine/turn-pace-momentum-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function TurnPaceMomentumDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: TurnPaceMomentumDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="turn-pace-momentum-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-orange-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
