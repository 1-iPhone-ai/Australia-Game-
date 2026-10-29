export interface ConvergenceAmplificationPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–amplification stack pressure converging with cascade–convergence resonance under composite health.
 */
export function computeConvergenceAmplificationPressureIndex(
  resonanceAmplificationStackIndex: number,
  cascadeConvergenceResonanceIndex: number,
  coordinationCompositeScore: number,
): ConvergenceAmplificationPressureReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (resonanceAmplificationStackIndex >= 44 && cascadeConvergenceResonanceIndex >= 44) {
    notes.push('Amplification stack and convergence resonance both elevated');
  }
  if (weakComposite && resonanceAmplificationStackIndex >= 46) {
    notes.push('Convergence amplification pressure under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.32 : 0;
  const pressureIndex = Math.round(
    Math.min(
      100,
      resonanceAmplificationStackIndex * 0.36 +
        cascadeConvergenceResonanceIndex * 0.38 +
        compositePenalty +
        (weakComposite && cascadeConvergenceResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceAmplificationPressure(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
