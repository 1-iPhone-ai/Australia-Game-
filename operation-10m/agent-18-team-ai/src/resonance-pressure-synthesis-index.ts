export interface ResonancePressureSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Amplification–stack resonance synthesized with escalation pressure under composite health.
 */
export function computeResonancePressureSynthesisIndex(
  amplificationStackResonanceIndex: number,
  synthesisEscalationPressureIndex: number,
  coordinationCompositeScore: number,
): ResonancePressureSynthesisReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (amplificationStackResonanceIndex >= 44 && synthesisEscalationPressureIndex >= 44) {
    notes.push('Stack resonance and escalation pressure both elevated');
  }
  if (weakComposite && synthesisEscalationPressureIndex >= 46) {
    notes.push('Resonance–pressure synthesis under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.32 : 0;
  const synthesisIndex = Math.round(
    Math.min(
      100,
      amplificationStackResonanceIndex * 0.36 +
        synthesisEscalationPressureIndex * 0.38 +
        compositePenalty +
        (weakComposite && amplificationStackResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonancePressureSynthesis(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
