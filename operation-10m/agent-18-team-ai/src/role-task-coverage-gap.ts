import { RoleAssignment, TeamTaskSnapshot } from './types.ts';

export interface RoleTaskCoverageReport {
  gapIndex: number;
  uncoveredTaskIds: string[];
  notes: string[];
}

function roleCoversTask(roles: RoleAssignment[], taskId: string): boolean {
  return roles.some(r => r.taskIds.includes(taskId));
}

/**
 * Detect team tasks with assignees that are not linked from any role assignment board.
 */
export function computeRoleTaskCoverageGap(
  roles: RoleAssignment[],
  tasks: TeamTaskSnapshot[],
): RoleTaskCoverageReport {
  const notes: string[] = [];
  const uncoveredTaskIds: string[] = [];

  tasks
    .filter(t => t.assignedActorIds.length > 0)
    .forEach(task => {
      if (!roleCoversTask(roles, task.id)) {
        uncoveredTaskIds.push(task.id);
        notes.push(`Task ${task.id} assigned but absent from role boards`);
      }
    });

  const assignedCount = tasks.filter(t => t.assignedActorIds.length > 0).length;
  const ratio = assignedCount === 0 ? 0 : uncoveredTaskIds.length / assignedCount;
  const gapIndex = Math.round(Math.min(100, ratio * 100 + uncoveredTaskIds.length * 8));

  return {
    gapIndex,
    uncoveredTaskIds: uncoveredTaskIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamRoleTaskCoverageGap(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
