import React from 'react';
import type { PreviewHeavyCoverageDayCoach } from '../engine/preview-heavy-coverage-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function PreviewHeavyCoverageDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: PreviewHeavyCoverageDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="preview-heavy-coverage-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-cyan-600/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
