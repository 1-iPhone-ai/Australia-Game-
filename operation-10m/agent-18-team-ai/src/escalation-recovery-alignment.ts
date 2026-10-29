export interface EscalationRecoveryAlignmentReport {
  alignmentIndex: number;
  notes: string[];
}

/**
 * Misalignment between escalation tier and recovery urgency expectations.
 */
export function computeEscalationRecoveryAlignment(
  escalationTier: number,
  recoveryUrgency: number,
): EscalationRecoveryAlignmentReport {
  const notes: string[] = [];
  const tier = Math.max(0, Math.min(3, escalationTier));
  const expectedUrgency = tier * 24 + (tier >= 2 ? 18 : 8);
  const delta = Math.abs(recoveryUrgency - expectedUrgency);

  if (tier >= 2 && recoveryUrgency < expectedUrgency - 15) {
    notes.push('Recovery urgency lagging escalation tier');
  }
  if (tier <= 1 && recoveryUrgency > expectedUrgency + 25) {
    notes.push('Recovery urgency overshoots nominal escalation tier');
  }

  const alignmentIndex = Math.round(Math.min(100, delta * 1.35));

  return { alignmentIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamEscalationRecoveryAlignment(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
