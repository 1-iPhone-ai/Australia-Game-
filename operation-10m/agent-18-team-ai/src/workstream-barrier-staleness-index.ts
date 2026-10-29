import { AGENT18_LIMITS } from './types.ts';

export interface WorkstreamBarrierStalenessReport {
  stalenessIndex: number;
  notes: string[];
}

/**
 * How long workstreams have waited at barriers relative to the SLA cap.
 */
export function computeWorkstreamBarrierStalenessIndex(
  currentTurn: number,
  workstreamBarrierSince: Record<string, number>,
  stalledWorkstreamIds: string[],
): WorkstreamBarrierStalenessReport {
  const notes: string[] = [];
  const maxWait = AGENT18_LIMITS.workstreamBarrierMaxWaitTurns;
  let worstWait = 0;

  stalledWorkstreamIds.forEach(wsId => {
    const since = workstreamBarrierSince[wsId];
    if (since === undefined) return;
    const wait = Math.max(0, currentTurn - since);
    worstWait = Math.max(worstWait, wait);
  });

  if (worstWait > maxWait) {
    notes.push(`Workstream barrier stale ${worstWait} turn(s) (cap ${maxWait})`);
  } else if (stalledWorkstreamIds.length > 0 && worstWait >= maxWait) {
    notes.push(`${stalledWorkstreamIds.length} stalled workstream(s) at barrier cap`);
  }

  const stallPenalty = stalledWorkstreamIds.length * 14;
  const waitPenalty = worstWait <= 0 ? 0 : Math.min(60, (worstWait / Math.max(1, maxWait)) * 55);
  const stalenessIndex = Math.round(Math.min(100, stallPenalty + waitPenalty));

  return { stalenessIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamWorkstreamBarrierStaleness(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
