import { HandoffRequest, RoleAssignment, TeamTaskSnapshot } from './types.ts';

export interface HandoffOrphanReport {
  orphanCount: number;
  orphanHandoffIds: string[];
  notes: string[];
}

function taskAssignedToActor(task: TeamTaskSnapshot | undefined, actorId: string): boolean {
  return Boolean(task && task.assignedActorIds.includes(actorId));
}

/**
 * Pending handoffs whose target actor is not assigned to the handoff task (orphaned acceptance).
 */
export function detectHandoffOrphans(
  handoffs: HandoffRequest[],
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
): HandoffOrphanReport {
  const notes: string[] = [];
  const orphanHandoffIds: string[] = [];
  const roleByActor = new Map(roles.map(r => [r.actorId, r]));

  handoffs
    .filter(h => h.status === 'pending')
    .forEach(h => {
      const task = tasks.find(t => t.id === h.taskId);
      const toRole = roleByActor.get(h.toActorId);
      const assigned = taskAssignedToActor(task, h.toActorId);
      const roleLinked = Boolean(toRole && toRole.taskIds.includes(h.taskId));

      if (!assigned && !roleLinked) {
        orphanHandoffIds.push(h.id);
        notes.push(`Orphan handoff ${h.id}: ${h.toActorId} not linked to task ${h.taskId}`);
      }
    });

  return {
    orphanCount: orphanHandoffIds.length,
    orphanHandoffIds: orphanHandoffIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamHandoffOrphans(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return friendly + enemy;
}
