export interface FusionResonanceCouplingReport {
  couplingIndex: number;
  notes: string[];
}

/**
 * Coupling–amplification fusion coupled with gap–churn resonance stress.
 */
export function computeFusionResonanceCouplingIndex(
  couplingAmplificationFusionIndex: number,
  gapChurnResonanceIndex: number,
  persistenceChurnIndex: number,
): FusionResonanceCouplingReport {
  const notes: string[] = [];
  if (couplingAmplificationFusionIndex >= 44 && gapChurnResonanceIndex >= 42) {
    notes.push('Fusion and gap–churn resonance both elevated');
  }
  if (persistenceChurnIndex >= 40 && couplingAmplificationFusionIndex >= 46) {
    notes.push('Persistence churn reinforcing fusion–resonance coupling');
  }

  const couplingIndex = Math.round(
    Math.min(
      100,
      couplingAmplificationFusionIndex * 0.38 +
        gapChurnResonanceIndex * 0.36 +
        persistenceChurnIndex * 0.18 +
        (couplingAmplificationFusionIndex >= 48 && gapChurnResonanceIndex >= 44 ? 14 : 0),
    ),
  );

  return { couplingIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionResonanceCoupling(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
