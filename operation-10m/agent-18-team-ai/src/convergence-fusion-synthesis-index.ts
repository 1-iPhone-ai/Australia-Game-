export interface ConvergenceFusionSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Synthesis–fusion convergence synthesizing with fusion–cascade stack under composite health.
 */
export function computeConvergenceFusionSynthesisIndex(
  synthesisFusionConvergenceIndex: number,
  fusionCascadeStackIndex: number,
  coordinationCompositeScore: number,
): ConvergenceFusionSynthesisReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (synthesisFusionConvergenceIndex >= 44 && fusionCascadeStackIndex >= 44) {
    notes.push('Fusion convergence and cascade stack both elevated');
  }
  if (weakComposite && synthesisFusionConvergenceIndex >= 46) {
    notes.push('Convergence–fusion synthesis under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const synthesisIndex = Math.round(
    Math.min(
      100,
      synthesisFusionConvergenceIndex * 0.37 +
        fusionCascadeStackIndex * 0.37 +
        compositePenalty +
        (weakComposite && fusionCascadeStackIndex >= 48 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceFusionSynthesis(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
