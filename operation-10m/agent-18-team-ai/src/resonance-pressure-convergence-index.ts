export interface ResonancePressureConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Pressure–resonance synthesis converging with fusion–convergence pressure under audit load.
 */
export function computeResonancePressureConvergenceIndex(
  pressureResonanceSynthesisIndex: number,
  fusionConvergencePressureIndex: number,
  auditPressureIndex: number,
): ResonancePressureConvergenceReport {
  const notes: string[] = [];
  if (pressureResonanceSynthesisIndex >= 44 && fusionConvergencePressureIndex >= 44) {
    notes.push('Resonance synthesis and convergence pressure both elevated');
  }
  if (auditPressureIndex >= 40 && pressureResonanceSynthesisIndex >= 46) {
    notes.push('Audit pressure driving resonance–pressure convergence');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      pressureResonanceSynthesisIndex * 0.37 +
        fusionConvergencePressureIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureResonanceSynthesisIndex >= 48 && fusionConvergencePressureIndex >= 46 ? 15 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonancePressureConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
