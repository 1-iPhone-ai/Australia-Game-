export interface FusionStackResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Fusion–stack synthesis resonating with synthesis–resonance convergence under composite health.
 */
export function computeFusionStackResonanceIndex(
  fusionStackSynthesisIndex: number,
  synthesisResonanceConvergenceIndex: number,
  coordinationCompositeScore: number,
): FusionStackResonanceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionStackSynthesisIndex >= 44 && synthesisResonanceConvergenceIndex >= 44) {
    notes.push('Stack synthesis and resonance convergence both elevated');
  }
  if (weakComposite && fusionStackSynthesisIndex >= 46) {
    notes.push('Fusion–stack resonance under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const resonanceIndex = Math.round(
    Math.min(
      100,
      fusionStackSynthesisIndex * 0.37 +
        synthesisResonanceConvergenceIndex * 0.37 +
        compositePenalty +
        (weakComposite && synthesisResonanceConvergenceIndex >= 48 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionStackResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
