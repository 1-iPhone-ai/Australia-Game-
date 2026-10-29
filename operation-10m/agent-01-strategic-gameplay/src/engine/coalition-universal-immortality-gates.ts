import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionUniversalImmortalityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionUniversalImmortalityStreakDays === undefined) return [];

  const streak = state.coalitionUniversalImmortalityStreakDays ?? 0;
  if (streak >= action.minCoalitionUniversalImmortalityStreakDays) return [];

  return [
    {
      code: 'COALITION_UNIVERSAL_IMMORTALITY_STREAK_TOO_SHORT',
      message: `Universal immortality streak ${streak} below required ${action.minCoalitionUniversalImmortalityStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_universal_immortality_streak',
        minDays: action.minCoalitionUniversalImmortalityStreakDays,
      },
    },
  ];
}
