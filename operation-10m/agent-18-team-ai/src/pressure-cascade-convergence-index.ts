export interface PressureCascadeConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Fusion–synthesis pressure converging with synthesis–cascade convergence under audit load.
 */
export function computePressureCascadeConvergenceIndex(
  fusionSynthesisPressureIndex: number,
  synthesisCascadeConvergenceIndex: number,
  auditPressureIndex: number,
): PressureCascadeConvergenceReport {
  const notes: string[] = [];
  if (fusionSynthesisPressureIndex >= 44 && synthesisCascadeConvergenceIndex >= 44) {
    notes.push('Synthesis pressure and cascade convergence both elevated');
  }
  if (auditPressureIndex >= 40 && fusionSynthesisPressureIndex >= 46) {
    notes.push('Audit pressure driving pressure–cascade convergence');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      fusionSynthesisPressureIndex * 0.37 +
        synthesisCascadeConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (fusionSynthesisPressureIndex >= 48 && synthesisCascadeConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureCascadeConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
