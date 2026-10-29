import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMatriarchInfinityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchInfinityStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchInfinityStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchInfinityStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_INFINITY_STREAK_TOO_SHORT',
      message: `Matriarch infinity streak ${streak} below required ${action.minCoalitionMatriarchInfinityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_infinity_streak',
        minDays: action.minCoalitionMatriarchInfinityStreakDays,
      },
    },
  ];
}
