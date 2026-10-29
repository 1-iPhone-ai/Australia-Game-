export interface StackSynthesisResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Synthesis–convergence stack resonating with cascade–resonance amplification under composite health.
 */
export function computeStackSynthesisResonanceIndex(
  synthesisConvergenceStackIndex: number,
  cascadeResonanceAmplificationIndex: number,
  coordinationCompositeScore: number,
): StackSynthesisResonanceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (synthesisConvergenceStackIndex >= 44 && cascadeResonanceAmplificationIndex >= 44) {
    notes.push('Convergence stack and resonance amplification both elevated');
  }
  if (weakComposite && synthesisConvergenceStackIndex >= 46) {
    notes.push('Stack–synthesis resonance under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const resonanceIndex = Math.round(
    Math.min(
      100,
      synthesisConvergenceStackIndex * 0.37 +
        cascadeResonanceAmplificationIndex * 0.37 +
        compositePenalty +
        (weakComposite && cascadeResonanceAmplificationIndex >= 48 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackSynthesisResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
