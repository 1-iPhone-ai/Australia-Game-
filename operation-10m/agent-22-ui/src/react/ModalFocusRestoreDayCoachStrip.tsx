import React from 'react';
import type { ModalFocusRestoreDayCoach } from '../engine/modal-focus-restore-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function ModalFocusRestoreDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: ModalFocusRestoreDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="modal-focus-restore-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
