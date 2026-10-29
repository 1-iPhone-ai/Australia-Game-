import React from 'react';
import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { evaluateShowAllOverrideSafety } from '../engine/show-all-progressive-safety.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface ShowAllSafetyCoachBannerProps {
  persisted: EvolvingUiPersistedState;
  policy: EvolvingUiAccessPolicy;
  signals: ProgressionSignalSnapshot;
  phase: V94StandardizedGamePhase;
  accessibility: AccessibilitySettingsSnapshot;
}

export function ShowAllSafetyCoachBanner({
  persisted,
  policy,
  signals,
  phase,
  accessibility,
}: ShowAllSafetyCoachBannerProps): React.ReactElement | null {
  const assessment = evaluateShowAllOverrideSafety({ persisted, phase, signals, policy });
  if (!assessment.coachCopy) return null;

  return (
    <div
      data-testid="show-all-safety-coach-banner"
      role="status"
      aria-live="polite"
      className="text-xs border border-yellow-500/35 rounded p-2"
      style={mergeHighContrastChromeStyle(accessibility)}
    >
      {assessment.coachCopy}
    </div>
  );
}
