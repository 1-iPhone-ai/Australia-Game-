import { RoleAssignment } from './types.ts';

export interface RoleLockFrictionReport {
  frictionIndex: number;
  lockedRoleActorIds: string[];
  notes: string[];
}

/**
 * Score friction from role locks that block reassignment this turn.
 */
export function computeRoleLockFrictionIndex(
  turn: number,
  roles: RoleAssignment[],
): RoleLockFrictionReport {
  const notes: string[] = [];
  const lockedRoleActorIds = roles
    .filter(r => r.lockedUntilTurn !== null && r.lockedUntilTurn > turn)
    .map(r => r.actorId);

  if (lockedRoleActorIds.length > 0) {
    notes.push(`Role locks active for: ${lockedRoleActorIds.join(', ')}`);
  }

  const ratio = roles.length === 0 ? 0 : lockedRoleActorIds.length / roles.length;
  const frictionIndex = Math.round(Math.min(100, ratio * 80 + lockedRoleActorIds.length * 10));

  return {
    frictionIndex,
    lockedRoleActorIds: lockedRoleActorIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamRoleLockFriction(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
