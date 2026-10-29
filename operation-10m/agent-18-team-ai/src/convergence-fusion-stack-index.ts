export interface ConvergenceFusionStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Stack–friction convergence stacked with coupling–amplification fusion under escalation.
 */
export function computeConvergenceFusionStackIndex(
  stackFrictionConvergenceIndex: number,
  couplingAmplificationFusionIndex: number,
  coordinationEscalationTier: number,
): ConvergenceFusionStackReport {
  const notes: string[] = [];
  if (stackFrictionConvergenceIndex >= 44 && couplingAmplificationFusionIndex >= 44) {
    notes.push('Convergence and fusion both elevated');
  }
  if (coordinationEscalationTier >= 2 && stackFrictionConvergenceIndex >= 46) {
    notes.push('Stack–friction convergence under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      stackFrictionConvergenceIndex * 0.37 +
        couplingAmplificationFusionIndex * 0.37 +
        coordinationEscalationTier * 7 +
        (stackFrictionConvergenceIndex >= 48 && couplingAmplificationFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceFusionStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
