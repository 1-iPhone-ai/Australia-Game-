export interface ResonanceHarmonyConvergenceStackReport {
  stackIndex: number;
  notes: string[];
}

/** Resonance–harmony convergence stacked on harmony–resonance convergence under escalation. */
export function computeResonanceHarmonyConvergenceStackIndex(
  resonanceHarmonyConvergenceIndex: number,
  harmonyResonanceConvergenceIndex: number,
  coordinationEscalationTier: number,
): ResonanceHarmonyConvergenceStackReport {
  const notes: string[] = [];
  if (resonanceHarmonyConvergenceIndex >= 44 && harmonyResonanceConvergenceIndex >= 44) {
    notes.push('Resonance–harmony convergence and harmony–resonance convergence both elevated');
  }
  if (coordinationEscalationTier >= 2 && harmonyResonanceConvergenceIndex >= 46) {
    notes.push('Resonance–harmony convergence stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      resonanceHarmonyConvergenceIndex * 0.37 +
        harmonyResonanceConvergenceIndex * 0.37 +
        coordinationEscalationTier * 5 +
        (resonanceHarmonyConvergenceIndex >= 48 && harmonyResonanceConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceHarmonyConvergenceStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
