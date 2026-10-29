import { evaluateHandoffSla, summarizeDualTeamHandoffSla } from './handoff-sla-monitor.ts';
import { combineDualTeamMutexStability } from './mutex-stability-index.ts';
import {
  combineDualTeamCoordinationComposite,
} from './coordination-composite-score.ts';
import { combineDualTeamLeaseHealth } from './lease-expiry-watchdog.ts';
import { combineDualTeamRoleChurn } from './role-churn-index.ts';
import { combineDualTeamDirectiveCollision } from './directive-collision-index.ts';
import { combineDualTeamHandoffIntegrity } from './handoff-chain-integrity.ts';
import { combineDualTeamEscalationTier } from './coordination-escalation-tier.ts';
import { combineDualTeamRecoveryUrgency } from './coordination-recovery-playbook.ts';
import { combineDualTeamPriorityInversion } from './directive-priority-inversion.ts';
import { combineDualTeamHandoffOrphans } from './handoff-orphan-detector.ts';
import { combineDualTeamWorkstreamDeadlocks } from './workstream-deadlock-detector.ts';
import { combineDualTeamLeaseContention } from './lease-contention-index.ts';
import { combineDualTeamCoordinationSaturation } from './coordination-saturation-gauge.ts';
import { combineDualTeamMutexLeaseDivergence } from './mutex-lease-divergence-index.ts';
import { combineDualTeamHandoffCascadeRisk } from './handoff-cascade-analyzer.ts';
import { combineDualTeamSuppressionBacklog } from './suppression-backlog-index.ts';
import { combineDualTeamReconcileDrift } from './reconcile-drift-index.ts';
import { combineDualTeamArbitrationPressure } from './arbitration-pressure-index.ts';
import { combineDualTeamPersistenceChurn } from './persistence-churn-gauge.ts';
import { combineDualTeamDuplicateGuardPressure } from './duplicate-guard-pressure.ts';
import { combineDualTeamRoleTaskCoverageGap } from './role-task-coverage-gap.ts';
import { combineDualTeamCompositeHealthGradient } from './composite-health-gradient.ts';
import { combineDualTeamHandoffReadinessSpread } from './handoff-readiness-spread.ts';
import { combineDualTeamWorkstreamParallelism } from './workstream-parallelism-index.ts';
import { combineDualTeamEscalationRecoveryAlignment } from './escalation-recovery-alignment.ts';
import { combineDualTeamAuditPressure } from './audit-pressure-index.ts';
import { combineDualTeamRoleLockFriction } from './role-lock-friction-index.ts';
import { combineDualTeamDirectiveConstraintDensity } from './directive-constraint-density.ts';
import { combineDualTeamCrossTeamRejection } from './cross-team-rejection-index.ts';
import { combineDualTeamHandoffSlaVelocity } from './handoff-sla-velocity-index.ts';
import { combineDualTeamRecoveryActionBreadth } from './recovery-action-breadth.ts';
import { combineDualTeamDirectiveQuotaExhaustion } from './directive-quota-exhaustion-index.ts';
import { combineDualTeamCapacityImbalance } from './capacity-imbalance-index.ts';
import { combineDualTeamWorkstreamBarrierStaleness } from './workstream-barrier-staleness-index.ts';
import { combineDualTeamWorkstreamDeadlockPressure } from './workstream-deadlock-pressure-index.ts';
import { combineDualTeamSuppressionQuotaCoupling } from './suppression-quota-coupling-index.ts';
import { combineDualTeamHandoffLeaseOverlap } from './handoff-lease-overlap-index.ts';
import { combineDualTeamSaturationDeadlockCoupling } from './saturation-deadlock-coupling-index.ts';
import { combineDualTeamCascadeLeaseConvergence } from './cascade-lease-convergence-index.ts';
import { combineDualTeamGradientAuditTension } from './gradient-audit-tension-index.ts';
import { combineDualTeamEscalationSaturationStack } from './escalation-saturation-stack-index.ts';
import { combineDualTeamRecoveryCascadeMismatch } from './recovery-cascade-mismatch-index.ts';
import { combineDualTeamPersistenceGradientFriction } from './persistence-gradient-friction-index.ts';
import { combineDualTeamStackMismatchCoupling } from './stack-mismatch-coupling-index.ts';
import { combineDualTeamAuditStackAmplification } from './audit-stack-amplification-index.ts';
import { combineDualTeamFrictionAlignmentGap } from './friction-alignment-gap-index.ts';
import { combineDualTeamCouplingAmplificationFusion } from './coupling-amplification-fusion-index.ts';
import { combineDualTeamGapChurnResonance } from './gap-churn-resonance-index.ts';
import { combineDualTeamStackFrictionConvergence } from './stack-friction-convergence-index.ts';
import { evaluateTeamMultiAgentLayer } from './multi-agent-state.ts';
import {
  auditCrossTeamMutexIsolation,
  assertTasksTeamScoped,
  teamActorScope,
} from './team-boundary-guard.ts';
import {
  TeamMultiAgentEvaluation,
  TeamMultiAgentInputs,
  TeamMultiAgentLayerState,
} from './types.ts';

