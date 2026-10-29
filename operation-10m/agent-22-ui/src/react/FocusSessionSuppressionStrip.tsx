import React from 'react';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { summarizeFocusSessionSuppression } from '../engine/focus-session-suppression-summary.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface FocusSessionSuppressionStripProps {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  focusSessionSnoozedUntilDay?: number;
  accessibility: AccessibilitySettingsSnapshot;
}

export function FocusSessionSuppressionStrip({
  phase,
  signals,
  policy,
  focusSessionSnoozedUntilDay,
  accessibility,
}: FocusSessionSuppressionStripProps): React.ReactElement | null {
  const summary = summarizeFocusSessionSuppression({
    phase,
    signals,
    policy,
    focusSessionSnoozedUntilDay,
  });
  if (!summary.coachCopy) return null;

  return (
    <div
      data-testid="focus-session-suppression-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-violet-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-suppressed-count={summary.suppressedCount}
    >
      {summary.coachCopy}
    </div>
  );
}
