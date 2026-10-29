export interface RecoveryActionBreadthReport {
  breadthGapIndex: number;
  notes: string[];
}

/**
 * Gap between escalation tier expectations and recovery playbook action breadth.
 */
export function measureRecoveryActionBreadth(
  escalationTier: number,
  recommendedActions: string[],
): RecoveryActionBreadthReport {
  const notes: string[] = [];
  const tier = Math.max(0, Math.min(3, escalationTier));
  const expectedMinActions = tier === 0 ? 0 : tier + 1;
  const actual = recommendedActions.length;
  const shortfall = Math.max(0, expectedMinActions - actual);

  if (shortfall > 0) {
    notes.push(`Recovery playbook shortfall: ${actual} actions for tier ${tier}`);
  }
  if (tier >= 2 && actual >= 4) {
    notes.push(`Recovery playbook breadth adequate for tier ${tier}`);
  }

  const overshootPenalty = tier <= 1 && actual >= 6 ? 12 : 0;
  const breadthGapIndex = Math.round(Math.min(100, shortfall * 28 + overshootPenalty));

  return { breadthGapIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamRecoveryActionBreadth(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
