import {
  AGENT18_LIMITS,
  CoordinationLease,
  CoordinationPlan,
  HandoffRequest,
  ParallelWorkstream,
  RoleAssignment,
  TeamTaskSnapshot,
} from './types.ts';

function leaseId(kind: string, regionId: string | null, taskId: string | null, holder: string): string {
  return `lease_${kind}_${regionId || 'none'}_${taskId || 'none'}_${holder}`;
}

/** Build region mutex map: one lead actor per contested region for deposit-class tasks. */
export function buildRegionMutexMap(
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
): Record<string, string> {
  const mutex: Record<string, string> = {};
  const depositTasks = tasks
    .filter(
      t =>
        t.regionId &&
        (t.type === 'defend_region' || t.type === 'take_region') &&
        !['cancelled', 'superseded', 'completed'].includes(t.status),
    )
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  depositTasks.forEach(t => {
    const region = t.regionId!;
    if (mutex[region]) return;
    const lead =
      t.assignedActorIds[0] ||
      roles.find(r => r.taskIds.includes(t.id))?.actorId ||
      t.assignedActorIds[0];
    if (lead) mutex[region] = lead;
  });
  return mutex;
}

export function buildCoordinationLeases(
  turn: number,
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  mutexRegions: Record<string, string>,
): CoordinationLease[] {
  const leases: CoordinationLease[] = [];
  Object.entries(mutexRegions).forEach(([regionId, holderActorId]) => {
    const task = tasks.find(
      t =>
        t.regionId === regionId &&
        (t.type === 'defend_region' || t.type === 'take_region') &&
        t.assignedActorIds.includes(holderActorId),
    );
    leases.push({
      id: leaseId('region_exclusive', regionId, task?.id || null, holderActorId),
      kind: 'region_exclusive',
      holderActorId,
      regionId,
      taskId: task?.id || null,
      sinceTurn: turn,
      expiresTurn: null,
      reason: `Lead deposit coordination for ${regionId}`,
    });
  });
  tasks
    .filter(t => t.type === 'request_treasury' && t.status !== 'completed')
    .slice(0, 2)
    .forEach(t => {
      const holder = t.assignedActorIds[0];
      if (!holder) return;
      leases.push({
        id: leaseId('treasury_request', null, t.id, holder),
        kind: 'treasury_request',
        holderActorId: holder,
        regionId: null,
        taskId: t.id,
        sinceTurn: turn,
        expiresTurn: turn + 2,
        reason: 'Treasury funding request in flight',
      });
    });
  return leases.slice(0, AGENT18_LIMITS.maxLeases);
}

export function detectHandoffCandidates(
  turn: number,
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  mutexRegions: Record<string, string>,
): HandoffRequest[] {
  const handoffs: HandoffRequest[] = [];
  Object.entries(mutexRegions).forEach(([regionId, leadId]) => {
    const task = tasks.find(
      t =>
        t.regionId === regionId &&
        t.status === 'blocked' &&
        t.assignedActorIds.includes(leadId),
    );
    if (!task) return;
    const supporter = roles.find(
      r => r.primaryRole === 'support' && r.responsibility.includes(regionId),
    );
    if (!supporter || supporter.actorId === leadId) return;
    handoffs.push({
      id: `handoff_${regionId}_${leadId}_${supporter.actorId}`,
      fromActorId: leadId,
      toActorId: supporter.actorId,
      regionId,
      taskId: task.id,
      status: 'pending',
      requestedTurn: turn,
      reason: `${leadId} blocked on ${regionId}; offer handoff to ${supporter.actorId}`,
    });
  });
  return handoffs.slice(0, AGENT18_LIMITS.maxHandoffs);
}

