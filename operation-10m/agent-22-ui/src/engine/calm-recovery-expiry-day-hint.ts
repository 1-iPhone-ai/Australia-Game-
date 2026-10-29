import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import { isCalmRecoveryActive } from './ui-calm-recovery-policy.js';

export interface CalmRecoveryExpiryDayHint {
  active: boolean;
  expiresToday: boolean;
  expiresTomorrow: boolean;
  coachCopy: string | null;
}

export function buildCalmRecoveryExpiryDayHint(
  persisted: EvolvingUiPersistedState,
  gameDay: number
): CalmRecoveryExpiryDayHint {
  const untilDay = persisted.calmRecoveryUntilDay;
  const active = isCalmRecoveryActive(persisted, gameDay);
  const expiresToday = untilDay != null && gameDay + 1 === untilDay && active;
  const expiresTomorrow = untilDay != null && gameDay + 2 === untilDay && active;

  let coachCopy: string | null = null;
  if (expiresToday) {
    coachCopy = 'Calm recovery ends tomorrow — coaching surfaces return unless you extend it.';
  } else if (expiresTomorrow) {
    coachCopy = 'Calm recovery winds down in two days — plan for returning coach prompts.';
  } else if (!active && untilDay != null && gameDay === untilDay) {
    coachCopy = 'Calm recovery ended today — interface coaching is available again.';
  }

  return {
    active,
    expiresToday,
    expiresTomorrow,
    coachCopy,
  };
}
