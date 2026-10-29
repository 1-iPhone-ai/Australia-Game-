export interface CascadeLeaseConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Handoff cascade risk converging with lease-overlap stress on pending chains.
 */
export function computeCascadeLeaseConvergenceIndex(
  handoffCascadeRiskIndex: number,
  handoffLeaseOverlapIndex: number,
  cascadeChainActorCount: number,
): CascadeLeaseConvergenceReport {
  const notes: string[] = [];
  if (handoffCascadeRiskIndex >= 38 && handoffLeaseOverlapIndex >= 38) {
    notes.push('Handoff cascade risk and lease overlap both elevated');
  }
  if (cascadeChainActorCount > 0 && handoffLeaseOverlapIndex >= 42) {
    notes.push(`${cascadeChainActorCount} actor(s) in cascade with lease-overlap stress`);
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      handoffCascadeRiskIndex * 0.34 +
        handoffLeaseOverlapIndex * 0.36 +
        cascadeChainActorCount * 9 +
        (handoffCascadeRiskIndex >= 42 && handoffLeaseOverlapIndex >= 44 ? 17 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeLeaseConvergence(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
