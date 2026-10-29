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
