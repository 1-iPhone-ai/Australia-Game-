import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionStewardshipStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionStewardshipStreakDays === undefined) return [];

  const streak = state.coalitionStewardshipStreakDays ?? 0;
  if (streak >= action.minCoalitionStewardshipStreakDays) return [];

  return [
    {
      code: 'COALITION_STEWARDSHIP_STREAK_TOO_SHORT',
      message: `Coalition stewardship streak ${streak} below required ${action.minCoalitionStewardshipStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_stewardship_streak',
        minDays: action.minCoalitionStewardshipStreakDays,
      },
    },
  ];
}
