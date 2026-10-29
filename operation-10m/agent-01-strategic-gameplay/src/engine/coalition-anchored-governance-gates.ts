import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

export function coalitionAnchoredGovernanceStreakIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  if (action.minCoalitionAnchoredGovernanceStreakDays === undefined) return [];

  const streak = state.coalitionAnchoredGovernanceStreakDays ?? 0;
  if (streak >= action.minCoalitionAnchoredGovernanceStreakDays) return [];

  return [
    {
      code: 'COALITION_ANCHORED_GOVERNANCE_STREAK_TOO_SHORT',
      message: `Anchored governance streak ${streak} below required ${action.minCoalitionAnchoredGovernanceStreakDays} day(s).`,
      requirement: {
        kind: 'min_coalition_anchored_governance_streak',
        minDays: action.minCoalitionAnchoredGovernanceStreakDays,
      },
    },
  ];
}
