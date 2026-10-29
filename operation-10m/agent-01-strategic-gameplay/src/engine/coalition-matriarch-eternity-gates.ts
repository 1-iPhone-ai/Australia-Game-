import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMatriarchEternityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchEternityStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchEternityStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_ETERNITY_STREAK_TOO_SHORT',
      message: `Matriarch eternity streak ${streak} below required ${action.minCoalitionMatriarchEternityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_eternity_streak',
        minDays: action.minCoalitionMatriarchEternityStreakDays,
      },
    },
  ];
}
