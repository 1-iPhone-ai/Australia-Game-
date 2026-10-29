import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionExarchAscendancyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionExarchAscendancyStreakDays === undefined) return [];

  const streak = state.coalitionExarchAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionExarchAscendancyStreakDays) return [];

  return [
    {
      code: 'COALITION_EXARCH_ASCENDANCY_STREAK_TOO_SHORT',
      message: `Exarch ascendancy streak ${streak} below required ${action.minCoalitionExarchAscendancyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_exarch_ascendancy_streak',
        minDays: action.minCoalitionExarchAscendancyStreakDays,
      },
    },
  ];
}
