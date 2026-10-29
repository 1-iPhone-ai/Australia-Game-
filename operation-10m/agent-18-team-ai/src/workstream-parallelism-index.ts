import { AGENT18_LIMITS, ParallelWorkstream } from './types.ts';

export interface WorkstreamParallelismReport {
  parallelismIndex: number;
  notes: string[];
}

/**
 * Score active parallel workstream load relative to configured workstream cap.
 */
export function measureWorkstreamParallelism(workstreams: ParallelWorkstream[]): WorkstreamParallelismReport {
  const notes: string[] = [];
  const scoped = workstreams.slice(0, AGENT18_LIMITS.maxWorkstreams);
  const active = scoped.filter(ws => ws.phase === 'active').length;
  const waiting = scoped.filter(ws => ws.phase === 'waiting_barrier').length;
  const inFlight = active + waiting;
  const ratio = inFlight / Math.max(1, AGENT18_LIMITS.maxWorkstreams);

  if (ratio >= 0.75) {
    notes.push(`Workstreams in flight at ${Math.round(ratio * 100)}% of cap (${inFlight}/${AGENT18_LIMITS.maxWorkstreams})`);
  }
  if (waiting >= 2) {
    notes.push(`${waiting} workstreams waiting on barriers`);
  }

  const parallelismIndex = Math.round(Math.min(100, ratio * 70 + waiting * 12));

  return { parallelismIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamWorkstreamParallelism(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
