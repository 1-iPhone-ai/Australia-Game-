export interface CouplingAmplificationFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Stack–mismatch coupling fused with audit–stack amplification pressure.
 */
export function computeCouplingAmplificationFusionIndex(
  stackMismatchCouplingIndex: number,
  auditStackAmplificationIndex: number,
  auditPressureIndex: number,
): CouplingAmplificationFusionReport {
  const notes: string[] = [];
  if (stackMismatchCouplingIndex >= 44 && auditStackAmplificationIndex >= 42) {
    notes.push('Stack coupling and audit amplification both elevated');
  }
  if (auditPressureIndex >= 40 && stackMismatchCouplingIndex >= 46) {
    notes.push('Audit pressure reinforcing coupling–amplification fusion');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      stackMismatchCouplingIndex * 0.36 +
        auditStackAmplificationIndex * 0.38 +
        auditPressureIndex * 0.18 +
        (stackMismatchCouplingIndex >= 48 && auditStackAmplificationIndex >= 44 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCouplingAmplificationFusion(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
