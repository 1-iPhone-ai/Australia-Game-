export interface ConvergenceSynthesisFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Fusion–stack convergence fused with resonance–cascade synthesis stress.
 */
export function computeConvergenceSynthesisFusionIndex(
  fusionStackConvergenceIndex: number,
  resonanceCascadeSynthesisIndex: number,
  coordinationEscalationTier: number,
): ConvergenceSynthesisFusionReport {
  const notes: string[] = [];
  if (fusionStackConvergenceIndex >= 44 && resonanceCascadeSynthesisIndex >= 44) {
    notes.push('Stack convergence and cascade synthesis both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionStackConvergenceIndex >= 46) {
    notes.push('Convergence–synthesis fusion under active escalation');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      fusionStackConvergenceIndex * 0.38 +
        resonanceCascadeSynthesisIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionStackConvergenceIndex >= 48 && resonanceCascadeSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceSynthesisFusion(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
