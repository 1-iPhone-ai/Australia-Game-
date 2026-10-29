import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import { SUSTAINED_COALITION_RECOVERY_THRESHOLD } from './coalition-recovery-pressure.ts';
import { incrementCoalitionVolatilityEvents } from './coalition-volatility.ts';

/** Increment recovery streak while coalition balance stays stable; reset when strained or acute. */
export function advanceCoalitionRecoveryStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (classifyCoalitionCrisisLevel(state) !== 'stable') {
    if ((state.coalitionRecoveryStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionRecoveryStreakDays: 0 };
  }
  return {
    ...state,
    coalitionRecoveryStreakDays: (state.coalitionRecoveryStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionRecoveryStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  const peak = state.coalitionRecoveryStreakDays ?? 0;
  let next: StrategicGameplayState = { ...state, coalitionRecoveryStreakDays: 0 };
  if (peak >= SUSTAINED_COALITION_RECOVERY_THRESHOLD) {
    next = incrementCoalitionVolatilityEvents(next);
  }
  return next;
}
