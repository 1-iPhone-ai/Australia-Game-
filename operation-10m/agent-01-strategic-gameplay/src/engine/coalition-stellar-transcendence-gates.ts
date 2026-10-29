import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionStellarTranscendenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionStellarTranscendenceStreakDays === undefined) return [];

  const streak = state.coalitionStellarTranscendenceStreakDays ?? 0;
  if (streak >= action.minCoalitionStellarTranscendenceStreakDays) return [];

  return [
    {
      code: 'COALITION_STELLAR_TRANSCENDENCE_STREAK_TOO_SHORT',
      message: `Stellar transcendence streak ${streak} below required ${action.minCoalitionStellarTranscendenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_stellar_transcendence_streak',
        minDays: action.minCoalitionStellarTranscendenceStreakDays,
      },
    },
  ];
}
