import React from 'react';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  phaseShellVisibilitySummary,
  planPhaseShellVisibility,
} from '../engine/phase-shell-visibility-plan.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface PhaseShellVisibilityBannerProps {
  phase: V94StandardizedGamePhase;
  accessibility: AccessibilitySettingsSnapshot;
}

export function PhaseShellVisibilityBanner({
  phase,
  accessibility,
}: PhaseShellVisibilityBannerProps): React.ReactElement | null {
  const plan = planPhaseShellVisibility(phase);
  const copy = plan.coachCopy ?? `Phase ${phase}: ${phaseShellVisibilitySummary(plan)} visible.`;

  return (
    <div
      data-testid="phase-shell-visibility-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-sky-600/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-show-nav-rail={plan.showNavRail ? 'true' : 'false'}
    >
      {copy}
    </div>
  );
}
