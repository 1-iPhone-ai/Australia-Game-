export interface UnundecenaryHarmonyResonanceConvergenceStackReport {
  stackIndex: number;
  notes: string[];
}

/** Unundecenary harmony–resonance convergence stacked on harmony–resonance convergence stack under escalation. */
export function computeUnundecenaryHarmonyResonanceConvergenceStackIndex(
  undecenaryHarmonyResonanceIndex: number,
  harmonyResonanceConvergenceStackIndex: number,
  coordinationEscalationTier: number,
): UnundecenaryHarmonyResonanceConvergenceStackReport {
  const notes: string[] = [];
  if (undecenaryHarmonyResonanceIndex >= 45 && harmonyResonanceConvergenceStackIndex >= 45) {
    notes.push('Unundecenary harmony–resonance convergence and stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && harmonyResonanceConvergenceStackIndex >= 47) {
    notes.push('Unundecenary harmony–resonance convergence stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      undecenaryHarmonyResonanceIndex * 0.36 +
        harmonyResonanceConvergenceStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (undecenaryHarmonyResonanceIndex >= 49 && harmonyResonanceConvergenceStackIndex >= 47 ? 16 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamUnundecenaryHarmonyResonanceConvergenceStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
