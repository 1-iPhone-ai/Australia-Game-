import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMatriarchSovereigntyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchSovereigntyStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchSovereigntyStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchSovereigntyStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_SOVEREIGNTY_STREAK_TOO_SHORT',
      message: `Matriarch sovereignty streak ${streak} below required ${action.minCoalitionMatriarchSovereigntyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_sovereignty_streak',
        minDays: action.minCoalitionMatriarchSovereigntyStreakDays,
      },
    },
  ];
}
