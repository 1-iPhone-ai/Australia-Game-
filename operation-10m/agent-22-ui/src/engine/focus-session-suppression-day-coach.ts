import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { summarizeFocusSessionSuppression } from './focus-session-suppression-summary.js';

export interface FocusSessionSuppressionDayCoach {
  active: boolean;
  suppressedCount: number;
  coachCopy: string | null;
}

export function buildFocusSessionSuppressionDayCoach(input: {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  focusSessionSnoozedUntilDay?: number;
  nextGameDay: number;
}): FocusSessionSuppressionDayCoach {
  const summary = summarizeFocusSessionSuppression({
    phase: input.phase,
    signals: input.signals,
    policy: input.policy,
    focusSessionSnoozedUntilDay: input.focusSessionSnoozedUntilDay,
  });
  const coachCopy = summary.coachCopy ? `Day ${input.nextGameDay}: ${summary.coachCopy}` : null;
  return {
    active: summary.active,
    suppressedCount: summary.suppressedCount,
    coachCopy,
  };
}
