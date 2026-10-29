import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { evaluateShowAllOverrideSafety } from './show-all-progressive-safety.js';

export interface ShowAllProgressiveSafetyDayCoach {
  overrideActive: boolean;
  riskyPhase: boolean;
  coachCopy: string | null;
}

export function buildShowAllProgressiveSafetyDayCoach(input: {
  persisted: EvolvingUiPersistedState;
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
}): ShowAllProgressiveSafetyDayCoach {
  const assessment = evaluateShowAllOverrideSafety({
    persisted: input.persisted,
    phase: input.phase,
    signals: input.signals,
    policy: input.policy,
  });
  const coachCopy = assessment.coachCopy ? `Day ${input.nextGameDay}: ${assessment.coachCopy}` : null;
  return {
    overrideActive: assessment.overrideActive,
    riskyPhase: assessment.riskyPhase,
    coachCopy,
  };
}
