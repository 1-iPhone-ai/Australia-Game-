import React from 'react';
import type { KeyboardHintsDayCoach } from '../engine/keyboard-hints-day-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface KeyboardHintsDayCoachStripProps {
  coach: KeyboardHintsDayCoach;
  accessibility: AccessibilitySettingsSnapshot;
}

export function KeyboardHintsDayCoachStrip({
  coach,
  accessibility,
}: KeyboardHintsDayCoachStripProps): React.ReactElement | null {
  if (!coach.coachCopy) return null;

  return (
    <div
      data-testid="keyboard-hints-day-coach"
      role="status"
      aria-live="polite"
      className="text-xs border border-cyan-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-shortcut-count={coach.shortcutCount}
    >
      {coach.coachCopy}
    </div>
  );
}
