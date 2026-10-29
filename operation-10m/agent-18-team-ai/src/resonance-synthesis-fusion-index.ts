export interface ResonanceSynthesisFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Fusion–resonance stack fusing with convergence–stack synthesis under composite health.
 */
export function computeResonanceSynthesisFusionIndex(
  fusionResonanceStackIndex: number,
  convergenceStackSynthesisIndex: number,
  coordinationCompositeScore: number,
): ResonanceSynthesisFusionReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionResonanceStackIndex >= 44 && convergenceStackSynthesisIndex >= 44) {
    notes.push('Resonance stack and stack synthesis both elevated');
  }
  if (weakComposite && fusionResonanceStackIndex >= 46) {
    notes.push('Resonance–synthesis fusion under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const fusionIndex = Math.round(
    Math.min(
      100,
      fusionResonanceStackIndex * 0.37 +
        convergenceStackSynthesisIndex * 0.37 +
        compositePenalty +
        (weakComposite && convergenceStackSynthesisIndex >= 48 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceSynthesisFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
