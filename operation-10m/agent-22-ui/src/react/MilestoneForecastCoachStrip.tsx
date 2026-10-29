import React from 'react';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import {
  forecastUpcomingMilestones,
  milestoneForecastCoachCopy,
} from '../engine/milestone-forecast-coach.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface MilestoneForecastCoachStripProps {
  signals: ProgressionSignalSnapshot;
  accessibility: AccessibilitySettingsSnapshot;
}

export function MilestoneForecastCoachStrip({
  signals,
  accessibility,
}: MilestoneForecastCoachStripProps): React.ReactElement | null {
  const entries = forecastUpcomingMilestones(signals, 2);
  const copy = milestoneForecastCoachCopy(entries);
  if (!copy) return null;

  return (
    <div
      data-testid="milestone-forecast-coach-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-purple-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
