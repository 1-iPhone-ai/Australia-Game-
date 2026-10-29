import { CoordinationPlan, HandoffRequest, PriorityArbitrationRecord } from './types.ts';

export interface CoordinationReconcileChange {
  kind:
    | 'mutex_holder_changed'
    | 'handoff_opened'
    | 'handoff_closed'
    | 'lease_added'
    | 'lease_removed'
    | 'arbitration_reversed';
  regionId: string | null;
  detail: string;
}

export interface CoordinationReconcileReport {
  turn: number;
  stable: boolean;
  changes: CoordinationReconcileChange[];
  thrashingRegions: string[];
}

function handoffKey(h: HandoffRequest): string {
  return `${h.id}:${h.status}`;
}

/** Compare two coordination plans for material diffs (turn-to-turn stability). */
export function reconcileCoordinationPlans(
  previous: CoordinationPlan | null,
  next: CoordinationPlan,
  turn: number,
): CoordinationReconcileReport {
  const changes: CoordinationReconcileChange[] = [];
  if (!previous) {
    return { turn, stable: true, changes, thrashingRegions: [] };
  }

  const prevRegions = previous.mutexRegions;
  const nextRegions = next.mutexRegions;
  new Set([...Object.keys(prevRegions), ...Object.keys(nextRegions)]).forEach(regionId => {
    const a = prevRegions[regionId];
    const b = nextRegions[regionId];
    if (a && b && a !== b) {
      changes.push({
        kind: 'mutex_holder_changed',
        regionId,
        detail: `${regionId}: ${a} → ${b}`,
      });
      const prevArb = previous.arbitrationLog.find(x => x.regionId === regionId);
      const nextArb = next.arbitrationLog.find(x => x.regionId === regionId);
      if (prevArb && nextArb && prevArb.winnerActorId !== nextArb.winnerActorId) {
        changes.push({
          kind: 'arbitration_reversed',
          regionId,
          detail: `arbitration ${prevArb.winnerActorId} → ${nextArb.winnerActorId}`,
        });
      }
    }
  });

  const prevHandoffs = new Map(previous.handoffs.map(h => [handoffKey(h), h]));
  next.handoffs.forEach(h => {
    const k = handoffKey(h);
    const p = prevHandoffs.get(k);
    if (!p && h.status === 'pending') {
      changes.push({ kind: 'handoff_opened', regionId: h.regionId, detail: h.id });
    }
  });
  previous.handoffs.forEach(h => {
    const n = next.handoffs.find(x => x.id === h.id);
    if (h.status === 'pending' && n && n.status !== 'pending') {
      changes.push({
        kind: 'handoff_closed',
        regionId: h.regionId,
        detail: `${h.id} → ${n.status}`,
      });
    }
  });

  const prevLeaseIds = new Set(previous.leases.map(l => l.id));
  const nextLeaseIds = new Set(next.leases.map(l => l.id));
  next.leases.forEach(l => {
    if (!prevLeaseIds.has(l.id)) {
      changes.push({ kind: 'lease_added', regionId: l.regionId, detail: l.id });
    }
  });
  previous.leases.forEach(l => {
    if (!nextLeaseIds.has(l.id)) {
      changes.push({ kind: 'lease_removed', regionId: l.regionId, detail: l.id });
    }
  });

  return {
    turn,
    stable: changes.length === 0,
    changes,
    thrashingRegions: [],
  };
}

/** Flag regions whose mutex holder changed in ≥2 of the last N snapshots. */
export function detectMutexThrashing(
  mutexHistory: Array<Record<string, string>>,
  minFlips: number = 2,
): string[] {
  const flips: Record<string, number> = {};
  for (let i = 1; i < mutexHistory.length; i += 1) {
    const prev = mutexHistory[i - 1];
    const cur = mutexHistory[i];
    new Set([...Object.keys(prev), ...Object.keys(cur)]).forEach(regionId => {
      if (prev[regionId] && cur[regionId] && prev[regionId] !== cur[regionId]) {
        flips[regionId] = (flips[regionId] || 0) + 1;
      }
    });
  }
  return Object.entries(flips)
    .filter(([, n]) => n >= minFlips)
    .map(([regionId]) => regionId)
    .sort();
}

export function mergeReconcileThrashing(
  report: CoordinationReconcileReport,
  mutexHistory: Array<Record<string, string>>,
): CoordinationReconcileReport {
  const thrashingRegions = detectMutexThrashing(mutexHistory);
  return {
    ...report,
    stable: report.stable && thrashingRegions.length === 0,
    thrashingRegions,
  };
}

export function summarizeArbitrationDemotions(log: PriorityArbitrationRecord[]): number {
  return log.reduce((s, e) => s + e.demoted.length, 0);
}
