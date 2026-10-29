import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionCrisisStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionCrisisStreakDays === undefined) return [];

  const streak = state.coalitionCrisisStreakDays ?? 0;
  if (streak >= action.minCoalitionCrisisStreakDays) return [];

  return [
    {
      code: 'COALITION_CRISIS_STREAK_TOO_SHORT',
      message: `Coalition crisis streak ${streak} below required ${action.minCoalitionCrisisStreakDays} acute day(s).`,
      requirement: {
        kind: 'min_coalition_crisis_streak',
        minDays: action.minCoalitionCrisisStreakDays,
      },
    },
  ];
}

export function coalitionRecoveryStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionRecoveryStreakDays === undefined) return [];

  const streak = state.coalitionRecoveryStreakDays ?? 0;
  if (streak >= action.minCoalitionRecoveryStreakDays) return [];

  return [
    {
      code: 'COALITION_RECOVERY_STREAK_TOO_SHORT',
      message: `Coalition recovery streak ${streak} below required ${action.minCoalitionRecoveryStreakDays} stable day(s).`,
      requirement: {
        kind: 'min_coalition_recovery_streak',
        minDays: action.minCoalitionRecoveryStreakDays,
      },
    },
  ];
}
