export interface HarmonyResonanceConvergenceStackReport {
  stackIndex: number;
  notes: string[];
}

/** Harmony–resonance convergence stacked on resonance–harmony convergence under escalation. */
export function computeHarmonyResonanceConvergenceStackIndex(
  harmonyResonanceConvergenceIndex: number,
  resonanceHarmonyConvergenceIndex: number,
  coordinationEscalationTier: number,
): HarmonyResonanceConvergenceStackReport {
  const notes: string[] = [];
  if (harmonyResonanceConvergenceIndex >= 44 && resonanceHarmonyConvergenceIndex >= 44) {
    notes.push('Harmony–resonance convergence and resonance–harmony convergence both elevated');
  }
  if (coordinationEscalationTier >= 2 && resonanceHarmonyConvergenceIndex >= 46) {
    notes.push('Harmony–resonance convergence stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      harmonyResonanceConvergenceIndex * 0.37 +
        resonanceHarmonyConvergenceIndex * 0.37 +
        coordinationEscalationTier * 5 +
        (harmonyResonanceConvergenceIndex >= 48 && resonanceHarmonyConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamHarmonyResonanceConvergenceStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
