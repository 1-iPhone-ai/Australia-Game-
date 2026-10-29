import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionCosmicPerpetuityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionCosmicPerpetuityStreakDays === undefined) return [];

  const streak = state.coalitionCosmicPerpetuityStreakDays ?? 0;
  if (streak >= action.minCoalitionCosmicPerpetuityStreakDays) return [];

  return [
    {
      code: 'COALITION_COSMIC_PERPETUITY_STREAK_TOO_SHORT',
      message: `Cosmic perpetuity streak ${streak} below required ${action.minCoalitionCosmicPerpetuityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_cosmic_perpetuity_streak',
        minDays: action.minCoalitionCosmicPerpetuityStreakDays,
      },
    },
  ];
}
