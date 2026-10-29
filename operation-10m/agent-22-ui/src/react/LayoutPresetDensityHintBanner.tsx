import React from 'react';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { UiDensityTier } from '../engine/ui-density-progression.js';
import type { V94LayoutPreset } from '../engine/layout-preset-evolution.js';
import {
  buildLayoutPresetDensityRecommendation,
  layoutDensityMismatchCopy,
} from '../engine/layout-preset-density-bridge.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface LayoutPresetDensityHintBannerProps {
  signals: ProgressionSignalSnapshot;
  activeDensity: UiDensityTier;
  preferredDensity?: UiDensityTier | null;
  accessibility: AccessibilitySettingsSnapshot;
}

export function LayoutPresetDensityHintBanner({
  signals,
  activeDensity,
  preferredDensity,
  accessibility,
}: LayoutPresetDensityHintBannerProps): React.ReactElement | null {
  const recommendation = buildLayoutPresetDensityRecommendation({
    layoutPreset: signals.layoutPreset as V94LayoutPreset | undefined,
    interfaceLevel: signals.interfaceLevel,
    preferredTier: preferredDensity,
  });
  const mismatch = layoutDensityMismatchCopy(recommendation.preset, activeDensity);
  const copy = mismatch ?? recommendation.coachCopy;

  return (
    <div
      data-testid="layout-preset-density-hint-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-lime-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
