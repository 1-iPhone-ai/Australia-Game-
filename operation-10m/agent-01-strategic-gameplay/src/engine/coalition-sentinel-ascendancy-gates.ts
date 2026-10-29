import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionSentinelAscendancyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionSentinelAscendancyStreakDays === undefined) return [];

  const streak = state.coalitionSentinelAscendancyStreakDays ?? 0;
  if (streak >= action.minCoalitionSentinelAscendancyStreakDays) return [];

  return [
    {
      code: 'COALITION_SENTINEL_ASCENDANCY_STREAK_TOO_SHORT',
      message: `Sentinel ascendancy streak ${streak} below required ${action.minCoalitionSentinelAscendancyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_sentinel_ascendancy_streak',
        minDays: action.minCoalitionSentinelAscendancyStreakDays,
      },
    },
  ];
}
