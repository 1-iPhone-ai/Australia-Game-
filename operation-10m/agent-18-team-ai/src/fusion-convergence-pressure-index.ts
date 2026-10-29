export interface FusionConvergencePressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–synthesis fusion pressuring with synthesis–pressure convergence under composite health.
 */
export function computeFusionConvergencePressureIndex(
  resonanceSynthesisFusionIndex: number,
  synthesisPressureConvergenceIndex: number,
  coordinationCompositeScore: number,
): FusionConvergencePressureReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (resonanceSynthesisFusionIndex >= 44 && synthesisPressureConvergenceIndex >= 44) {
    notes.push('Synthesis fusion and pressure convergence both elevated');
  }
  if (weakComposite && resonanceSynthesisFusionIndex >= 46) {
    notes.push('Fusion–convergence pressure under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const pressureIndex = Math.round(
    Math.min(
      100,
      resonanceSynthesisFusionIndex * 0.37 +
        synthesisPressureConvergenceIndex * 0.37 +
        compositePenalty +
        (weakComposite && synthesisPressureConvergenceIndex >= 48 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionConvergencePressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
