import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionVanguardSynthesisStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionVanguardSynthesisStreakDays === undefined) return [];

  const streak = state.coalitionVanguardSynthesisStreakDays ?? 0;
  if (streak >= action.minCoalitionVanguardSynthesisStreakDays) return [];

  return [
    {
      code: 'COALITION_VANGUARD_SYNTHESIS_STREAK_TOO_SHORT',
      message: `Vanguard synthesis streak ${streak} below required ${action.minCoalitionVanguardSynthesisStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_vanguard_synthesis_streak',
        minDays: action.minCoalitionVanguardSynthesisStreakDays,
      },
    },
  ];
}
