export interface StackFrictionConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Stack–mismatch coupling converging with friction–alignment gap under weak composite health.
 */
export function computeStackFrictionConvergenceIndex(
  stackMismatchCouplingIndex: number,
  frictionAlignmentGapIndex: number,
  coordinationCompositeScore: number,
): StackFrictionConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (stackMismatchCouplingIndex >= 42 && frictionAlignmentGapIndex >= 42) {
    notes.push('Stack coupling and friction gap both elevated');
  }
  if (weakComposite && frictionAlignmentGapIndex >= 44) {
    notes.push('Friction gap under depressed coordination composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 60 - coordinationCompositeScore) * 0.4 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      stackMismatchCouplingIndex * 0.35 +
        frictionAlignmentGapIndex * 0.36 +
        compositePenalty +
        (weakComposite && stackMismatchCouplingIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackFrictionConvergence(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
