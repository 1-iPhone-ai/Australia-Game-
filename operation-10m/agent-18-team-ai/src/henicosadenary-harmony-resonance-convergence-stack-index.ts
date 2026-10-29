export interface UnhenhenicosadenaryHarmonyResonanceConvergenceStackReport {
  stackIndex: number;
  notes: string[];
}

/** Unhenhenicosadenary harmony–resonance convergence stacked on harmony–resonance convergence stack under escalation. */
export function computeUnhenhenicosadenaryHarmonyResonanceConvergenceStackIndex(
  henicosadenaryHarmonyResonanceIndex: number,
  harmonyResonanceConvergenceStackIndex: number,
  coordinationEscalationTier: number,
): UnhenhenicosadenaryHarmonyResonanceConvergenceStackReport {
  const notes: string[] = [];
  if (henicosadenaryHarmonyResonanceIndex >= 45 && harmonyResonanceConvergenceStackIndex >= 45) {
    notes.push('Unhenhenicosadenary harmony–resonance convergence and stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && harmonyResonanceConvergenceStackIndex >= 47) {
    notes.push('Unhenhenicosadenary harmony–resonance convergence stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      henicosadenaryHarmonyResonanceIndex * 0.36 +
        harmonyResonanceConvergenceStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (henicosadenaryHarmonyResonanceIndex >= 49 && harmonyResonanceConvergenceStackIndex >= 47 ? 16 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamUnhenhenicosadenaryHarmonyResonanceConvergenceStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
