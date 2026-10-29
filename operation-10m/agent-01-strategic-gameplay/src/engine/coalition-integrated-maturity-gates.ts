import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function integratedCoalitionMaturityStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minIntegratedCoalitionMaturityStreakDays === undefined) return [];

  const streak = state.integratedCoalitionMaturityStreakDays ?? 0;
  if (streak >= action.minIntegratedCoalitionMaturityStreakDays) return [];

  return [
    {
      code: 'INTEGRATED_COALITION_MATURITY_TOO_LOW',
      message: `Integrated coalition maturity streak ${streak} below required ${action.minIntegratedCoalitionMaturityStreakDays} day(s).`,
      requirement: {
        kind: 'min_integrated_coalition_maturity_streak',
        minDays: action.minIntegratedCoalitionMaturityStreakDays,
      },
    },
  ];
}
