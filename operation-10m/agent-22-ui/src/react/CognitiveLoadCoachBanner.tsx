import React from 'react';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import {
  assessCognitiveLoad,
  shouldShowCognitiveLoadCoach,
  snoozeCognitiveLoadCoachUntilDay,
} from '../engine/cognitive-load-governor.js';
import { buildFocusRingClassName } from '../a11y/aria-builders.js';
import { shouldActivateFocusSession } from '../engine/focus-session-policy.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { shouldAllowCoachSurface } from '../engine/coach-dismissal-backoff.js';
import type { CoachDismissalBackoffState } from '../engine/coach-dismissal-backoff.js';
import {
  isAttentionCoachSurfaceVisible,
  planAttentionSurfaceGate,
} from '../engine/attention-surface-gate.js';

export interface CognitiveLoadCoachBannerProps {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  accessibility: AccessibilitySettingsSnapshot;
  cognitiveLoadCoachSnoozedUntilDay?: number;
  coachDismissalBackoff?: CoachDismissalBackoffState;
  focusSessionSnoozedUntilDay?: number;
  pendingCoachAnnouncements?: number;
  onboardingEnabled?: boolean;
  focusSessionBannerActive?: boolean;
  onSnooze?: (untilDay: number) => void;
}

export function CognitiveLoadCoachBanner({
  phase,
  signals,
  policy,
  accessibility,
  cognitiveLoadCoachSnoozedUntilDay,
  coachDismissalBackoff,
  focusSessionSnoozedUntilDay,
  pendingCoachAnnouncements = 0,
  onboardingEnabled = true,
  focusSessionBannerActive = false,
  onSnooze,
}: CognitiveLoadCoachBannerProps): React.ReactElement | null {
  const focusSessionActive = shouldActivateFocusSession({
    phase,
    signals,
    policy,
    focusSessionSnoozedUntilDay,
  });

  const assessment = assessCognitiveLoad({
    signals,
    policy,
    onboardingEnabled,
    focusSessionActive,
    pendingCoachAnnouncements,
  });

  if (
    !shouldShowCognitiveLoadCoach(assessment, signals.gameDay, cognitiveLoadCoachSnoozedUntilDay) ||
    !shouldAllowCoachSurface(signals.gameDay, coachDismissalBackoff ?? {}, cognitiveLoadCoachSnoozedUntilDay)
  ) {
    return null;
  }

  const attentionPlan = planAttentionSurfaceGate({
    band: assessment.band,
    phase,
    cognitiveLoadCoachRequested: true,
    focusSessionBannerRequested: focusSessionBannerActive,
  });

  if (!isAttentionCoachSurfaceVisible(attentionPlan, 'cognitive_load_coach')) {
    return null;
  }

  const focusClass = buildFocusRingClassName({
    highContrast: accessibility.highContrastFocusRings,
    style: accessibility.focusRingStyle,
  });

  return (
    <div
      data-testid="cognitive-load-coach-banner"
      data-load-band={assessment.band}
      role="status"
      aria-live="polite"
      className="text-sm border border-sky-500/40 rounded p-2"
    >
      <p>{assessment.coachCopy}</p>
      {assessment.recommendDeferCoach ? (
        <p className="text-xs opacity-80" data-testid="cognitive-load-defer-hint">
          Unlock coaching will wait until the interface catches up.
        </p>
      ) : null}
      {assessment.recommendCollapseQuickActions ? (
        <p className="text-xs opacity-80" data-testid="cognitive-load-quick-actions-hint">
          Quick actions may collapse while load is {assessment.band}.
        </p>
      ) : null}
      <button
        type="button"
        className={focusClass}
        data-testid="cognitive-load-snooze"
        onClick={() => onSnooze?.(snoozeCognitiveLoadCoachUntilDay(signals.gameDay))}
      >
        Snooze load coach
      </button>
    </div>
  );
}
