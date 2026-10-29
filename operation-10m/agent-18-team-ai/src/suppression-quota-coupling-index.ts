export interface SuppressionQuotaCouplingReport {
  couplingIndex: number;
  notes: string[];
}

/**
 * Combined stress when directive suppression backlog coincides with quota exhaustion.
 */
export function computeSuppressionQuotaCouplingIndex(
  suppressionBacklogIndex: number,
  directiveQuotaExhaustionIndex: number,
  quotaExhaustedActorCount: number,
): SuppressionQuotaCouplingReport {
  const notes: string[] = [];
  if (suppressionBacklogIndex >= 35 && directiveQuotaExhaustionIndex >= 35) {
    notes.push('Suppression backlog and quota exhaustion both elevated');
  }
  if (quotaExhaustedActorCount > 0 && suppressionBacklogIndex >= 40) {
    notes.push(`${quotaExhaustedActorCount} exhausted actor(s) with suppressed backlog`);
  }

  const couplingIndex = Math.round(
    Math.min(
      100,
      suppressionBacklogIndex * 0.35 +
        directiveQuotaExhaustionIndex * 0.35 +
        quotaExhaustedActorCount * 10 +
        (suppressionBacklogIndex >= 40 && directiveQuotaExhaustionIndex >= 40 ? 18 : 0),
    ),
  );

  return { couplingIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSuppressionQuotaCoupling(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
