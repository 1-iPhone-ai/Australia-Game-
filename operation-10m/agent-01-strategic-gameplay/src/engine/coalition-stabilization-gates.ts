import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionStabilizationStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionStabilizationStreakDays === undefined) return [];

  const streak = state.coalitionStabilizationStreakDays ?? 0;
  if (streak >= action.minCoalitionStabilizationStreakDays) return [];

  return [
    {
      code: 'COALITION_STABILIZATION_STREAK_TOO_SHORT',
      message: `Coalition stabilization streak ${streak} below required ${action.minCoalitionStabilizationStreakDays} stable day(s).`,
      requirement: {
        kind: 'min_coalition_stabilization_streak',
        minDays: action.minCoalitionStabilizationStreakDays,
      },
    },
  ];
}
