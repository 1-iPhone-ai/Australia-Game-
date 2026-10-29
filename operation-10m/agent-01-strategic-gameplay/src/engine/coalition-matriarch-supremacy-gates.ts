import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMatriarchSupremacyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchSupremacyStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchSupremacyStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchSupremacyStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_SUPREMACY_STREAK_TOO_SHORT',
      message: `Matriarch sovereignty streak ${streak} below required ${action.minCoalitionMatriarchSupremacyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_supremacy_streak',
        minDays: action.minCoalitionMatriarchSupremacyStreakDays,
      },
    },
  ];
}
