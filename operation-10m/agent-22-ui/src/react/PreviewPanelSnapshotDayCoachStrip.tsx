import React from 'react';
import type { PreviewPanelSnapshotDayCoach } from '../engine/preview-panel-snapshot-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PreviewPanelSnapshotDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PreviewPanelSnapshotDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="preview-panel-snapshot-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-yellow-700/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
