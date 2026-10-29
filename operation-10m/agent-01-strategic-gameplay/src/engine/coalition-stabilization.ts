import type { StrategicGameplayState } from '../types/strategic-action.ts';
import { classifyCoalitionCrisisLevel } from './coalition-crisis.ts';

export const COALITION_STABILIZATION_STREAK_THRESHOLD = 3;

/** Stable coalition days while volatility history is still nonzero — path to a stabilization pact. */
export function advanceCoalitionStabilizationStreak(
  state: StrategicGameplayState,
  daysAdvanced: number,
): StrategicGameplayState {
  if (daysAdvanced <= 0) return state;
  if (classifyCoalitionCrisisLevel(state) !== 'stable') {
    if ((state.coalitionStabilizationStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionStabilizationStreakDays: 0 };
  }
  if ((state.coalitionVolatilityEvents ?? 0) < 1) {
    if ((state.coalitionStabilizationStreakDays ?? 0) === 0) return state;
    return { ...state, coalitionStabilizationStreakDays: 0 };
  }
  return {
    ...state,
    coalitionStabilizationStreakDays:
      (state.coalitionStabilizationStreakDays ?? 0) + daysAdvanced,
  };
}

export function resetCoalitionStabilizationStreak(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionStabilizationStreakDays: 0 };
}

export function isCoalitionStabilizationReady(state: StrategicGameplayState): boolean {
  return (
    (state.coalitionStabilizationStreakDays ?? 0) >= COALITION_STABILIZATION_STREAK_THRESHOLD
  );
}
