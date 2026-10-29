import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMatriarchDeificationStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchDeificationStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchDeificationStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchDeificationStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_DEIFICATION_STREAK_TOO_SHORT',
      message: `Matriarch apotheosis streak ${streak} below required ${action.minCoalitionMatriarchDeificationStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_deification_streak',
        minDays: action.minCoalitionMatriarchDeificationStreakDays,
      },
    },
  ];
}
