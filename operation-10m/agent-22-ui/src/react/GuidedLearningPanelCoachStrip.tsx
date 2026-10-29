import React from 'react';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import {
  buildGuidedLearningPanelHints,
  guidedLearningPanelCoachCopy,
} from '../engine/guided-learning-panel-bridge.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface GuidedLearningPanelCoachStripProps {
  signals: ProgressionSignalSnapshot;
  accessibility: AccessibilitySettingsSnapshot;
}

export function GuidedLearningPanelCoachStrip({
  signals,
  accessibility,
}: GuidedLearningPanelCoachStripProps): React.ReactElement | null {
  const hints = buildGuidedLearningPanelHints(signals);
  const copy = guidedLearningPanelCoachCopy(hints);
  if (!copy) return null;

  return (
    <div
      data-testid="guided-learning-panel-coach-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-pink-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
