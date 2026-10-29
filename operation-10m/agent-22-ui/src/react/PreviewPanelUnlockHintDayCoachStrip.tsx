import React from 'react';
import type { PreviewPanelUnlockHintDayCoach } from '../engine/preview-panel-unlock-hint-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PreviewPanelUnlockHintDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PreviewPanelUnlockHintDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="preview-panel-unlock-hint-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-cyan-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
