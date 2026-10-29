export interface FusionResonanceConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Cascade–synthesis fusion converging with amplification–stack resonance.
 */
export function computeFusionResonanceConvergenceIndex(
  cascadeSynthesisFusionIndex: number,
  amplificationStackResonanceIndex: number,
  fusionResonanceCouplingIndex: number,
): FusionResonanceConvergenceReport {
  const notes: string[] = [];
  if (cascadeSynthesisFusionIndex >= 44 && amplificationStackResonanceIndex >= 44) {
    notes.push('Synthesis fusion and stack resonance both elevated');
  }
  if (fusionResonanceCouplingIndex >= 46 && cascadeSynthesisFusionIndex >= 46) {
    notes.push('Fusion–resonance coupling reinforcing convergence');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      cascadeSynthesisFusionIndex * 0.37 +
        amplificationStackResonanceIndex * 0.37 +
        fusionResonanceCouplingIndex * 0.16 +
        (cascadeSynthesisFusionIndex >= 48 && amplificationStackResonanceIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionResonanceConvergence(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
