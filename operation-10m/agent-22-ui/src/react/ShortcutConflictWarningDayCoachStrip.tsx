import React from 'react';
import type { ShortcutConflictWarningDayCoach } from '../engine/shortcut-conflict-warning-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ShortcutConflictWarningDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ShortcutConflictWarningDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="shortcut-conflict-warning-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-red-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
