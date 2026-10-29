export interface SynthesisPressureFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Resonance–pressure convergence fusing with pressure–fusion convergence under audit load.
 */
export function computeSynthesisPressureFusionIndex(
  resonancePressureConvergenceIndex: number,
  pressureFusionConvergenceIndex: number,
  auditPressureIndex: number,
): SynthesisPressureFusionReport {
  const notes: string[] = [];
  if (resonancePressureConvergenceIndex >= 44 && pressureFusionConvergenceIndex >= 44) {
    notes.push('Pressure convergence and fusion convergence both elevated');
  }
  if (auditPressureIndex >= 40 && pressureFusionConvergenceIndex >= 46) {
    notes.push('Audit pressure driving synthesis–pressure fusion');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      resonancePressureConvergenceIndex * 0.37 +
        pressureFusionConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (resonancePressureConvergenceIndex >= 48 && pressureFusionConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisPressureFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
