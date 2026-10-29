import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import { calmRecoveryCoachCopy, isCalmRecoveryActive } from './ui-calm-recovery-policy.js';

export interface CalmRecoveryActiveStatusDayCoach {
  active: boolean;
  coachCopy: string | null;
}

export function buildCalmRecoveryActiveStatusDayCoach(input: {
  persisted: EvolvingUiPersistedState;
  nextGameDay: number;
}): CalmRecoveryActiveStatusDayCoach {
  const active = isCalmRecoveryActive(input.persisted, input.nextGameDay);
  if (!active) {
    return { active: false, coachCopy: null };
  }
  return {
    active: true,
    coachCopy: `Day ${input.nextGameDay}: ${calmRecoveryCoachCopy(true)}`,
  };
}
