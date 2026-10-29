export interface PressureStackFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Pressure–cascade convergence fusing with cascade–stack fusion under audit load.
 */
export function computePressureStackFusionIndex(
  pressureCascadeConvergenceIndex: number,
  cascadeStackFusionIndex: number,
  auditPressureIndex: number,
): PressureStackFusionReport {
  const notes: string[] = [];
  if (pressureCascadeConvergenceIndex >= 44 && cascadeStackFusionIndex >= 44) {
    notes.push('Cascade convergence and stack fusion both elevated');
  }
  if (auditPressureIndex >= 40 && pressureCascadeConvergenceIndex >= 46) {
    notes.push('Audit pressure driving pressure–stack fusion');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      pressureCascadeConvergenceIndex * 0.37 +
        cascadeStackFusionIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureCascadeConvergenceIndex >= 48 && cascadeStackFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureStackFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
