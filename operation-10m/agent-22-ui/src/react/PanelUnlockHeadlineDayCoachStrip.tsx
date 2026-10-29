import React from 'react';
import type { PanelUnlockHeadlineDayCoach } from '../engine/panel-unlock-headline-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PanelUnlockHeadlineDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PanelUnlockHeadlineDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="panel-unlock-headline-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-amber-500/40 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
