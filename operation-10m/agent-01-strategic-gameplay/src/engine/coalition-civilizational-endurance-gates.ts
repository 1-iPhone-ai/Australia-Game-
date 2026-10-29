import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionCivilizationalEnduranceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionCivilizationalEnduranceStreakDays === undefined) return [];

  const streak = state.coalitionCivilizationalEnduranceStreakDays ?? 0;
  if (streak >= action.minCoalitionCivilizationalEnduranceStreakDays) return [];

  return [
    {
      code: 'COALITION_CIVILIZATIONAL_ENDURANCE_STREAK_TOO_SHORT',
      message: `Civilizational endurance streak ${streak} below required ${action.minCoalitionCivilizationalEnduranceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_civilizational_endurance_streak',
        minDays: action.minCoalitionCivilizationalEnduranceStreakDays,
      },
    },
  ];
}
