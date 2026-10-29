import React from 'react';
import type { TextScaleDensityDayHint } from '../engine/text-scale-density-day-hint.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface TextScaleDensityDayHintStripProps {
  hint: TextScaleDensityDayHint;
  accessibility: AccessibilitySettingsSnapshot;
}

export function TextScaleDensityDayHintStrip({
  hint,
  accessibility,
}: TextScaleDensityDayHintStripProps): React.ReactElement | null {
  if (!hint.coachCopy) return null;

  return (
    <div
      data-testid="text-scale-density-day-hint"
      role="status"
      aria-live="polite"
      className="text-xs border border-amber-400/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-density={hint.activeDensity}
      data-suggest-change={hint.shouldSuggestDensityChange ? 'true' : 'false'}
    >
      {hint.coachCopy}
    </div>
  );
}
