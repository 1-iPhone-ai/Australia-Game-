import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionSupremeConvergenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionSupremeConvergenceStreakDays === undefined) return [];

  const streak = state.coalitionSupremeConvergenceStreakDays ?? 0;
  if (streak >= action.minCoalitionSupremeConvergenceStreakDays) return [];

  return [
    {
      code: 'COALITION_SUPREME_CONVERGENCE_STREAK_TOO_SHORT',
      message: `Supreme convergence streak ${streak} below required ${action.minCoalitionSupremeConvergenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_supreme_convergence_streak',
        minDays: action.minCoalitionSupremeConvergenceStreakDays,
      },
    },
  ];
}
