import { attachAuditToState, auditTeamMultiAgentLayer, emptyCoordinationMeta } from './coordination-audit.ts';
import {
  mergeReconcileThrashing,
  reconcileCoordinationPlans,
} from './coordination-reconcile.ts';
import { orchestrateTeamCoordination, serializeCoordinationPlan } from './coordination-orchestrator.ts';
import {
  buildActorDirectiveConstraints,
  coordinateTeammateDirectives,
} from './directive-coordination.ts';
import {
  advanceDuplicateGuardTurn,
  emptyDuplicateGuardState,
  reserveActionSlot,
  reservationKeyForRegionAction,
  sanitizeDuplicateGuardState,
} from './duplicate-action-guard.ts';
import {
  assignTeamRolesWithSlots,
  detectIllegalSharedExclusiveTasks,
} from './role-assignment-engine.ts';
import {
  decideTeamMultiAgentPersistence,
  teamMultiAgentPersistSignature,
} from './layer-persistence.ts';
import {
  buildActorCapacityLedger,
  suggestCapacityRebalanceNotes,
} from './actor-capacity-ledger.ts';
import { applyDirectiveQuotaGuard } from './directive-quota-guard.ts';
import { evaluateHandoffSla } from './handoff-sla-monitor.ts';
import {
  assertTasksTeamScoped,
  filterCrossTeamDirectives,
  teamActorScope,
} from './team-boundary-guard.ts';
import {
  AGENT18_LIMITS,
  TeamMultiAgentEvaluation,
  TeamMultiAgentInputs,
  TeamMultiAgentLayerState,
  TeamMultiAgentPersistenceDecision,
} from './types.ts';

const emptyCoordination = {
  leases: [],
  handoffs: [],
  workstreams: [],
  mutexRegions: {},
  warnings: [],
  arbitrationLog: [],
};

export function sanitizeTeamMultiAgentCoordinationState(
  raw: unknown,
  teamId: string,
  turn: number,
): TeamMultiAgentLayerState {
  const empty: TeamMultiAgentLayerState = {
    version: 1,
    teamId,
    turn,
    roles: [],
    coordination: { ...emptyCoordination },
    duplicateGuard: emptyDuplicateGuardState(turn),
    diagnostics: [],
    meta: emptyCoordinationMeta(),
    auditFindings: [],
  };
  if (!raw || typeof raw !== 'object') return empty;
  const r = raw as Record<string, unknown>;
  const roles = Array.isArray(r.roles) ? (r.roles as TeamMultiAgentLayerState['roles']) : [];
  const coordination =
    r.coordination && typeof r.coordination === 'object'
      ? (r.coordination as TeamMultiAgentLayerState['coordination'])
      : empty.coordination;
  const metaRaw = r.meta && typeof r.meta === 'object' ? (r.meta as Record<string, unknown>) : {};
  return {
    version: 1,
    teamId: String(r.teamId || teamId),
    turn: Number(r.turn) || turn,
    roles,
    coordination: {
      leases: Array.isArray(coordination.leases) ? coordination.leases.slice(0, AGENT18_LIMITS.maxLeases) : [],
      handoffs: Array.isArray(coordination.handoffs) ? coordination.handoffs.slice(0, AGENT18_LIMITS.maxHandoffs) : [],
      workstreams: Array.isArray(coordination.workstreams)
        ? coordination.workstreams.slice(0, AGENT18_LIMITS.maxWorkstreams)
        : [],
      mutexRegions:
        coordination.mutexRegions && typeof coordination.mutexRegions === 'object'
          ? (coordination.mutexRegions as Record<string, string>)
          : {},
      warnings: Array.isArray(coordination.warnings) ? coordination.warnings.map(String).slice(0, 12) : [],
      arbitrationLog: Array.isArray(coordination.arbitrationLog)
        ? coordination.arbitrationLog.slice(0, 12)
        : [],
    },
    duplicateGuard: sanitizeDuplicateGuardState(r.duplicateGuard, turn),
    diagnostics: Array.isArray(r.diagnostics) ? r.diagnostics.map(String).slice(0, 20) : [],
    meta: {
      directiveConstraints:
        metaRaw.directiveConstraints && typeof metaRaw.directiveConstraints === 'object'
          ? (metaRaw.directiveConstraints as Record<string, string>)
          : {},
      suppressedDirectiveIds: Array.isArray(metaRaw.suppressedDirectiveIds)
        ? metaRaw.suppressedDirectiveIds.map(String).slice(0, AGENT18_LIMITS.maxSuppressedDirectives)
        : [],
      auditSummary:
        metaRaw.auditSummary && typeof metaRaw.auditSummary === 'object'
          ? (metaRaw.auditSummary as TeamMultiAgentLayerState['meta']['auditSummary'])
          : { errors: 0, warnings: 0, info: 0 },
      lastReconcileStable: metaRaw.lastReconcileStable !== false,
      thrashingRegions: Array.isArray(metaRaw.thrashingRegions)
        ? metaRaw.thrashingRegions.map(String).slice(0, 8)
        : [],
      mutexHistory: Array.isArray(metaRaw.mutexHistory)
        ? (metaRaw.mutexHistory as Array<Record<string, string>>).slice(-5)
        : [],
      handoffSlaCompliance:
        typeof metaRaw.handoffSlaCompliance === 'number' ? metaRaw.handoffSlaCompliance : undefined,
      overdueHandoffIds: Array.isArray(metaRaw.overdueHandoffIds)
        ? metaRaw.overdueHandoffIds.map(String).slice(0, 8)
        : undefined,
      capacityBalanceScore:
        typeof metaRaw.capacityBalanceScore === 'number' ? metaRaw.capacityBalanceScore : undefined,
      overloadedActorIds: Array.isArray(metaRaw.overloadedActorIds)
        ? metaRaw.overloadedActorIds.map(String).slice(0, 8)
        : undefined,
      idleActorIds: Array.isArray(metaRaw.idleActorIds)
        ? metaRaw.idleActorIds.map(String).slice(0, 8)
        : undefined,
      directiveQuotaRemaining:
        metaRaw.directiveQuotaRemaining && typeof metaRaw.directiveQuotaRemaining === 'object'
          ? (metaRaw.directiveQuotaRemaining as Record<string, number>)
          : undefined,
    },
    auditFindings: Array.isArray(r.auditFindings)
      ? (r.auditFindings as TeamMultiAgentLayerState['auditFindings']).slice(0, AGENT18_LIMITS.maxAuditFindings)
      : [],
  };
}

