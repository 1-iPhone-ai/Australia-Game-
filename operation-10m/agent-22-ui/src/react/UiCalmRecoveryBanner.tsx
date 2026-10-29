import React from 'react';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import { assessCognitiveLoad } from '../engine/cognitive-load-governor.js';
import {
  buildCalmRecoveryPatch,
  calmRecoveryCoachCopy,
  isCalmRecoveryActive,
  mergeCalmRecoveryIntoPersisted,
} from '../engine/ui-calm-recovery-policy.js';
import { shouldActivateFocusSession } from '../engine/focus-session-policy.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { buildFocusRingClassName } from '../a11y/aria-builders.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import {
  isAttentionSurfaceAllowed,
  planAttentionSurfaces,
} from '../engine/attention-budget-scheduler.js';

export interface UiCalmRecoveryBannerProps {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  persisted: EvolvingUiPersistedState;
  pendingCoachAnnouncements?: number;
  onApplyCalmRecovery?: (next: EvolvingUiPersistedState) => void;
}

export function UiCalmRecoveryBanner({
  phase,
  signals,
  policy,
  accessibility,
  persisted,
  pendingCoachAnnouncements = 0,
  onApplyCalmRecovery,
}: UiCalmRecoveryBannerProps): React.ReactElement | null {
  const focusSessionActive = shouldActivateFocusSession({
    phase,
    signals,
    policy,
    focusSessionSnoozedUntilDay: persisted.focusSessionSnoozedUntilDay,
  });

  const assessment = assessCognitiveLoad({
    signals,
    policy,
    focusSessionActive,
    pendingCoachAnnouncements,
  });

  const calmActive = isCalmRecoveryActive(persisted, signals.gameDay);
  const patch = buildCalmRecoveryPatch(assessment, signals.gameDay);

  const budget = planAttentionSurfaces({
    band: assessment.band,
    phase,
    candidates: [
      { id: 'cognitive_load_coach', priority: 2, requested: assessment.band !== 'light' },
      { id: 'focus_session_banner', priority: 1, requested: focusSessionActive },
      { id: 'panel_unlock_coach', priority: 3, requested: pendingCoachAnnouncements > 0 },
      {
        id: 'sim_evolution_bridge',
        priority: 4,
        requested: !calmActive && pendingCoachAnnouncements > 0,
      },
    ],
  });

  const showBanner =
    calmActive ||
    (patch != null && isAttentionSurfaceAllowed(budget, 'cognitive_load_coach'));

  if (!showBanner) return null;

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="ui-calm-recovery-banner"
      data-calm-active={calmActive ? 'true' : 'false'}
      data-attention-slots={budget.maxConcurrentSurfaces}
      role="status"
      aria-live="polite"
      className="text-sm border border-violet-500/40 rounded p-2 space-y-2"
    >
      <p>{calmRecoveryCoachCopy(calmActive)}</p>
      {!calmActive && patch && onApplyCalmRecovery ? (
        <button
          type="button"
          data-testid="ui-calm-recovery-activate"
          className={`text-xs underline ${focusClass}`}
          onClick={() => onApplyCalmRecovery(mergeCalmRecoveryIntoPersisted(persisted, patch))}
        >
          Enable calm recovery
        </button>
      ) : null}
    </div>
  );
}
