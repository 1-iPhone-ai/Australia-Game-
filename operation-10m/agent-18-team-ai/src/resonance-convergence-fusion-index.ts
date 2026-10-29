export interface ResonanceConvergenceFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Stack–cascade resonance fusing with cascade–convergence pressure under escalation.
 */
export function computeResonanceConvergenceFusionIndex(
  stackCascadeResonanceIndex: number,
  cascadeConvergencePressureIndex: number,
  coordinationEscalationTier: number,
): ResonanceConvergenceFusionReport {
  const notes: string[] = [];
  if (stackCascadeResonanceIndex >= 44 && cascadeConvergencePressureIndex >= 44) {
    notes.push('Stack resonance and convergence pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && stackCascadeResonanceIndex >= 46) {
    notes.push('Resonance–convergence fusion under active escalation');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      stackCascadeResonanceIndex * 0.38 +
        cascadeConvergencePressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (stackCascadeResonanceIndex >= 48 && cascadeConvergencePressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceConvergenceFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
