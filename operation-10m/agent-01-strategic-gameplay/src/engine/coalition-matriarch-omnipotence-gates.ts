import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMatriarchOmnipotenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchOmnipotenceStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchOmnipotenceStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchOmnipotenceStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_OMNIPOTENCE_STREAK_TOO_SHORT',
      message: `Matriarch deification streak ${streak} below required ${action.minCoalitionMatriarchOmnipotenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_omnipotence_streak',
        minDays: action.minCoalitionMatriarchOmnipotenceStreakDays,
      },
    },
  ];
}
