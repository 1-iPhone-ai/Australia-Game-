import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionOmniversalSynthesisStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionOmniversalSynthesisStreakDays === undefined) return [];

  const streak = state.coalitionOmniversalSynthesisStreakDays ?? 0;
  if (streak >= action.minCoalitionOmniversalSynthesisStreakDays) return [];

  return [
    {
      code: 'COALITION_OMNIVERSAL_SYNTHESIS_STREAK_TOO_SHORT',
      message: `Omniversal synthesis streak ${streak} below required ${action.minCoalitionOmniversalSynthesisStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_omniversal_synthesis_streak',
        minDays: action.minCoalitionOmniversalSynthesisStreakDays,
      },
    },
  ];
}
