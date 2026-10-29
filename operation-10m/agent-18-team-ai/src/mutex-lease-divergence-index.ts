import { AGENT18_LIMITS, CoordinationLease } from './types.ts';

export interface MutexLeaseDivergenceReport {
  divergenceIndex: number;
  divergentRegionIds: string[];
  notes: string[];
}

/**
 * Flag regions where mutex holder and active lease holder disagree.
 */
export function computeMutexLeaseDivergenceIndex(
  mutexRegions: Record<string, string>,
  leases: CoordinationLease[],
): MutexLeaseDivergenceReport {
  const notes: string[] = [];
  const divergentRegionIds: string[] = [];
  const scoped = leases.slice(0, AGENT18_LIMITS.maxLeases);

  Object.entries(mutexRegions).forEach(([regionId, mutexHolder]) => {
    const lease = scoped.find(l => l.regionId === regionId);
    if (!lease) return;
    if (lease.holderActorId !== mutexHolder) {
      divergentRegionIds.push(regionId);
      notes.push(
        `Region ${regionId}: mutex ${mutexHolder} vs lease ${lease.holderActorId} (${lease.id})`,
      );
    }
  });

  const tracked = Object.keys(mutexRegions).length;
  const ratio = tracked === 0 ? 0 : divergentRegionIds.length / tracked;
  const divergenceIndex = Math.round(Math.min(100, ratio * 100 + divergentRegionIds.length * 12));

  return {
    divergenceIndex,
    divergentRegionIds: divergentRegionIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamMutexLeaseDivergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
