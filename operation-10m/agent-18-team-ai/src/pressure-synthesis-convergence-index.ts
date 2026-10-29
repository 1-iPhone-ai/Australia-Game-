export interface PressureSynthesisConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Convergence–synthesis resonance converging with resonance–convergence synthesis under composite health.
 */
export function computePressureSynthesisConvergenceIndex(
  convergenceSynthesisResonanceIndex: number,
  resonanceConvergenceSynthesisIndex: number,
  coordinationCompositeScore: number,
): PressureSynthesisConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (convergenceSynthesisResonanceIndex >= 44 && resonanceConvergenceSynthesisIndex >= 44) {
    notes.push('Synthesis resonance and convergence synthesis both elevated');
  }
  if (weakComposite && resonanceConvergenceSynthesisIndex >= 46) {
    notes.push('Pressure–synthesis convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      convergenceSynthesisResonanceIndex * 0.37 +
        resonanceConvergenceSynthesisIndex * 0.37 +
        compositePenalty +
        (weakComposite && convergenceSynthesisResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureSynthesisConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
