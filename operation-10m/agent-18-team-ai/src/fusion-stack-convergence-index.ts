export interface FusionStackConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Stack–amplification cascade fusion converging with resonance–amplification stack.
 */
export function computeFusionStackConvergenceIndex(
  stackAmplificationCascadeFusionIndex: number,
  resonanceAmplificationStackIndex: number,
  coordinationEscalationTier: number,
): FusionStackConvergenceReport {
  const notes: string[] = [];
  if (stackAmplificationCascadeFusionIndex >= 44 && resonanceAmplificationStackIndex >= 44) {
    notes.push('Cascade fusion and amplification stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && stackAmplificationCascadeFusionIndex >= 46) {
    notes.push('Fusion–stack convergence under active escalation');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      stackAmplificationCascadeFusionIndex * 0.38 +
        resonanceAmplificationStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (stackAmplificationCascadeFusionIndex >= 48 && resonanceAmplificationStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionStackConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
