import React from 'react';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import type { CognitiveLoadBand } from '../engine/cognitive-load-governor.js';
import {
  phaseCoachGateCopy,
  planPhaseCoachSurfaces,
} from '../engine/phase-coach-gate.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface PhaseCoachGateBannerProps {
  phase: V94StandardizedGamePhase;
  cognitiveBand?: CognitiveLoadBand;
  accessibility: AccessibilitySettingsSnapshot;
}

export function PhaseCoachGateBanner({
  phase,
  cognitiveBand = 'moderate',
  accessibility,
}: PhaseCoachGateBannerProps): React.ReactElement | null {
  const plan = planPhaseCoachSurfaces(phase, cognitiveBand);
  const copy = phaseCoachGateCopy(plan);
  if (!copy) return null;

  return (
    <div
      data-testid="phase-coach-gate-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-orange-500/30 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {copy}
    </div>
  );
}
