export interface SeptenaryHarmonyResonanceConvergenceStackReport {
  stackIndex: number;
  notes: string[];
}

/** Septenary harmony–resonance convergence stacked on harmony–resonance convergence stack under escalation. */
export function computeSeptenaryHarmonyResonanceConvergenceStackIndex(
  septenaryHarmonyResonanceIndex: number,
  harmonyResonanceConvergenceStackIndex: number,
  coordinationEscalationTier: number,
): SeptenaryHarmonyResonanceConvergenceStackReport {
  const notes: string[] = [];
  if (septenaryHarmonyResonanceIndex >= 45 && harmonyResonanceConvergenceStackIndex >= 45) {
    notes.push('Septenary harmony–resonance convergence and stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && harmonyResonanceConvergenceStackIndex >= 47) {
    notes.push('Septenary harmony–resonance convergence stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      septenaryHarmonyResonanceIndex * 0.36 +
        harmonyResonanceConvergenceStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (septenaryHarmonyResonanceIndex >= 49 && harmonyResonanceConvergenceStackIndex >= 47 ? 16 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSeptenaryHarmonyResonanceConvergenceStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
