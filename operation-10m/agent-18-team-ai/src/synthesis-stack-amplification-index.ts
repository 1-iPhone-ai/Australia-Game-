export interface SynthesisStackAmplificationReport {
  amplificationIndex: number;
  notes: string[];
}

/**
 * Convergence–cascade synthesis amplified by synthesis–convergence stack load.
 */
export function computeSynthesisStackAmplificationIndex(
  convergenceCascadeSynthesisIndex: number,
  synthesisConvergenceStackIndex: number,
  coordinationEscalationTier: number,
): SynthesisStackAmplificationReport {
  const notes: string[] = [];
  if (convergenceCascadeSynthesisIndex >= 44 && synthesisConvergenceStackIndex >= 44) {
    notes.push('Cascade synthesis and convergence stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisConvergenceStackIndex >= 46) {
    notes.push('Synthesis stack amplification under active escalation');
  }

  const amplificationIndex = Math.round(
    Math.min(
      100,
      convergenceCascadeSynthesisIndex * 0.37 +
        synthesisConvergenceStackIndex * 0.39 +
        coordinationEscalationTier * 5 +
        (convergenceCascadeSynthesisIndex >= 48 && synthesisConvergenceStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { amplificationIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisStackAmplification(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
