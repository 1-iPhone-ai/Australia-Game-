import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';

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
  return { ...state, coalitionRecoveryStreakDays: 0 };
}
