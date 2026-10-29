export interface DirectiveQuotaExhaustionReport {
  exhaustionIndex: number;
  notes: string[];
}

/**
 * Pressure from directive quota drops and actors with zero remaining quota.
 */
export function computeDirectiveQuotaExhaustionIndex(
  droppedCount: number,
  quotaExhaustedActorIds: string[],
): DirectiveQuotaExhaustionReport {
  const notes: string[] = [];
  const exhausted = quotaExhaustedActorIds.length;
  if (droppedCount > 0) {
    notes.push(`${droppedCount} directive(s) dropped by quota guard`);
  }
  if (exhausted > 0) {
    notes.push(`${exhausted} actor(s) at directive quota limit`);
  }

  const exhaustionIndex = Math.round(
    Math.min(100, droppedCount * 18 + exhausted * 22 + (droppedCount > 0 && exhausted > 0 ? 10 : 0)),
  );

  return { exhaustionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamDirectiveQuotaExhaustion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
