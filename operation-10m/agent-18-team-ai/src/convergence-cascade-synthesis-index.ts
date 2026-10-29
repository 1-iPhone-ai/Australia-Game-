export interface ConvergenceCascadeSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Fusion–resonance convergence synthesized with pressure–fusion cascade load.
 */
export function computeConvergenceCascadeSynthesisIndex(
  fusionResonanceConvergenceIndex: number,
  pressureFusionCascadeIndex: number,
  coordinationEscalationTier: number,
): ConvergenceCascadeSynthesisReport {
  const notes: string[] = [];
  if (fusionResonanceConvergenceIndex >= 44 && pressureFusionCascadeIndex >= 44) {
    notes.push('Fusion convergence and pressure cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && pressureFusionCascadeIndex >= 46) {
    notes.push('Convergence–cascade synthesis under active escalation');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      fusionResonanceConvergenceIndex * 0.38 +
        pressureFusionCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionResonanceConvergenceIndex >= 48 && pressureFusionCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceCascadeSynthesis(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
