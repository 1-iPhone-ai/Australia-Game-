export interface FusionSynthesisPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Pressure–fusion synthesis pressuring synthesis–stack convergence under audit load.
 */
export function computeFusionSynthesisPressureIndex(
  pressureFusionSynthesisIndex: number,
  synthesisStackConvergenceIndex: number,
  auditPressureIndex: number,
): FusionSynthesisPressureReport {
  const notes: string[] = [];
  if (pressureFusionSynthesisIndex >= 44 && synthesisStackConvergenceIndex >= 44) {
    notes.push('Fusion synthesis and stack convergence both elevated');
  }
  if (auditPressureIndex >= 40 && pressureFusionSynthesisIndex >= 46) {
    notes.push('Audit pressure driving fusion–synthesis pressure');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      pressureFusionSynthesisIndex * 0.37 +
        synthesisStackConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureFusionSynthesisIndex >= 48 && synthesisStackConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionSynthesisPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
