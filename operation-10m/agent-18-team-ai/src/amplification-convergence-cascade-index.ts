export interface AmplificationConvergenceCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Cascade–resonance amplification cascading through convergence–cascade synthesis.
 */
export function computeAmplificationConvergenceCascadeIndex(
  cascadeResonanceAmplificationIndex: number,
  convergenceCascadeSynthesisIndex: number,
  auditPressureIndex: number,
): AmplificationConvergenceCascadeReport {
  const notes: string[] = [];
  if (cascadeResonanceAmplificationIndex >= 44 && convergenceCascadeSynthesisIndex >= 44) {
    notes.push('Resonance amplification and cascade synthesis both elevated');
  }
  if (auditPressureIndex >= 40 && cascadeResonanceAmplificationIndex >= 46) {
    notes.push('Audit pressure driving amplification–convergence cascade');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      cascadeResonanceAmplificationIndex * 0.38 +
        convergenceCascadeSynthesisIndex * 0.36 +
        auditPressureIndex * 0.18 +
        (cascadeResonanceAmplificationIndex >= 48 && convergenceCascadeSynthesisIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamAmplificationConvergenceCascade(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
