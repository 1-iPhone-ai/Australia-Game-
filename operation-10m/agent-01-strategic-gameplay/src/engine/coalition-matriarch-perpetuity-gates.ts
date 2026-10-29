import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMatriarchPerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchPerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchPerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_PERPETUITY_STREAK_TOO_SHORT',
      message: `Matriarch perpetuity streak ${streak} below required ${action.minCoalitionMatriarchPerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_perpetuity_streak',
        minDays: action.minCoalitionMatriarchPerpetuityStreakDays,
      },
    },
  ];
}
