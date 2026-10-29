import React from 'react';
import type { HiddenPanelBreadthDayCoach } from '../engine/hidden-panel-breadth-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function HiddenPanelBreadthDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: HiddenPanelBreadthDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="hidden-panel-breadth-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-slate-950/60 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
