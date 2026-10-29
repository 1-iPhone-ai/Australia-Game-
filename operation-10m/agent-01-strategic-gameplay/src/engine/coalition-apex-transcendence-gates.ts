import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionApexTranscendenceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionApexTranscendenceStreakDays === undefined) return [];

  const streak = state.coalitionApexTranscendenceStreakDays ?? 0;
  if (streak >= action.minCoalitionApexTranscendenceStreakDays) return [];

  return [
    {
      code: 'COALITION_APEX_TRANSCENDENCE_STREAK_TOO_SHORT',
      message: `Apex transcendence streak ${streak} below required ${action.minCoalitionApexTranscendenceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_apex_transcendence_streak',
        minDays: action.minCoalitionApexTranscendenceStreakDays,
      },
    },
  ];
}
