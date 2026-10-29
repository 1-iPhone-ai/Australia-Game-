import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionHyperversalHarmonizationStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionHyperversalHarmonizationStreakDays === undefined) return [];

  const streak = state.coalitionHyperversalHarmonizationStreakDays ?? 0;
  if (streak >= action.minCoalitionHyperversalHarmonizationStreakDays) return [];

  return [
    {
      code: 'COALITION_HYPERVERSAL_HARMONIZATION_STREAK_TOO_SHORT',
      message: `Hyperversal harmonization streak ${streak} below required ${action.minCoalitionHyperversalHarmonizationStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_hyperversal_harmonization_streak',
        minDays: action.minCoalitionHyperversalHarmonizationStreakDays,
      },
    },
  ];
}
