export interface CascadeConvergencePressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–pressure cascade pressuring synthesis–fusion convergence under audit load.
 */
export function computeCascadeConvergencePressureIndex(
  resonancePressureCascadeIndex: number,
  synthesisFusionConvergenceIndex: number,
  auditPressureIndex: number,
): CascadeConvergencePressureReport {
  const notes: string[] = [];
  if (resonancePressureCascadeIndex >= 44 && synthesisFusionConvergenceIndex >= 44) {
    notes.push('Pressure cascade and fusion convergence both elevated');
  }
  if (auditPressureIndex >= 40 && resonancePressureCascadeIndex >= 46) {
    notes.push('Audit pressure driving cascade–convergence pressure');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      resonancePressureCascadeIndex * 0.37 +
        synthesisFusionConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (resonancePressureCascadeIndex >= 48 && synthesisFusionConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeConvergencePressure(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
