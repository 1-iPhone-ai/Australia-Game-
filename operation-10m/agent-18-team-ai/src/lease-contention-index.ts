import { AGENT18_LIMITS, CoordinationLease, HandoffRequest } from './types.ts';

export interface LeaseContentionReport {
  contentionIndex: number;
  contendedRegionIds: string[];
  notes: string[];
}

/**
 * Score regions where leases, mutex holders, and pending handoffs disagree on ownership.
 */
export function computeLeaseContentionIndex(
  leases: CoordinationLease[],
  handoffs: HandoffRequest[],
  mutexRegions: Record<string, string>,
): LeaseContentionReport {
  const notes: string[] = [];
  const contendedRegionIds: string[] = [];
  const scopedLeases = leases.slice(0, AGENT18_LIMITS.maxLeases);
  const regionLeaseHolders = new Map<string, Set<string>>();

  scopedLeases.forEach(lease => {
    if (!lease.regionId) return;
    const holders = regionLeaseHolders.get(lease.regionId) ?? new Set<string>();
    holders.add(lease.holderActorId);
    regionLeaseHolders.set(lease.regionId, holders);
  });

  regionLeaseHolders.forEach((holders, regionId) => {
    if (holders.size > 1) {
      contendedRegionIds.push(regionId);
      notes.push(`Region ${regionId}: ${holders.size} lease holders (${[...holders].join(', ')})`);
    }
  });

  handoffs
    .filter(h => h.status === 'pending' && h.regionId)
    .forEach(h => {
      const regionId = h.regionId as string;
      const mutexHolder = mutexRegions[regionId];
      if (mutexHolder && mutexHolder !== h.toActorId) {
        if (!contendedRegionIds.includes(regionId)) contendedRegionIds.push(regionId);
        notes.push(
          `Handoff ${h.id} to ${h.toActorId} conflicts with mutex holder ${mutexHolder} on ${regionId}`,
        );
      }
    });

  const leaseConflictWeight = contendedRegionIds.filter(r => {
    const holders = regionLeaseHolders.get(r);
    return holders && holders.size > 1;
  }).length;
  const handoffConflictCount = notes.filter(n => n.startsWith('Handoff')).length;
  const signal = leaseConflictWeight * 35 + handoffConflictCount * 25;
  const contentionIndex = Math.min(100, Math.round(signal));

  return {
    contentionIndex,
    contendedRegionIds: contendedRegionIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamLeaseContention(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
