export interface ResonanceAuditCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Gap–churn resonance cascading with audit–stack amplification pressure.
 */
export function computeResonanceAuditCascadeIndex(
  gapChurnResonanceIndex: number,
  auditStackAmplificationIndex: number,
  auditPressureIndex: number,
): ResonanceAuditCascadeReport {
  const notes: string[] = [];
  if (gapChurnResonanceIndex >= 42 && auditStackAmplificationIndex >= 42) {
    notes.push('Resonance and audit amplification both elevated');
  }
  if (auditPressureIndex >= 40 && gapChurnResonanceIndex >= 44) {
    notes.push('Audit pressure cascading through gap–churn resonance');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      gapChurnResonanceIndex * 0.35 +
        auditStackAmplificationIndex * 0.36 +
        auditPressureIndex * 0.22 +
        (gapChurnResonanceIndex >= 46 && auditStackAmplificationIndex >= 44 ? 14 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceAuditCascade(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
