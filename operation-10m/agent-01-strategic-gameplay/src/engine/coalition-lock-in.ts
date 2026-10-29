import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';
import { COALITION_STABILIZATION_STREAK_THRESHOLD } from './coalition-stabilization.ts';

export const POST_STABILIZATION_LOCK_IN_THRESHOLD = 2;

export function isPostStabilizationLockIn(state: StrategicGameplayState): boolean {
  return (state.coalitionLockInStreakDays ?? 0) >= POST_STABILIZATION_LOCK_IN_THRESHOLD;
}

/** Stable days with volatility cleared after coalition stabilization matured. */
export function advanceCoalitionLockInStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  const volatility = state.coalitionVolatilityEvents ?? 0;
  if (volatility > 0) {
    if ((state.coalitionLockInStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionLockInStreakDays: 0 };
  }
  if (classifyCoalitionCrisisLevel(state) !== 'stable') {
    if ((state.coalitionLockInStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionLockInStreakDays: 0 };
  }
  const stabilization = state.coalitionStabilizationStreakDays ?? 0;
  const lockIn = state.coalitionLockInStreakDays ?? 0;
  const eligible =
    lockIn > 0 || stabilization >= COALITION_STABILIZATION_STREAK_THRESHOLD;
  if (!eligible) return state;
  return {
    ...state,
    coalitionLockInStreakDays: lockIn + daysAdvanced,
  };
}

export function resetCoalitionLockInStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionLockInStreakDays: 0 };
}
