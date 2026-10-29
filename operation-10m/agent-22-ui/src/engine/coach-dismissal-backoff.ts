import type { EvolvingUiPersistedState } from '../sim/evolution-hooks.js';

export interface CoachDismissalBackoffState {
  coachDismissalStreak?: number;
  coachDismissalQuietUntilDay?: number;
}

export interface CoachDismissalRecordResult {
  streak: number;
  quietUntilDay: number;
  snoozeDays: number;
}

const MAX_SNOOZE_DAYS = 7;
const BASE_SNOOZE_DAYS = 2;

export function resolveCoachDismissalSnoozeDays(streak: number): number {
  const safe = Math.max(1, Math.floor(streak));
  return Math.min(MAX_SNOOZE_DAYS, BASE_SNOOZE_DAYS + safe - 1);
}

export function isCoachDismissalQuiet(
  persisted: CoachDismissalBackoffState,
  gameDay: number
): boolean {
  return persisted.coachDismissalQuietUntilDay != null && gameDay < persisted.coachDismissalQuietUntilDay;
}

export function recordCoachDismissal(
  persisted: CoachDismissalBackoffState,
  gameDay: number
): CoachDismissalRecordResult {
  const priorStreak = persisted.coachDismissalStreak ?? 0;
  const streak = priorStreak + 1;
  const snoozeDays = resolveCoachDismissalSnoozeDays(streak);
  const quietUntilDay = Math.max(gameDay + snoozeDays, gameDay + 1);
  return { streak, quietUntilDay, snoozeDays };
}

export function mergeCoachDismissalIntoPersisted(
  persisted: EvolvingUiPersistedState,
  record: CoachDismissalRecordResult
): EvolvingUiPersistedState {
  return {
    ...persisted,
    coachDismissalStreak: record.streak,
    coachDismissalQuietUntilDay: Math.max(
      persisted.coachDismissalQuietUntilDay ?? 0,
      record.quietUntilDay
    ),
  };
}

export function coachDismissalQuietCopy(quietUntilDay: number, gameDay: number): string {
  const remaining = Math.max(0, quietUntilDay - gameDay);
  if (remaining <= 0) return '';
  return remaining === 1
    ? 'Coaching stays quiet for the rest of today after repeated dismissals.'
    : `Coaching stays quiet for ${remaining} more days after repeated dismissals.`;
}

export function shouldAllowCoachSurface(
  gameDay: number,
  persisted: CoachDismissalBackoffState,
  snoozedUntilDay?: number
): boolean {
  if (snoozedUntilDay != null && gameDay < snoozedUntilDay) return false;
  if (isCoachDismissalQuiet(persisted, gameDay)) return false;
  return true;
}
