import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionQuantumOmnipresenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionQuantumOmnipresenceStreakDays === undefined) return [];

  const streak = state.coalitionQuantumOmnipresenceStreakDays ?? 0;
  if (streak >= action.minCoalitionQuantumOmnipresenceStreakDays) return [];

  return [
    {
      code: 'COALITION_QUANTUM_OMNIPRESENCE_STREAK_TOO_SHORT',
      message: `Quantum omnipresence streak ${streak} below required ${action.minCoalitionQuantumOmnipresenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_quantum_omnipresence_streak',
        minDays: action.minCoalitionQuantumOmnipresenceStreakDays,
      },
    },
  ];
}
