export interface PressureSynthesisCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Cascade–convergence pressure cascading with convergence–fusion synthesis under audit load.
 */
export function computePressureSynthesisCascadeIndex(
  cascadeConvergencePressureIndex: number,
  convergenceFusionSynthesisIndex: number,
  auditPressureIndex: number,
): PressureSynthesisCascadeReport {
  const notes: string[] = [];
  if (cascadeConvergencePressureIndex >= 44 && convergenceFusionSynthesisIndex >= 44) {
    notes.push('Convergence pressure and fusion synthesis both elevated');
  }
  if (auditPressureIndex >= 40 && cascadeConvergencePressureIndex >= 46) {
    notes.push('Audit pressure driving pressure–synthesis cascade');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      cascadeConvergencePressureIndex * 0.37 +
        convergenceFusionSynthesisIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (cascadeConvergencePressureIndex >= 48 && convergenceFusionSynthesisIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureSynthesisCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
