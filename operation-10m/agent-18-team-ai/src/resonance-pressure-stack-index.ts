export interface ResonancePressureStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Cascade–synthesis resonance stacking with convergence–pressure stack under audit load.
 */
export function computeResonancePressureStackIndex(
  cascadeSynthesisResonanceIndex: number,
  convergencePressureStackIndex: number,
  auditPressureIndex: number,
): ResonancePressureStackReport {
  const notes: string[] = [];
  if (cascadeSynthesisResonanceIndex >= 44 && convergencePressureStackIndex >= 44) {
    notes.push('Synthesis resonance and pressure stack both elevated');
  }
  if (auditPressureIndex >= 40 && cascadeSynthesisResonanceIndex >= 46) {
    notes.push('Audit pressure driving resonance–pressure stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      cascadeSynthesisResonanceIndex * 0.37 +
        convergencePressureStackIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (cascadeSynthesisResonanceIndex >= 48 && convergencePressureStackIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonancePressureStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
