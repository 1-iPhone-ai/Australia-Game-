export interface UnhexadecenaryHarmonyResonanceConvergenceStackReport {
  stackIndex: number;
  notes: string[];
}

/** Unhexadecenary harmony–resonance convergence stacked on harmony–resonance convergence stack under escalation. */
export function computeUnhexadecenaryHarmonyResonanceConvergenceStackIndex(
  hexadecenaryHarmonyResonanceIndex: number,
  harmonyResonanceConvergenceStackIndex: number,
  coordinationEscalationTier: number,
): UnhexadecenaryHarmonyResonanceConvergenceStackReport {
  const notes: string[] = [];
  if (hexadecenaryHarmonyResonanceIndex >= 45 && harmonyResonanceConvergenceStackIndex >= 45) {
    notes.push('Unhexadecenary harmony–resonance convergence and stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && harmonyResonanceConvergenceStackIndex >= 47) {
    notes.push('Unhexadecenary harmony–resonance convergence stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      hexadecenaryHarmonyResonanceIndex * 0.36 +
        harmonyResonanceConvergenceStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (hexadecenaryHarmonyResonanceIndex >= 49 && harmonyResonanceConvergenceStackIndex >= 47 ? 16 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamUnhexadecenaryHarmonyResonanceConvergenceStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
