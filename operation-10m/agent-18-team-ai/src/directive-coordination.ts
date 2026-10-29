import {
  CoordinationPlan,
  RoleAssignment,
  TeammateDirectiveProposal,
  DirectiveCoordinationResult,
} from './types.ts';

function directiveKey(p: TeammateDirectiveProposal): string {
  return [p.actorId, p.goalKind, p.targetRegionId || '_', p.taskId || '_'].join('|');
}

function isRegionDepositGoal(kind: string): boolean {
  return /deposit|defend|take|region/i.test(kind);
}

/** Stable dedupe before mutex filtering (same actor/goal/target/task). */
export function dedupeDirectiveProposals(proposals: TeammateDirectiveProposal[]): TeammateDirectiveProposal[] {
  const seen = new Set<string>();
  const out: TeammateDirectiveProposal[] = [];
  proposals
    .slice()
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))
    .forEach(p => {
      const k = directiveKey(p);
      if (seen.has(k)) return;
      seen.add(k);
      out.push(p);
    });
  return out;
}

export function buildActorDirectiveConstraints(
  plan: CoordinationPlan,
  roles: RoleAssignment[],
): Record<string, string> {
  const constraints: Record<string, string> = {};
  Object.entries(plan.mutexRegions).forEach(([regionId, holderId]) => {
    constraints[holderId] = `Lead region coordination for ${regionId}`;
  });
  roles.forEach(r => {
    if (r.primaryRole === 'support') {
      constraints[r.actorId] = constraints[r.actorId] || `Support role: ${r.responsibility}`;
    }
    if (r.primaryRole === 'recovery') {
      constraints[r.actorId] = 'Recovery first — no expansion directives';
    }
  });
  plan.handoffs
    .filter(h => h.status === 'pending')
    .forEach(h => {
      constraints[h.toActorId] = `Pending handoff for ${h.regionId || 'task'} from ${h.fromActorId}`;
    });
  return constraints;
}

/**
 * Filter Strategic Command directive proposals so teammates never receive conflicting
 * region deposit goals (mutex + duplicate suppression).
 */
export function coordinateTeammateDirectives(
  proposals: TeammateDirectiveProposal[],
  plan: CoordinationPlan,
  roles: RoleAssignment[],
): DirectiveCoordinationResult {
  const constraintsByActor = buildActorDirectiveConstraints(plan, roles);
  const allowed: TeammateDirectiveProposal[] = [];
  const suppressed: DirectiveCoordinationResult['suppressed'] = [];
  const seen = new Set<string>();

  dedupeDirectiveProposals(proposals).forEach(p => {
    const key = directiveKey(p);
    if (seen.has(key)) {
      suppressed.push({ proposal: p, reason: 'duplicate_directive_proposal' });
      return;
    }
    seen.add(key);

    const role = roles.find(r => r.actorId === p.actorId);
    if (role?.primaryRole === 'recovery' && /take|expand|expansion/i.test(p.goalKind)) {
      suppressed.push({ proposal: p, reason: 'recovery_blocks_expansion_directive' });
      return;
    }

    if (p.targetRegionId && isRegionDepositGoal(p.goalKind)) {
      const holder = plan.mutexRegions[p.targetRegionId];
      if (holder && holder !== p.actorId) {
        suppressed.push({
          proposal: p,
          reason: `mutex_holder_${holder}_for_${p.targetRegionId}`,
        });
        return;
      }
    }

    if (role?.primaryRole === 'support' && p.targetRegionId && !role.responsibility.includes(p.targetRegionId)) {
      suppressed.push({ proposal: p, reason: 'support_out_of_scope_region' });
      return;
    }

    allowed.push(p);
  });

  return { allowed, suppressed, constraintsByActor };
}

export interface DirectiveStressStep {
  turn: number;
  allowedCount: number;
  suppressedCount: number;
}

/** Deterministic multi-turn directive stress (coordination stability). */
export function stressDirectiveCoordination(
  baseProposals: TeammateDirectiveProposal[],
  evaluatePlan: (turn: number) => CoordinationPlan,
  roles: RoleAssignment[],
  turns: number,
): DirectiveStressStep[] {
  const steps: DirectiveStressStep[] = [];
  for (let t = 0; t < turns; t += 1) {
    const plan = evaluatePlan(t);
    const proposals = baseProposals.map(p => ({ ...p, id: `${p.id}_t${t}` }));
    const r = coordinateTeammateDirectives(proposals, plan, roles);
    steps.push({ turn: t, allowedCount: r.allowed.length, suppressedCount: r.suppressed.length });
  }
  return steps;
}
