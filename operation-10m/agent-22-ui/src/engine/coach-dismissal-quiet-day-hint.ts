import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';
import {
  coachDismissalQuietCopy,
  isCoachDismissalQuiet,
} from './coach-dismissal-backoff.js';

export interface CoachDismissalQuietDayHint {
  quietActive: boolean;
  quietEndsToday: boolean;
  coachCopy: string | null;
}

export function buildCoachDismissalQuietDayHint(
  persisted: EvolvingUiPersistedState,
  gameDay: number
): CoachDismissalQuietDayHint {
  const quietUntil = persisted.coachDismissalQuietUntilDay;
  const quietActive = isCoachDismissalQuiet(persisted, gameDay);
  const quietEndsToday = quietUntil != null && gameDay + 1 === quietUntil && quietActive;

  let coachCopy: string | null = null;
  if (quietEndsToday) {
    coachCopy = 'Coach dismissal quiet period ends tomorrow — coaching surfaces may return.';
  } else if (quietActive && quietUntil != null) {
    coachCopy = coachDismissalQuietCopy(quietUntil, gameDay) || null;
  } else if (!quietActive && quietUntil != null && gameDay === quietUntil) {
    coachCopy = 'Coach dismissal quiet period ended today — interface coaching is available again.';
  }

  return {
    quietActive,
    quietEndsToday,
    coachCopy,
  };
}
