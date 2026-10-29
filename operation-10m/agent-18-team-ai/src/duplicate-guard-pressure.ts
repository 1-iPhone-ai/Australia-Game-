import { AGENT18_LIMITS, DuplicateGuardState } from './types.ts';

export interface DuplicateGuardPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Score duplicate-guard reservation and commit-key load versus configured caps.
 */
export function measureDuplicateGuardPressure(guard: DuplicateGuardState): DuplicateGuardPressureReport {
  const notes: string[] = [];
  const reservationCount = Object.keys(guard.reservations).length;
  const committedCount = guard.committedKeys.length;
  const reservationRatio = reservationCount / Math.max(1, AGENT18_LIMITS.maxReservations);
  const committedRatio = committedCount / Math.max(1, AGENT18_LIMITS.maxCommittedKeys);

  if (reservationRatio >= 0.75) {
    notes.push(`Duplicate reservations at ${Math.round(reservationRatio * 100)}% of cap`);
  }
  if (committedRatio >= 0.75) {
    notes.push(`Committed action keys at ${Math.round(committedRatio * 100)}% of cap`);
  }

  const pressureIndex = Math.round(
    Math.min(100, reservationRatio * 55 + committedRatio * 45 + (reservationRatio >= 1 ? 10 : 0)),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamDuplicateGuardPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
