import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionOraclePerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionOraclePerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionOraclePerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionOraclePerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_ORACLE_PERPETUITY_STREAK_TOO_SHORT',
      message: `Oracle perpetuity streak ${streak} below required ${action.minCoalitionOraclePerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_oracle_perpetuity_streak',
        minDays: action.minCoalitionOraclePerpetuityStreakDays,
      },
    },
  ];
}
