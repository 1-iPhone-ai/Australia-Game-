import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import { calmRecoveryCoachCopy, isCalmRecoveryActive } from './ui-calm-recovery-policy.js';

export interface CalmRecoveryStatusDayCoach {
  active: boolean;
  coachCopy: string | null;
}

export function buildCalmRecoveryStatusDayCoach(input: {
  persisted: EvolvingUiPersistedState;
  nextGameDay: number;
}): CalmRecoveryStatusDayCoach {
  const active = isCalmRecoveryActive(input.persisted, input.nextGameDay);
  const coachCopy = active ? `Day ${input.nextGameDay}: ${calmRecoveryCoachCopy(true)}` : null;
  return { active, coachCopy };
}
