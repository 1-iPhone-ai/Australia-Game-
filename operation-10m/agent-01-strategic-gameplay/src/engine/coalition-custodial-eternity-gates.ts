import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionCustodialEternityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionCustodialEternityStreakDays === undefined) return [];

  const streak = state.coalitionCustodialEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionCustodialEternityStreakDays) return [];

  return [
    {
      code: 'COALITION_CUSTODIAL_ETERNITY_STREAK_TOO_SHORT',
      message: `Custodial eternity streak ${streak} below required ${action.minCoalitionCustodialEternityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_custodial_eternity_streak',
        minDays: action.minCoalitionCustodialEternityStreakDays,
      },
    },
  ];
}
