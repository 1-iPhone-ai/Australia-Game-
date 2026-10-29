import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import { evaluateShowAllOverrideSafety } from './show-all-progressive-safety.js';

export interface ShowAllPhaseRiskDayCoach {
  riskyPhase: boolean;
  coachCopy: string | null;
}

export function buildShowAllPhaseRiskDayCoach(input: {
  persisted: EvolvingUiPersistedState;
  phase: V94StandardizedGamePhase;
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
}): ShowAllPhaseRiskDayCoach {
  const assessment = evaluateShowAllOverrideSafety({
    persisted: input.persisted,
    phase: input.phase,
    signals: input.signals,
    policy: input.policy,
  });
  if (!assessment.overrideActive || !assessment.riskyPhase || !assessment.coachCopy) {
    return { riskyPhase: assessment.riskyPhase, coachCopy: null };
  }
  return {
    riskyPhase: true,
    coachCopy: `Day ${input.nextGameDay}: ${assessment.coachCopy}`,
  };
}
