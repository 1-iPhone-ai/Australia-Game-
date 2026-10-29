export interface FusionResonanceStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Fusion–stack resonance stacking with resonance–convergence stack under composite health.
 */
export function computeFusionResonanceStackIndex(
  fusionStackResonanceIndex: number,
  resonanceConvergenceStackIndex: number,
  coordinationCompositeScore: number,
): FusionResonanceStackReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionStackResonanceIndex >= 44 && resonanceConvergenceStackIndex >= 44) {
    notes.push('Stack resonance and convergence stack both elevated');
  }
  if (weakComposite && fusionStackResonanceIndex >= 46) {
    notes.push('Fusion–resonance stack under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const stackIndex = Math.round(
    Math.min(
      100,
      fusionStackResonanceIndex * 0.37 +
        resonanceConvergenceStackIndex * 0.37 +
        compositePenalty +
        (weakComposite && resonanceConvergenceStackIndex >= 48 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionResonanceStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
