import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import {
  coachDismissalQuietCopy,
  isCoachDismissalQuiet,
} from './coach-dismissal-backoff.js';

export interface CoachDismissalBackoffDayCoach {
  quietActive: boolean;
  dismissalStreak: number;
  coachCopy: string | null;
}

export function buildCoachDismissalBackoffDayCoach(input: {
  persisted: EvolvingUiPersistedState;
  nextGameDay: number;
}): CoachDismissalBackoffDayCoach {
  const quietActive = isCoachDismissalQuiet(input.persisted, input.nextGameDay);
  const quietUntil = input.persisted.coachDismissalQuietUntilDay;
  let coachCopy: string | null = null;
  if (quietActive && quietUntil != null) {
    const base = coachDismissalQuietCopy(quietUntil, input.nextGameDay);
    coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  }
  return {
    quietActive,
    dismissalStreak: input.persisted.coachDismissalStreak ?? 0,
    coachCopy,
  };
}
