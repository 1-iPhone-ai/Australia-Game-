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
import { computeCrossTeamRejectionIndex } from './cross-team-rejection-index.ts';
import { computeHandoffSlaVelocityIndex } from './handoff-sla-velocity-index.ts';
import { measureRecoveryActionBreadth } from './recovery-action-breadth.ts';
import { computeDirectiveQuotaExhaustionIndex } from './directive-quota-exhaustion-index.ts';
import { computeCapacityImbalanceIndex } from './capacity-imbalance-index.ts';
import { computeWorkstreamBarrierStalenessIndex } from './workstream-barrier-staleness-index.ts';
import { computeWorkstreamDeadlockPressureIndex } from './workstream-deadlock-pressure-index.ts';
import { computeSuppressionQuotaCouplingIndex } from './suppression-quota-coupling-index.ts';
import { computeHandoffLeaseOverlapIndex } from './handoff-lease-overlap-index.ts';
import { computeSaturationDeadlockCouplingIndex } from './saturation-deadlock-coupling-index.ts';
import { computeCascadeLeaseConvergenceIndex } from './cascade-lease-convergence-index.ts';
import { computeGradientAuditTensionIndex } from './gradient-audit-tension-index.ts';
import { computeEscalationSaturationStackIndex } from './escalation-saturation-stack-index.ts';
import { computeRecoveryCascadeMismatchIndex } from './recovery-cascade-mismatch-index.ts';
import { computePersistenceGradientFrictionIndex } from './persistence-gradient-friction-index.ts';
import { computeStackMismatchCouplingIndex } from './stack-mismatch-coupling-index.ts';
import { computeAuditStackAmplificationIndex } from './audit-stack-amplification-index.ts';
import { computeFrictionAlignmentGapIndex } from './friction-alignment-gap-index.ts';
import { computeCouplingAmplificationFusionIndex } from './coupling-amplification-fusion-index.ts';
import { computeGapChurnResonanceIndex } from './gap-churn-resonance-index.ts';
import { computeStackFrictionConvergenceIndex } from './stack-friction-convergence-index.ts';
import { computeFusionResonanceCouplingIndex } from './fusion-resonance-coupling-index.ts';
import { computeConvergenceFusionStackIndex } from './convergence-fusion-stack-index.ts';
import { computeResonanceAuditCascadeIndex } from './resonance-audit-cascade-index.ts';
import { computeCouplingStackCascadeIndex } from './coupling-stack-cascade-index.ts';
import { computeStackCascadeAmplificationIndex } from './stack-cascade-amplification-index.ts';
import { computeCascadeCouplingSynthesisIndex } from './cascade-coupling-synthesis-index.ts';
import { computeCascadeSynthesisFusionIndex } from './cascade-synthesis-fusion-index.ts';
import { computeAmplificationStackResonanceIndex } from './amplification-stack-resonance-index.ts';
import { computeSynthesisEscalationPressureIndex } from './synthesis-escalation-pressure-index.ts';
import { computeFusionResonanceConvergenceIndex } from './fusion-resonance-convergence-index.ts';
import { computePressureFusionCascadeIndex } from './pressure-fusion-cascade-index.ts';
import { computeResonancePressureSynthesisIndex } from './resonance-pressure-synthesis-index.ts';
import { computeConvergenceCascadeSynthesisIndex } from './convergence-cascade-synthesis-index.ts';
import { computeSynthesisConvergenceStackIndex } from './synthesis-convergence-stack-index.ts';
import { computeCascadeResonanceAmplificationIndex } from './cascade-resonance-amplification-index.ts';
import { computeSynthesisStackAmplificationIndex } from './synthesis-stack-amplification-index.ts';
import { computeAmplificationConvergenceCascadeIndex } from './amplification-convergence-cascade-index.ts';
import { computeStackSynthesisResonanceIndex } from './stack-synthesis-resonance-index.ts';
import { computeStackAmplificationCascadeFusionIndex } from './stack-amplification-cascade-fusion-index.ts';
import { computeResonanceAmplificationStackIndex } from './resonance-amplification-stack-index.ts';
import { computeCascadeConvergenceResonanceIndex } from './cascade-convergence-resonance-index.ts';
import { computeFusionStackConvergenceIndex } from './fusion-stack-convergence-index.ts';
import { computeResonanceCascadeSynthesisIndex } from './resonance-cascade-synthesis-index.ts';
import { computeConvergenceAmplificationPressureIndex } from './convergence-amplification-pressure-index.ts';
import { computeConvergenceSynthesisFusionIndex } from './convergence-synthesis-fusion-index.ts';
import { computePressureCascadeStackIndex } from './pressure-cascade-stack-index.ts';
import { computeSynthesisPressureResonanceIndex } from './synthesis-pressure-resonance-index.ts';
import { computeFusionCascadeStackIndex } from './fusion-cascade-stack-index.ts';
import { computeResonancePressureCascadeIndex } from './resonance-pressure-cascade-index.ts';
import { computeSynthesisFusionConvergenceIndex } from './synthesis-fusion-convergence-index.ts';
import { computeStackCascadeResonanceIndex } from './stack-cascade-resonance-index.ts';
import { computeCascadeConvergencePressureIndex } from './cascade-convergence-pressure-index.ts';
import { computeConvergenceFusionSynthesisIndex } from './convergence-fusion-synthesis-index.ts';
import { computeResonanceConvergenceFusionIndex } from './resonance-convergence-fusion-index.ts';
import { computePressureSynthesisCascadeIndex } from './pressure-synthesis-cascade-index.ts';
import { computeSynthesisResonanceStackIndex } from './synthesis-resonance-stack-index.ts';
import { computeConvergenceFusionPressureIndex } from './convergence-fusion-pressure-index.ts';
import { computeSynthesisCascadeStackIndex } from './synthesis-cascade-stack-index.ts';
import { computeResonanceStackFusionIndex } from './resonance-stack-fusion-index.ts';
import { computePressureStackResonanceIndex } from './pressure-stack-resonance-index.ts';
import { computeStackFusionCascadeIndex } from './stack-fusion-cascade-index.ts';
import { computeFusionCascadeConvergenceIndex } from './fusion-cascade-convergence-index.ts';
import { computeResonanceFusionStackIndex } from './resonance-fusion-stack-index.ts';
import { computeFusionCascadePressureIndex } from './fusion-cascade-pressure-index.ts';
import { computeStackConvergenceResonanceIndex } from './stack-convergence-resonance-index.ts';
import { computeFusionStackPressureIndex } from './fusion-stack-pressure-index.ts';
import { computePressureResonanceCascadeIndex } from './pressure-resonance-cascade-index.ts';
import { computeStackSynthesisConvergenceIndex } from './stack-synthesis-convergence-index.ts';
import { computePressureCascadeFusionIndex } from './pressure-cascade-fusion-index.ts';
import { computeCascadeSynthesisResonanceIndex } from './cascade-synthesis-resonance-index.ts';
import { computeConvergencePressureStackIndex } from './convergence-pressure-stack-index.ts';
import { computeFusionCascadeResonanceIndex } from './fusion-cascade-resonance-index.ts';
import { computeResonancePressureStackIndex } from './resonance-pressure-stack-index.ts';
import { computeStackSynthesisFusionIndex } from './stack-synthesis-fusion-index.ts';
import { computeCascadeResonanceStackIndex } from './cascade-resonance-stack-index.ts';
import { computeResonanceFusionPressureIndex } from './resonance-fusion-pressure-index.ts';
import { computeFusionConvergenceSynthesisIndex } from './fusion-convergence-synthesis-index.ts';
import { computeStackResonancePressureIndex } from './stack-resonance-pressure-index.ts';
import { computePressureFusionSynthesisIndex } from './pressure-fusion-synthesis-index.ts';
import { computeSynthesisStackConvergenceIndex } from './synthesis-stack-convergence-index.ts';
import { computeStackFusionResonanceIndex } from './stack-fusion-resonance-index.ts';
import { computeFusionSynthesisPressureIndex } from './fusion-synthesis-pressure-index.ts';
import { computeSynthesisCascadeConvergenceIndex } from './synthesis-cascade-convergence-index.ts';
import { computeFusionResonanceSynthesisIndex } from './fusion-resonance-synthesis-index.ts';
import { computePressureCascadeConvergenceIndex } from './pressure-cascade-convergence-index.ts';
import { computeCascadeStackFusionIndex } from './cascade-stack-fusion-index.ts';
import { computeSynthesisResonanceConvergenceIndex } from './synthesis-resonance-convergence-index.ts';
import { computePressureStackFusionIndex } from './pressure-stack-fusion-index.ts';
import { computeFusionStackSynthesisIndex } from './fusion-stack-synthesis-index.ts';
import { computeResonanceConvergenceStackIndex } from './resonance-convergence-stack-index.ts';
import { computePressureStackSynthesisIndex } from './pressure-stack-synthesis-index.ts';
import { computeFusionStackResonanceIndex } from './fusion-stack-resonance-index.ts';
import { computeConvergenceStackSynthesisIndex } from './convergence-stack-synthesis-index.ts';
import { computeStackSynthesisPressureIndex } from './stack-synthesis-pressure-index.ts';
import { computeFusionResonanceStackIndex } from './fusion-resonance-stack-index.ts';
import { computeSynthesisPressureConvergenceIndex } from './synthesis-pressure-convergence-index.ts';
import { computePressureFusionStackIndex } from './pressure-fusion-stack-index.ts';
import { computeResonanceSynthesisFusionIndex } from './resonance-synthesis-fusion-index.ts';
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
      crossTeamRejectionIndex:
        typeof metaRaw.crossTeamRejectionIndex === 'number'
          ? metaRaw.crossTeamRejectionIndex
          : undefined,
      handoffSlaVelocityIndex:
        typeof metaRaw.handoffSlaVelocityIndex === 'number'
          ? metaRaw.handoffSlaVelocityIndex
          : undefined,
      recoveryActionBreadthIndex:
        typeof metaRaw.recoveryActionBreadthIndex === 'number'
          ? metaRaw.recoveryActionBreadthIndex
          : undefined,
      directiveQuotaExhaustionIndex:
        typeof metaRaw.directiveQuotaExhaustionIndex === 'number'
          ? metaRaw.directiveQuotaExhaustionIndex
          : undefined,
      quotaExhaustedActorIds: Array.isArray(metaRaw.quotaExhaustedActorIds)
        ? metaRaw.quotaExhaustedActorIds.map(String).slice(0, 8)
        : undefined,
      capacityImbalanceIndex:
        typeof metaRaw.capacityImbalanceIndex === 'number'
          ? metaRaw.capacityImbalanceIndex
          : undefined,
      workstreamBarrierStalenessIndex:
        typeof metaRaw.workstreamBarrierStalenessIndex === 'number'
          ? metaRaw.workstreamBarrierStalenessIndex
          : undefined,
      workstreamDeadlockPressureIndex:
        typeof metaRaw.workstreamDeadlockPressureIndex === 'number'
          ? metaRaw.workstreamDeadlockPressureIndex
          : undefined,
      suppressionQuotaCouplingIndex:
        typeof metaRaw.suppressionQuotaCouplingIndex === 'number'
          ? metaRaw.suppressionQuotaCouplingIndex
          : undefined,
      handoffLeaseOverlapIndex:
        typeof metaRaw.handoffLeaseOverlapIndex === 'number'
          ? metaRaw.handoffLeaseOverlapIndex
          : undefined,
      saturationDeadlockCouplingIndex:
        typeof metaRaw.saturationDeadlockCouplingIndex === 'number'
          ? metaRaw.saturationDeadlockCouplingIndex
          : undefined,
      cascadeLeaseConvergenceIndex:
        typeof metaRaw.cascadeLeaseConvergenceIndex === 'number'
          ? metaRaw.cascadeLeaseConvergenceIndex
          : undefined,
      gradientAuditTensionIndex:
        typeof metaRaw.gradientAuditTensionIndex === 'number'
          ? metaRaw.gradientAuditTensionIndex
          : undefined,
      escalationSaturationStackIndex:
        typeof metaRaw.escalationSaturationStackIndex === 'number'
          ? metaRaw.escalationSaturationStackIndex
          : undefined,
      recoveryCascadeMismatchIndex:
        typeof metaRaw.recoveryCascadeMismatchIndex === 'number'
          ? metaRaw.recoveryCascadeMismatchIndex
          : undefined,
      persistenceGradientFrictionIndex:
        typeof metaRaw.persistenceGradientFrictionIndex === 'number'
          ? metaRaw.persistenceGradientFrictionIndex
          : undefined,
      stackMismatchCouplingIndex:
        typeof metaRaw.stackMismatchCouplingIndex === 'number'
          ? metaRaw.stackMismatchCouplingIndex
          : undefined,
      auditStackAmplificationIndex:
        typeof metaRaw.auditStackAmplificationIndex === 'number'
          ? metaRaw.auditStackAmplificationIndex
          : undefined,
      frictionAlignmentGapIndex:
        typeof metaRaw.frictionAlignmentGapIndex === 'number'
          ? metaRaw.frictionAlignmentGapIndex
          : undefined,
      couplingAmplificationFusionIndex:
        typeof metaRaw.couplingAmplificationFusionIndex === 'number'
          ? metaRaw.couplingAmplificationFusionIndex
          : undefined,
      gapChurnResonanceIndex:
        typeof metaRaw.gapChurnResonanceIndex === 'number'
          ? metaRaw.gapChurnResonanceIndex
          : undefined,
      stackFrictionConvergenceIndex:
        typeof metaRaw.stackFrictionConvergenceIndex === 'number'
          ? metaRaw.stackFrictionConvergenceIndex
          : undefined,
      fusionResonanceCouplingIndex:
        typeof metaRaw.fusionResonanceCouplingIndex === 'number'
          ? metaRaw.fusionResonanceCouplingIndex
          : undefined,
      convergenceFusionStackIndex:
        typeof metaRaw.convergenceFusionStackIndex === 'number'
          ? metaRaw.convergenceFusionStackIndex
          : undefined,
      resonanceAuditCascadeIndex:
        typeof metaRaw.resonanceAuditCascadeIndex === 'number'
          ? metaRaw.resonanceAuditCascadeIndex
          : undefined,
      couplingStackCascadeIndex:
        typeof metaRaw.couplingStackCascadeIndex === 'number'
          ? metaRaw.couplingStackCascadeIndex
          : undefined,
      stackCascadeAmplificationIndex:
        typeof metaRaw.stackCascadeAmplificationIndex === 'number'
          ? metaRaw.stackCascadeAmplificationIndex
          : undefined,
      cascadeCouplingSynthesisIndex:
        typeof metaRaw.cascadeCouplingSynthesisIndex === 'number'
          ? metaRaw.cascadeCouplingSynthesisIndex
          : undefined,
      cascadeSynthesisFusionIndex:
        typeof metaRaw.cascadeSynthesisFusionIndex === 'number'
          ? metaRaw.cascadeSynthesisFusionIndex
          : undefined,
      amplificationStackResonanceIndex:
        typeof metaRaw.amplificationStackResonanceIndex === 'number'
          ? metaRaw.amplificationStackResonanceIndex
          : undefined,
      synthesisEscalationPressureIndex:
        typeof metaRaw.synthesisEscalationPressureIndex === 'number'
          ? metaRaw.synthesisEscalationPressureIndex
          : undefined,
      fusionResonanceConvergenceIndex:
        typeof metaRaw.fusionResonanceConvergenceIndex === 'number'
          ? metaRaw.fusionResonanceConvergenceIndex
          : undefined,
      pressureFusionCascadeIndex:
        typeof metaRaw.pressureFusionCascadeIndex === 'number'
          ? metaRaw.pressureFusionCascadeIndex
          : undefined,
      resonancePressureSynthesisIndex:
        typeof metaRaw.resonancePressureSynthesisIndex === 'number'
          ? metaRaw.resonancePressureSynthesisIndex
          : undefined,
      convergenceCascadeSynthesisIndex:
        typeof metaRaw.convergenceCascadeSynthesisIndex === 'number'
          ? metaRaw.convergenceCascadeSynthesisIndex
          : undefined,
      synthesisConvergenceStackIndex:
        typeof metaRaw.synthesisConvergenceStackIndex === 'number'
          ? metaRaw.synthesisConvergenceStackIndex
          : undefined,
      cascadeResonanceAmplificationIndex:
        typeof metaRaw.cascadeResonanceAmplificationIndex === 'number'
          ? metaRaw.cascadeResonanceAmplificationIndex
          : undefined,
      synthesisStackAmplificationIndex:
        typeof metaRaw.synthesisStackAmplificationIndex === 'number'
          ? metaRaw.synthesisStackAmplificationIndex
          : undefined,
      amplificationConvergenceCascadeIndex:
        typeof metaRaw.amplificationConvergenceCascadeIndex === 'number'
          ? metaRaw.amplificationConvergenceCascadeIndex
          : undefined,
      stackSynthesisResonanceIndex:
        typeof metaRaw.stackSynthesisResonanceIndex === 'number'
          ? metaRaw.stackSynthesisResonanceIndex
          : undefined,
      stackAmplificationCascadeFusionIndex:
        typeof metaRaw.stackAmplificationCascadeFusionIndex === 'number'
          ? metaRaw.stackAmplificationCascadeFusionIndex
          : undefined,
      resonanceAmplificationStackIndex:
        typeof metaRaw.resonanceAmplificationStackIndex === 'number'
          ? metaRaw.resonanceAmplificationStackIndex
          : undefined,
      cascadeConvergenceResonanceIndex:
        typeof metaRaw.cascadeConvergenceResonanceIndex === 'number'
          ? metaRaw.cascadeConvergenceResonanceIndex
          : undefined,
      fusionStackConvergenceIndex:
        typeof metaRaw.fusionStackConvergenceIndex === 'number'
          ? metaRaw.fusionStackConvergenceIndex
          : undefined,
      resonanceCascadeSynthesisIndex:
        typeof metaRaw.resonanceCascadeSynthesisIndex === 'number'
          ? metaRaw.resonanceCascadeSynthesisIndex
          : undefined,
      convergenceAmplificationPressureIndex:
        typeof metaRaw.convergenceAmplificationPressureIndex === 'number'
          ? metaRaw.convergenceAmplificationPressureIndex
          : undefined,
      convergenceSynthesisFusionIndex:
        typeof metaRaw.convergenceSynthesisFusionIndex === 'number'
          ? metaRaw.convergenceSynthesisFusionIndex
          : undefined,
      pressureCascadeStackIndex:
        typeof metaRaw.pressureCascadeStackIndex === 'number'
          ? metaRaw.pressureCascadeStackIndex
          : undefined,
      synthesisPressureResonanceIndex:
        typeof metaRaw.synthesisPressureResonanceIndex === 'number'
          ? metaRaw.synthesisPressureResonanceIndex
          : undefined,
      fusionCascadeStackIndex:
        typeof metaRaw.fusionCascadeStackIndex === 'number'
          ? metaRaw.fusionCascadeStackIndex
          : undefined,
      resonancePressureCascadeIndex:
        typeof metaRaw.resonancePressureCascadeIndex === 'number'
          ? metaRaw.resonancePressureCascadeIndex
          : undefined,
      synthesisFusionConvergenceIndex:
        typeof metaRaw.synthesisFusionConvergenceIndex === 'number'
          ? metaRaw.synthesisFusionConvergenceIndex
          : undefined,
      stackCascadeResonanceIndex:
        typeof metaRaw.stackCascadeResonanceIndex === 'number'
          ? metaRaw.stackCascadeResonanceIndex
          : undefined,
      cascadeConvergencePressureIndex:
        typeof metaRaw.cascadeConvergencePressureIndex === 'number'
          ? metaRaw.cascadeConvergencePressureIndex
          : undefined,
      convergenceFusionSynthesisIndex:
        typeof metaRaw.convergenceFusionSynthesisIndex === 'number'
          ? metaRaw.convergenceFusionSynthesisIndex
          : undefined,
      resonanceConvergenceFusionIndex:
        typeof metaRaw.resonanceConvergenceFusionIndex === 'number'
          ? metaRaw.resonanceConvergenceFusionIndex
          : undefined,
      pressureSynthesisCascadeIndex:
        typeof metaRaw.pressureSynthesisCascadeIndex === 'number'
          ? metaRaw.pressureSynthesisCascadeIndex
          : undefined,
      synthesisResonanceStackIndex:
        typeof metaRaw.synthesisResonanceStackIndex === 'number'
          ? metaRaw.synthesisResonanceStackIndex
          : undefined,
      convergenceFusionPressureIndex:
        typeof metaRaw.convergenceFusionPressureIndex === 'number'
          ? metaRaw.convergenceFusionPressureIndex
          : undefined,
      synthesisCascadeStackIndex:
        typeof metaRaw.synthesisCascadeStackIndex === 'number'
          ? metaRaw.synthesisCascadeStackIndex
          : undefined,
      resonanceStackFusionIndex:
        typeof metaRaw.resonanceStackFusionIndex === 'number'
          ? metaRaw.resonanceStackFusionIndex
          : undefined,
      pressureStackResonanceIndex:
        typeof metaRaw.pressureStackResonanceIndex === 'number'
          ? metaRaw.pressureStackResonanceIndex
          : undefined,
      stackFusionCascadeIndex:
        typeof metaRaw.stackFusionCascadeIndex === 'number'
          ? metaRaw.stackFusionCascadeIndex
          : undefined,
      fusionCascadeConvergenceIndex:
        typeof metaRaw.fusionCascadeConvergenceIndex === 'number'
          ? metaRaw.fusionCascadeConvergenceIndex
          : undefined,
      resonanceFusionStackIndex:
        typeof metaRaw.resonanceFusionStackIndex === 'number'
          ? metaRaw.resonanceFusionStackIndex
          : undefined,
      fusionCascadePressureIndex:
        typeof metaRaw.fusionCascadePressureIndex === 'number'
          ? metaRaw.fusionCascadePressureIndex
          : undefined,
      stackConvergenceResonanceIndex:
        typeof metaRaw.stackConvergenceResonanceIndex === 'number'
          ? metaRaw.stackConvergenceResonanceIndex
          : undefined,
      fusionStackPressureIndex:
        typeof metaRaw.fusionStackPressureIndex === 'number'
          ? metaRaw.fusionStackPressureIndex
          : undefined,
      pressureResonanceCascadeIndex:
        typeof metaRaw.pressureResonanceCascadeIndex === 'number'
          ? metaRaw.pressureResonanceCascadeIndex
          : undefined,
      stackSynthesisConvergenceIndex:
        typeof metaRaw.stackSynthesisConvergenceIndex === 'number'
          ? metaRaw.stackSynthesisConvergenceIndex
          : undefined,
      pressureCascadeFusionIndex:
        typeof metaRaw.pressureCascadeFusionIndex === 'number'
          ? metaRaw.pressureCascadeFusionIndex
          : undefined,
      cascadeSynthesisResonanceIndex:
        typeof metaRaw.cascadeSynthesisResonanceIndex === 'number'
          ? metaRaw.cascadeSynthesisResonanceIndex
          : undefined,
      convergencePressureStackIndex:
        typeof metaRaw.convergencePressureStackIndex === 'number'
          ? metaRaw.convergencePressureStackIndex
          : undefined,
      fusionCascadeResonanceIndex:
        typeof metaRaw.fusionCascadeResonanceIndex === 'number'
          ? metaRaw.fusionCascadeResonanceIndex
          : undefined,
      resonancePressureStackIndex:
        typeof metaRaw.resonancePressureStackIndex === 'number'
          ? metaRaw.resonancePressureStackIndex
          : undefined,
      stackSynthesisFusionIndex:
        typeof metaRaw.stackSynthesisFusionIndex === 'number'
          ? metaRaw.stackSynthesisFusionIndex
          : undefined,
      cascadeResonanceStackIndex:
        typeof metaRaw.cascadeResonanceStackIndex === 'number'
          ? metaRaw.cascadeResonanceStackIndex
          : undefined,
      resonanceFusionPressureIndex:
        typeof metaRaw.resonanceFusionPressureIndex === 'number'
          ? metaRaw.resonanceFusionPressureIndex
          : undefined,
      fusionConvergenceSynthesisIndex:
        typeof metaRaw.fusionConvergenceSynthesisIndex === 'number'
          ? metaRaw.fusionConvergenceSynthesisIndex
          : undefined,
      stackResonancePressureIndex:
        typeof metaRaw.stackResonancePressureIndex === 'number'
          ? metaRaw.stackResonancePressureIndex
          : undefined,
      pressureFusionSynthesisIndex:
        typeof metaRaw.pressureFusionSynthesisIndex === 'number'
          ? metaRaw.pressureFusionSynthesisIndex
          : undefined,
      synthesisStackConvergenceIndex:
        typeof metaRaw.synthesisStackConvergenceIndex === 'number'
          ? metaRaw.synthesisStackConvergenceIndex
          : undefined,
      stackFusionResonanceIndex:
        typeof metaRaw.stackFusionResonanceIndex === 'number'
          ? metaRaw.stackFusionResonanceIndex
          : undefined,
      fusionSynthesisPressureIndex:
        typeof metaRaw.fusionSynthesisPressureIndex === 'number'
          ? metaRaw.fusionSynthesisPressureIndex
          : undefined,
      synthesisCascadeConvergenceIndex:
        typeof metaRaw.synthesisCascadeConvergenceIndex === 'number'
          ? metaRaw.synthesisCascadeConvergenceIndex
          : undefined,
      fusionResonanceSynthesisIndex:
        typeof metaRaw.fusionResonanceSynthesisIndex === 'number'
          ? metaRaw.fusionResonanceSynthesisIndex
          : undefined,
      pressureCascadeConvergenceIndex:
        typeof metaRaw.pressureCascadeConvergenceIndex === 'number'
          ? metaRaw.pressureCascadeConvergenceIndex
          : undefined,
      cascadeStackFusionIndex:
        typeof metaRaw.cascadeStackFusionIndex === 'number'
          ? metaRaw.cascadeStackFusionIndex
          : undefined,
      synthesisResonanceConvergenceIndex:
        typeof metaRaw.synthesisResonanceConvergenceIndex === 'number'
          ? metaRaw.synthesisResonanceConvergenceIndex
          : undefined,
      pressureStackFusionIndex:
        typeof metaRaw.pressureStackFusionIndex === 'number'
          ? metaRaw.pressureStackFusionIndex
          : undefined,
      fusionStackSynthesisIndex:
        typeof metaRaw.fusionStackSynthesisIndex === 'number'
          ? metaRaw.fusionStackSynthesisIndex
          : undefined,
      resonanceConvergenceStackIndex:
        typeof metaRaw.resonanceConvergenceStackIndex === 'number'
          ? metaRaw.resonanceConvergenceStackIndex
          : undefined,
      pressureStackSynthesisIndex:
        typeof metaRaw.pressureStackSynthesisIndex === 'number'
          ? metaRaw.pressureStackSynthesisIndex
          : undefined,
      fusionStackResonanceIndex:
        typeof metaRaw.fusionStackResonanceIndex === 'number'
          ? metaRaw.fusionStackResonanceIndex
          : undefined,
      convergenceStackSynthesisIndex:
        typeof metaRaw.convergenceStackSynthesisIndex === 'number'
          ? metaRaw.convergenceStackSynthesisIndex
          : undefined,
      stackSynthesisPressureIndex:
        typeof metaRaw.stackSynthesisPressureIndex === 'number'
          ? metaRaw.stackSynthesisPressureIndex
          : undefined,
      fusionResonanceStackIndex:
        typeof metaRaw.fusionResonanceStackIndex === 'number'
          ? metaRaw.fusionResonanceStackIndex
          : undefined,
      synthesisPressureConvergenceIndex:
        typeof metaRaw.synthesisPressureConvergenceIndex === 'number'
          ? metaRaw.synthesisPressureConvergenceIndex
          : undefined,
      pressureFusionStackIndex:
        typeof metaRaw.pressureFusionStackIndex === 'number'
          ? metaRaw.pressureFusionStackIndex
          : undefined,
      resonanceSynthesisFusionIndex:
        typeof metaRaw.resonanceSynthesisFusionIndex === 'number'
          ? metaRaw.resonanceSynthesisFusionIndex
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
  const crossTeamRejection = computeCrossTeamRejectionIndex(
    scoped.rejected.length,
    rawProposals.length,
  );
  crossTeamRejection.notes.forEach(n => diagnostics.push(n));
  const quota = applyDirectiveQuotaGuard(scoped.inTeam, {
    maxPerActorPerTurn: AGENT18_LIMITS.maxDirectivesPerActorPerTurn,
    maxPerTeamPerTurn: AGENT18_LIMITS.maxDirectivesPerTeamPerTurn,
  });
  quota.dropped.forEach(d =>
    diagnostics.push(`Dropped directive ${d.proposal.id}: ${d.reason}`),
  );
  const quotaExhaustedActorIds = Object.entries(quota.remainingByActor)
    .filter(([, remaining]) => remaining === 0)
    .map(([actorId]) => actorId);
  const directiveQuotaExhaustion = computeDirectiveQuotaExhaustionIndex(
    quota.dropped.length,
    quotaExhaustedActorIds,
  );
  directiveQuotaExhaustion.notes.forEach(n => diagnostics.push(n));
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
  const handoffSlaVelocity = computeHandoffSlaVelocityIndex(
    coordination.handoffs.filter(h => h.status === 'pending').length,
    handoffSla.overdueHandoffIds,
  );
  handoffSlaVelocity.notes.forEach(n => diagnostics.push(n));
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
  const capacityImbalance = computeCapacityImbalanceIndex(
    capacityLedger.balanceScore,
    capacityLedger.overloadedActorIds,
    capacityLedger.idleActorIds,
  );
  capacityImbalance.notes.forEach(n => diagnostics.push(n));
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
  const workstreamBarrierStaleness = computeWorkstreamBarrierStalenessIndex(
    inputs.turn,
    barrierSince,
    workstreamBarriers.stalledWorkstreamIds,
  );
  workstreamBarrierStaleness.notes.forEach(n => diagnostics.push(n));
  const workstreamDeadlocks = detectWorkstreamDeadlocks(coordination.workstreams);
  workstreamDeadlocks.notes.forEach(n => diagnostics.push(n));
  const workstreamParallelism = measureWorkstreamParallelism(coordination.workstreams);
  workstreamParallelism.notes.forEach(n => diagnostics.push(n));
  const workstreamDeadlockPressure = computeWorkstreamDeadlockPressureIndex(
    workstreamDeadlocks.deadlockCount,
    workstreamDeadlocks.deadlockedWorkstreamIds,
    workstreamParallelism.parallelismIndex,
  );
  workstreamDeadlockPressure.notes.forEach(n => diagnostics.push(n));
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
  const suppressionQuotaCoupling = computeSuppressionQuotaCouplingIndex(
    suppressionBacklog.backlogIndex,
    directiveQuotaExhaustion.exhaustionIndex,
    quotaExhaustedActorIds.length,
  );
  suppressionQuotaCoupling.notes.forEach(n => diagnostics.push(n));

  const roleChurn = computeRoleChurnIndex(previous?.roles ?? null, roles);
  roleChurn.notes.forEach(n => diagnostics.push(n));

  const leaseExpiry = evaluateLeaseExpiry(inputs.turn, coordination.leases);
  leaseExpiry.notes.forEach(n => diagnostics.push(n));
  const leaseAtRiskRegions = new Set<string>();
  coordination.leases.forEach(lease => {
    if (
      leaseExpiry.expiringLeaseIds.includes(lease.id) ||
      leaseExpiry.expiredLeaseIds.includes(lease.id)
    ) {
      if (lease.regionId) leaseAtRiskRegions.add(lease.regionId);
    }
  });
  const pendingHandoffs = coordination.handoffs.filter(h => h.status === 'pending');
  const overlappingPendingHandoffs = pendingHandoffs.filter(
    h => h.regionId !== null && leaseAtRiskRegions.has(h.regionId),
  ).length;
  const handoffLeaseOverlap = computeHandoffLeaseOverlapIndex(
    overlappingPendingHandoffs,
    pendingHandoffs.length,
    leaseExpiry.expiringLeaseIds.length,
    leaseExpiry.expiredLeaseIds.length,
  );
  handoffLeaseOverlap.notes.forEach(n => diagnostics.push(n));

  const saturationDeadlockCoupling = computeSaturationDeadlockCouplingIndex(
    coordinationSaturation.saturationIndex,
    workstreamDeadlockPressure.pressureIndex,
    workstreamDeadlocks.deadlockCount,
  );
  saturationDeadlockCoupling.notes.forEach(n => diagnostics.push(n));
  const cascadeLeaseConvergence = computeCascadeLeaseConvergenceIndex(
    handoffCascade.cascadeRiskIndex,
    handoffLeaseOverlap.overlapIndex,
    handoffCascade.cascadeChainActorIds.length,
  );
  cascadeLeaseConvergence.notes.forEach(n => diagnostics.push(n));

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
      crossTeamRejectionIndex: crossTeamRejection.rejectionIndex,
      handoffSlaVelocityIndex: handoffSlaVelocity.velocityIndex,
      directiveQuotaExhaustionIndex: directiveQuotaExhaustion.exhaustionIndex,
      quotaExhaustedActorIds: quotaExhaustedActorIds.slice(0, 8),
      capacityImbalanceIndex: capacityImbalance.imbalanceIndex,
      workstreamBarrierStalenessIndex: workstreamBarrierStaleness.stalenessIndex,
      workstreamDeadlockPressureIndex: workstreamDeadlockPressure.pressureIndex,
      suppressionQuotaCouplingIndex: suppressionQuotaCoupling.couplingIndex,
      handoffLeaseOverlapIndex: handoffLeaseOverlap.overlapIndex,
      saturationDeadlockCouplingIndex: saturationDeadlockCoupling.couplingIndex,
      cascadeLeaseConvergenceIndex: cascadeLeaseConvergence.convergenceIndex,
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
  const recoveryBreadth = measureRecoveryActionBreadth(
    escalation.tier,
    recoveryPlaybook.recommendedActions,
  );
  recoveryBreadth.notes.forEach(n => diagnostics.push(n));
  state = attachAuditToState(state, auditFindings, {
    coordinationEscalationTier: escalation.tier,
    coordinationEscalationLabel: escalation.label,
    coordinationRecoveryUrgency: recoveryPlaybook.recoveryUrgency,
    coordinationRecoveryActions: recoveryPlaybook.recommendedActions,
    escalationRecoveryAlignmentIndex: escalationAlignment.alignmentIndex,
    auditPressureIndex: auditPressure.pressureIndex,
    recoveryActionBreadthIndex: recoveryBreadth.breadthGapIndex,
  });
  const gradientAuditTension = computeGradientAuditTensionIndex(
    state.meta.compositeHealthGradientIndex ?? 0,
    state.meta.compositeHealthTrend,
    state.meta.auditPressureIndex ?? 0,
  );
  gradientAuditTension.notes.forEach(n => diagnostics.push(n));
  const escalationSaturationStack = computeEscalationSaturationStackIndex(
    state.meta.coordinationEscalationTier ?? 0,
    state.meta.saturationDeadlockCouplingIndex ?? 0,
    state.meta.coordinationSaturationIndex ?? 0,
  );
  escalationSaturationStack.notes.forEach(n => diagnostics.push(n));
  const recoveryCascadeMismatch = computeRecoveryCascadeMismatchIndex(
    state.meta.recoveryActionBreadthIndex ?? 0,
    state.meta.cascadeLeaseConvergenceIndex ?? 0,
    state.meta.coordinationRecoveryUrgency ?? 0,
  );
  recoveryCascadeMismatch.notes.forEach(n => diagnostics.push(n));
  const stackMismatchCoupling = computeStackMismatchCouplingIndex(
    escalationSaturationStack.stackIndex,
    recoveryCascadeMismatch.mismatchIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  stackMismatchCoupling.notes.forEach(n => diagnostics.push(n));
  const auditStackAmplification = computeAuditStackAmplificationIndex(
    state.meta.auditPressureIndex ?? 0,
    escalationSaturationStack.stackIndex,
    gradientAuditTension.tensionIndex,
  );
  auditStackAmplification.notes.forEach(n => diagnostics.push(n));
  const couplingAmplificationFusion = computeCouplingAmplificationFusionIndex(
    stackMismatchCoupling.couplingIndex,
    auditStackAmplification.amplificationIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  couplingAmplificationFusion.notes.forEach(n => diagnostics.push(n));
  state = {
    ...state,
    meta: {
      ...state.meta,
      gradientAuditTensionIndex: gradientAuditTension.tensionIndex,
      escalationSaturationStackIndex: escalationSaturationStack.stackIndex,
      recoveryCascadeMismatchIndex: recoveryCascadeMismatch.mismatchIndex,
      stackMismatchCouplingIndex: stackMismatchCoupling.couplingIndex,
      auditStackAmplificationIndex: auditStackAmplification.amplificationIndex,
      couplingAmplificationFusionIndex: couplingAmplificationFusion.fusionIndex,
    },
  };
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
  const persistenceGradientFriction = computePersistenceGradientFrictionIndex(
    persistenceChurn.churnIndex,
    state.meta.gradientAuditTensionIndex ?? 0,
    state.meta.compositeHealthTrend,
  );
  persistenceGradientFriction.notes.forEach(n => diagnostics.push(n));
  state = {
    ...state,
    diagnostics,
    meta: {
      ...state.meta,
      persistenceGradientFrictionIndex: persistenceGradientFriction.frictionIndex,
    },
  };
  const frictionAlignmentGap = computeFrictionAlignmentGapIndex(
    persistenceGradientFriction.frictionIndex,
    state.meta.escalationRecoveryAlignmentIndex ?? 100,
    persistenceChurn.churnIndex,
  );
  frictionAlignmentGap.notes.forEach(n => diagnostics.push(n));
  const gapChurnResonance = computeGapChurnResonanceIndex(
    frictionAlignmentGap.gapIndex,
    persistenceChurn.churnIndex,
    persistenceGradientFriction.frictionIndex,
  );
  gapChurnResonance.notes.forEach(n => diagnostics.push(n));
  const stackFrictionConvergence = computeStackFrictionConvergenceIndex(
    stackMismatchCoupling.couplingIndex,
    frictionAlignmentGap.gapIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  stackFrictionConvergence.notes.forEach(n => diagnostics.push(n));
  const fusionResonanceCoupling = computeFusionResonanceCouplingIndex(
    couplingAmplificationFusion.fusionIndex,
    gapChurnResonance.resonanceIndex,
    persistenceChurn.churnIndex,
  );
  fusionResonanceCoupling.notes.forEach(n => diagnostics.push(n));
  const convergenceFusionStack = computeConvergenceFusionStackIndex(
    stackFrictionConvergence.convergenceIndex,
    couplingAmplificationFusion.fusionIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergenceFusionStack.notes.forEach(n => diagnostics.push(n));
  const resonanceAuditCascade = computeResonanceAuditCascadeIndex(
    gapChurnResonance.resonanceIndex,
    state.meta.auditStackAmplificationIndex ?? 0,
    state.meta.auditPressureIndex ?? 0,
  );
  resonanceAuditCascade.notes.forEach(n => diagnostics.push(n));
  const couplingStackCascade = computeCouplingStackCascadeIndex(
    fusionResonanceCoupling.couplingIndex,
    convergenceFusionStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  couplingStackCascade.notes.forEach(n => diagnostics.push(n));
  const stackCascadeAmplification = computeStackCascadeAmplificationIndex(
    convergenceFusionStack.stackIndex,
    resonanceAuditCascade.cascadeIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  stackCascadeAmplification.notes.forEach(n => diagnostics.push(n));
  const cascadeCouplingSynthesis = computeCascadeCouplingSynthesisIndex(
    resonanceAuditCascade.cascadeIndex,
    fusionResonanceCoupling.couplingIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  cascadeCouplingSynthesis.notes.forEach(n => diagnostics.push(n));
  const cascadeSynthesisFusion = computeCascadeSynthesisFusionIndex(
    couplingStackCascade.cascadeIndex,
    cascadeCouplingSynthesis.synthesisIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  cascadeSynthesisFusion.notes.forEach(n => diagnostics.push(n));
  const amplificationStackResonance = computeAmplificationStackResonanceIndex(
    stackCascadeAmplification.amplificationIndex,
    convergenceFusionStack.stackIndex,
    gapChurnResonance.resonanceIndex,
  );
  amplificationStackResonance.notes.forEach(n => diagnostics.push(n));
  const synthesisEscalationPressure = computeSynthesisEscalationPressureIndex(
    cascadeCouplingSynthesis.synthesisIndex,
    stackCascadeAmplification.amplificationIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  synthesisEscalationPressure.notes.forEach(n => diagnostics.push(n));
  const fusionResonanceConvergence = computeFusionResonanceConvergenceIndex(
    cascadeSynthesisFusion.fusionIndex,
    amplificationStackResonance.resonanceIndex,
    fusionResonanceCoupling.couplingIndex,
  );
  fusionResonanceConvergence.notes.forEach(n => diagnostics.push(n));
  const pressureFusionCascade = computePressureFusionCascadeIndex(
    synthesisEscalationPressure.pressureIndex,
    cascadeSynthesisFusion.fusionIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  pressureFusionCascade.notes.forEach(n => diagnostics.push(n));
  const resonancePressureSynthesis = computeResonancePressureSynthesisIndex(
    amplificationStackResonance.resonanceIndex,
    synthesisEscalationPressure.pressureIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  resonancePressureSynthesis.notes.forEach(n => diagnostics.push(n));
  const convergenceCascadeSynthesis = computeConvergenceCascadeSynthesisIndex(
    fusionResonanceConvergence.convergenceIndex,
    pressureFusionCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergenceCascadeSynthesis.notes.forEach(n => diagnostics.push(n));
  const synthesisConvergenceStack = computeSynthesisConvergenceStackIndex(
    resonancePressureSynthesis.synthesisIndex,
    fusionResonanceConvergence.convergenceIndex,
    cascadeSynthesisFusion.fusionIndex,
  );
  synthesisConvergenceStack.notes.forEach(n => diagnostics.push(n));
  const cascadeResonanceAmplification = computeCascadeResonanceAmplificationIndex(
    pressureFusionCascade.cascadeIndex,
    resonancePressureSynthesis.synthesisIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  cascadeResonanceAmplification.notes.forEach(n => diagnostics.push(n));
  const synthesisStackAmplification = computeSynthesisStackAmplificationIndex(
    convergenceCascadeSynthesis.synthesisIndex,
    synthesisConvergenceStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  synthesisStackAmplification.notes.forEach(n => diagnostics.push(n));
  const amplificationConvergenceCascade = computeAmplificationConvergenceCascadeIndex(
    cascadeResonanceAmplification.amplificationIndex,
    convergenceCascadeSynthesis.synthesisIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  amplificationConvergenceCascade.notes.forEach(n => diagnostics.push(n));
  const stackSynthesisResonance = computeStackSynthesisResonanceIndex(
    synthesisConvergenceStack.stackIndex,
    cascadeResonanceAmplification.amplificationIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  stackSynthesisResonance.notes.forEach(n => diagnostics.push(n));
  const stackAmplificationCascadeFusion = computeStackAmplificationCascadeFusionIndex(
    synthesisStackAmplification.amplificationIndex,
    amplificationConvergenceCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  stackAmplificationCascadeFusion.notes.forEach(n => diagnostics.push(n));
  const resonanceAmplificationStack = computeResonanceAmplificationStackIndex(
    stackSynthesisResonance.resonanceIndex,
    synthesisStackAmplification.amplificationIndex,
    convergenceCascadeSynthesis.synthesisIndex,
  );
  resonanceAmplificationStack.notes.forEach(n => diagnostics.push(n));
  const cascadeConvergenceResonance = computeCascadeConvergenceResonanceIndex(
    amplificationConvergenceCascade.cascadeIndex,
    stackSynthesisResonance.resonanceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  cascadeConvergenceResonance.notes.forEach(n => diagnostics.push(n));
  const fusionStackConvergence = computeFusionStackConvergenceIndex(
    stackAmplificationCascadeFusion.fusionIndex,
    resonanceAmplificationStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  fusionStackConvergence.notes.forEach(n => diagnostics.push(n));
  const resonanceCascadeSynthesis = computeResonanceCascadeSynthesisIndex(
    cascadeConvergenceResonance.resonanceIndex,
    stackAmplificationCascadeFusion.fusionIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  resonanceCascadeSynthesis.notes.forEach(n => diagnostics.push(n));
  const convergenceAmplificationPressure = computeConvergenceAmplificationPressureIndex(
    resonanceAmplificationStack.stackIndex,
    cascadeConvergenceResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  convergenceAmplificationPressure.notes.forEach(n => diagnostics.push(n));
  const convergenceSynthesisFusion = computeConvergenceSynthesisFusionIndex(
    fusionStackConvergence.convergenceIndex,
    resonanceCascadeSynthesis.synthesisIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergenceSynthesisFusion.notes.forEach(n => diagnostics.push(n));
  const pressureCascadeStack = computePressureCascadeStackIndex(
    convergenceAmplificationPressure.pressureIndex,
    fusionStackConvergence.convergenceIndex,
    stackAmplificationCascadeFusion.fusionIndex,
  );
  pressureCascadeStack.notes.forEach(n => diagnostics.push(n));
  const synthesisPressureResonance = computeSynthesisPressureResonanceIndex(
    resonanceCascadeSynthesis.synthesisIndex,
    convergenceAmplificationPressure.pressureIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  synthesisPressureResonance.notes.forEach(n => diagnostics.push(n));
  const fusionCascadeStack = computeFusionCascadeStackIndex(
    convergenceSynthesisFusion.fusionIndex,
    pressureCascadeStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  fusionCascadeStack.notes.forEach(n => diagnostics.push(n));
  const resonancePressureCascade = computeResonancePressureCascadeIndex(
    synthesisPressureResonance.resonanceIndex,
    pressureCascadeStack.stackIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  resonancePressureCascade.notes.forEach(n => diagnostics.push(n));
  const synthesisFusionConvergence = computeSynthesisFusionConvergenceIndex(
    convergenceSynthesisFusion.fusionIndex,
    synthesisPressureResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  synthesisFusionConvergence.notes.forEach(n => diagnostics.push(n));
  const stackCascadeResonance = computeStackCascadeResonanceIndex(
    fusionCascadeStack.stackIndex,
    resonancePressureCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  stackCascadeResonance.notes.forEach(n => diagnostics.push(n));
  const cascadeConvergencePressure = computeCascadeConvergencePressureIndex(
    resonancePressureCascade.cascadeIndex,
    synthesisFusionConvergence.convergenceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  cascadeConvergencePressure.notes.forEach(n => diagnostics.push(n));
  const convergenceFusionSynthesis = computeConvergenceFusionSynthesisIndex(
    synthesisFusionConvergence.convergenceIndex,
    fusionCascadeStack.stackIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  convergenceFusionSynthesis.notes.forEach(n => diagnostics.push(n));
  const resonanceConvergenceFusion = computeResonanceConvergenceFusionIndex(
    stackCascadeResonance.resonanceIndex,
    cascadeConvergencePressure.pressureIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  resonanceConvergenceFusion.notes.forEach(n => diagnostics.push(n));
  const pressureSynthesisCascade = computePressureSynthesisCascadeIndex(
    cascadeConvergencePressure.pressureIndex,
    convergenceFusionSynthesis.synthesisIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureSynthesisCascade.notes.forEach(n => diagnostics.push(n));
  const synthesisResonanceStack = computeSynthesisResonanceStackIndex(
    convergenceFusionSynthesis.synthesisIndex,
    stackCascadeResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  synthesisResonanceStack.notes.forEach(n => diagnostics.push(n));
  const convergenceFusionPressure = computeConvergenceFusionPressureIndex(
    resonanceConvergenceFusion.fusionIndex,
    pressureSynthesisCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergenceFusionPressure.notes.forEach(n => diagnostics.push(n));
  const synthesisCascadeStack = computeSynthesisCascadeStackIndex(
    pressureSynthesisCascade.cascadeIndex,
    synthesisResonanceStack.stackIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  synthesisCascadeStack.notes.forEach(n => diagnostics.push(n));
  const resonanceStackFusion = computeResonanceStackFusionIndex(
    synthesisResonanceStack.stackIndex,
    resonanceConvergenceFusion.fusionIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  resonanceStackFusion.notes.forEach(n => diagnostics.push(n));
  const pressureStackResonance = computePressureStackResonanceIndex(
    convergenceFusionPressure.pressureIndex,
    synthesisCascadeStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  pressureStackResonance.notes.forEach(n => diagnostics.push(n));
  const stackFusionCascade = computeStackFusionCascadeIndex(
    synthesisCascadeStack.stackIndex,
    resonanceStackFusion.fusionIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  stackFusionCascade.notes.forEach(n => diagnostics.push(n));
  const fusionCascadeConvergence = computeFusionCascadeConvergenceIndex(
    resonanceStackFusion.fusionIndex,
    convergenceFusionPressure.pressureIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  fusionCascadeConvergence.notes.forEach(n => diagnostics.push(n));
  const resonanceFusionStack = computeResonanceFusionStackIndex(
    pressureStackResonance.resonanceIndex,
    stackFusionCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  resonanceFusionStack.notes.forEach(n => diagnostics.push(n));
  const fusionCascadePressure = computeFusionCascadePressureIndex(
    stackFusionCascade.cascadeIndex,
    fusionCascadeConvergence.convergenceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  fusionCascadePressure.notes.forEach(n => diagnostics.push(n));
  const stackConvergenceResonance = computeStackConvergenceResonanceIndex(
    fusionCascadeConvergence.convergenceIndex,
    pressureStackResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  stackConvergenceResonance.notes.forEach(n => diagnostics.push(n));
  const fusionStackPressure = computeFusionStackPressureIndex(
    resonanceFusionStack.stackIndex,
    fusionCascadePressure.pressureIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  fusionStackPressure.notes.forEach(n => diagnostics.push(n));
  const pressureResonanceCascade = computePressureResonanceCascadeIndex(
    fusionCascadePressure.pressureIndex,
    stackConvergenceResonance.resonanceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureResonanceCascade.notes.forEach(n => diagnostics.push(n));
  const stackSynthesisConvergence = computeStackSynthesisConvergenceIndex(
    stackConvergenceResonance.resonanceIndex,
    resonanceFusionStack.stackIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  stackSynthesisConvergence.notes.forEach(n => diagnostics.push(n));
  const pressureCascadeFusion = computePressureCascadeFusionIndex(
    fusionStackPressure.pressureIndex,
    pressureResonanceCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  pressureCascadeFusion.notes.forEach(n => diagnostics.push(n));
  const cascadeSynthesisResonance = computeCascadeSynthesisResonanceIndex(
    pressureResonanceCascade.cascadeIndex,
    stackSynthesisConvergence.convergenceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  cascadeSynthesisResonance.notes.forEach(n => diagnostics.push(n));
  const convergencePressureStack = computeConvergencePressureStackIndex(
    stackSynthesisConvergence.convergenceIndex,
    fusionStackPressure.pressureIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  convergencePressureStack.notes.forEach(n => diagnostics.push(n));
  const fusionCascadeResonance = computeFusionCascadeResonanceIndex(
    pressureCascadeFusion.fusionIndex,
    cascadeSynthesisResonance.resonanceIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  fusionCascadeResonance.notes.forEach(n => diagnostics.push(n));
  const resonancePressureStack = computeResonancePressureStackIndex(
    cascadeSynthesisResonance.resonanceIndex,
    convergencePressureStack.stackIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  resonancePressureStack.notes.forEach(n => diagnostics.push(n));
  const stackSynthesisFusion = computeStackSynthesisFusionIndex(
    convergencePressureStack.stackIndex,
    pressureCascadeFusion.fusionIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  stackSynthesisFusion.notes.forEach(n => diagnostics.push(n));
  const cascadeResonanceStack = computeCascadeResonanceStackIndex(
    fusionCascadeResonance.resonanceIndex,
    resonancePressureStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  cascadeResonanceStack.notes.forEach(n => diagnostics.push(n));
  const resonanceFusionPressure = computeResonanceFusionPressureIndex(
    resonancePressureStack.stackIndex,
    stackSynthesisFusion.fusionIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  resonanceFusionPressure.notes.forEach(n => diagnostics.push(n));
  const fusionConvergenceSynthesis = computeFusionConvergenceSynthesisIndex(
    stackSynthesisFusion.fusionIndex,
    fusionCascadeResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  fusionConvergenceSynthesis.notes.forEach(n => diagnostics.push(n));
  const stackResonancePressure = computeStackResonancePressureIndex(
    cascadeResonanceStack.stackIndex,
    resonanceFusionPressure.pressureIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  stackResonancePressure.notes.forEach(n => diagnostics.push(n));
  const pressureFusionSynthesis = computePressureFusionSynthesisIndex(
    resonanceFusionPressure.pressureIndex,
    fusionConvergenceSynthesis.synthesisIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureFusionSynthesis.notes.forEach(n => diagnostics.push(n));
  const synthesisStackConvergence = computeSynthesisStackConvergenceIndex(
    fusionConvergenceSynthesis.synthesisIndex,
    cascadeResonanceStack.stackIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  synthesisStackConvergence.notes.forEach(n => diagnostics.push(n));
  const stackFusionResonance = computeStackFusionResonanceIndex(
    stackResonancePressure.pressureIndex,
    pressureFusionSynthesis.synthesisIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  stackFusionResonance.notes.forEach(n => diagnostics.push(n));
  const fusionSynthesisPressure = computeFusionSynthesisPressureIndex(
    pressureFusionSynthesis.synthesisIndex,
    synthesisStackConvergence.convergenceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  fusionSynthesisPressure.notes.forEach(n => diagnostics.push(n));
  const synthesisCascadeConvergence = computeSynthesisCascadeConvergenceIndex(
    synthesisStackConvergence.convergenceIndex,
    stackResonancePressure.pressureIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  synthesisCascadeConvergence.notes.forEach(n => diagnostics.push(n));
  const fusionResonanceSynthesis = computeFusionResonanceSynthesisIndex(
    stackFusionResonance.resonanceIndex,
    fusionSynthesisPressure.pressureIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  fusionResonanceSynthesis.notes.forEach(n => diagnostics.push(n));
  const pressureCascadeConvergence = computePressureCascadeConvergenceIndex(
    fusionSynthesisPressure.pressureIndex,
    synthesisCascadeConvergence.convergenceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureCascadeConvergence.notes.forEach(n => diagnostics.push(n));
  const cascadeStackFusion = computeCascadeStackFusionIndex(
    synthesisCascadeConvergence.convergenceIndex,
    stackFusionResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  cascadeStackFusion.notes.forEach(n => diagnostics.push(n));
  const synthesisResonanceConvergence = computeSynthesisResonanceConvergenceIndex(
    fusionResonanceSynthesis.synthesisIndex,
    pressureCascadeConvergence.convergenceIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  synthesisResonanceConvergence.notes.forEach(n => diagnostics.push(n));
  const pressureStackFusion = computePressureStackFusionIndex(
    pressureCascadeConvergence.convergenceIndex,
    cascadeStackFusion.fusionIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureStackFusion.notes.forEach(n => diagnostics.push(n));
  const fusionStackSynthesis = computeFusionStackSynthesisIndex(
    cascadeStackFusion.fusionIndex,
    fusionResonanceSynthesis.synthesisIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  fusionStackSynthesis.notes.forEach(n => diagnostics.push(n));
  const resonanceConvergenceStack = computeResonanceConvergenceStackIndex(
    synthesisResonanceConvergence.convergenceIndex,
    pressureStackFusion.fusionIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  resonanceConvergenceStack.notes.forEach(n => diagnostics.push(n));
  const pressureStackSynthesis = computePressureStackSynthesisIndex(
    pressureStackFusion.fusionIndex,
    fusionStackSynthesis.synthesisIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureStackSynthesis.notes.forEach(n => diagnostics.push(n));
  const fusionStackResonance = computeFusionStackResonanceIndex(
    fusionStackSynthesis.synthesisIndex,
    synthesisResonanceConvergence.convergenceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  fusionStackResonance.notes.forEach(n => diagnostics.push(n));
  const convergenceStackSynthesis = computeConvergenceStackSynthesisIndex(
    resonanceConvergenceStack.stackIndex,
    pressureStackSynthesis.synthesisIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergenceStackSynthesis.notes.forEach(n => diagnostics.push(n));
  const stackSynthesisPressure = computeStackSynthesisPressureIndex(
    pressureStackSynthesis.synthesisIndex,
    fusionStackResonance.resonanceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  stackSynthesisPressure.notes.forEach(n => diagnostics.push(n));
  const fusionResonanceStack = computeFusionResonanceStackIndex(
    fusionStackResonance.resonanceIndex,
    resonanceConvergenceStack.stackIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  fusionResonanceStack.notes.forEach(n => diagnostics.push(n));
  const synthesisPressureConvergence = computeSynthesisPressureConvergenceIndex(
    convergenceStackSynthesis.synthesisIndex,
    stackSynthesisPressure.pressureIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  synthesisPressureConvergence.notes.forEach(n => diagnostics.push(n));
  const pressureFusionStack = computePressureFusionStackIndex(
    stackSynthesisPressure.pressureIndex,
    fusionResonanceStack.stackIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureFusionStack.notes.forEach(n => diagnostics.push(n));
  const resonanceSynthesisFusion = computeResonanceSynthesisFusionIndex(
    fusionResonanceStack.stackIndex,
    convergenceStackSynthesis.synthesisIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  resonanceSynthesisFusion.notes.forEach(n => diagnostics.push(n));
  state = {
    ...state,
    diagnostics,
    meta: {
      ...state.meta,
      frictionAlignmentGapIndex: frictionAlignmentGap.gapIndex,
      gapChurnResonanceIndex: gapChurnResonance.resonanceIndex,
      stackFrictionConvergenceIndex: stackFrictionConvergence.convergenceIndex,
      fusionResonanceCouplingIndex: fusionResonanceCoupling.couplingIndex,
      convergenceFusionStackIndex: convergenceFusionStack.stackIndex,
      resonanceAuditCascadeIndex: resonanceAuditCascade.cascadeIndex,
      couplingStackCascadeIndex: couplingStackCascade.cascadeIndex,
      stackCascadeAmplificationIndex: stackCascadeAmplification.amplificationIndex,
      cascadeCouplingSynthesisIndex: cascadeCouplingSynthesis.synthesisIndex,
      cascadeSynthesisFusionIndex: cascadeSynthesisFusion.fusionIndex,
      amplificationStackResonanceIndex: amplificationStackResonance.resonanceIndex,
      synthesisEscalationPressureIndex: synthesisEscalationPressure.pressureIndex,
      fusionResonanceConvergenceIndex: fusionResonanceConvergence.convergenceIndex,
      pressureFusionCascadeIndex: pressureFusionCascade.cascadeIndex,
      resonancePressureSynthesisIndex: resonancePressureSynthesis.synthesisIndex,
      convergenceCascadeSynthesisIndex: convergenceCascadeSynthesis.synthesisIndex,
      synthesisConvergenceStackIndex: synthesisConvergenceStack.stackIndex,
      cascadeResonanceAmplificationIndex: cascadeResonanceAmplification.amplificationIndex,
      synthesisStackAmplificationIndex: synthesisStackAmplification.amplificationIndex,
      amplificationConvergenceCascadeIndex: amplificationConvergenceCascade.cascadeIndex,
      stackSynthesisResonanceIndex: stackSynthesisResonance.resonanceIndex,
      stackAmplificationCascadeFusionIndex: stackAmplificationCascadeFusion.fusionIndex,
      resonanceAmplificationStackIndex: resonanceAmplificationStack.stackIndex,
      cascadeConvergenceResonanceIndex: cascadeConvergenceResonance.resonanceIndex,
      fusionStackConvergenceIndex: fusionStackConvergence.convergenceIndex,
      resonanceCascadeSynthesisIndex: resonanceCascadeSynthesis.synthesisIndex,
      convergenceAmplificationPressureIndex: convergenceAmplificationPressure.pressureIndex,
      convergenceSynthesisFusionIndex: convergenceSynthesisFusion.fusionIndex,
      pressureCascadeStackIndex: pressureCascadeStack.stackIndex,
      synthesisPressureResonanceIndex: synthesisPressureResonance.resonanceIndex,
      fusionCascadeStackIndex: fusionCascadeStack.stackIndex,
      resonancePressureCascadeIndex: resonancePressureCascade.cascadeIndex,
      synthesisFusionConvergenceIndex: synthesisFusionConvergence.convergenceIndex,
      stackCascadeResonanceIndex: stackCascadeResonance.resonanceIndex,
      cascadeConvergencePressureIndex: cascadeConvergencePressure.pressureIndex,
      convergenceFusionSynthesisIndex: convergenceFusionSynthesis.synthesisIndex,
      resonanceConvergenceFusionIndex: resonanceConvergenceFusion.fusionIndex,
      pressureSynthesisCascadeIndex: pressureSynthesisCascade.cascadeIndex,
      synthesisResonanceStackIndex: synthesisResonanceStack.stackIndex,
      convergenceFusionPressureIndex: convergenceFusionPressure.pressureIndex,
      synthesisCascadeStackIndex: synthesisCascadeStack.stackIndex,
      resonanceStackFusionIndex: resonanceStackFusion.fusionIndex,
      pressureStackResonanceIndex: pressureStackResonance.resonanceIndex,
      stackFusionCascadeIndex: stackFusionCascade.cascadeIndex,
      fusionCascadeConvergenceIndex: fusionCascadeConvergence.convergenceIndex,
      resonanceFusionStackIndex: resonanceFusionStack.stackIndex,
      fusionCascadePressureIndex: fusionCascadePressure.pressureIndex,
      stackConvergenceResonanceIndex: stackConvergenceResonance.resonanceIndex,
      fusionStackPressureIndex: fusionStackPressure.pressureIndex,
      pressureResonanceCascadeIndex: pressureResonanceCascade.cascadeIndex,
      stackSynthesisConvergenceIndex: stackSynthesisConvergence.convergenceIndex,
      pressureCascadeFusionIndex: pressureCascadeFusion.fusionIndex,
      cascadeSynthesisResonanceIndex: cascadeSynthesisResonance.resonanceIndex,
      convergencePressureStackIndex: convergencePressureStack.stackIndex,
      fusionCascadeResonanceIndex: fusionCascadeResonance.resonanceIndex,
      resonancePressureStackIndex: resonancePressureStack.stackIndex,
      stackSynthesisFusionIndex: stackSynthesisFusion.fusionIndex,
      cascadeResonanceStackIndex: cascadeResonanceStack.stackIndex,
      resonanceFusionPressureIndex: resonanceFusionPressure.pressureIndex,
      fusionConvergenceSynthesisIndex: fusionConvergenceSynthesis.synthesisIndex,
      stackResonancePressureIndex: stackResonancePressure.pressureIndex,
      pressureFusionSynthesisIndex: pressureFusionSynthesis.synthesisIndex,
      synthesisStackConvergenceIndex: synthesisStackConvergence.convergenceIndex,
      stackFusionResonanceIndex: stackFusionResonance.resonanceIndex,
      fusionSynthesisPressureIndex: fusionSynthesisPressure.pressureIndex,
      synthesisCascadeConvergenceIndex: synthesisCascadeConvergence.convergenceIndex,
      fusionResonanceSynthesisIndex: fusionResonanceSynthesis.synthesisIndex,
      pressureCascadeConvergenceIndex: pressureCascadeConvergence.convergenceIndex,
      cascadeStackFusionIndex: cascadeStackFusion.fusionIndex,
      synthesisResonanceConvergenceIndex: synthesisResonanceConvergence.convergenceIndex,
      pressureStackFusionIndex: pressureStackFusion.fusionIndex,
      fusionStackSynthesisIndex: fusionStackSynthesis.synthesisIndex,
      resonanceConvergenceStackIndex: resonanceConvergenceStack.stackIndex,
      pressureStackSynthesisIndex: pressureStackSynthesis.synthesisIndex,
      fusionStackResonanceIndex: fusionStackResonance.resonanceIndex,
      convergenceStackSynthesisIndex: convergenceStackSynthesis.synthesisIndex,
      stackSynthesisPressureIndex: stackSynthesisPressure.pressureIndex,
      fusionResonanceStackIndex: fusionResonanceStack.stackIndex,
      synthesisPressureConvergenceIndex: synthesisPressureConvergence.convergenceIndex,
      pressureFusionStackIndex: pressureFusionStack.stackIndex,
      resonanceSynthesisFusionIndex: resonanceSynthesisFusion.fusionIndex,
    },
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
