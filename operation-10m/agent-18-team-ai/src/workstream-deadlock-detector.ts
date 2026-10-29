import { ParallelWorkstream } from './types.ts';

export interface WorkstreamDeadlockReport {
  deadlockCount: number;
  deadlockedWorkstreamIds: string[];
  notes: string[];
}

function waitingWorkstreams(workstreams: ParallelWorkstream[]): ParallelWorkstream[] {
  return workstreams.filter(ws => ws.phase === 'waiting_barrier');
}

function dependsOn(a: ParallelWorkstream, b: ParallelWorkstream): boolean {
  if (b.taskIds.length === 0) return false;
  const bTasks = new Set(b.taskIds);
  return a.barrierTaskIds.some(taskId => bTasks.has(taskId));
}

/**
 * Detect circular barrier dependencies among workstreams stuck in waiting_barrier.
 */
export function detectWorkstreamDeadlocks(workstreams: ParallelWorkstream[]): WorkstreamDeadlockReport {
  const waiting = waitingWorkstreams(workstreams);
  const notes: string[] = [];
  const deadlocked = new Set<string>();

  const adjacency = new Map<string, string[]>();
  waiting.forEach(ws => {
    const deps = waiting.filter(other => other.id !== ws.id && dependsOn(ws, other)).map(o => o.id);
    adjacency.set(ws.id, deps);
  });

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  const reportCycle = (cycleStart: string) => {
    const startIdx = stack.indexOf(cycleStart);
    if (startIdx < 0) return;
    const cycle = stack.slice(startIdx);
    cycle.forEach(id => deadlocked.add(id));
    notes.push(`Workstream deadlock cycle: ${cycle.join(' → ')}`);
  };

  const dfs = (node: string): boolean => {
    if (visiting.has(node)) {
      reportCycle(node);
      return true;
    }
    if (visited.has(node)) return false;
    visiting.add(node);
    stack.push(node);
    const neighbors = adjacency.get(node) || [];
    neighbors.forEach(n => {
      dfs(n);
    });
    stack.pop();
    visiting.delete(node);
    visited.add(node);
    return false;
  };

  waiting.forEach(ws => {
    if (!visited.has(ws.id)) dfs(ws.id);
  });

  return {
    deadlockCount: deadlocked.size,
    deadlockedWorkstreamIds: [...deadlocked].slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamWorkstreamDeadlocks(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return friendly + enemy;
}
