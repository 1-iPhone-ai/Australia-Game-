import React from 'react';
import type { ShowAllOverrideDayHint } from '../engine/show-all-override-day-hint.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface ShowAllOverrideDayHintStripProps {
  hint: ShowAllOverrideDayHint;
  accessibility: AccessibilitySettingsSnapshot;
}

export function ShowAllOverrideDayHintStrip({
  hint,
  accessibility,
}: ShowAllOverrideDayHintStripProps): React.ReactElement | null {
  if (!hint.coachCopy) return null;

  return (
    <div
      data-testid="show-all-override-day-hint"
      role="status"
      aria-live="polite"
      className="text-xs border border-orange-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-override-active={hint.overrideActive ? 'true' : 'false'}
      data-risky-phase={hint.riskyPhase ? 'true' : 'false'}
    >
      {hint.coachCopy}
    </div>
  );
}
