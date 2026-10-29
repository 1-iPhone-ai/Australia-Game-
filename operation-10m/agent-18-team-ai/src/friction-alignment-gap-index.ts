export interface FrictionAlignmentGapReport {
  gapIndex: number;
  notes: string[];
}

/**
 * Persistence–gradient friction diverging from escalation–recovery alignment.
 */
export function computeFrictionAlignmentGapIndex(
  persistenceGradientFrictionIndex: number,
  escalationRecoveryAlignmentIndex: number,
  persistenceChurnIndex: number,
): FrictionAlignmentGapReport {
  const notes: string[] = [];
  const misaligned = escalationRecoveryAlignmentIndex < 45;
  if (persistenceGradientFrictionIndex >= 40 && misaligned) {
    notes.push('Persistence friction while escalation–recovery alignment is weak');
  }
  if (persistenceChurnIndex >= 38 && persistenceGradientFrictionIndex >= 42) {
    notes.push('Elevated churn contributing to friction–alignment gap');
  }

  const alignmentPenalty = misaligned ? Math.max(0, 55 - escalationRecoveryAlignmentIndex) * 0.5 : 0;
  const gapIndex = Math.round(
    Math.min(
      100,
      persistenceGradientFrictionIndex * 0.38 +
        alignmentPenalty +
        persistenceChurnIndex * 0.22 +
        (misaligned && persistenceGradientFrictionIndex >= 44 ? 16 : 0),
    ),
  );

  return { gapIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFrictionAlignmentGap(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
