import type { StrategicGameplayState } from '../types/strategic-action.ts';

export function resetCoalitionVolatilityEvents(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return { ...state, coalitionVolatilityEvents: 0 };
}

export function incrementCoalitionVolatilityEvents(
  state: StrategicGameplayState,
): StrategicGameplayState {
  return {
    ...state,
    coalitionVolatilityEvents: (state.coalitionVolatilityEvents ?? 0) + 1,
  };
}

export function decrementCoalitionVolatilityEvents(
  state: StrategicGameplayState,
): StrategicGameplayState {
  const current = state.coalitionVolatilityEvents ?? 0;
  return { ...state, coalitionVolatilityEvents: Math.max(0, current - 1) };
}
