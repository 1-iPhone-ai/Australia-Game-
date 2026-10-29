import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { evaluateShowAllOverrideSafety } from './show-all-progressive-safety.js';

export interface ShowAllOverrideDayHint {
  overrideActive: boolean;
  riskyPhase: boolean;
  coachCopy: string | null;
}

export function buildShowAllOverrideDayHint(input: {
  persisted: EvolvingUiPersistedState;
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
}): ShowAllOverrideDayHint {
  const assessment = evaluateShowAllOverrideSafety({
    persisted: input.persisted,
    phase: input.phase,
    signals: input.signals,
    policy: input.policy,
  });

  let coachCopy = assessment.coachCopy;
  if (assessment.overrideActive && assessment.coachCopy) {
    coachCopy = `Day ${input.nextGameDay}: ${assessment.coachCopy}`;
  }

  return {
    overrideActive: assessment.overrideActive,
    riskyPhase: assessment.riskyPhase,
    coachCopy,
  };
}
