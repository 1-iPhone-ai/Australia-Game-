import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  focusSessionCoachCopy,
  shouldActivateFocusSession,
} from './focus-session-policy.js';

export interface FocusSessionPolicyDayCoach {
  focusSessionActive: boolean;
  coachCopy: string | null;
}

export function buildFocusSessionPolicyDayCoach(input: {
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  focusSessionSnoozedUntilDay?: number;
  nextGameDay: number;
}): FocusSessionPolicyDayCoach {
  const ctx = {
    phase: input.phase,
    signals: input.signals,
    policy: input.policy,
    focusSessionSnoozedUntilDay: input.focusSessionSnoozedUntilDay,
  };
  const focusSessionActive = shouldActivateFocusSession(ctx);
  const base = focusSessionCoachCopy(ctx);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return { focusSessionActive, coachCopy };
}
