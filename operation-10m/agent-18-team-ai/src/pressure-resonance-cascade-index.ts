export interface PressureResonanceCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Fusion–cascade pressure cascading with stack–convergence resonance under audit load.
 */
export function computePressureResonanceCascadeIndex(
  fusionCascadePressureIndex: number,
  stackConvergenceResonanceIndex: number,
  auditPressureIndex: number,
): PressureResonanceCascadeReport {
  const notes: string[] = [];
  if (fusionCascadePressureIndex >= 44 && stackConvergenceResonanceIndex >= 44) {
    notes.push('Cascade pressure and convergence resonance both elevated');
  }
  if (auditPressureIndex >= 40 && fusionCascadePressureIndex >= 46) {
    notes.push('Audit pressure driving pressure–resonance cascade');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      fusionCascadePressureIndex * 0.37 +
        stackConvergenceResonanceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (fusionCascadePressureIndex >= 48 && stackConvergenceResonanceIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureResonanceCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
