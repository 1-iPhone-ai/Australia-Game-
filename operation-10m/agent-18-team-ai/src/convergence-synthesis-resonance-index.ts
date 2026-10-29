export interface ConvergenceSynthesisResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Pressure–fusion convergence resonating with fusion–synthesis resonance under composite health.
 */
export function computeConvergenceSynthesisResonanceIndex(
  pressureFusionConvergenceIndex: number,
  fusionSynthesisResonanceIndex: number,
  coordinationCompositeScore: number,
): ConvergenceSynthesisResonanceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (pressureFusionConvergenceIndex >= 44 && fusionSynthesisResonanceIndex >= 44) {
    notes.push('Fusion convergence and synthesis resonance both elevated');
  }
  if (weakComposite && fusionSynthesisResonanceIndex >= 46) {
    notes.push('Convergence–synthesis resonance under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const resonanceIndex = Math.round(
    Math.min(
      100,
      pressureFusionConvergenceIndex * 0.37 +
        fusionSynthesisResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && pressureFusionConvergenceIndex >= 48 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceSynthesisResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
