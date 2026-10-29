import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  listPanelsSuppressedByFocusSession,
  shouldActivateFocusSession,
} from './focus-session-policy.js';

export interface FocusSessionSuppressionSummary {
  active: boolean;
  suppressedPanelIds: string[];
  suppressedCount: number;
  coachCopy: string | null;
}

export function summarizeFocusSessionSuppression(input: {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  focusSessionSnoozedUntilDay?: number;
}): FocusSessionSuppressionSummary {
  const ctx = {
    phase: input.phase,
    signals: input.signals,
    policy: input.policy,
    focusSessionSnoozedUntilDay: input.focusSessionSnoozedUntilDay,
  };
  const active = shouldActivateFocusSession(ctx);
  const suppressedPanelIds = listPanelsSuppressedByFocusSession(
    input.signals,
    input.policy,
    input.phase,
    input.focusSessionSnoozedUntilDay
  );

  let coachCopy: string | null = null;
  if (active && suppressedPanelIds.length) {
    coachCopy = `Focus session tucks ${suppressedPanelIds.length} advanced panels into preview mode.`;
  }

  return {
    active,
    suppressedPanelIds,
    suppressedCount: suppressedPanelIds.length,
    coachCopy,
  };
}
