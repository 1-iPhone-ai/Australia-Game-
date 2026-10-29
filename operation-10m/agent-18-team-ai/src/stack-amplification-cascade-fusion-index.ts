export interface StackAmplificationCascadeFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Synthesis–stack amplification fused with amplification–convergence cascade load.
 */
export function computeStackAmplificationCascadeFusionIndex(
  synthesisStackAmplificationIndex: number,
  amplificationConvergenceCascadeIndex: number,
  coordinationEscalationTier: number,
): StackAmplificationCascadeFusionReport {
  const notes: string[] = [];
  if (synthesisStackAmplificationIndex >= 44 && amplificationConvergenceCascadeIndex >= 44) {
    notes.push('Stack amplification and convergence cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisStackAmplificationIndex >= 46) {
    notes.push('Amplification–cascade fusion under active escalation');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      synthesisStackAmplificationIndex * 0.38 +
        amplificationConvergenceCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (synthesisStackAmplificationIndex >= 48 && amplificationConvergenceCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackAmplificationCascadeFusion(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
