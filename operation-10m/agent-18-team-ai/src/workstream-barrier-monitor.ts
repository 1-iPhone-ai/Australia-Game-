import { AGENT18_LIMITS, ParallelWorkstream, TeamTaskSnapshot } from './types.ts';

export interface WorkstreamBarrierReport {
  stalledWorkstreamIds: string[];
  waitingBarrierCount: number;
  barrierComplianceScore: number;
  notes: string[];
}

/**
 * Detect parallel workstreams stuck on barrier tasks beyond a turn budget.
 */
export function evaluateWorkstreamBarriers(
  turn: number,
  workstreams: ParallelWorkstream[],
  tasks: TeamTaskSnapshot[],
  options: { maxBarrierWaitTurns?: number; workstreamSinceTurn?: Record<string, number> } = {},
): WorkstreamBarrierReport {
  const maxWait = options.maxBarrierWaitTurns ?? AGENT18_LIMITS.workstreamBarrierMaxWaitTurns;
  const sinceById = options.workstreamSinceTurn ?? {};
  const stalledWorkstreamIds: string[] = [];
  const notes: string[] = [];

  const waiting = workstreams.filter(ws => ws.phase === 'waiting_barrier');
  waiting.forEach(ws => {
    const barrierTasks = ws.barrierTaskIds
      .map(id => tasks.find(t => t.id === id))
      .filter((t): t is TeamTaskSnapshot => Boolean(t));
    const allWaiting = barrierTasks.length > 0 && barrierTasks.every(t => t.status === 'waiting');
    if (!allWaiting) return;

    const since = sinceById[ws.id] ?? turn;
    const age = turn - since;
    if (age > maxWait) {
      stalledWorkstreamIds.push(ws.id);
      notes.push(`Workstream ${ws.id} stalled on barrier (${age} turns, max ${maxWait})`);
    }
  });

  const barrierComplianceScore =
    waiting.length === 0
      ? 100
      : Math.max(
          0,
          Math.round(100 * (1 - stalledWorkstreamIds.length / Math.max(1, waiting.length))),
        );

  return {
    stalledWorkstreamIds,
    waitingBarrierCount: waiting.length,
    barrierComplianceScore,
    notes: notes.slice(0, 6),
  };
}

export function trackWorkstreamBarrierSince(
  previous: Record<string, number>,
  workstreams: ParallelWorkstream[],
  turn: number,
): Record<string, number> {
  const next: Record<string, number> = { ...previous };
  workstreams.forEach(ws => {
    if (ws.phase === 'waiting_barrier') {
      if (next[ws.id] === undefined) next[ws.id] = turn;
    } else {
      delete next[ws.id];
    }
  });
  return next;
}
