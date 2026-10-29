import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMultiversalPersistenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMultiversalPersistenceStreakDays === undefined) return [];

  const streak = state.coalitionMultiversalPersistenceStreakDays ?? 0;
  if (streak >= action.minCoalitionMultiversalPersistenceStreakDays) return [];

  return [
    {
      code: 'COALITION_MULTIVERSAL_PERSISTENCE_STREAK_TOO_SHORT',
      message: `Multiversal persistence streak ${streak} below required ${action.minCoalitionMultiversalPersistenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_multiversal_persistence_streak',
        minDays: action.minCoalitionMultiversalPersistenceStreakDays,
      },
    },
  ];
}
