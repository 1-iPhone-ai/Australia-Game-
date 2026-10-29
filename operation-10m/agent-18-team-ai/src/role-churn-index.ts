import { RoleAssignment } from './types.ts';

export interface RoleChurnReport {
  churnIndex: number;
  churnedActorIds: string[];
  stableActorCount: number;
  notes: string[];
}

/**
 * Measure how many actors changed primary role since the previous evaluation.
 */
export function computeRoleChurnIndex(
  previousRoles: RoleAssignment[] | null | undefined,
  currentRoles: RoleAssignment[],
): RoleChurnReport {
  if (!previousRoles || previousRoles.length === 0) {
    return {
      churnIndex: 0,
      churnedActorIds: [],
      stableActorCount: currentRoles.length,
      notes: [],
    };
  }

  const prevByActor = new Map(previousRoles.map(r => [r.actorId, r]));
  const churnedActorIds: string[] = [];
  const notes: string[] = [];

  currentRoles.forEach(role => {
    const prev = prevByActor.get(role.actorId);
    if (!prev) return;
    if (prev.primaryRole !== role.primaryRole) {
      churnedActorIds.push(role.actorId);
      notes.push(
        `Actor ${role.actorId} role churn ${prev.primaryRole} → ${role.primaryRole}`,
      );
    }
  });

  const compared = currentRoles.filter(r => prevByActor.has(r.actorId)).length;
  const stableActorCount = Math.max(0, compared - churnedActorIds.length);
  const churnRate = compared === 0 ? 0 : churnedActorIds.length / compared;
  const churnIndex = Math.round(Math.min(100, churnRate * 100));

  return {
    churnIndex,
    churnedActorIds: churnedActorIds.slice(0, 8),
    stableActorCount,
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamRoleChurn(
  friendly: RoleChurnReport,
  enemy: RoleChurnReport | null,
): number {
  if (!enemy) return friendly.churnIndex;
  return Math.round((friendly.churnIndex + enemy.churnIndex) / 2);
}
