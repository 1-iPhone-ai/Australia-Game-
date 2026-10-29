export interface PressureFusionConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Fusion–convergence pressure converging with convergence–pressure fusion under composite health.
 */
export function computePressureFusionConvergenceIndex(
  fusionConvergencePressureIndex: number,
  convergencePressureFusionIndex: number,
  coordinationCompositeScore: number,
): PressureFusionConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionConvergencePressureIndex >= 44 && convergencePressureFusionIndex >= 44) {
    notes.push('Convergence pressure and pressure fusion both elevated');
  }
  if (weakComposite && fusionConvergencePressureIndex >= 46) {
    notes.push('Pressure–fusion convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      fusionConvergencePressureIndex * 0.37 +
        convergencePressureFusionIndex * 0.37 +
        compositePenalty +
        (weakComposite && convergencePressureFusionIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureFusionConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
