import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionEternalAscendanceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionEternalAscendanceStreakDays === undefined) return [];

  const streak = state.coalitionEternalAscendanceStreakDays ?? 0;
  if (streak >= action.minCoalitionEternalAscendanceStreakDays) return [];

  return [
    {
      code: 'COALITION_ETERNAL_ASCENDANCE_STREAK_TOO_SHORT',
      message: `Eternal ascendance streak ${streak} below required ${action.minCoalitionEternalAscendanceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_eternal_ascendance_streak',
        minDays: action.minCoalitionEternalAscendanceStreakDays,
      },
    },
  ];
}
