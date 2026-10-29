import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionInfinitePersistenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionInfinitePersistenceStreakDays === undefined) return [];

  const streak = state.coalitionInfinitePersistenceStreakDays ?? 0;
  if (streak >= action.minCoalitionInfinitePersistenceStreakDays) return [];

  return [
    {
      code: 'COALITION_INFINITE_PERSISTENCE_STREAK_TOO_SHORT',
      message: `Infinite persistence streak ${streak} below required ${action.minCoalitionInfinitePersistenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_infinite_persistence_streak',
        minDays: action.minCoalitionInfinitePersistenceStreakDays,
      },
    },
  ];
}
