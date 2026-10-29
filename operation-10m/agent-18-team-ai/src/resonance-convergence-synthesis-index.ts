export interface ResonanceConvergenceSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Fusion–synthesis resonance synthesizing with resonance–pressure convergence under escalation.
 */
export function computeResonanceConvergenceSynthesisIndex(
  fusionSynthesisResonanceIndex: number,
  resonancePressureConvergenceIndex: number,
  coordinationEscalationTier: number,
): ResonanceConvergenceSynthesisReport {
  const notes: string[] = [];
  if (fusionSynthesisResonanceIndex >= 44 && resonancePressureConvergenceIndex >= 44) {
    notes.push('Fusion synthesis resonance and pressure convergence both elevated');
  }
  if (coordinationEscalationTier >= 2 && resonancePressureConvergenceIndex >= 46) {
    notes.push('Resonance–convergence synthesis under active escalation');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      fusionSynthesisResonanceIndex * 0.38 +
        resonancePressureConvergenceIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionSynthesisResonanceIndex >= 48 && resonancePressureConvergenceIndex >= 46 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceConvergenceSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
