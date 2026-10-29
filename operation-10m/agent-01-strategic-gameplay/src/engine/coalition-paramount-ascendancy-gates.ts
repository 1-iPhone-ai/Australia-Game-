import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionParamountAscendancyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionParamountAscendancyStreakDays === undefined) return [];

  const streak = state.coalitionParamountAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionParamountAscendancyStreakDays) return [];

  return [
    {
      code: 'COALITION_PARAMOUNT_ASCENDANCY_STREAK_TOO_SHORT',
      message: `Paramount ascendancy streak ${streak} below required ${action.minCoalitionParamountAscendancyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_paramount_ascendancy_streak',
        minDays: action.minCoalitionParamountAscendancyStreakDays,
      },
    },
  ];
}