export function teamMultiAgentSignature(state: TeamMultiAgentLayerState): string {
  return teamMultiAgentPersistSignature(state);
}

/**
 * Evaluate the Agent 18 multi-agent layer: roles + coordination + duplicate reservations.
 * Pure function — safe to call from Team OS evaluation and Strategic Command sync.
 */
export function evaluateTeamMultiAgentLayer(
  inputs: TeamMultiAgentInputs,
  previous: TeamMultiAgentLayerState | null,
): TeamMultiAgentEvaluation {
  const diagnostics: string[] = [];
  const roleMinTurns = inputs.roleMinTurns || AGENT18_LIMITS.roleMinTurnsDefault;
  const { roles, notes } = assignTeamRolesWithSlots({ ...inputs, roleMinTurns });
  diagnostics.push(...notes);
  const sharedIssues = detectIllegalSharedExclusiveTasks(inputs.tasks);
  const locked = [...inputs.lockedRoles, ...(inputs.command?.lockedActorIds || [])];
  const coordination = orchestrateTeamCoordination(inputs.turn, inputs.tasks, roles, locked);
  diagnostics.push(...coordination.warnings);
  coordination.arbitrationLog.forEach(a => diagnostics.push(a.reason));

  const directiveConstraints = buildActorDirectiveConstraints(coordination, roles);
  const scope = teamActorScope(inputs);
  diagnostics.push(...assertTasksTeamScoped(inputs, scope));

  const rawProposals = inputs.directiveProposals || [];
  const scoped = filterCrossTeamDirectives(rawProposals, scope);
  scoped.rejected.forEach(r =>
    diagnostics.push(`Rejected cross-team directive ${r.proposal.id}: ${r.reason}`),
  );
  const quota = applyDirectiveQuotaGuard(scoped.inTeam, {
    maxPerActorPerTurn: AGENT18_LIMITS.maxDirectivesPerActorPerTurn,
    maxPerTeamPerTurn: AGENT18_LIMITS.maxDirectivesPerTeamPerTurn,
  });
  quota.dropped.forEach(d =>
    diagnostics.push(`Dropped directive ${d.proposal.id}: ${d.reason}`),
  );
  const proposals = quota.allowed;
  const directiveResult = coordinateTeammateDirectives(proposals, coordination, roles);
  const handoffSla = evaluateHandoffSla(inputs.turn, coordination.handoffs, {
    maxPendingTurns: AGENT18_LIMITS.handoffSlaMaxPendingTurns,
  });
  handoffSla.notes.forEach(n => diagnostics.push(n));
  const capacityLedger = buildActorCapacityLedger(inputs.actors, inputs.tasks, roles);
  suggestCapacityRebalanceNotes(capacityLedger).forEach(n => diagnostics.push(n));
  directiveResult.suppressed.forEach(s =>
    diagnostics.push(`Suppressed directive ${s.proposal.id}: ${s.reason}`),
  );

  let duplicateGuard = previous
    ? advanceDuplicateGuardTurn(previous.duplicateGuard, inputs.turn)
    : emptyDuplicateGuardState(inputs.turn);
  Object.entries(coordination.mutexRegions).forEach(([regionId, holderActorId]) => {
    const task = inputs.tasks.find(t => t.regionId === regionId);
    duplicateGuard = reserveActionSlot(
      duplicateGuard,
      reservationKeyForRegionAction(regionId, 'region_deposit'),
      holderActorId,
      task?.id || `region_${regionId}`,
      inputs.turn,
    );
  });

  let state: TeamMultiAgentLayerState = {
    version: 1,
    teamId: inputs.teamId,
    turn: inputs.turn,
    roles,
    coordination,
    duplicateGuard,
    diagnostics,
    meta: emptyCoordinationMeta(),
    auditFindings: [],
  };

  const mutexHistory = [...(previous?.meta.mutexHistory || []), coordination.mutexRegions].slice(-5);
  const reconcile = mergeReconcileThrashing(
    reconcileCoordinationPlans(previous?.coordination ?? null, coordination, inputs.turn),
    mutexHistory,
  );
  if (!reconcile.stable) {
    diagnostics.push(`Coordination reconcile: ${reconcile.changes.length} change(s)`);
  }
  if (reconcile.thrashingRegions.length) {
    diagnostics.push(`Mutex thrashing: ${reconcile.thrashingRegions.join(', ')}`);
  }

  state = {
    ...state,
    diagnostics,
    meta: {
      ...emptyCoordinationMeta(),
      directiveConstraints: directiveResult.constraintsByActor,
      suppressedDirectiveIds: [
        ...quota.dropped.map(d => d.proposal.id),
        ...directiveResult.suppressed.map(s => s.proposal.id),
      ].slice(0, AGENT18_LIMITS.maxSuppressedDirectives),
      lastReconcileStable: reconcile.stable,
      thrashingRegions: reconcile.thrashingRegions,
      mutexHistory,
      handoffSlaCompliance: handoffSla.complianceScore,
      overdueHandoffIds: handoffSla.overdueHandoffIds,
      capacityBalanceScore: capacityLedger.balanceScore,
      overloadedActorIds: capacityLedger.overloadedActorIds,
      idleActorIds: capacityLedger.idleActorIds,
      directiveQuotaRemaining: quota.remainingByActor,
    },
  };

  const auditFindings = auditTeamMultiAgentLayer(state, inputs);
  state = attachAuditToState(state, auditFindings, {});

  const coordinationIssues = [
    ...sharedIssues,
    ...coordination.warnings,
    ...auditFindings.filter(f => f.severity !== 'info').map(f => f.message),
  ];

  const persistence = decideTeamMultiAgentPersistence(
    previous,
    state,
    previous ? teamMultiAgentPersistSignature(previous) : null,
    0,
  );

  return {
    state,
    blockedDuplicates: sharedIssues,
    coordinationIssues,
    auditFindings: state.auditFindings,
    persistence,
  };
}

export function syncMultiAgentCoordinationForDirectives(
  inputs: TeamMultiAgentInputs,
  stored: TeamMultiAgentLayerState | null,
): TeamMultiAgentLayerState {
  return evaluateTeamMultiAgentLayer(inputs, stored).state;
}
