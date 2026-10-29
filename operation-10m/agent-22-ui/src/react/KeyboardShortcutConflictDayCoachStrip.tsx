import React from 'react';
import type { KeyboardShortcutConflictDayCoach } from '../engine/keyboard-shortcut-conflict-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export function KeyboardShortcutConflictDayCoachStrip({
  coach,
  accessibility,
}: {
  coach: KeyboardShortcutConflictDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}): React.ReactElement | null {
  if (!coach.coachCopy) return null;
  return (
    <div
      data-testid="keyboard-shortcut-conflict-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-rose-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {coach.coachCopy}
    </div>
  );
}
