export interface ConvergencePressureSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Synthesis–pressure fusion synthesizing with convergence–synthesis resonance under audit load.
 */
export function computeConvergencePressureSynthesisIndex(
  synthesisPressureFusionIndex: number,
  convergenceSynthesisResonanceIndex: number,
  auditPressureIndex: number,
): ConvergencePressureSynthesisReport {
  const notes: string[] = [];
  if (synthesisPressureFusionIndex >= 44 && convergenceSynthesisResonanceIndex >= 44) {
    notes.push('Pressure fusion and synthesis resonance both elevated');
  }
  if (auditPressureIndex >= 40 && convergenceSynthesisResonanceIndex >= 46) {
    notes.push('Audit pressure driving convergence–pressure synthesis');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      synthesisPressureFusionIndex * 0.37 +
        convergenceSynthesisResonanceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (synthesisPressureFusionIndex >= 48 && convergenceSynthesisResonanceIndex >= 46 ? 15 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergencePressureSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
