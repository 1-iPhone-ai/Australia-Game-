import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionPrimarchPerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionPrimarchPerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionPrimarchPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionPrimarchPerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_PRIMARCH_PERPETUITY_STREAK_TOO_SHORT',
      message: `Primarch perpetuity streak ${streak} below required ${action.minCoalitionPrimarchPerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_primarch_perpetuity_streak',
        minDays: action.minCoalitionPrimarchPerpetuityStreakDays,
      },
    },
  ];
}
