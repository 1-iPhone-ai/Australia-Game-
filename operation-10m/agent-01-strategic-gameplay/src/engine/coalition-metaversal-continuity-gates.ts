import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMetaversalContinuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMetaversalContinuityStreakDays === undefined) return [];

  const streak = state.coalitionMetaversalContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionMetaversalContinuityStreakDays) return [];

  return [
    {
      code: 'COALITION_METAVERSE_CONTINUITY_STREAK_TOO_SHORT',
      message: `Metaversal continuity streak ${streak} below required ${action.minCoalitionMetaversalContinuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_metaversal_continuity_streak',
        minDays: action.minCoalitionMetaversalContinuityStreakDays,
      },
    },
  ];
}
