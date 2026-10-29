import {
  AGENT18_LIMITS,
  ExplicitResponsibility,
  RoleAssignment,
  TASK_ROLE_MAP,
  TeamActorSnapshot,
  TeamCommandSlice,
  TeamMultiAgentInputs,
  TeamRole,
  TeamTaskSnapshot,
} from './types.ts';

function focusToRole(focus: ExplicitResponsibility['focus']): TeamRole {
  switch (focus) {
    case 'economy':
    case 'contracts':
      return 'earner';
    case 'recovery':
      return 'recovery';
    case 'support':
      return 'support';
    case 'expansion':
      return 'explorer';
    case 'controller':
      return 'controller';
    default:
      return 'earner';
  }
}

function responsibilityLabel(resp: ExplicitResponsibility): string {
  if (resp.regionId) {
    return resp.focus === 'expansion'
      ? `Expand into ${resp.regionId}`
      : `Hold ${resp.regionId}`;
  }
  if (resp.focus === 'economy') return 'Team income';
  if (resp.focus === 'recovery') {
    return resp.untilCash ? `Recover until $${resp.untilCash}` : 'Recover';
  }
  return resp.focus;
}

function pickTopTask(tasks: TeamTaskSnapshot[], actorId: string): TeamTaskSnapshot | null {
  const mine = tasks.filter(
    t =>
      t.assignedActorIds.includes(actorId) &&
      !['completed', 'cancelled', 'superseded'].includes(t.status) &&
      t.type !== 'support_actor',
  );
  if (!mine.length) return null;
  return mine.slice().sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))[0];
}

function exclusiveSlotForTask(task: TeamTaskSnapshot | null): string | null {
  if (!task) return null;
  if (task.type === 'defend_region' || task.type === 'take_region') {
    return task.regionId ? `region:${task.regionId}:${task.type}` : null;
  }
  if (task.type === 'generate_cash') return `cash:${task.assignedActorIds[0] || 'team'}`;
  return null;
}

/** Resolve two actors competing for the same exclusive slot — higher-priority task wins. */
export function resolveExclusiveSlotCollisions(
  roles: RoleAssignment[],
  tasks: TeamTaskSnapshot[],
): { roles: RoleAssignment[]; notes: string[] } {
  const notes: string[] = [];
  const slotToActors = new Map<string, string[]>();
  roles.forEach(r => {
    if (!r.exclusiveSlotId) return;
    const list = slotToActors.get(r.exclusiveSlotId) || [];
    list.push(r.actorId);
    slotToActors.set(r.exclusiveSlotId, list);
  });
  let next = roles.map(r => ({ ...r }));
  slotToActors.forEach((actorIds, slot) => {
    if (actorIds.length <= 1) return;
    const ranked = actorIds
      .map(id => ({ id, task: pickTopTask(tasks, id) }))
      .filter(x => x.task)
      .sort((a, b) => (a.task!.priority - b.task!.priority) || a.id.localeCompare(b.id));
    const winner = ranked[0]?.id;
    if (!winner) return;
    next = next.map(r => {
      if (!actorIds.includes(r.actorId) || r.actorId === winner) return r;
      notes.push(`Demoted ${r.actorId} from slot ${slot}; ${winner} leads`);
      return {
        ...r,
        primaryRole: 'support',
        responsibility: `Support ${winner} on ${slot.replace(/^region:/, '')}`,
        reason: 'Exclusive slot collision — supporting lead actor',
        temporary: true,
        exclusiveSlotId: null,
        confidence: Math.min(r.confidence, 0.55),
      };
    });
  });
  return { roles: next, notes };
}

/**
 * Assign team roles with hysteresis, explicit responsibilities, recovery override,
 * and exclusive slot metadata for coordination.
 */
