import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionImperialPerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionImperialPerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionImperialPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionImperialPerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_IMPERIAL_PERPETUITY_STREAK_TOO_SHORT',
      message: `Imperial perpetuity streak ${streak} below required ${action.minCoalitionImperialPerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_imperial_perpetuity_streak',
        minDays: action.minCoalitionImperialPerpetuityStreakDays,
      },
    },
  ];
}
