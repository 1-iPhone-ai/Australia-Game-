import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionTranscendentOmniumStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionTranscendentOmniumStreakDays === undefined) return [];

  const streak = state.coalitionTranscendentOmniumStreakDays ?? 0;
  if (streak >= action.minCoalitionTranscendentOmniumStreakDays) return [];

  return [
    {
      code: 'COALITION_TRANSCENDENT_OMNIUM_STREAK_TOO_SHORT',
      message: `Transcendent omnium streak ${streak} below required ${action.minCoalitionTranscendentOmniumStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_transcendent_omnium_streak',
        minDays: action.minCoalitionTranscendentOmniumStreakDays,
      },
    },
  ];
}
