import {
  HandoffRequest,
  RoleAssignment,
  TeamActorSnapshot,
  TeamTaskSnapshot,
} from './types.ts';

export interface HandoffReadinessRow {
  handoffId: string;
  toActorId: string;
  readinessScore: number;
  blockers: string[];
  ready: boolean;
}

export interface HandoffReadinessReport {
  rows: HandoffReadinessRow[];
  averageReadiness: number;
  notReadyHandoffIds: string[];
  notes: string[];
}

/**
 * Score whether pending handoff targets can accept responsibility this turn.
 */
export function scoreHandoffReadiness(
  handoffs: HandoffRequest[],
  actors: TeamActorSnapshot[],
  roles: RoleAssignment[],
  tasks: TeamTaskSnapshot[],
): HandoffReadinessReport {
  const pending = handoffs.filter(h => h.status === 'pending');
  const rows: HandoffReadinessRow[] = [];
  const notReadyHandoffIds: string[] = [];
  const notes: string[] = [];

  pending.forEach(h => {
    const actor = actors.find(a => a.id === h.toActorId);
    const role = roles.find(r => r.actorId === h.toActorId);
    const task = tasks.find(t => t.id === h.taskId);
    const blockers: string[] = [];
    let score = 100;

    if (!actor) {
      blockers.push('missing_target_actor');
      score = 0;
    } else {
      if (actor.inRecovery) {
        blockers.push('target_in_recovery');
        score -= 45;
      }
      if (actor.apRemaining !== null && actor.apRemaining <= 0) {
        blockers.push('target_no_ap');
        score -= 35;
      }
    }

    if (role?.primaryRole === 'recovery') {
      blockers.push('target_recovery_role');
      score -= 25;
    }

    if (task && task.status !== 'blocked') {
      blockers.push('task_not_blocked');
      score -= 20;
    }

    const ready = score >= 60 && blockers.length === 0;
    if (!ready) {
      notReadyHandoffIds.push(h.id);
      notes.push(`Handoff ${h.id} target ${h.toActorId} not ready (${blockers.join(', ') || 'low score'})`);
    }

    rows.push({
      handoffId: h.id,
      toActorId: h.toActorId,
      readinessScore: Math.max(0, Math.min(100, score)),
      blockers,
      ready,
    });
  });

  const averageReadiness =
    rows.length === 0
      ? 100
      : Math.round(rows.reduce((sum, r) => sum + r.readinessScore, 0) / rows.length);

  return {
    rows,
    averageReadiness,
    notReadyHandoffIds,
    notes: notes.slice(0, 8),
  };
}

export function filterHandoffsByReadiness(
  handoffs: HandoffRequest[],
  report: HandoffReadinessReport,
  minScore = 60,
): { eligible: HandoffRequest[]; deferredIds: string[] } {
  const eligible: HandoffRequest[] = [];
  const deferredIds: string[] = [];
  handoffs.forEach(h => {
    if (h.status !== 'pending') {
      eligible.push(h);
      return;
    }
    const row = report.rows.find(r => r.handoffId === h.id);
    if (row && row.readinessScore >= minScore && row.ready) {
      eligible.push(h);
    } else {
      deferredIds.push(h.id);
    }
  });
  return { eligible, deferredIds };
}
