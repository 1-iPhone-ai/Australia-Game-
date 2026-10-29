import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionAbsoluteSanctityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionAbsoluteSanctityStreakDays === undefined) return [];

  const streak = state.coalitionAbsoluteSanctityStreakDays ?? 0;
  if (streak >= action.minCoalitionAbsoluteSanctityStreakDays) return [];

  return [
    {
      code: 'COALITION_ABSOLUTE_SANCTITY_STREAK_TOO_SHORT',
      message: `Absolute sanctity streak ${streak} below required ${action.minCoalitionAbsoluteSanctityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_absolute_sanctity_streak',
        minDays: action.minCoalitionAbsoluteSanctityStreakDays,
      },
    },
  ];
}
