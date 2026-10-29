import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionMatriarchTranscendenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionMatriarchTranscendenceStreakDays === undefined) return [];

  const streak = state.coalitionMatriarchTranscendenceStreakDays ?? 0;
  if (streak >= action.minCoalitionMatriarchTranscendenceStreakDays) return [];

  return [
    {
      code: 'COALITION_MATRIARCH_TRANSCENDENCE_STREAK_TOO_SHORT',
      message: `Matriarch infinity streak ${streak} below required ${action.minCoalitionMatriarchTranscendenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_matriarch_transcendence_streak',
        minDays: action.minCoalitionMatriarchTranscendenceStreakDays,
      },
    },
  ];
}