export interface DualTeamMultiAgentResult {
  friendly: TeamMultiAgentEvaluation;
  enemy: TeamMultiAgentEvaluation | null;
  isolationIssues: string[];
  byTeam: Record<string, TeamMultiAgentLayerState>;
  handoffSlaCombinedCompliance: number;
  mutexStabilityCombined: number;
  coordinationCompositeCombined: number;
  roleChurnCombined: number;
  leaseHealthCombined: number;
  directiveCollisionCombined: number;
  handoffIntegrityCombined: number;
  escalationTierCombined: number;
  recoveryUrgencyCombined: number;
  priorityInversionCombined: number;
  handoffOrphanCombined: number;
  workstreamDeadlockCombined: number;
  leaseContentionCombined: number;
  coordinationSaturationCombined: number;
  mutexLeaseDivergenceCombined: number;
  handoffCascadeRiskCombined: number;
  suppressionBacklogCombined: number;
  reconcileDriftCombined: number;
  arbitrationPressureCombined: number;
  persistenceChurnCombined: number;
  duplicateGuardPressureCombined: number;
  roleTaskCoverageGapCombined: number;
  compositeHealthGradientCombined: number;
  handoffReadinessSpreadCombined: number;
  workstreamParallelismCombined: number;
  escalationRecoveryAlignmentCombined: number;
  auditPressureCombined: number;
  roleLockFrictionCombined: number;
  directiveConstraintDensityCombined: number;
  crossTeamRejectionCombined: number;
  handoffSlaVelocityCombined: number;
  recoveryActionBreadthCombined: number;
  directiveQuotaExhaustionCombined: number;
  capacityImbalanceCombined: number;
  workstreamBarrierStalenessCombined: number;
  workstreamDeadlockPressureCombined: number;
  suppressionQuotaCouplingCombined: number;
  handoffLeaseOverlapCombined: number;
  saturationDeadlockCouplingCombined: number;
  cascadeLeaseConvergenceCombined: number;
  gradientAuditTensionCombined: number;
  escalationSaturationStackCombined: number;
  recoveryCascadeMismatchCombined: number;
  persistenceGradientFrictionCombined: number;
  stackMismatchCouplingCombined: number;
  auditStackAmplificationCombined: number;
  frictionAlignmentGapCombined: number;
  couplingAmplificationFusionCombined: number;
  gapChurnResonanceCombined: number;
  stackFrictionConvergenceCombined: number;
}

/**
 * Evaluate friendly + optional enemy team layers with cross-team isolation checks.
 * Planning-only: each team keeps its own mutex namespace (no shared state mutation).
 */
