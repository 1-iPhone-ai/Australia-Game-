import { PriorityArbitrationRecord, RoleAssignment, TaskKind, TeamTaskSnapshot } from './types.ts';

/** Mission tier (lower number = wins). Mirrors Team OS objective tiers. */
export const MISSION_TIER_BY_TASK: Partial<Record<TaskKind, number>> = {
  request_treasury: 3,
  generate_cash: 4,
  preserve_reserve: 5,
  defend_region: 6,
  recover: 7,
  take_region: 8,
  reach_region: 8,
  support_actor: 7,
  monitor_rival: 9,
  complete_contract: 8,
};

export interface ArbitrationCandidate {
  actorId: string;
  task: TeamTaskSnapshot;
  role: RoleAssignment | null;
  explicit: boolean;
  locked: boolean;
}

export interface ArbitrationOutcome {
  winner: ArbitrationCandidate;
  demoted: ArbitrationCandidate[];
  reason: string;
}

export function missionTierForTask(task: TeamTaskSnapshot): number {
  return MISSION_TIER_BY_TASK[task.type] ?? 8;
}

/**
 * Effective arbitration score (lower wins). Combines mission tier, task priority field,
 * explicit/locked boosts, and defend-over-take on the same region.
 */
export function arbitrationScore(
  candidate: ArbitrationCandidate,
  regionId: string | null,
): number {
  let score = missionTierForTask(candidate.task) * 100 + candidate.task.priority;
  if (candidate.task.type === 'defend_region' && regionId && candidate.task.regionId === regionId) {
    score -= 5;
  }
  if (candidate.task.type === 'take_region' && regionId && candidate.task.regionId === regionId) {
    score += 3;
  }
  if (candidate.explicit) score -= 2;
  if (candidate.locked) score -= 1;
  if (candidate.role?.primaryRole === 'recovery') score += 4;
  return score;
}

export function compareArbitrationCandidates(
  a: ArbitrationCandidate,
  b: ArbitrationCandidate,
  regionId: string | null,
): number {
  const sa = arbitrationScore(a, regionId);
  const sb = arbitrationScore(b, regionId);
  if (sa !== sb) return sa - sb;
  if (a.task.priority !== b.task.priority) return a.task.priority - b.task.priority;
  const actorCmp = a.actorId.localeCompare(b.actorId);
  if (actorCmp !== 0) return actorCmp;
  return a.task.id.localeCompare(b.task.id);
}

export function arbitrateCompetingCandidates(
  candidates: ArbitrationCandidate[],
  regionId: string | null,
): ArbitrationOutcome | null {
  const live = candidates.filter(
    c => !['completed', 'cancelled', 'superseded'].includes(c.task.status),
  );
  if (!live.length) return null;
  if (live.length === 1) {
    return {
      winner: live[0],
      demoted: [],
      reason: `Priority arbitration: ${live[0].actorId} wins (sole active candidate, tier ${missionTierForTask(live[0].task)})`,
    };
  }
  const sorted = live.slice().sort((x, y) => compareArbitrationCandidates(x, y, regionId));
  const winner = sorted[0];
  const demoted = sorted.slice(1);
  const winTier = missionTierForTask(winner.task);
  const reasonParts = [`tier ${winTier} ${winner.task.type}`, `task priority ${winner.task.priority}`];
  if (winner.explicit) reasonParts.push('explicit assignment');
  if (winner.locked) reasonParts.push('locked role');
  const reason = reasonParts.join('; ');
  return {
    winner,
    demoted,
    reason: `Priority arbitration: ${winner.actorId} wins (${reason})`,
  };
}

export function collectRegionCandidates(
  regionId: string,
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  lockedActorIds: string[] = [],
): ArbitrationCandidate[] {
  const depositTasks = tasks.filter(
    t =>
      t.regionId === regionId &&
      (t.type === 'defend_region' || t.type === 'take_region') &&
      !['completed', 'cancelled', 'superseded'].includes(t.status),
  );
  const out: ArbitrationCandidate[] = [];
  depositTasks.forEach(task => {
    task.assignedActorIds.forEach(actorId => {
      const role = roles.find(r => r.actorId === actorId) || null;
      out.push({
        actorId,
        task,
        role,
        explicit: Boolean(role?.explicit),
        locked: lockedActorIds.includes(actorId),
      });
    });
  });
  return out;
}

/** Pick one lead actor per region using mission tiers and stable tie-breaks. */
export function arbitrateRegionLead(
  regionId: string,
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  lockedActorIds: string[] = [],
): { holderActorId: string | null; record: ArbitrationOutcome | null } {
  const candidates = collectRegionCandidates(regionId, tasks, roles, lockedActorIds);
  if (!candidates.length) return { holderActorId: null, record: null };
  const outcome = arbitrateCompetingCandidates(candidates, regionId);
  if (!outcome) return { holderActorId: null, record: null };
  return { holderActorId: outcome.winner.actorId, record: outcome };
}

export function buildMutexMapWithPriorityArbitration(
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  lockedActorIds: string[] = [],
): { mutexRegions: Record<string, string>; arbitrationLog: PriorityArbitrationRecord[] } {
  const regions = new Set(
    tasks
      .filter(
        t =>
          t.regionId &&
          (t.type === 'defend_region' || t.type === 'take_region') &&
          !['completed', 'cancelled', 'superseded'].includes(t.status),
      )
      .map(t => t.regionId as string),
  );
  const mutexRegions: Record<string, string> = {};
  const arbitrationLog: PriorityArbitrationRecord[] = [];
  regions.forEach(regionId => {
    const { holderActorId, record } = arbitrateRegionLead(regionId, tasks, roles, lockedActorIds);
    if (!holderActorId || !record) return;
    mutexRegions[regionId] = holderActorId;
    arbitrationLog.push({
      regionId,
      winnerActorId: record.winner.actorId,
      winnerTaskId: record.winner.task.id,
      reason: record.reason,
      demoted: record.demoted.map(d => ({
        actorId: d.actorId,
        taskId: d.task.id,
        reason: `tier ${missionTierForTask(d.task)} ${d.task.type} loses arbitration`,
      })),
    });
  });
  return { mutexRegions, arbitrationLog };
}

/** Slot collision winner using the same arbitration ordering as region mutex. */
export function pickSlotCollisionWinner(
  actorIds: string[],
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  slotRegionId: string | null,
): string | null {
  const candidates: ArbitrationCandidate[] = [];
  actorIds.forEach(actorId => {
    const role = roles.find(r => r.actorId === actorId) || null;
    const task =
      tasks
        .filter(
          t =>
            t.assignedActorIds.includes(actorId) &&
            !['completed', 'cancelled', 'superseded'].includes(t.status),
        )
        .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))[0] || null;
    if (!task) return;
    candidates.push({ actorId, task, role, explicit: Boolean(role?.explicit), locked: false });
  });
  const outcome = arbitrateCompetingCandidates(candidates, slotRegionId);
  return outcome?.winner.actorId ?? null;
}
