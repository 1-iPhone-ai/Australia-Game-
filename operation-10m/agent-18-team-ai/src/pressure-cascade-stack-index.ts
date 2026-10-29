export interface PressureCascadeStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Convergence–amplification pressure stacked on fusion–stack convergence load.
 */
export function computePressureCascadeStackIndex(
  convergenceAmplificationPressureIndex: number,
  fusionStackConvergenceIndex: number,
  stackAmplificationCascadeFusionIndex: number,
): PressureCascadeStackReport {
  const notes: string[] = [];
  if (convergenceAmplificationPressureIndex >= 44 && fusionStackConvergenceIndex >= 44) {
    notes.push('Amplification pressure and stack convergence both elevated');
  }
  if (stackAmplificationCascadeFusionIndex >= 46 && convergenceAmplificationPressureIndex >= 46) {
    notes.push('Cascade fusion reinforcing pressure–cascade stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      convergenceAmplificationPressureIndex * 0.37 +
        fusionStackConvergenceIndex * 0.37 +
        stackAmplificationCascadeFusionIndex * 0.18 +
        (convergenceAmplificationPressureIndex >= 48 && fusionStackConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureCascadeStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
