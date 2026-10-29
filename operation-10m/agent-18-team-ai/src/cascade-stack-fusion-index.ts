export interface CascadeStackFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Synthesis–cascade convergence fusing with stack–fusion resonance under composite health.
 */
export function computeCascadeStackFusionIndex(
  synthesisCascadeConvergenceIndex: number,
  stackFusionResonanceIndex: number,
  coordinationCompositeScore: number,
): CascadeStackFusionReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (synthesisCascadeConvergenceIndex >= 44 && stackFusionResonanceIndex >= 44) {
    notes.push('Cascade convergence and fusion resonance both elevated');
  }
  if (weakComposite && synthesisCascadeConvergenceIndex >= 46) {
    notes.push('Cascade–stack fusion under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const fusionIndex = Math.round(
    Math.min(
      100,
      synthesisCascadeConvergenceIndex * 0.37 +
        stackFusionResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && stackFusionResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeStackFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
