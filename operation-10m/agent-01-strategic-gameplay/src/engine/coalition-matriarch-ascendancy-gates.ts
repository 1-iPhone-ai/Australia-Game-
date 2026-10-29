import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMatriarchAscendancyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchAscendancyStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchAscendancyStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_ASCENDANCY_STREAK_TOO_SHORT',
      message: `Matriarch ascendancy streak ${streak} below required ${action.minCoalitionMatriarchAscendancyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_ascendancy_streak',
        minDays: action.minCoalitionMatriarchAscendancyStreakDays,
      },
    },
  ];
}
