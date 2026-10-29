export interface FusionCascadeStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Convergence–synthesis fusion stacked with pressure–cascade stack under escalation.
 */
export function computeFusionCascadeStackIndex(
  convergenceSynthesisFusionIndex: number,
  pressureCascadeStackIndex: number,
  coordinationEscalationTier: number,
): FusionCascadeStackReport {
  const notes: string[] = [];
  if (convergenceSynthesisFusionIndex >= 44 && pressureCascadeStackIndex >= 44) {
    notes.push('Synthesis fusion and pressure–cascade stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && pressureCascadeStackIndex >= 46) {
    notes.push('Fusion–cascade stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      convergenceSynthesisFusionIndex * 0.38 +
        pressureCascadeStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (convergenceSynthesisFusionIndex >= 48 && pressureCascadeStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionCascadeStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
