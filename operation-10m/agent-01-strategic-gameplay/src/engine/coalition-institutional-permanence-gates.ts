import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionInstitutionalPermanenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionInstitutionalPermanenceStreakDays === undefined) return [];

  const streak = state.coalitionInstitutionalPermanenceStreakDays ?? 0;
  if (streak >= action.minCoalitionInstitutionalPermanenceStreakDays) return [];

  return [
    {
      code: 'COALITION_INSTITUTIONAL_PERMANENCE_STREAK_TOO_SHORT',
      message: `Institutional permanence streak ${streak} below required ${action.minCoalitionInstitutionalPermanenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_institutional_permanence_streak',
        minDays: action.minCoalitionInstitutionalPermanenceStreakDays,
      },
    },
  ];
}
