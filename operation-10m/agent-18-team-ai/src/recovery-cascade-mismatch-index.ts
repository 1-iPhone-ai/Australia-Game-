export interface RecoveryCascadeMismatchReport {
  mismatchIndex: number;
  notes: string[];
}

/**
 * Recovery playbook breadth gap when cascade–lease convergence is elevated.
 */
export function computeRecoveryCascadeMismatchIndex(
  recoveryActionBreadthIndex: number,
  cascadeLeaseConvergenceIndex: number,
  coordinationRecoveryUrgency: number,
): RecoveryCascadeMismatchReport {
  const notes: string[] = [];
  if (recoveryActionBreadthIndex >= 38 && cascadeLeaseConvergenceIndex >= 40) {
    notes.push('Recovery breadth gap coincides with cascade–lease convergence');
  }
  if (coordinationRecoveryUrgency >= 3 && cascadeLeaseConvergenceIndex >= 42) {
    notes.push('High recovery urgency with unresolved cascade–lease convergence');
  }

  const mismatchIndex = Math.round(
    Math.min(
      100,
      recoveryActionBreadthIndex * 0.34 +
        cascadeLeaseConvergenceIndex * 0.38 +
        coordinationRecoveryUrgency * 8 +
        (recoveryActionBreadthIndex >= 40 && cascadeLeaseConvergenceIndex >= 44 ? 16 : 0),
    ),
  );

  return { mismatchIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamRecoveryCascadeMismatch(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
