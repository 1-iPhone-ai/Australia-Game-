export interface FusionStackSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Cascade–stack fusion synthesizing with fusion–resonance synthesis under composite health.
 */
export function computeFusionStackSynthesisIndex(
  cascadeStackFusionIndex: number,
  fusionResonanceSynthesisIndex: number,
  coordinationCompositeScore: number,
): FusionStackSynthesisReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (cascadeStackFusionIndex >= 44 && fusionResonanceSynthesisIndex >= 44) {
    notes.push('Stack fusion and resonance synthesis both elevated');
  }
  if (weakComposite && cascadeStackFusionIndex >= 46) {
    notes.push('Fusion–stack synthesis under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const synthesisIndex = Math.round(
    Math.min(
      100,
      cascadeStackFusionIndex * 0.37 +
        fusionResonanceSynthesisIndex * 0.37 +
        compositePenalty +
        (weakComposite && fusionResonanceSynthesisIndex >= 48 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionStackSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
