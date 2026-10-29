import React from 'react';
import type { PreviewPanelBreadthDayCoach } from '../engine/preview-panel-breadth-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PreviewPanelBreadthDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PreviewPanelBreadthDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="preview-panel-breadth-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-yellow-800/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
