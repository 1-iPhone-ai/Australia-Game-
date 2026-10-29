export interface StackConvergenceResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Fusion–cascade convergence resonating with pressure–stack resonance under composite health.
 */
export function computeStackConvergenceResonanceIndex(
  fusionCascadeConvergenceIndex: number,
  pressureStackResonanceIndex: number,
  coordinationCompositeScore: number,
): StackConvergenceResonanceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionCascadeConvergenceIndex >= 44 && pressureStackResonanceIndex >= 44) {
    notes.push('Cascade convergence and stack resonance both elevated');
  }
  if (weakComposite && fusionCascadeConvergenceIndex >= 46) {
    notes.push('Stack–convergence resonance under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const resonanceIndex = Math.round(
    Math.min(
      100,
      fusionCascadeConvergenceIndex * 0.37 +
        pressureStackResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && pressureStackResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackConvergenceResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
