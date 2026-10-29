import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionGenerationalContinuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionGenerationalContinuityStreakDays === undefined) return [];

  const streak = state.coalitionGenerationalContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionGenerationalContinuityStreakDays) return [];

  return [
    {
      code: 'COALITION_GENERATIONAL_CONTINUITY_STREAK_TOO_SHORT',
      message: `Generational continuity streak ${streak} below required ${action.minCoalitionGenerationalContinuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_generational_continuity_streak',
        minDays: action.minCoalitionGenerationalContinuityStreakDays,
      },
    },
  ];
}
