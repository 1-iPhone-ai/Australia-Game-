import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionPatriarchEternityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionPatriarchEternityStreakDays === undefined) return [];

  const streak = state.coalitionPatriarchEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionPatriarchEternityStreakDays) return [];

  return [
    {
      code: 'COALITION_PATRIARCH_ETERNITY_STREAK_TOO_SHORT',
      message: `Patriarch eternity streak ${streak} below required ${action.minCoalitionPatriarchEternityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_patriarch_eternity_streak',
        minDays: action.minCoalitionPatriarchEternityStreakDays,
      },
    },
  ];
}
