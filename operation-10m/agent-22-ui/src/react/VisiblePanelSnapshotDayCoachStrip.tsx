import React from 'react';
import type { VisiblePanelSnapshotDayCoach } from '../engine/visible-panel-snapshot-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function VisiblePanelSnapshotDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: VisiblePanelSnapshotDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="visible-panel-snapshot-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-amber-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
