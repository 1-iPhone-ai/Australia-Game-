export interface FusionCascadePressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Stack–fusion cascade pressuring fusion–cascade convergence under audit load.
 */
export function computeFusionCascadePressureIndex(
  stackFusionCascadeIndex: number,
  fusionCascadeConvergenceIndex: number,
  auditPressureIndex: number,
): FusionCascadePressureReport {
  const notes: string[] = [];
  if (stackFusionCascadeIndex >= 44 && fusionCascadeConvergenceIndex >= 44) {
    notes.push('Fusion cascade and cascade convergence both elevated');
  }
  if (auditPressureIndex >= 40 && stackFusionCascadeIndex >= 46) {
    notes.push('Audit pressure driving fusion–cascade pressure');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      stackFusionCascadeIndex * 0.37 +
        fusionCascadeConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (stackFusionCascadeIndex >= 48 && fusionCascadeConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionCascadePressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
