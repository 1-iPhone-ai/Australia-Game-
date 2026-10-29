import React from 'react';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  buildCoachLandmarkReadingPlan,
  landmarkReadingCoachCopy,
} from '../engine/landmark-coach-plan.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface LandmarkReadingOrderCoachStripProps {
  phase: V94StandardizedGamePhase;
  accessibility: AccessibilitySettingsSnapshot;
}

export function LandmarkReadingOrderCoachStrip({
  phase,
  accessibility,
}: LandmarkReadingOrderCoachStripProps): React.ReactElement | null {
  if (!accessibility.keyboardNavigationHints) return null;
  const plan = buildCoachLandmarkReadingPlan(phase);
  const copy = landmarkReadingCoachCopy(plan);
  if (!copy) return null;

  return (
    <div
      data-testid="landmark-reading-order-coach-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-neutral-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
