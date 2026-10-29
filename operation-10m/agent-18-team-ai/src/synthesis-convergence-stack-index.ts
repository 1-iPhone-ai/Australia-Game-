export interface SynthesisConvergenceStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Resonance–pressure synthesis stacked on fusion–resonance convergence.
 */
export function computeSynthesisConvergenceStackIndex(
  resonancePressureSynthesisIndex: number,
  fusionResonanceConvergenceIndex: number,
  cascadeSynthesisFusionIndex: number,
): SynthesisConvergenceStackReport {
  const notes: string[] = [];
  if (resonancePressureSynthesisIndex >= 44 && fusionResonanceConvergenceIndex >= 44) {
    notes.push('Pressure synthesis and fusion convergence both elevated');
  }
  if (cascadeSynthesisFusionIndex >= 46 && resonancePressureSynthesisIndex >= 46) {
    notes.push('Cascade synthesis fusion reinforcing convergence stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      resonancePressureSynthesisIndex * 0.36 +
        fusionResonanceConvergenceIndex * 0.36 +
        cascadeSynthesisFusionIndex * 0.2 +
        (resonancePressureSynthesisIndex >= 48 && fusionResonanceConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisConvergenceStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
