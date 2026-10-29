export interface SynthesisResonanceStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Convergence–fusion synthesis stacking with stack–cascade resonance under composite health.
 */
export function computeSynthesisResonanceStackIndex(
  convergenceFusionSynthesisIndex: number,
  stackCascadeResonanceIndex: number,
  coordinationCompositeScore: number,
): SynthesisResonanceStackReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (convergenceFusionSynthesisIndex >= 44 && stackCascadeResonanceIndex >= 44) {
    notes.push('Fusion synthesis and stack resonance both elevated');
  }
  if (weakComposite && convergenceFusionSynthesisIndex >= 46) {
    notes.push('Synthesis–resonance stack under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const stackIndex = Math.round(
    Math.min(
      100,
      convergenceFusionSynthesisIndex * 0.37 +
        stackCascadeResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && stackCascadeResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisResonanceStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
