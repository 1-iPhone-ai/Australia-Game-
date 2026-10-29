export interface StackSynthesisConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Stack–convergence resonance converging with resonance–fusion stack under composite health.
 */
export function computeStackSynthesisConvergenceIndex(
  stackConvergenceResonanceIndex: number,
  resonanceFusionStackIndex: number,
  coordinationCompositeScore: number,
): StackSynthesisConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (stackConvergenceResonanceIndex >= 44 && resonanceFusionStackIndex >= 44) {
    notes.push('Convergence resonance and fusion stack both elevated');
  }
  if (weakComposite && stackConvergenceResonanceIndex >= 46) {
    notes.push('Stack–synthesis convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      stackConvergenceResonanceIndex * 0.37 +
        resonanceFusionStackIndex * 0.37 +
        compositePenalty +
        (weakComposite && resonanceFusionStackIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackSynthesisConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
