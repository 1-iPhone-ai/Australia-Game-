import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionPrimordialContinuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionPrimordialContinuityStreakDays === undefined) return [];

  const streak = state.coalitionPrimordialContinuityStreakDays ?? 0;
  if (streak >= action.minCoalitionPrimordialContinuityStreakDays) return [];

  return [
    {
      code: 'COALITION_PRIMORDIAL_CONTINUITY_STREAK_TOO_SHORT',
      message: `Primordial continuity streak ${streak} below required ${action.minCoalitionPrimordialContinuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_primordial_continuity_streak',
        minDays: action.minCoalitionPrimordialContinuityStreakDays,
      },
    },
  ];
}
