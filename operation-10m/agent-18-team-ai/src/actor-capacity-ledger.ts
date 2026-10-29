import { RoleAssignment, TeamActorSnapshot, TeamTaskSnapshot } from './types.ts';

export interface ActorCapacityRow {
  actorId: string;
  apRemaining: number | null;
  readyTaskCount: number;
  activeTaskCount: number;
  loadScore: number;
  status: 'balanced' | 'overloaded' | 'idle';
}

export interface CapacityLedgerSnapshot {
  rows: ActorCapacityRow[];
  balanceScore: number;
  overloadedActorIds: string[];
  idleActorIds: string[];
  notes: string[];
}

const ACTIVE_STATUSES = new Set(['ready', 'active', 'blocked']);

function taskLoadForActor(actorId: string, tasks: TeamTaskSnapshot[]): { ready: number; active: number } {
  let ready = 0;
  let active = 0;
  tasks.forEach(t => {
    if (!t.assignedActorIds.includes(actorId)) return;
    if (t.status === 'ready') ready += 1;
    if (t.status === 'active') active += 1;
  });
  return { ready, active };
}

function roleWeight(role: RoleAssignment | undefined): number {
  if (!role) return 1;
  if (role.primaryRole === 'recovery') return 0.5;
  if (role.primaryRole === 'support') return 0.75;
  return 1;
}

/**
 * Read-only capacity view: compares AP budget vs assigned work for rebalance hints.
 */
export function buildActorCapacityLedger(
  actors: TeamActorSnapshot[],
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
): CapacityLedgerSnapshot {
  const rows: ActorCapacityRow[] = [];
  const overloadedActorIds: string[] = [];
  const idleActorIds: string[] = [];
  const notes: string[] = [];

  actors.forEach(actor => {
    const role = roles.find(r => r.actorId === actor.id);
    const { ready, active } = taskLoadForActor(actor.id, tasks);
    const weight = roleWeight(role);
    const ap = actor.apRemaining;
    const demand = (ready + active * 1.25) * weight;
    const supply = ap === null ? Math.max(1, demand) : Math.max(0, ap);
    const loadScore = supply <= 0 ? demand : demand / supply;

    let status: ActorCapacityRow['status'] = 'balanced';
    if (actor.inRecovery) {
      status = ready + active > 1 ? 'overloaded' : 'balanced';
    } else if (ap !== null && ap === 0 && ready > 0) {
      status = 'overloaded';
    } else if (loadScore > 1.35) {
      status = 'overloaded';
    } else if (ap !== null && ap >= 3 && ready === 0 && active === 0) {
      status = 'idle';
    }

    if (status === 'overloaded') {
      overloadedActorIds.push(actor.id);
      notes.push(`Actor ${actor.id} overloaded (load ${loadScore.toFixed(2)})`);
    }
    if (status === 'idle') {
      idleActorIds.push(actor.id);
      notes.push(`Actor ${actor.id} idle with ${ap} AP remaining`);
    }

    rows.push({
      actorId: actor.id,
      apRemaining: ap,
      readyTaskCount: ready,
      activeTaskCount: active,
      loadScore: Math.round(loadScore * 100) / 100,
      status,
    });
  });

  const balanceScore =
    rows.length === 0
      ? 100
      : Math.round(
          (rows.filter(r => r.status === 'balanced').length / rows.length) * 100,
        );

  return {
    rows,
    balanceScore,
    overloadedActorIds,
    idleActorIds,
    notes: notes.slice(0, 8),
  };
}

export function suggestCapacityRebalanceNotes(ledger: CapacityLedgerSnapshot): string[] {
  if (ledger.overloadedActorIds.length === 0 || ledger.idleActorIds.length === 0) {
    return [];
  }
  return [
    `Rebalance hint: shift work from ${ledger.overloadedActorIds.join(', ')} to ${ledger.idleActorIds.join(', ')}`,
  ];
}
