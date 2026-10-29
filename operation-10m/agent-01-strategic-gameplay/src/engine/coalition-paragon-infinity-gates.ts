import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionParagonInfinityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionParagonInfinityStreakDays === undefined) return [];

  const streak = state.coalitionParagonInfinityStreakDays ?? 0;
  if (streak >= action.minCoalitionParagonInfinityStreakDays) return [];

  return [
    {
      code: 'COALITION_PARAGON_INFINITY_STREAK_TOO_SHORT',
      message: `Paragon infinity streak ${streak} below required ${action.minCoalitionParagonInfinityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_paragon_infinity_streak',
        minDays: action.minCoalitionParagonInfinityStreakDays,
      },
    },
  ];
}
