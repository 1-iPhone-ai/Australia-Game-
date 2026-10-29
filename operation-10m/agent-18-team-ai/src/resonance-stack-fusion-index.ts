export interface ResonanceStackFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Synthesis–resonance stack fusing with resonance–convergence fusion under composite health.
 */
export function computeResonanceStackFusionIndex(
  synthesisResonanceStackIndex: number,
  resonanceConvergenceFusionIndex: number,
  coordinationCompositeScore: number,
): ResonanceStackFusionReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (synthesisResonanceStackIndex >= 44 && resonanceConvergenceFusionIndex >= 44) {
    notes.push('Resonance stack and convergence fusion both elevated');
  }
  if (weakComposite && synthesisResonanceStackIndex >= 46) {
    notes.push('Resonance–stack fusion under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const fusionIndex = Math.round(
    Math.min(
      100,
      synthesisResonanceStackIndex * 0.37 +
        resonanceConvergenceFusionIndex * 0.37 +
        compositePenalty +
        (weakComposite && resonanceConvergenceFusionIndex >= 48 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceStackFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
