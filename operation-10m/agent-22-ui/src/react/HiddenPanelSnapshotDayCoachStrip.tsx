import React from 'react';
import type { HiddenPanelSnapshotDayCoach } from '../engine/hidden-panel-snapshot-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function HiddenPanelSnapshotDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: HiddenPanelSnapshotDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="hidden-panel-snapshot-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-neutral-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
