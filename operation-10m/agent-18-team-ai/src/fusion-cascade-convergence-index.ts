export interface FusionCascadeConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Resonance–stack fusion converging with convergence–fusion pressure under composite health.
 */
export function computeFusionCascadeConvergenceIndex(
  resonanceStackFusionIndex: number,
  convergenceFusionPressureIndex: number,
  coordinationCompositeScore: number,
): FusionCascadeConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (resonanceStackFusionIndex >= 44 && convergenceFusionPressureIndex >= 44) {
    notes.push('Stack fusion and fusion pressure both elevated');
  }
  if (weakComposite && resonanceStackFusionIndex >= 46) {
    notes.push('Fusion–cascade convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      resonanceStackFusionIndex * 0.37 +
        convergenceFusionPressureIndex * 0.37 +
        compositePenalty +
        (weakComposite && convergenceFusionPressureIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionCascadeConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
