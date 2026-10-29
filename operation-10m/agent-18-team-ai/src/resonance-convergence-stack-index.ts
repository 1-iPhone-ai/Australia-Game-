export interface ResonanceConvergenceStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Synthesis–resonance convergence stacking with pressure–stack fusion under escalation.
 */
export function computeResonanceConvergenceStackIndex(
  synthesisResonanceConvergenceIndex: number,
  pressureStackFusionIndex: number,
  coordinationEscalationTier: number,
): ResonanceConvergenceStackReport {
  const notes: string[] = [];
  if (synthesisResonanceConvergenceIndex >= 44 && pressureStackFusionIndex >= 44) {
    notes.push('Resonance convergence and stack fusion both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisResonanceConvergenceIndex >= 46) {
    notes.push('Resonance–convergence stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      synthesisResonanceConvergenceIndex * 0.38 +
        pressureStackFusionIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (synthesisResonanceConvergenceIndex >= 48 && pressureStackFusionIndex >= 46 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceConvergenceStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
