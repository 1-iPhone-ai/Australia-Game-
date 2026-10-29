import React from 'react';
import type { CoachDismissalQuietDayHint } from '../engine/coach-dismissal-quiet-day-hint.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface CoachDismissalQuietDayHintStripProps {
  hint: CoachDismissalQuietDayHint;
  accessibility: AccessibilitySettingsSnapshot;
}

export function CoachDismissalQuietDayHintStrip({
  hint,
  accessibility,
}: CoachDismissalQuietDayHintStripProps): React.ReactElement | null {
  if (!hint.coachCopy) return null;

  return (
    <div
      data-testid="coach-dismissal-quiet-day-hint"
      role="status"
      aria-live="polite"
      className="text-xs border border-amber-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-quiet-active={hint.quietActive ? 'true' : 'false'}
      data-quiet-ends-today={hint.quietEndsToday ? 'true' : 'false'}
    >
      {hint.coachCopy}
    </div>
  );
}
