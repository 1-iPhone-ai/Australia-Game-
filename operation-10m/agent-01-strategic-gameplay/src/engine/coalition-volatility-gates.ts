import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionVolatilityIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionVolatilityEvents === undefined) return [];

  const events = state.coalitionVolatilityEvents ?? 0;
  if (events >= action.minCoalitionVolatilityEvents) return [];

  return [
    {
      code: 'COALITION_VOLATILITY_TOO_LOW',
      message: `Coalition volatility events ${events} below required ${action.minCoalitionVolatilityEvents}.`,
      requirement: {
        kind: 'min_coalition_volatility_events',
        minEvents: action.minCoalitionVolatilityEvents,
      },
    },
  ];
}
