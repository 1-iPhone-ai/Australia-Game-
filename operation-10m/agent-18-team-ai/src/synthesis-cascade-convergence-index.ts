export interface SynthesisCascadeConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Synthesis–stack convergence converging with stack–resonance pressure under composite health.
 */
export function computeSynthesisCascadeConvergenceIndex(
  synthesisStackConvergenceIndex: number,
  stackResonancePressureIndex: number,
  coordinationCompositeScore: number,
): SynthesisCascadeConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (synthesisStackConvergenceIndex >= 44 && stackResonancePressureIndex >= 44) {
    notes.push('Stack convergence and resonance pressure both elevated');
  }
  if (weakComposite && synthesisStackConvergenceIndex >= 46) {
    notes.push('Synthesis–cascade convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      synthesisStackConvergenceIndex * 0.37 +
        stackResonancePressureIndex * 0.37 +
        compositePenalty +
        (weakComposite && stackResonancePressureIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisCascadeConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
