import React from 'react';
import type { RememberedPanelRosterDayCoach } from '../engine/remembered-panel-roster-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function RememberedPanelRosterDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: RememberedPanelRosterDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="remembered-panel-roster-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-stone-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
