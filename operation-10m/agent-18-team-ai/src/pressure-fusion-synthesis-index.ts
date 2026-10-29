export interface PressureFusionSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Resonance–fusion pressure synthesizing with fusion–convergence synthesis under audit load.
 */
export function computePressureFusionSynthesisIndex(
  resonanceFusionPressureIndex: number,
  fusionConvergenceSynthesisIndex: number,
  auditPressureIndex: number,
): PressureFusionSynthesisReport {
  const notes: string[] = [];
  if (resonanceFusionPressureIndex >= 44 && fusionConvergenceSynthesisIndex >= 44) {
    notes.push('Fusion pressure and convergence synthesis both elevated');
  }
  if (auditPressureIndex >= 40 && resonanceFusionPressureIndex >= 46) {
    notes.push('Audit pressure driving pressure–fusion synthesis');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      resonanceFusionPressureIndex * 0.37 +
        fusionConvergenceSynthesisIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (resonanceFusionPressureIndex >= 48 && fusionConvergenceSynthesisIndex >= 46 ? 15 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureFusionSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
