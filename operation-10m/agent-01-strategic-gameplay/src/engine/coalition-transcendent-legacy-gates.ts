import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionTranscendentLegacyStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionTranscendentLegacyStreakDays === undefined) return [];

  const streak = state.coalitionTranscendentLegacyStreakDays ?? 0;
  if (streak >= action.minCoalitionTranscendentLegacyStreakDays) return [];

  return [
    {
      code: 'COALITION_TRANSCENDENT_LEGACY_STREAK_TOO_SHORT',
      message: `Transcendent legacy streak ${streak} below required ${action.minCoalitionTranscendentLegacyStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_transcendent_legacy_streak',
        minDays: action.minCoalitionTranscendentLegacyStreakDays,
      },
    },
  ];
}
