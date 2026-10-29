import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionGalacticInfinityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionGalacticInfinityStreakDays === undefined) return [];

  const streak = state.coalitionGalacticInfinityStreakDays ?? 0;
  if (streak >= action.minCoalitionGalacticInfinityStreakDays) return [];

  return [
    {
      code: 'COALITION_GALACTIC_INFINITY_STREAK_TOO_SHORT',
      message: `Galactic infinity streak ${streak} below required ${action.minCoalitionGalacticInfinityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_galactic_infinity_streak',
        minDays: action.minCoalitionGalacticInfinityStreakDays,
      },
    },
  ];
}
