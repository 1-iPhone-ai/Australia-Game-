export interface SynthesisConvergencePressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–convergence synthesis pressuring with synthesis–pressure fusion under escalation.
 */
export function computeSynthesisConvergencePressureIndex(
  resonanceConvergenceSynthesisIndex: number,
  synthesisPressureFusionIndex: number,
  coordinationEscalationTier: number,
): SynthesisConvergencePressureReport {
  const notes: string[] = [];
  if (resonanceConvergenceSynthesisIndex >= 44 && synthesisPressureFusionIndex >= 44) {
    notes.push('Convergence synthesis and pressure fusion both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisPressureFusionIndex >= 46) {
    notes.push('Synthesis–convergence pressure under active escalation');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      resonanceConvergenceSynthesisIndex * 0.38 +
        synthesisPressureFusionIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (resonanceConvergenceSynthesisIndex >= 48 && synthesisPressureFusionIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisConvergencePressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
