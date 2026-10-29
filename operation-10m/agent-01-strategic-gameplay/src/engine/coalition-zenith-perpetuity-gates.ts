import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionZenithPerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionZenithPerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionZenithPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionZenithPerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_ZENITH_PERPETUITY_STREAK_TOO_SHORT',
      message: `Zenith perpetuity streak ${streak} below required ${action.minCoalitionZenithPerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_zenith_perpetuity_streak',
        minDays: action.minCoalitionZenithPerpetuityStreakDays,
      },
    },
  ];
}