export function buildParallelWorkstreams(
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
): ParallelWorkstream[] {
  const activeActors = roles.filter(r => r.taskIds.length > 0).map(r => r.actorId);
  if (activeActors.length < 2) return [];
  const human = roles.find(r => r.actorId === 'player');
  const ai = roles.find(r => r.actorId !== 'player' && r.taskIds.length > 0);
  if (!human || !ai) return [];
  const sharedBarrier = tasks.filter(
    t => t.type === 'preserve_reserve' || t.type === 'monitor_rival',
  );
  return [
    {
      id: 'ws_parallel_human_ai',
      actorIds: [human.actorId, ai.actorId],
      taskIds: [...new Set([...human.taskIds, ...ai.taskIds])],
      phase: sharedBarrier.some(b => b.status === 'waiting') ? 'waiting_barrier' : 'active',
      barrierTaskIds: sharedBarrier.map(t => t.id),
    },
  ].slice(0, AGENT18_LIMITS.maxWorkstreams);
}

export function orchestrateTeamCoordination(
  turn: number,
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
): CoordinationPlan {
  const warnings: string[] = [];
  const mutexRegions = buildRegionMutexMap(tasks, roles);
  const leases = buildCoordinationLeases(turn, tasks, roles, mutexRegions);
  const handoffs = detectHandoffCandidates(turn, tasks, roles, mutexRegions);
  const workstreams = buildParallelWorkstreams(tasks, roles);
  tasks.forEach(t => {
    if (!t.regionId || !mutexRegions[t.regionId]) return;
    const lead = mutexRegions[t.regionId];
    if (t.type !== 'support_actor' && t.assignedActorIds.length > 1) {
      warnings.push(`Task ${t.id} shares actors but region ${t.regionId} mutex held by ${lead}`);
    }
  });
  return { leases, handoffs, workstreams, mutexRegions, warnings };
}

export function acceptHandoff(plan: CoordinationPlan, handoffId: string): CoordinationPlan {
  const handoffs = plan.handoffs.map(h =>
    h.id === handoffId ? { ...h, status: 'accepted' as const } : h,
  );
  const accepted = handoffs.find(h => h.id === handoffId && h.status === 'accepted');
  if (!accepted || !accepted.regionId) return { ...plan, handoffs };
  const mutexRegions = { ...plan.mutexRegions, [accepted.regionId]: accepted.toActorId };
  const leases = plan.leases.map(l =>
    l.regionId === accepted.regionId && l.kind === 'region_exclusive'
      ? { ...l, holderActorId: accepted.toActorId, reason: `Handoff accepted from ${accepted.fromActorId}` }
      : l,
  );
  return { ...plan, handoffs, mutexRegions, leases };
}

export function rejectHandoff(plan: CoordinationPlan, handoffId: string): CoordinationPlan {
  return {
    ...plan,
    handoffs: plan.handoffs.map(h =>
      h.id === handoffId ? { ...h, status: 'rejected' as const } : h,
    ),
  };
}

export function coordinationHealthScore(plan: CoordinationPlan): number {
  let score = 1;
  score -= Math.min(0.4, plan.warnings.length * 0.08);
  score -= Math.min(0.2, plan.handoffs.filter(h => h.status === 'pending').length * 0.05);
  const barriers = plan.workstreams.filter(w => w.phase === 'waiting_barrier').length;
  score -= Math.min(0.15, barriers * 0.07);
  return Math.max(0, Math.round(score * 100) / 100);
}

export function actorHoldsLease(plan: CoordinationPlan, actorId: string, regionId: string): boolean {
  return plan.leases.some(
    l => l.kind === 'region_exclusive' && l.holderActorId === actorId && l.regionId === regionId,
  );
}

export function serializeCoordinationPlan(plan: CoordinationPlan): string {
  return JSON.stringify({
    leases: plan.leases.map(l => [l.id, l.holderActorId, l.regionId]),
    mutex: plan.mutexRegions,
    handoffs: plan.handoffs.map(h => [h.id, h.status]),
    ws: plan.workstreams.map(w => [w.id, w.phase]),
  });
}
