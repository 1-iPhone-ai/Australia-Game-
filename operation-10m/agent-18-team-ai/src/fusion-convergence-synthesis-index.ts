export interface FusionConvergenceSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Stack–synthesis fusion synthesizing with fusion–cascade resonance under composite health.
 */
export function computeFusionConvergenceSynthesisIndex(
  stackSynthesisFusionIndex: number,
  fusionCascadeResonanceIndex: number,
  coordinationCompositeScore: number,
): FusionConvergenceSynthesisReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (stackSynthesisFusionIndex >= 44 && fusionCascadeResonanceIndex >= 44) {
    notes.push('Synthesis fusion and cascade resonance both elevated');
  }
  if (weakComposite && stackSynthesisFusionIndex >= 46) {
    notes.push('Fusion–convergence synthesis under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const synthesisIndex = Math.round(
    Math.min(
      100,
      stackSynthesisFusionIndex * 0.37 +
        fusionCascadeResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && fusionCascadeResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionConvergenceSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
