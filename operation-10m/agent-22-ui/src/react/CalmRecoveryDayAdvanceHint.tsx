import React from 'react';
import type { DayAdvanceCalmRecoveryHint } from '../engine/day-advance-calm-recovery-hint.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface CalmRecoveryDayAdvanceHintProps {
  hint: DayAdvanceCalmRecoveryHint;
  accessibility: AccessibilitySettingsSnapshot;
}

export function CalmRecoveryDayAdvanceHint({
  hint,
  accessibility,
}: CalmRecoveryDayAdvanceHintProps): React.ReactElement | null {
  if (!hint.coachCopy) return null;

  return (
    <div
      data-testid="calm-recovery-day-advance-hint"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-suggest-calm={hint.suggestCalmRecovery ? 'true' : 'false'}
    >
      {hint.coachCopy}
    </div>
  );
}
