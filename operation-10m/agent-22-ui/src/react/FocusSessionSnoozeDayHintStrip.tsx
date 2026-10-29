import React from 'react';
import type { FocusSessionSnoozeDayHint } from '../engine/focus-session-snooze-day-hint.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface FocusSessionSnoozeDayHintStripProps {
  hint: FocusSessionSnoozeDayHint;
  accessibility: AccessibilitySettingsSnapshot;
}

export function FocusSessionSnoozeDayHintStrip({
  hint,
  accessibility,
}: FocusSessionSnoozeDayHintStripProps): React.ReactElement | null {
  if (!hint.coachCopy) return null;

  return (
    <div
      data-testid="focus-session-snooze-day-hint"
      role="status"
      aria-live="polite"
      className="text-xs border border-indigo-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-snooze-active={hint.snoozeActive ? 'true' : 'false'}
    >
      {hint.coachCopy}
    </div>
  );
}
