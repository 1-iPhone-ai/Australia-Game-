import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionArchonEternityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionArchonEternityStreakDays === undefined) return [];

  const streak = state.coalitionArchonEternityStreakDays ?? 0;
  if (streak >= action.minCoalitionArchonEternityStreakDays) return [];

  return [
    {
      code: 'COALITION_ARCHON_ETERNITY_STREAK_TOO_SHORT',
      message: `Archon eternity streak ${streak} below required ${action.minCoalitionArchonEternityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_archon_eternity_streak',
        minDays: action.minCoalitionArchonEternityStreakDays,
      },
    },
  ];
}
