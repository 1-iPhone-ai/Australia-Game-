import { HandoffRequest } from './types.ts';

export interface HandoffChainIntegrityReport {
  integrityScore: number;
  brokenHandoffIds: string[];
  duplicatePendingTaskIds: string[];
  notes: string[];
}

function actorKnown(actorId: string, known: Set<string>): boolean {
  return known.has(actorId);
}

/**
 * Validate pending handoff chains: actor membership, self-handoffs, duplicate pending targets.
 */
export function evaluateHandoffChainIntegrity(
  handoffs: HandoffRequest[],
  teamActorIds: Iterable<string>,
): HandoffChainIntegrityReport {
  const known = new Set(teamActorIds);
  const notes: string[] = [];
  const brokenHandoffIds: string[] = [];
  const pendingByTask = new Map<string, HandoffRequest[]>();

  handoffs
    .filter(h => h.status === 'pending')
    .forEach(h => {
      const list = pendingByTask.get(h.taskId) || [];
      list.push(h);
      pendingByTask.set(h.taskId, list);

      if (h.fromActorId === h.toActorId) {
        brokenHandoffIds.push(h.id);
        notes.push(`Handoff ${h.id} is a self-handoff`);
      }
      if (!actorKnown(h.fromActorId, known) || !actorKnown(h.toActorId, known)) {
        brokenHandoffIds.push(h.id);
        notes.push(`Handoff ${h.id} references unknown actor`);
      }
    });

  const duplicatePendingTaskIds: string[] = [];
  pendingByTask.forEach((list, taskId) => {
    if (list.length > 1) {
      duplicatePendingTaskIds.push(taskId);
      list.forEach(h => {
        if (!brokenHandoffIds.includes(h.id)) brokenHandoffIds.push(h.id);
      });
      notes.push(`Multiple pending handoffs for task ${taskId}`);
    }
  });

  const pendingCount = handoffs.filter(h => h.status === 'pending').length;
  const defectCount = new Set(brokenHandoffIds).size;
  const integrityScore =
    pendingCount === 0 ? 100 : Math.round(Math.max(0, 100 - (defectCount / pendingCount) * 100));

  return {
    integrityScore,
    brokenHandoffIds: [...new Set(brokenHandoffIds)].slice(0, 8),
    duplicatePendingTaskIds: duplicatePendingTaskIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamHandoffIntegrity(
  friendly: HandoffChainIntegrityReport,
  enemy: HandoffChainIntegrityReport | null,
): number {
  if (!enemy) return friendly.integrityScore;
  return Math.round((friendly.integrityScore + enemy.integrityScore) / 2);
}