export function evaluateDualTeamMultiAgentLayers(
  friendlyInputs: TeamMultiAgentInputs,
  enemyInputs: TeamMultiAgentInputs | null,
  storedByTeam: Record<string, TeamMultiAgentLayerState | null> = {},
): DualTeamMultiAgentResult {
  const friendlyScope = teamActorScope(friendlyInputs);
  const boundaryIssues = assertTasksTeamScoped(friendlyInputs, friendlyScope);
  const friendlyProposals = friendlyInputs.directiveProposals || [];
  const friendly = evaluateTeamMultiAgentLayer(
    {
      ...friendlyInputs,
      directiveProposals: friendlyProposals,
    },
    storedByTeam[friendlyInputs.teamId] ?? null,
  );
  friendly.coordinationIssues.push(...boundaryIssues);

  if (!enemyInputs) {
    const friendlySla = evaluateHandoffSla(
      friendlyInputs.turn,
      friendly.state.coordination.handoffs,
    );
    return {
      friendly,
      enemy: null,
      isolationIssues: boundaryIssues,
      byTeam: { [friendlyInputs.teamId]: friendly.state },
      handoffSlaCombinedCompliance: friendlySla.complianceScore,
      mutexStabilityCombined: friendly.state.meta.mutexStabilityIndex ?? 100,
      coordinationCompositeCombined: friendly.state.meta.coordinationCompositeScore ?? 100,
      roleChurnCombined: friendly.state.meta.roleChurnIndex ?? 0,
      leaseHealthCombined: friendly.state.meta.leaseHealthScore ?? 100,
      directiveCollisionCombined: friendly.state.meta.directiveCollisionIndex ?? 0,
      handoffIntegrityCombined: friendly.state.meta.handoffIntegrityScore ?? 100,
      escalationTierCombined: friendly.state.meta.coordinationEscalationTier ?? 0,
      recoveryUrgencyCombined: friendly.state.meta.coordinationRecoveryUrgency ?? 0,
      priorityInversionCombined: friendly.state.meta.directivePriorityInversionIndex ?? 0,
      handoffOrphanCombined: friendly.state.meta.handoffOrphanCount ?? 0,
      workstreamDeadlockCombined: friendly.state.meta.workstreamDeadlockCount ?? 0,
      leaseContentionCombined: friendly.state.meta.leaseContentionIndex ?? 0,
      coordinationSaturationCombined: friendly.state.meta.coordinationSaturationIndex ?? 0,
      mutexLeaseDivergenceCombined: friendly.state.meta.mutexLeaseDivergenceIndex ?? 0,
      handoffCascadeRiskCombined: friendly.state.meta.handoffCascadeRiskIndex ?? 0,
      suppressionBacklogCombined: friendly.state.meta.suppressionBacklogIndex ?? 0,
      reconcileDriftCombined: friendly.state.meta.reconcileDriftIndex ?? 0,
      arbitrationPressureCombined: friendly.state.meta.arbitrationPressureIndex ?? 0,
      persistenceChurnCombined: friendly.state.meta.persistenceChurnIndex ?? 0,
      duplicateGuardPressureCombined: friendly.state.meta.duplicateGuardPressureIndex ?? 0,
      roleTaskCoverageGapCombined: friendly.state.meta.roleTaskCoverageGapIndex ?? 0,
      compositeHealthGradientCombined: friendly.state.meta.compositeHealthGradientIndex ?? 0,
      handoffReadinessSpreadCombined: friendly.state.meta.handoffReadinessSpreadIndex ?? 0,
      workstreamParallelismCombined: friendly.state.meta.workstreamParallelismIndex ?? 0,
      escalationRecoveryAlignmentCombined: friendly.state.meta.escalationRecoveryAlignmentIndex ?? 0,
      auditPressureCombined: friendly.state.meta.auditPressureIndex ?? 0,
      roleLockFrictionCombined: friendly.state.meta.roleLockFrictionIndex ?? 0,
      directiveConstraintDensityCombined: friendly.state.meta.directiveConstraintDensityIndex ?? 0,
      crossTeamRejectionCombined: friendly.state.meta.crossTeamRejectionIndex ?? 0,
      handoffSlaVelocityCombined: friendly.state.meta.handoffSlaVelocityIndex ?? 0,
      recoveryActionBreadthCombined: friendly.state.meta.recoveryActionBreadthIndex ?? 0,
      directiveQuotaExhaustionCombined: friendly.state.meta.directiveQuotaExhaustionIndex ?? 0,
      capacityImbalanceCombined: friendly.state.meta.capacityImbalanceIndex ?? 0,
      workstreamBarrierStalenessCombined: friendly.state.meta.workstreamBarrierStalenessIndex ?? 0,
      workstreamDeadlockPressureCombined: friendly.state.meta.workstreamDeadlockPressureIndex ?? 0,
      suppressionQuotaCouplingCombined: friendly.state.meta.suppressionQuotaCouplingIndex ?? 0,
      handoffLeaseOverlapCombined: friendly.state.meta.handoffLeaseOverlapIndex ?? 0,
      saturationDeadlockCouplingCombined: friendly.state.meta.saturationDeadlockCouplingIndex ?? 0,
      cascadeLeaseConvergenceCombined: friendly.state.meta.cascadeLeaseConvergenceIndex ?? 0,
      gradientAuditTensionCombined: friendly.state.meta.gradientAuditTensionIndex ?? 0,
      escalationSaturationStackCombined: friendly.state.meta.escalationSaturationStackIndex ?? 0,
      recoveryCascadeMismatchCombined: friendly.state.meta.recoveryCascadeMismatchIndex ?? 0,
      persistenceGradientFrictionCombined: friendly.state.meta.persistenceGradientFrictionIndex ?? 0,
      stackMismatchCouplingCombined: friendly.state.meta.stackMismatchCouplingIndex ?? 0,
      auditStackAmplificationCombined: friendly.state.meta.auditStackAmplificationIndex ?? 0,
      frictionAlignmentGapCombined: friendly.state.meta.frictionAlignmentGapIndex ?? 0,
      couplingAmplificationFusionCombined: friendly.state.meta.couplingAmplificationFusionIndex ?? 0,
      gapChurnResonanceCombined: friendly.state.meta.gapChurnResonanceIndex ?? 0,
      stackFrictionConvergenceCombined: friendly.state.meta.stackFrictionConvergenceIndex ?? 0,
    };
  }

  const enemyScope = teamActorScope(enemyInputs);
  const enemyBoundary = assertTasksTeamScoped(enemyInputs, enemyScope);
  const enemy = evaluateTeamMultiAgentLayer(enemyInputs, storedByTeam[enemyInputs.teamId] ?? null);
  enemy.coordinationIssues.push(...enemyBoundary);

  const mutexIssues = auditCrossTeamMutexIsolation(
    friendly.state.coordination.mutexRegions,
    enemy.state.coordination.mutexRegions,
  );

  const crossActorIssues: string[] = [];
  if ([...friendlyScope].some(id => enemyScope.has(id))) {
    crossActorIssues.push('Friendly and enemy teams share actor ids — invalid isolation');
  }

  const isolationIssues = [...boundaryIssues, ...enemyBoundary, ...mutexIssues, ...crossActorIssues];

  const friendlySla = evaluateHandoffSla(friendlyInputs.turn, friendly.state.coordination.handoffs);
  const enemySla = evaluateHandoffSla(enemyInputs.turn, enemy.state.coordination.handoffs);
  const slaSummary = summarizeDualTeamHandoffSla(
    friendlyInputs.teamId,
    friendlySla,
    enemyInputs.teamId,
    enemySla,
  );

  return {
    friendly,
    enemy,
    isolationIssues,
    byTeam: {
      [friendlyInputs.teamId]: friendly.state,
      [enemyInputs.teamId]: enemy.state,
    },
    handoffSlaCombinedCompliance: slaSummary.combinedCompliance,
    mutexStabilityCombined: combineDualTeamMutexStability(
      {
        stabilityIndex: friendly.state.meta.mutexStabilityIndex ?? 100,
        volatileRegionIds: friendly.state.meta.volatileMutexRegionIds ?? [],
        stableRegionCount: 0,
        trackedTurns: friendly.state.meta.mutexHistory.length,
        notes: [],
      },
      {
        stabilityIndex: enemy.state.meta.mutexStabilityIndex ?? 100,
        volatileRegionIds: enemy.state.meta.volatileMutexRegionIds ?? [],
        stableRegionCount: 0,
        trackedTurns: enemy.state.meta.mutexHistory.length,
        notes: [],
      },
    ),
    coordinationCompositeCombined: combineDualTeamCoordinationComposite(
      friendly.state.meta.coordinationCompositeScore ?? 100,
      enemy.state.meta.coordinationCompositeScore ?? 100,
    ),
    roleChurnCombined: combineDualTeamRoleChurn(
      {
        churnIndex: friendly.state.meta.roleChurnIndex ?? 0,
        churnedActorIds: friendly.state.meta.roleChurnActorIds ?? [],
        stableActorCount: 0,
        notes: [],
      },
      {
        churnIndex: enemy.state.meta.roleChurnIndex ?? 0,
        churnedActorIds: enemy.state.meta.roleChurnActorIds ?? [],
        stableActorCount: 0,
        notes: [],
      },
    ),
    leaseHealthCombined: combineDualTeamLeaseHealth(
      {
        leaseHealthScore: friendly.state.meta.leaseHealthScore ?? 100,
        expiringLeaseIds: friendly.state.meta.expiringLeaseIds ?? [],
        expiredLeaseIds: friendly.state.meta.expiredLeaseIds ?? [],
        notes: [],
      },
      {
        leaseHealthScore: enemy.state.meta.leaseHealthScore ?? 100,
        expiringLeaseIds: enemy.state.meta.expiringLeaseIds ?? [],
        expiredLeaseIds: enemy.state.meta.expiredLeaseIds ?? [],
        notes: [],
      },
    ),
    directiveCollisionCombined: combineDualTeamDirectiveCollision(
      {
        collisionIndex: friendly.state.meta.directiveCollisionIndex ?? 0,
        collidingProposalIds: friendly.state.meta.collidingDirectiveIds ?? [],
        notes: [],
      },
      {
        collisionIndex: enemy.state.meta.directiveCollisionIndex ?? 0,
        collidingProposalIds: enemy.state.meta.collidingDirectiveIds ?? [],
        notes: [],
      },
    ),
    handoffIntegrityCombined: combineDualTeamHandoffIntegrity(
      {
        integrityScore: friendly.state.meta.handoffIntegrityScore ?? 100,
        brokenHandoffIds: friendly.state.meta.brokenHandoffIds ?? [],
        duplicatePendingTaskIds: friendly.state.meta.duplicatePendingHandoffTaskIds ?? [],
        notes: [],
      },
      {
        integrityScore: enemy.state.meta.handoffIntegrityScore ?? 100,
        brokenHandoffIds: enemy.state.meta.brokenHandoffIds ?? [],
        duplicatePendingTaskIds: enemy.state.meta.duplicatePendingHandoffTaskIds ?? [],
        notes: [],
      },
    ),
    escalationTierCombined: combineDualTeamEscalationTier(
      friendly.state.meta.coordinationEscalationTier ?? 0,
      enemy.state.meta.coordinationEscalationTier ?? 0,
    ),
    recoveryUrgencyCombined: combineDualTeamRecoveryUrgency(
      friendly.state.meta.coordinationRecoveryUrgency ?? 0,
      enemy.state.meta.coordinationRecoveryUrgency ?? 0,
    ),
    priorityInversionCombined: combineDualTeamPriorityInversion(
      friendly.state.meta.directivePriorityInversionIndex ?? 0,
      enemy.state.meta.directivePriorityInversionIndex ?? 0,
    ),
    handoffOrphanCombined: combineDualTeamHandoffOrphans(
      friendly.state.meta.handoffOrphanCount ?? 0,
      enemy.state.meta.handoffOrphanCount ?? 0,
    ),
    workstreamDeadlockCombined: combineDualTeamWorkstreamDeadlocks(
      friendly.state.meta.workstreamDeadlockCount ?? 0,
      enemy.state.meta.workstreamDeadlockCount ?? 0,
    ),
    leaseContentionCombined: combineDualTeamLeaseContention(
      friendly.state.meta.leaseContentionIndex ?? 0,
      enemy.state.meta.leaseContentionIndex ?? 0,
    ),
    coordinationSaturationCombined: combineDualTeamCoordinationSaturation(
      friendly.state.meta.coordinationSaturationIndex ?? 0,
      enemy.state.meta.coordinationSaturationIndex ?? 0,
    ),
    mutexLeaseDivergenceCombined: combineDualTeamMutexLeaseDivergence(
      friendly.state.meta.mutexLeaseDivergenceIndex ?? 0,
      enemy.state.meta.mutexLeaseDivergenceIndex ?? 0,
    ),
    handoffCascadeRiskCombined: combineDualTeamHandoffCascadeRisk(
      friendly.state.meta.handoffCascadeRiskIndex ?? 0,
      enemy.state.meta.handoffCascadeRiskIndex ?? 0,
    ),
    suppressionBacklogCombined: combineDualTeamSuppressionBacklog(
      friendly.state.meta.suppressionBacklogIndex ?? 0,
      enemy.state.meta.suppressionBacklogIndex ?? 0,
    ),
    reconcileDriftCombined: combineDualTeamReconcileDrift(
      friendly.state.meta.reconcileDriftIndex ?? 0,
      enemy.state.meta.reconcileDriftIndex ?? 0,
    ),
    arbitrationPressureCombined: combineDualTeamArbitrationPressure(
      friendly.state.meta.arbitrationPressureIndex ?? 0,
      enemy.state.meta.arbitrationPressureIndex ?? 0,
    ),
    persistenceChurnCombined: combineDualTeamPersistenceChurn(
      friendly.state.meta.persistenceChurnIndex ?? 0,
      enemy.state.meta.persistenceChurnIndex ?? 0,
    ),
    duplicateGuardPressureCombined: combineDualTeamDuplicateGuardPressure(
      friendly.state.meta.duplicateGuardPressureIndex ?? 0,
      enemy.state.meta.duplicateGuardPressureIndex ?? 0,
    ),
    roleTaskCoverageGapCombined: combineDualTeamRoleTaskCoverageGap(
      friendly.state.meta.roleTaskCoverageGapIndex ?? 0,
      enemy.state.meta.roleTaskCoverageGapIndex ?? 0,
    ),
    compositeHealthGradientCombined: combineDualTeamCompositeHealthGradient(
      friendly.state.meta.compositeHealthGradientIndex ?? 0,
      enemy.state.meta.compositeHealthGradientIndex ?? 0,
    ),
    handoffReadinessSpreadCombined: combineDualTeamHandoffReadinessSpread(
      friendly.state.meta.handoffReadinessSpreadIndex ?? 0,
      enemy.state.meta.handoffReadinessSpreadIndex ?? 0,
    ),
    workstreamParallelismCombined: combineDualTeamWorkstreamParallelism(
      friendly.state.meta.workstreamParallelismIndex ?? 0,
      enemy.state.meta.workstreamParallelismIndex ?? 0,
    ),
    escalationRecoveryAlignmentCombined: combineDualTeamEscalationRecoveryAlignment(
      friendly.state.meta.escalationRecoveryAlignmentIndex ?? 0,
      enemy.state.meta.escalationRecoveryAlignmentIndex ?? 0,
    ),
    auditPressureCombined: combineDualTeamAuditPressure(
      friendly.state.meta.auditPressureIndex ?? 0,
      enemy.state.meta.auditPressureIndex ?? 0,
    ),
    roleLockFrictionCombined: combineDualTeamRoleLockFriction(
      friendly.state.meta.roleLockFrictionIndex ?? 0,
      enemy.state.meta.roleLockFrictionIndex ?? 0,
    ),
    directiveConstraintDensityCombined: combineDualTeamDirectiveConstraintDensity(
      friendly.state.meta.directiveConstraintDensityIndex ?? 0,
      enemy.state.meta.directiveConstraintDensityIndex ?? 0,
    ),
    crossTeamRejectionCombined: combineDualTeamCrossTeamRejection(
      friendly.state.meta.crossTeamRejectionIndex ?? 0,
      enemy.state.meta.crossTeamRejectionIndex ?? 0,
    ),
    handoffSlaVelocityCombined: combineDualTeamHandoffSlaVelocity(
      friendly.state.meta.handoffSlaVelocityIndex ?? 0,
      enemy.state.meta.handoffSlaVelocityIndex ?? 0,
    ),
    recoveryActionBreadthCombined: combineDualTeamRecoveryActionBreadth(
      friendly.state.meta.recoveryActionBreadthIndex ?? 0,
      enemy.state.meta.recoveryActionBreadthIndex ?? 0,
    ),
    directiveQuotaExhaustionCombined: combineDualTeamDirectiveQuotaExhaustion(
      friendly.state.meta.directiveQuotaExhaustionIndex ?? 0,
      enemy.state.meta.directiveQuotaExhaustionIndex ?? 0,
    ),
    capacityImbalanceCombined: combineDualTeamCapacityImbalance(
      friendly.state.meta.capacityImbalanceIndex ?? 0,
      enemy.state.meta.capacityImbalanceIndex ?? 0,
    ),
    workstreamBarrierStalenessCombined: combineDualTeamWorkstreamBarrierStaleness(
      friendly.state.meta.workstreamBarrierStalenessIndex ?? 0,
      enemy.state.meta.workstreamBarrierStalenessIndex ?? 0,
    ),
    workstreamDeadlockPressureCombined: combineDualTeamWorkstreamDeadlockPressure(
      friendly.state.meta.workstreamDeadlockPressureIndex ?? 0,
      enemy.state.meta.workstreamDeadlockPressureIndex ?? 0,
    ),
    suppressionQuotaCouplingCombined: combineDualTeamSuppressionQuotaCoupling(
      friendly.state.meta.suppressionQuotaCouplingIndex ?? 0,
      enemy.state.meta.suppressionQuotaCouplingIndex ?? 0,
    ),
    handoffLeaseOverlapCombined: combineDualTeamHandoffLeaseOverlap(
      friendly.state.meta.handoffLeaseOverlapIndex ?? 0,
      enemy.state.meta.handoffLeaseOverlapIndex ?? 0,
    ),
    saturationDeadlockCouplingCombined: combineDualTeamSaturationDeadlockCoupling(
      friendly.state.meta.saturationDeadlockCouplingIndex ?? 0,
      enemy.state.meta.saturationDeadlockCouplingIndex ?? 0,
    ),
    cascadeLeaseConvergenceCombined: combineDualTeamCascadeLeaseConvergence(
      friendly.state.meta.cascadeLeaseConvergenceIndex ?? 0,
      enemy.state.meta.cascadeLeaseConvergenceIndex ?? 0,
    ),
    gradientAuditTensionCombined: combineDualTeamGradientAuditTension(
      friendly.state.meta.gradientAuditTensionIndex ?? 0,
      enemy.state.meta.gradientAuditTensionIndex ?? 0,
    ),
    escalationSaturationStackCombined: combineDualTeamEscalationSaturationStack(
      friendly.state.meta.escalationSaturationStackIndex ?? 0,
      enemy.state.meta.escalationSaturationStackIndex ?? 0,
    ),
    recoveryCascadeMismatchCombined: combineDualTeamRecoveryCascadeMismatch(
      friendly.state.meta.recoveryCascadeMismatchIndex ?? 0,
      enemy.state.meta.recoveryCascadeMismatchIndex ?? 0,
    ),
    persistenceGradientFrictionCombined: combineDualTeamPersistenceGradientFriction(
      friendly.state.meta.persistenceGradientFrictionIndex ?? 0,
      enemy.state.meta.persistenceGradientFrictionIndex ?? 0,
    ),
    stackMismatchCouplingCombined: combineDualTeamStackMismatchCoupling(
      friendly.state.meta.stackMismatchCouplingIndex ?? 0,
      enemy.state.meta.stackMismatchCouplingIndex ?? 0,
    ),
    auditStackAmplificationCombined: combineDualTeamAuditStackAmplification(
      friendly.state.meta.auditStackAmplificationIndex ?? 0,
      enemy.state.meta.auditStackAmplificationIndex ?? 0,
    ),
    frictionAlignmentGapCombined: combineDualTeamFrictionAlignmentGap(
      friendly.state.meta.frictionAlignmentGapIndex ?? 0,
      enemy.state.meta.frictionAlignmentGapIndex ?? 0,
    ),
    couplingAmplificationFusionCombined: combineDualTeamCouplingAmplificationFusion(
      friendly.state.meta.couplingAmplificationFusionIndex ?? 0,
      enemy.state.meta.couplingAmplificationFusionIndex ?? 0,
    ),
    gapChurnResonanceCombined: combineDualTeamGapChurnResonance(
      friendly.state.meta.gapChurnResonanceIndex ?? 0,
      enemy.state.meta.gapChurnResonanceIndex ?? 0,
    ),
    stackFrictionConvergenceCombined: combineDualTeamStackFrictionConvergence(
      friendly.state.meta.stackFrictionConvergenceIndex ?? 0,
      enemy.state.meta.stackFrictionConvergenceIndex ?? 0,
    ),
  };
}
