export interface SynthesisStackConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Fusion–convergence synthesis converging with cascade–resonance stack under composite health.
 */
export function computeSynthesisStackConvergenceIndex(
  fusionConvergenceSynthesisIndex: number,
  cascadeResonanceStackIndex: number,
  coordinationCompositeScore: number,
): SynthesisStackConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionConvergenceSynthesisIndex >= 44 && cascadeResonanceStackIndex >= 44) {
    notes.push('Convergence synthesis and resonance stack both elevated');
  }
  if (weakComposite && fusionConvergenceSynthesisIndex >= 46) {
    notes.push('Synthesis–stack convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      fusionConvergenceSynthesisIndex * 0.37 +
        cascadeResonanceStackIndex * 0.37 +
        compositePenalty +
        (weakComposite && cascadeResonanceStackIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisStackConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
