export interface UntridecenaryHarmonyResonanceConvergenceStackReport {
  stackIndex: number;
  notes: string[];
}

/** Untridecenary harmony–resonance convergence stacked on harmony–resonance convergence stack under escalation. */
export function computeUntridecenaryHarmonyResonanceConvergenceStackIndex(
  tridecenaryHarmonyResonanceIndex: number,
  harmonyResonanceConvergenceStackIndex: number,
  coordinationEscalationTier: number,
): UntridecenaryHarmonyResonanceConvergenceStackReport {
  const notes: string[] = [];
  if (tridecenaryHarmonyResonanceIndex >= 45 && harmonyResonanceConvergenceStackIndex >= 45) {
    notes.push('Untridecenary harmony–resonance convergence and stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && harmonyResonanceConvergenceStackIndex >= 47) {
    notes.push('Untridecenary harmony–resonance convergence stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      tridecenaryHarmonyResonanceIndex * 0.36 +
        harmonyResonanceConvergenceStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (tridecenaryHarmonyResonanceIndex >= 49 && harmonyResonanceConvergenceStackIndex >= 47 ? 16 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamUntridecenaryHarmonyResonanceConvergenceStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
