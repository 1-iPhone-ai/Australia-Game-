export interface ResonanceCascadeSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Cascade–convergence resonance synthesized with stack–amplification cascade fusion.
 */
export function computeResonanceCascadeSynthesisIndex(
  cascadeConvergenceResonanceIndex: number,
  stackAmplificationCascadeFusionIndex: number,
  auditPressureIndex: number,
): ResonanceCascadeSynthesisReport {
  const notes: string[] = [];
  if (cascadeConvergenceResonanceIndex >= 44 && stackAmplificationCascadeFusionIndex >= 44) {
    notes.push('Convergence resonance and cascade fusion both elevated');
  }
  if (auditPressureIndex >= 40 && cascadeConvergenceResonanceIndex >= 46) {
    notes.push('Audit pressure reinforcing resonance–cascade synthesis');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      cascadeConvergenceResonanceIndex * 0.37 +
        stackAmplificationCascadeFusionIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (cascadeConvergenceResonanceIndex >= 48 && stackAmplificationCascadeFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceCascadeSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
