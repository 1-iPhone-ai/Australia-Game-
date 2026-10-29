export interface ResonanceHarmonyConvergenceReport {
  harmonyIndex: number;
  notes: string[];
}

/** Harmony–resonance synthesis harmonizing with synthesis–convergence harmony under escalation. */
export function computeResonanceHarmonyConvergenceIndex(
  harmonyResonanceSynthesisIndex: number,
  synthesisConvergenceHarmonyIndex: number,
  coordinationEscalationTier: number,
): ResonanceHarmonyConvergenceReport {
  const notes: string[] = [];
  if (harmonyResonanceSynthesisIndex >= 44 && synthesisConvergenceHarmonyIndex >= 44) {
    notes.push('Resonance synthesis and convergence harmony both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisConvergenceHarmonyIndex >= 46) {
    notes.push('Resonance–harmony convergence under active escalation');
  }

  const harmonyIndex = Math.round(
    Math.min(
      100,
      harmonyResonanceSynthesisIndex * 0.38 +
        synthesisConvergenceHarmonyIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (harmonyResonanceSynthesisIndex >= 48 && synthesisConvergenceHarmonyIndex >= 46 ? 14 : 0),
    ),
  );

  return { harmonyIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceHarmonyConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
