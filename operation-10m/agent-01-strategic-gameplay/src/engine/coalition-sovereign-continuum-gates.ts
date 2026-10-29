import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionSovereignContinuumStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionSovereignContinuumStreakDays === undefined) return [];

  const streak = state.coalitionSovereignContinuumStreakDays ?? 0;
  if (streak >= action.minCoalitionSovereignContinuumStreakDays) return [];

  return [
    {
      code: 'COALITION_SOVEREIGN_CONTINUUM_STREAK_TOO_SHORT',
      message: `Sovereign continuum streak ${streak} below required ${action.minCoalitionSovereignContinuumStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_sovereign_continuum_streak',
        minDays: action.minCoalitionSovereignContinuumStreakDays,
      },
    },
  ];
}
