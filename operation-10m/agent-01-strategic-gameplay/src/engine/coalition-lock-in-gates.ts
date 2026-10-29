import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionLockInStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionLockInStreakDays === undefined) return [];

  const streak = state.coalitionLockInStreakDays ?? 0;
  if (streak >= action.minCoalitionLockInStreakDays) return [];

  return [
    {
      code: 'COALITION_LOCK_IN_STREAK_TOO_SHORT',
      message: `Coalition lock-in streak ${streak} below required ${action.minCoalitionLockInStreakDays} stable day(s).`,
      requirement: {
        kind: 'min_coalition_lock_in_streak',
        minDays: action.minCoalitionLockInStreakDays,
      },
    },
  ];
}

export function coalitionVolatilityCapIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.maxCoalitionVolatilityEvents === undefined) return [];

  const events = state.coalitionVolatilityEvents ?? 0;
  if (events <= action.maxCoalitionVolatilityEvents) return [];

  return [
    {
      code: 'COALITION_VOLATILITY_TOO_HIGH',
      message: `Coalition volatility events ${events} above cap ${action.maxCoalitionVolatilityEvents}.`,
      requirement: {
        kind: 'max_coalition_volatility_events',
        maxEvents: action.maxCoalitionVolatilityEvents,
      },
    },
  ];
}
