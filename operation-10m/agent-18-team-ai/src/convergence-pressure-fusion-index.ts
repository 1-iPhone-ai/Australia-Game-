export interface ConvergencePressureFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Synthesis–pressure convergence fusing with pressure–fusion stack under escalation.
 */
export function computeConvergencePressureFusionIndex(
  synthesisPressureConvergenceIndex: number,
  pressureFusionStackIndex: number,
  coordinationEscalationTier: number,
): ConvergencePressureFusionReport {
  const notes: string[] = [];
  if (synthesisPressureConvergenceIndex >= 44 && pressureFusionStackIndex >= 44) {
    notes.push('Pressure convergence and fusion stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisPressureConvergenceIndex >= 46) {
    notes.push('Convergence–pressure fusion under active escalation');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      synthesisPressureConvergenceIndex * 0.38 +
        pressureFusionStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (synthesisPressureConvergenceIndex >= 48 && pressureFusionStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergencePressureFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
