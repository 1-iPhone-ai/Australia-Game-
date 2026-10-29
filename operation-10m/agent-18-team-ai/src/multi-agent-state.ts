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
import { scoreHandoffReadiness } from './handoff-readiness-scorer.ts';
import { computeMutexStabilityIndex } from './mutex-stability-index.ts';
import {
  evaluateWorkstreamBarriers,
  trackWorkstreamBarrierSince,
} from './workstream-barrier-monitor.ts';
import { computeRoleChurnIndex } from './role-churn-index.ts';
import { evaluateLeaseExpiry } from './lease-expiry-watchdog.ts';
import { computeCoordinationComposite } from './coordination-composite-score.ts';
import { computeDirectiveCollisionIndex } from './directive-collision-index.ts';
import { evaluateHandoffChainIntegrity } from './handoff-chain-integrity.ts';
import { computeCoordinationEscalationTier } from './coordination-escalation-tier.ts';
import { buildCoordinationRecoveryPlaybook } from './coordination-recovery-playbook.ts';
import { computeDirectivePriorityInversion } from './directive-priority-inversion.ts';
import { detectHandoffOrphans } from './handoff-orphan-detector.ts';
import { detectWorkstreamDeadlocks } from './workstream-deadlock-detector.ts';
import { computeLeaseContentionIndex } from './lease-contention-index.ts';
import { measureCoordinationSaturation } from './coordination-saturation-gauge.ts';
import { computeMutexLeaseDivergenceIndex } from './mutex-lease-divergence-index.ts';
import { analyzeHandoffCascadeRisk } from './handoff-cascade-analyzer.ts';
import { computeSuppressionBacklogIndex } from './suppression-backlog-index.ts';
import { computeReconcileDriftIndex } from './reconcile-drift-index.ts';
import { computeArbitrationPressureIndex } from './arbitration-pressure-index.ts';
import { measurePersistenceChurn } from './persistence-churn-gauge.ts';
import { measureDuplicateGuardPressure } from './duplicate-guard-pressure.ts';
import { computeRoleTaskCoverageGap } from './role-task-coverage-gap.ts';
import { computeCompositeHealthGradient } from './composite-health-gradient.ts';
import { computeHandoffReadinessSpread } from './handoff-readiness-spread.ts';
import { measureWorkstreamParallelism } from './workstream-parallelism-index.ts';
import { computeEscalationRecoveryAlignment } from './escalation-recovery-alignment.ts';
import { computeAuditPressureIndex } from './audit-pressure-index.ts';
import { computeRoleLockFrictionIndex } from './role-lock-friction-index.ts';
import { computeDirectiveConstraintDensity } from './directive-constraint-density.ts';
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
      handoffReadinessAverage:
        typeof metaRaw.handoffReadinessAverage === 'number' ? metaRaw.handoffReadinessAverage : undefined,
      notReadyHandoffIds: Array.isArray(metaRaw.notReadyHandoffIds)
        ? metaRaw.notReadyHandoffIds.map(String).slice(0, 8)
        : undefined,
      mutexStabilityIndex:
        typeof metaRaw.mutexStabilityIndex === 'number' ? metaRaw.mutexStabilityIndex : undefined,
      volatileMutexRegionIds: Array.isArray(metaRaw.volatileMutexRegionIds)
        ? metaRaw.volatileMutexRegionIds.map(String).slice(0, 8)
        : undefined,
      workstreamBarrierCompliance:
        typeof metaRaw.workstreamBarrierCompliance === 'number'
          ? metaRaw.workstreamBarrierCompliance
          : undefined,
      stalledWorkstreamIds: Array.isArray(metaRaw.stalledWorkstreamIds)
        ? metaRaw.stalledWorkstreamIds.map(String).slice(0, 8)
        : undefined,
      workstreamBarrierSince:
        metaRaw.workstreamBarrierSince && typeof metaRaw.workstreamBarrierSince === 'object'
          ? (metaRaw.workstreamBarrierSince as Record<string, number>)
          : undefined,
      roleChurnIndex:
        typeof metaRaw.roleChurnIndex === 'number' ? metaRaw.roleChurnIndex : undefined,
      roleChurnActorIds: Array.isArray(metaRaw.roleChurnActorIds)
        ? metaRaw.roleChurnActorIds.map(String).slice(0, 8)
        : undefined,
      leaseHealthScore:
        typeof metaRaw.leaseHealthScore === 'number' ? metaRaw.leaseHealthScore : undefined,
      expiringLeaseIds: Array.isArray(metaRaw.expiringLeaseIds)
        ? metaRaw.expiringLeaseIds.map(String).slice(0, 8)
        : undefined,
      expiredLeaseIds: Array.isArray(metaRaw.expiredLeaseIds)
        ? metaRaw.expiredLeaseIds.map(String).slice(0, 8)
        : undefined,
      coordinationCompositeScore:
        typeof metaRaw.coordinationCompositeScore === 'number'
          ? metaRaw.coordinationCompositeScore
          : undefined,
      coordinationWeakestDimension:
        typeof metaRaw.coordinationWeakestDimension === 'string'
          ? metaRaw.coordinationWeakestDimension
          : undefined,
      directiveCollisionIndex:
        typeof metaRaw.directiveCollisionIndex === 'number'
          ? metaRaw.directiveCollisionIndex
          : undefined,
      collidingDirectiveIds: Array.isArray(metaRaw.collidingDirectiveIds)
        ? metaRaw.collidingDirectiveIds.map(String).slice(0, 8)
        : undefined,
      handoffIntegrityScore:
        typeof metaRaw.handoffIntegrityScore === 'number' ? metaRaw.handoffIntegrityScore : undefined,
      brokenHandoffIds: Array.isArray(metaRaw.brokenHandoffIds)
        ? metaRaw.brokenHandoffIds.map(String).slice(0, 8)
        : undefined,
      duplicatePendingHandoffTaskIds: Array.isArray(metaRaw.duplicatePendingHandoffTaskIds)
        ? metaRaw.duplicatePendingHandoffTaskIds.map(String).slice(0, 8)
        : undefined,
      coordinationEscalationTier:
        typeof metaRaw.coordinationEscalationTier === 'number'
          ? metaRaw.coordinationEscalationTier
          : undefined,
      coordinationEscalationLabel:
        typeof metaRaw.coordinationEscalationLabel === 'string'
          ? metaRaw.coordinationEscalationLabel
          : undefined,
      coordinationRecoveryUrgency:
        typeof metaRaw.coordinationRecoveryUrgency === 'number'
          ? metaRaw.coordinationRecoveryUrgency
          : undefined,
      coordinationRecoveryActions: Array.isArray(metaRaw.coordinationRecoveryActions)
        ? metaRaw.coordinationRecoveryActions.map(String).slice(0, 8)
        : undefined,
      directivePriorityInversionIndex:
        typeof metaRaw.directivePriorityInversionIndex === 'number'
          ? metaRaw.directivePriorityInversionIndex
          : undefined,
      invertedDirectiveIds: Array.isArray(metaRaw.invertedDirectiveIds)
        ? metaRaw.invertedDirectiveIds.map(String).slice(0, 8)
        : undefined,
      handoffOrphanCount:
        typeof metaRaw.handoffOrphanCount === 'number' ? metaRaw.handoffOrphanCount : undefined,
      orphanHandoffIds: Array.isArray(metaRaw.orphanHandoffIds)
        ? metaRaw.orphanHandoffIds.map(String).slice(0, 8)
        : undefined,
      workstreamDeadlockCount:
        typeof metaRaw.workstreamDeadlockCount === 'number'
          ? metaRaw.workstreamDeadlockCount
          : undefined,
      deadlockedWorkstreamIds: Array.isArray(metaRaw.deadlockedWorkstreamIds)
        ? metaRaw.deadlockedWorkstreamIds.map(String).slice(0, 8)
        : undefined,
      leaseContentionIndex:
        typeof metaRaw.leaseContentionIndex === 'number' ? metaRaw.leaseContentionIndex : undefined,
      contendedRegionIds: Array.isArray(metaRaw.contendedRegionIds)
        ? metaRaw.contendedRegionIds.map(String).slice(0, 8)
        : undefined,
      coordinationSaturationIndex:
        typeof metaRaw.coordinationSaturationIndex === 'number'
          ? metaRaw.coordinationSaturationIndex
          : undefined,
      mutexLeaseDivergenceIndex:
        typeof metaRaw.mutexLeaseDivergenceIndex === 'number'
          ? metaRaw.mutexLeaseDivergenceIndex
          : undefined,
      mutexLeaseDivergentRegionIds: Array.isArray(metaRaw.mutexLeaseDivergentRegionIds)
        ? metaRaw.mutexLeaseDivergentRegionIds.map(String).slice(0, 8)
        : undefined,
      handoffCascadeRiskIndex:
        typeof metaRaw.handoffCascadeRiskIndex === 'number'
          ? metaRaw.handoffCascadeRiskIndex
          : undefined,
      handoffCascadeChainActorIds: Array.isArray(metaRaw.handoffCascadeChainActorIds)
        ? metaRaw.handoffCascadeChainActorIds.map(String).slice(0, 8)
        : undefined,
      suppressionBacklogIndex:
        typeof metaRaw.suppressionBacklogIndex === 'number'
          ? metaRaw.suppressionBacklogIndex
          : undefined,
      reconcileDriftIndex:
        typeof metaRaw.reconcileDriftIndex === 'number' ? metaRaw.reconcileDriftIndex : undefined,
      arbitrationPressureIndex:
        typeof metaRaw.arbitrationPressureIndex === 'number'
          ? metaRaw.arbitrationPressureIndex
          : undefined,
      arbitrationDemotedActorIds: Array.isArray(metaRaw.arbitrationDemotedActorIds)
        ? metaRaw.arbitrationDemotedActorIds.map(String).slice(0, 8)
        : undefined,
      persistenceChurnIndex:
        typeof metaRaw.persistenceChurnIndex === 'number'
          ? metaRaw.persistenceChurnIndex
          : undefined,
      duplicateGuardPressureIndex:
        typeof metaRaw.duplicateGuardPressureIndex === 'number'
          ? metaRaw.duplicateGuardPressureIndex
          : undefined,
      roleTaskCoverageGapIndex:
        typeof metaRaw.roleTaskCoverageGapIndex === 'number'
          ? metaRaw.roleTaskCoverageGapIndex
          : undefined,
      uncoveredTaskIds: Array.isArray(metaRaw.uncoveredTaskIds)
        ? metaRaw.uncoveredTaskIds.map(String).slice(0, 8)
        : undefined,
      compositeHealthGradientIndex:
        typeof metaRaw.compositeHealthGradientIndex === 'number'
          ? metaRaw.compositeHealthGradientIndex
          : undefined,
      compositeHealthTrend:
        typeof metaRaw.compositeHealthTrend === 'string' ? metaRaw.compositeHealthTrend : undefined,
      handoffReadinessSpreadIndex:
        typeof metaRaw.handoffReadinessSpreadIndex === 'number'
          ? metaRaw.handoffReadinessSpreadIndex
          : undefined,
      workstreamParallelismIndex:
        typeof metaRaw.workstreamParallelismIndex === 'number'
          ? metaRaw.workstreamParallelismIndex
          : undefined,
      escalationRecoveryAlignmentIndex:
        typeof metaRaw.escalationRecoveryAlignmentIndex === 'number'
          ? metaRaw.escalationRecoveryAlignmentIndex
          : undefined,
      auditPressureIndex:
        typeof metaRaw.auditPressureIndex === 'number' ? metaRaw.auditPressureIndex : undefined,
      roleLockFrictionIndex:
        typeof metaRaw.roleLockFrictionIndex === 'number' ? metaRaw.roleLockFrictionIndex : undefined,
      lockedRoleActorIds: Array.isArray(metaRaw.lockedRoleActorIds)
        ? metaRaw.lockedRoleActorIds.map(String).slice(0, 8)
        : undefined,
      directiveConstraintDensityIndex:
        typeof metaRaw.directiveConstraintDensityIndex === 'number'
          ? metaRaw.directiveConstraintDensityIndex
          : undefined,
      directiveConstrainedActorIds: Array.isArray(metaRaw.directiveConstrainedActorIds)
        ? metaRaw.directiveConstrainedActorIds.map(String).slice(0, 8)
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
  const roleTaskCoverage = computeRoleTaskCoverageGap(roles, inputs.tasks);
  roleTaskCoverage.notes.forEach(n => diagnostics.push(n));
  const roleLockFriction = computeRoleLockFrictionIndex(inputs.turn, roles);
  roleLockFriction.notes.forEach(n => diagnostics.push(n));
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
  const directiveCollisions = computeDirectiveCollisionIndex(proposals);
  directiveCollisions.notes.forEach(n => diagnostics.push(n));
  const handoffIntegrity = evaluateHandoffChainIntegrity(coordination.handoffs, scope);
  handoffIntegrity.notes.forEach(n => diagnostics.push(n));
  const directiveResult = coordinateTeammateDirectives(proposals, coordination, roles);
  const priorityInversion = computeDirectivePriorityInversion(
    proposals,
    directiveCollisions.collidingProposalIds,
    {
      allowed: directiveResult.allowed,
      suppressed: directiveResult.suppressed.map(s => s.proposal),
    },
  );
  priorityInversion.notes.forEach(n => diagnostics.push(n));
  const handoffOrphans = detectHandoffOrphans(coordination.handoffs, inputs.tasks, roles);
  handoffOrphans.notes.forEach(n => diagnostics.push(n));
  const handoffSla = evaluateHandoffSla(inputs.turn, coordination.handoffs, {
    maxPendingTurns: AGENT18_LIMITS.handoffSlaMaxPendingTurns,
  });
  handoffSla.notes.forEach(n => diagnostics.push(n));
  const handoffReadiness = scoreHandoffReadiness(
    coordination.handoffs,
    inputs.actors,
    roles,
    inputs.tasks,
  );
  handoffReadiness.notes.forEach(n => diagnostics.push(n));
  const handoffReadinessSpread = computeHandoffReadinessSpread(handoffReadiness);
  handoffReadinessSpread.notes.forEach(n => diagnostics.push(n));
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
  const duplicateGuardPressure = measureDuplicateGuardPressure(duplicateGuard);
  duplicateGuardPressure.notes.forEach(n => diagnostics.push(n));

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

  const mutexHistory = [...(previous?.meta.mutexHistory || []), coordination.mutexRegions].slice(
    -AGENT18_LIMITS.maxMutexHistorySnapshots,
  );
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
  const reconcileDrift = computeReconcileDriftIndex(reconcile, reconcile.thrashingRegions.length);
  reconcileDrift.notes.forEach(n => diagnostics.push(n));
  const arbitrationPressure = computeArbitrationPressureIndex(coordination.arbitrationLog);
  arbitrationPressure.notes.forEach(n => diagnostics.push(n));

  const mutexStability = computeMutexStabilityIndex(mutexHistory, reconcile.thrashingRegions);
  mutexStability.notes.forEach(n => diagnostics.push(n));

  const barrierSince = trackWorkstreamBarrierSince(
    previous?.meta.workstreamBarrierSince ?? {},
    coordination.workstreams,
    inputs.turn,
  );
  const workstreamBarriers = evaluateWorkstreamBarriers(
    inputs.turn,
    coordination.workstreams,
    inputs.tasks,
    { workstreamSinceTurn: barrierSince },
  );
  workstreamBarriers.notes.forEach(n => diagnostics.push(n));
  const workstreamDeadlocks = detectWorkstreamDeadlocks(coordination.workstreams);
  workstreamDeadlocks.notes.forEach(n => diagnostics.push(n));
  const workstreamParallelism = measureWorkstreamParallelism(coordination.workstreams);
  workstreamParallelism.notes.forEach(n => diagnostics.push(n));
  const leaseContention = computeLeaseContentionIndex(
    coordination.leases,
    coordination.handoffs,
    coordination.mutexRegions,
  );
  leaseContention.notes.forEach(n => diagnostics.push(n));
  const coordinationSaturation = measureCoordinationSaturation({
    directiveProposalCount: proposals.length,
    pendingHandoffCount: coordination.handoffs.filter(h => h.status === 'pending').length,
    activeLeaseCount: coordination.leases.length,
    activeWorkstreamCount: coordination.workstreams.filter(ws => ws.phase !== 'complete').length,
    suppressedDirectiveCount: directiveResult.suppressed.length + quota.dropped.length,
  });
  coordinationSaturation.notes.forEach(n => diagnostics.push(n));
  const mutexLeaseDivergence = computeMutexLeaseDivergenceIndex(
    coordination.mutexRegions,
    coordination.leases,
  );
  mutexLeaseDivergence.notes.forEach(n => diagnostics.push(n));
  const handoffCascade = analyzeHandoffCascadeRisk(coordination.handoffs);
  handoffCascade.notes.forEach(n => diagnostics.push(n));
  const suppressedIds = [
    ...quota.dropped.map(d => d.proposal.id),
    ...directiveResult.suppressed.map(s => s.proposal.id),
  ];
  const suppressionBacklog = computeSuppressionBacklogIndex({
    suppressedDirectiveIds: suppressedIds,
    droppedDirectiveCount: quota.dropped.length,
    quotaExhaustedActorIds: Object.entries(quota.remainingByActor)
      .filter(([, remaining]) => remaining === 0)
      .map(([actorId]) => actorId),
  });
  suppressionBacklog.notes.forEach(n => diagnostics.push(n));

  const roleChurn = computeRoleChurnIndex(previous?.roles ?? null, roles);
  roleChurn.notes.forEach(n => diagnostics.push(n));

  const leaseExpiry = evaluateLeaseExpiry(inputs.turn, coordination.leases);
  leaseExpiry.notes.forEach(n => diagnostics.push(n));

  const coordinationComposite = computeCoordinationComposite({
    handoffSlaCompliance: handoffSla.complianceScore,
    handoffReadinessAverage: handoffReadiness.averageReadiness,
    mutexStabilityIndex: mutexStability.stabilityIndex,
    workstreamBarrierCompliance: workstreamBarriers.barrierComplianceScore,
    capacityBalanceScore: capacityLedger.balanceScore,
    leaseHealthScore: leaseExpiry.leaseHealthScore,
    roleChurnIndex: roleChurn.churnIndex,
  });
  coordinationComposite.notes.forEach(n => diagnostics.push(n));
  const compositeGradient = computeCompositeHealthGradient(
    previous?.meta.coordinationCompositeScore,
    coordinationComposite.compositeScore,
  );
  compositeGradient.notes.forEach(n => diagnostics.push(n));
  const directiveConstraintDensity = computeDirectiveConstraintDensity(
    directiveResult.constraintsByActor,
  );
  directiveConstraintDensity.notes.forEach(n => diagnostics.push(n));

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
      handoffReadinessAverage: handoffReadiness.averageReadiness,
      notReadyHandoffIds: handoffReadiness.notReadyHandoffIds,
      mutexStabilityIndex: mutexStability.stabilityIndex,
      volatileMutexRegionIds: mutexStability.volatileRegionIds,
      workstreamBarrierCompliance: workstreamBarriers.barrierComplianceScore,
      stalledWorkstreamIds: workstreamBarriers.stalledWorkstreamIds,
      workstreamBarrierSince: barrierSince,
      roleChurnIndex: roleChurn.churnIndex,
      roleChurnActorIds: roleChurn.churnedActorIds,
      leaseHealthScore: leaseExpiry.leaseHealthScore,
      expiringLeaseIds: leaseExpiry.expiringLeaseIds,
      expiredLeaseIds: leaseExpiry.expiredLeaseIds,
      coordinationCompositeScore: coordinationComposite.compositeScore,
      coordinationWeakestDimension: coordinationComposite.weakestDimension,
      directiveCollisionIndex: directiveCollisions.collisionIndex,
      collidingDirectiveIds: directiveCollisions.collidingProposalIds,
      handoffIntegrityScore: handoffIntegrity.integrityScore,
      brokenHandoffIds: handoffIntegrity.brokenHandoffIds,
      duplicatePendingHandoffTaskIds: handoffIntegrity.duplicatePendingTaskIds,
      directivePriorityInversionIndex: priorityInversion.inversionIndex,
      invertedDirectiveIds: priorityInversion.invertedProposalIds,
      handoffOrphanCount: handoffOrphans.orphanCount,
      orphanHandoffIds: handoffOrphans.orphanHandoffIds,
      workstreamDeadlockCount: workstreamDeadlocks.deadlockCount,
      deadlockedWorkstreamIds: workstreamDeadlocks.deadlockedWorkstreamIds,
      leaseContentionIndex: leaseContention.contentionIndex,
      contendedRegionIds: leaseContention.contendedRegionIds,
      coordinationSaturationIndex: coordinationSaturation.saturationIndex,
      mutexLeaseDivergenceIndex: mutexLeaseDivergence.divergenceIndex,
      mutexLeaseDivergentRegionIds: mutexLeaseDivergence.divergentRegionIds,
      handoffCascadeRiskIndex: handoffCascade.cascadeRiskIndex,
      handoffCascadeChainActorIds: handoffCascade.cascadeChainActorIds,
      suppressionBacklogIndex: suppressionBacklog.backlogIndex,
      reconcileDriftIndex: reconcileDrift.driftIndex,
      arbitrationPressureIndex: arbitrationPressure.pressureIndex,
      arbitrationDemotedActorIds: arbitrationPressure.demotedActorIds,
      duplicateGuardPressureIndex: duplicateGuardPressure.pressureIndex,
      roleTaskCoverageGapIndex: roleTaskCoverage.gapIndex,
      uncoveredTaskIds: roleTaskCoverage.uncoveredTaskIds,
      compositeHealthGradientIndex: compositeGradient.gradientIndex,
      compositeHealthTrend: compositeGradient.trend,
      handoffReadinessSpreadIndex: handoffReadinessSpread.spreadIndex,
      workstreamParallelismIndex: workstreamParallelism.parallelismIndex,
      roleLockFrictionIndex: roleLockFriction.frictionIndex,
      lockedRoleActorIds: roleLockFriction.lockedRoleActorIds,
      directiveConstraintDensityIndex: directiveConstraintDensity.densityIndex,
      directiveConstrainedActorIds: directiveConstraintDensity.constrainedActorIds,
    },
  };

  const auditFindings = auditTeamMultiAgentLayer(state, inputs);
  const escalation = computeCoordinationEscalationTier({
    coordinationCompositeScore: coordinationComposite.compositeScore,
    auditErrors: auditFindings.filter(f => f.severity === 'error').length,
    auditWarnings: auditFindings.filter(f => f.severity === 'warning').length,
    directiveCollisionIndex: directiveCollisions.collisionIndex,
    handoffIntegrityScore: handoffIntegrity.integrityScore,
  });
  escalation.notes.forEach(n => diagnostics.push(n));
  const recoveryPlaybook = buildCoordinationRecoveryPlaybook({
    escalationTier: escalation.tier,
    coordinationCompositeScore: coordinationComposite.compositeScore,
    coordinationWeakestDimension: coordinationComposite.weakestDimension,
    directiveCollisionIndex: directiveCollisions.collisionIndex,
    handoffIntegrityScore: handoffIntegrity.integrityScore,
  });
  recoveryPlaybook.notes.forEach(n => diagnostics.push(n));
  const escalationAlignment = computeEscalationRecoveryAlignment(
    escalation.tier,
    recoveryPlaybook.recoveryUrgency,
  );
  escalationAlignment.notes.forEach(n => diagnostics.push(n));
  const auditPressure = computeAuditPressureIndex(auditFindings);
  auditPressure.notes.forEach(n => diagnostics.push(n));
  state = attachAuditToState(state, auditFindings, {
    coordinationEscalationTier: escalation.tier,
    coordinationEscalationLabel: escalation.label,
    coordinationRecoveryUrgency: recoveryPlaybook.recoveryUrgency,
    coordinationRecoveryActions: recoveryPlaybook.recommendedActions,
    escalationRecoveryAlignmentIndex: escalationAlignment.alignmentIndex,
    auditPressureIndex: auditPressure.pressureIndex,
  });
  state = { ...state, diagnostics };

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
  const persistenceChurn = measurePersistenceChurn(previous, state, persistence);
  persistenceChurn.notes.forEach(n => diagnostics.push(n));
  state = {
    ...state,
    diagnostics,
    meta: { ...state.meta, persistenceChurnIndex: persistenceChurn.churnIndex },
  };

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
