export interface StackMismatchCouplingReport {
  couplingIndex: number;
  notes: string[];
}

/**
 * Escalation–saturation stack coupled with recovery–cascade mismatch stress.
 */
export function computeStackMismatchCouplingIndex(
  escalationSaturationStackIndex: number,
  recoveryCascadeMismatchIndex: number,
  coordinationEscalationTier: number,
): StackMismatchCouplingReport {
  const notes: string[] = [];
  if (escalationSaturationStackIndex >= 42 && recoveryCascadeMismatchIndex >= 40) {
    notes.push('Escalation stack and recovery mismatch both elevated');
  }
  if (coordinationEscalationTier >= 2 && recoveryCascadeMismatchIndex >= 44) {
    notes.push('Recovery mismatch under active escalation tier');
  }

  const couplingIndex = Math.round(
    Math.min(
      100,
      escalationSaturationStackIndex * 0.37 +
        recoveryCascadeMismatchIndex * 0.39 +
        coordinationEscalationTier * 6 +
        (escalationSaturationStackIndex >= 46 && recoveryCascadeMismatchIndex >= 44 ? 15 : 0),
    ),
  );

  return { couplingIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackMismatchCoupling(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