export function assignTeamRolesWithSlots(
  inputs: TeamMultiAgentInputs,
): { roles: RoleAssignment[]; notes: string[] } {
  const { actors, tasks, command, previousRoles, roleSince, lockedRoles, roleMinTurns } = inputs;
  const notes: string[] = [];
  const roles: RoleAssignment[] = actors.map(a => {
    const prev = previousRoles.find(p => p.actorId === a.id) || null;
    const explicitResp =
      (command?.responsibilities || []).find(
        r => r.actorId === a.id || (a.isHuman && r.actorId === 'player'),
      ) || null;
    const top = pickTopTask(tasks, a.id);
    let role: TeamRole =
      a.inRecovery && !a.isHuman
        ? 'recovery'
        : top
          ? TASK_ROLE_MAP[top.type] || 'earner'
          : a.brainRole || 'earner';
    if (explicitResp) role = focusToRole(explicitResp.focus);
    const responsibility = explicitResp
      ? responsibilityLabel(explicitResp)
      : top
        ? top.label
        : 'No active task';
    const since = roleSince[a.id] ?? inputs.turn;
    const locked =
      lockedRoles.includes(a.id) ||
      (command?.lockedActorIds || []).includes(a.id) ||
      Boolean(prev?.explicit && !explicitResp && command === null);
    if (
      prev &&
      !explicitResp &&
      (locked ||
        (prev.primaryRole !== role &&
          inputs.turn - since < roleMinTurns &&
          role !== 'recovery'))
    ) {
      return {
        ...prev,
        taskIds: tasks.filter(t => t.assignedActorIds.includes(a.id)).map(t => t.id),
        exclusiveSlotId: exclusiveSlotForTask(top),
      };
    }
    return {
      actorId: a.id,
      primaryRole: role,
      secondaryRole: null,
      responsibility,
      reason: explicitResp
        ? 'You assigned this responsibility.'
        : a.inRecovery && !a.isHuman
          ? 'Economic recovery comes first.'
          : top
            ? `Assigned to "${top.label}".`
            : 'Team Brain default role.',
      taskIds: tasks.filter(t => t.assignedActorIds.includes(a.id)).map(t => t.id),
      startTurn: prev && prev.primaryRole === role ? prev.startTurn : inputs.turn,
      reviewCondition:
        role === 'recovery'
          ? 'exits economic recovery'
          : top
            ? `"${top.label}" completes or is blocked`
            : 'next replan',
      temporary: role === 'recovery' || Boolean(explicitResp?.untilCash),
      confidence: explicitResp ? 0.95 : top ? 0.8 : 0.6,
      explicit: Boolean(explicitResp),
      exclusiveSlotId: exclusiveSlotForTask(top),
    };
  });
  const resolved = resolveExclusiveSlotCollisions(roles, tasks);
  notes.push(...resolved.notes);
  return { roles: resolved.roles, notes };
}

/** Detect tasks that illegally assign multiple actors to one exclusive action. */
export function detectIllegalSharedExclusiveTasks(tasks: TeamTaskSnapshot[]): string[] {
  const issues: string[] = [];
  tasks.forEach(t => {
    if (!['defend_region', 'take_region', 'generate_cash'].includes(t.type)) return;
    if (t.assignedActorIds.length > 1 && !['cancelled', 'superseded', 'completed'].includes(t.status)) {
      issues.push(`Task ${t.id} (${t.type}) assigns ${t.assignedActorIds.join('+')} — exclusive kinds allow one lead actor`);
    }
  });
  return issues;
}

export function mergeCommandSlice(
  base: TeamCommandSlice | null,
  patch: Partial<TeamCommandSlice>,
): TeamCommandSlice {
  return {
    responsibilities: patch.responsibilities ?? base?.responsibilities ?? [],
    lockedActorIds: patch.lockedActorIds ?? base?.lockedActorIds ?? [],
    reserveFloor: patch.reserveFloor ?? base?.reserveFloor ?? null,
  };
}

export function actorsNeedingRoleReview(
  roles: RoleAssignment[],
  turn: number,
  maxIdleTurns: number = AGENT18_LIMITS.roleMinTurnsDefault + 2,
): string[] {
  return roles
    .filter(r => !r.temporary && turn - r.startTurn >= maxIdleTurns && r.taskIds.length === 0)
    .map(r => r.actorId);
}

export function summarizeRoleBoard(roles: RoleAssignment[]): string {
  return roles
    .map(r => `${r.actorId}:${r.primaryRole}${r.exclusiveSlotId ? `@${r.exclusiveSlotId}` : ''}`)
    .join(' | ');
}
