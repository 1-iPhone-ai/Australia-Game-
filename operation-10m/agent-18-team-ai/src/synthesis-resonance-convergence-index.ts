export interface SynthesisResonanceConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Fusion–resonance synthesis converging with pressure–cascade convergence under escalation.
 */
export function computeSynthesisResonanceConvergenceIndex(
  fusionResonanceSynthesisIndex: number,
  pressureCascadeConvergenceIndex: number,
  coordinationEscalationTier: number,
): SynthesisResonanceConvergenceReport {
  const notes: string[] = [];
  if (fusionResonanceSynthesisIndex >= 44 && pressureCascadeConvergenceIndex >= 44) {
    notes.push('Resonance synthesis and cascade convergence both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionResonanceSynthesisIndex >= 46) {
    notes.push('Synthesis–resonance convergence under active escalation');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      fusionResonanceSynthesisIndex * 0.38 +
        pressureCascadeConvergenceIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionResonanceSynthesisIndex >= 48 && pressureCascadeConvergenceIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisResonanceConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
