export interface SynthesisFusionConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Convergence–synthesis fusion converging with synthesis–pressure resonance under composite health.
 */
export function computeSynthesisFusionConvergenceIndex(
  convergenceSynthesisFusionIndex: number,
  synthesisPressureResonanceIndex: number,
  coordinationCompositeScore: number,
): SynthesisFusionConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (convergenceSynthesisFusionIndex >= 44 && synthesisPressureResonanceIndex >= 44) {
    notes.push('Synthesis fusion and pressure resonance both elevated');
  }
  if (weakComposite && convergenceSynthesisFusionIndex >= 46) {
    notes.push('Synthesis–fusion convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      convergenceSynthesisFusionIndex * 0.37 +
        synthesisPressureResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && synthesisPressureResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisFusionConvergence(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
