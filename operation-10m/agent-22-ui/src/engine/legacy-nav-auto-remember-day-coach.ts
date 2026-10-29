import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import { buildLegacyNavAutoRememberPlan } from './legacy-nav-auto-remember-bridge.js';

export interface LegacyNavAutoRememberDayCoach {
  pendingRememberCount: number;
  coachCopy: string | null;
}

export function buildLegacyNavAutoRememberDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  persisted: EvolvingUiPersistedState;
  nextGameDay: number;
}): LegacyNavAutoRememberDayCoach {
  const plan = buildLegacyNavAutoRememberPlan(input.signals, input.policy, input.persisted);
  const coachCopy = plan.coachCopy ? `Day ${input.nextGameDay}: ${plan.coachCopy}` : null;
  return {
    pendingRememberCount: plan.panelIdsToRemember.length,
    coachCopy,
  };
}
