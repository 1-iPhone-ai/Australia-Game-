export interface AuditStackAmplificationReport {
  amplificationIndex: number;
  notes: string[];
}

/**
 * Audit pressure amplifying escalation–saturation stack under gradient tension.
 */
export function computeAuditStackAmplificationIndex(
  auditPressureIndex: number,
  escalationSaturationStackIndex: number,
  gradientAuditTensionIndex: number,
): AuditStackAmplificationReport {
  const notes: string[] = [];
  if (auditPressureIndex >= 38 && escalationSaturationStackIndex >= 40) {
    notes.push('Audit pressure atop escalation–saturation stack');
  }
  if (gradientAuditTensionIndex >= 42 && auditPressureIndex >= 40) {
    notes.push('Gradient–audit tension reinforcing stack amplification');
  }

  const amplificationIndex = Math.round(
    Math.min(
      100,
      auditPressureIndex * 0.36 +
        escalationSaturationStackIndex * 0.34 +
        gradientAuditTensionIndex * 0.28 +
        (auditPressureIndex >= 42 && escalationSaturationStackIndex >= 44 ? 14 : 0),
    ),
  );

  return { amplificationIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamAuditStackAmplification(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
