export interface ResonanceFusionPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–pressure stack pressuring stack–synthesis fusion under audit load.
 */
export function computeResonanceFusionPressureIndex(
  resonancePressureStackIndex: number,
  stackSynthesisFusionIndex: number,
  auditPressureIndex: number,
): ResonanceFusionPressureReport {
  const notes: string[] = [];
  if (resonancePressureStackIndex >= 44 && stackSynthesisFusionIndex >= 44) {
    notes.push('Pressure stack and synthesis fusion both elevated');
  }
  if (auditPressureIndex >= 40 && resonancePressureStackIndex >= 46) {
    notes.push('Audit pressure driving resonance–fusion pressure');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      resonancePressureStackIndex * 0.37 +
        stackSynthesisFusionIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (resonancePressureStackIndex >= 48 && stackSynthesisFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceFusionPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
