import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMatriarchApotheosisStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchApotheosisStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchApotheosisStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchApotheosisStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_APOTHEOSIS_STREAK_TOO_SHORT',
      message: `Matriarch transcendence streak ${streak} below required ${action.minCoalitionMatriarchApotheosisStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_apotheosis_streak',
        minDays: action.minCoalitionMatriarchApotheosisStreakDays,
      },
    },
  ];
}
