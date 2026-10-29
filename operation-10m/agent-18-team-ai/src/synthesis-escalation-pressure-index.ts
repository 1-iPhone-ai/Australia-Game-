export interface SynthesisEscalationPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Cascade–coupling synthesis pressure stacked with escalation tier and amplification load.
 */
export function computeSynthesisEscalationPressureIndex(
  cascadeCouplingSynthesisIndex: number,
  stackCascadeAmplificationIndex: number,
  coordinationEscalationTier: number,
): SynthesisEscalationPressureReport {
  const notes: string[] = [];
  if (cascadeCouplingSynthesisIndex >= 44 && stackCascadeAmplificationIndex >= 44) {
    notes.push('Coupling synthesis and cascade amplification both elevated');
  }
  if (coordinationEscalationTier >= 2 && cascadeCouplingSynthesisIndex >= 46) {
    notes.push('Synthesis escalation pressure under active tier');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      cascadeCouplingSynthesisIndex * 0.36 +
        stackCascadeAmplificationIndex * 0.36 +
        coordinationEscalationTier * 8 +
        (cascadeCouplingSynthesisIndex >= 48 && stackCascadeAmplificationIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisEscalationPressure(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
