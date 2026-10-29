export interface HarmonyResonanceConvergenceReport {
  synthesisIndex: number;
  notes: string[];
}

/** Synthesis–convergence harmony converging with harmony–resonance synthesis under escalation. */
export function computeHarmonyResonanceConvergenceIndex(
  synthesisConvergenceHarmonyIndex: number,
  harmonyResonanceSynthesisIndex: number,
  coordinationEscalationTier: number,
): HarmonyResonanceConvergenceReport {
  const notes: string[] = [];
  if (synthesisConvergenceHarmonyIndex >= 44 && harmonyResonanceSynthesisIndex >= 44) {
    notes.push('Harmony pressure and resonance convergence both elevated');
  }
  if (coordinationEscalationTier >= 2 && harmonyResonanceSynthesisIndex >= 46) {
    notes.push('Harmony–resonance convergence under active escalation');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      synthesisConvergenceHarmonyIndex * 0.38 +
        harmonyResonanceSynthesisIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (synthesisConvergenceHarmonyIndex >= 48 && harmonyResonanceSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamHarmonyResonanceConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
