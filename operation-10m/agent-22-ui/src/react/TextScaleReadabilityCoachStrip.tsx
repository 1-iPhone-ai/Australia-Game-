import React from 'react';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { UiDensityTier } from '../engine/ui-density-progression.js';
import { assessTextScaleReadability } from '../engine/text-scale-readability-coach.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface TextScaleReadabilityCoachStripProps {
  accessibility: AccessibilitySettingsSnapshot;
  activeDensity: UiDensityTier;
}

export function TextScaleReadabilityCoachStrip({
  accessibility,
  activeDensity,
}: TextScaleReadabilityCoachStripProps): React.ReactElement | null {
  const assessment = assessTextScaleReadability({ accessibility, activeDensity });
  if (!assessment.coachCopy) return null;

  return (
    <div
      data-testid="text-scale-readability-coach-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-orange-400/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {assessment.coachCopy}
    </div>
  );
}
