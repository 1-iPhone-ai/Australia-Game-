import { reservationKeyForRegionAction } from './duplicate-action-guard.ts';
import { detectIllegalSharedExclusiveTasks } from './role-assignment-engine.ts';
import {
  AGENT18_LIMITS,
  CoordinationAuditFinding,
  TeamMultiAgentInputs,
  TeamMultiAgentLayerState,
  TeamMultiAgentCoordinationMeta,
} from './types.ts';

function summarizeAudit(findings: CoordinationAuditFinding[]): TeamMultiAgentCoordinationMeta['auditSummary'] {
  return {
    errors: findings.filter(f => f.severity === 'error').length,
    warnings: findings.filter(f => f.severity === 'warning').length,
    info: findings.filter(f => f.severity === 'info').length,
  };
}

export function emptyCoordinationMeta(): TeamMultiAgentCoordinationMeta {
  return {
    directiveConstraints: {},
    suppressedDirectiveIds: [],
    auditSummary: { errors: 0, warnings: 0, info: 0 },
    lastReconcileStable: true,
    thrashingRegions: [],
    mutexHistory: [],
  };
}

export function auditTeamMultiAgentLayer(
  state: TeamMultiAgentLayerState,
  inputs: TeamMultiAgentInputs,
): CoordinationAuditFinding[] {
  const findings: CoordinationAuditFinding[] = [];
  const push = (f: Omit<CoordinationAuditFinding, 'id'>) => {
    if (findings.length >= AGENT18_LIMITS.maxAuditFindings) return;
    findings.push({ ...f, id: `audit_${findings.length}_${f.severity}` });
  };

  detectIllegalSharedExclusiveTasks(inputs.tasks).forEach(msg =>
    push({ severity: 'error', message: msg, actorIds: [], regionId: null }),
  );

  Object.entries(state.coordination.mutexRegions).forEach(([regionId, holderId]) => {
    const role = state.roles.find(r => r.actorId === holderId);
    const task = inputs.tasks.find(
      t => t.regionId === regionId && t.assignedActorIds.includes(holderId),
    );
    if (!task) {
      push({
        severity: 'warning',
        message: `Mutex holder ${holderId} has no assigned task for ${regionId}`,
        actorIds: [holderId],
        regionId,
      });
    }
    if (role && role.primaryRole === 'support') {
      push({
        severity: 'warning',
        message: `Support role holds mutex for ${regionId} — verify handoff`,
        actorIds: [holderId],
        regionId,
      });
    }
    const resKey = reservationKeyForRegionAction(regionId, 'region_deposit');
    const reservation = state.duplicateGuard.reservations[resKey];
    if (reservation && reservation.holderActorId !== holderId) {
      push({
        severity: 'error',
        message: `Reservation holder ${reservation.holderActorId} disagrees with mutex ${holderId}`,
        actorIds: [holderId, reservation.holderActorId],
        regionId,
      });
    }
  });

  state.coordination.arbitrationLog.forEach(entry => {
    if (entry.regionId && state.coordination.mutexRegions[entry.regionId] !== entry.winnerActorId) {
      push({
        severity: 'error',
        message: `Arbitration winner ${entry.winnerActorId} does not match mutex for ${entry.regionId}`,
        actorIds: [entry.winnerActorId],
        regionId: entry.regionId,
      });
    }
  });

  state.coordination.handoffs
    .filter(h => h.status === 'pending')
    .forEach(h => {
      const task = inputs.tasks.find(t => t.id === h.taskId);
      if (!task || task.status !== 'blocked') {
        push({
          severity: 'info',
          message: `Handoff ${h.id} pending without blocked task ${h.taskId}`,
          actorIds: [h.fromActorId, h.toActorId],
          regionId: h.regionId,
        });
      }
    });

  state.coordination.workstreams.forEach(ws => {
    ws.actorIds.forEach(id => {
      const role = state.roles.find(r => r.actorId === id);
      if (!role || role.taskIds.length === 0) {
        push({
          severity: 'warning',
          message: `Workstream ${ws.id} includes idle actor ${id}`,
          actorIds: [id],
          regionId: null,
        });
      }
    });
  });

  if (state.coordination.warnings.length > 3) {
    push({
      severity: 'warning',
      message: `${state.coordination.warnings.length} coordination warnings active`,
      actorIds: [],
      regionId: null,
    });
  }

  if (state.meta.thrashingRegions.length > 0) {
    push({
      severity: 'error',
      message: `Mutex thrashing on ${state.meta.thrashingRegions.join(', ')}`,
      actorIds: [],
      regionId: state.meta.thrashingRegions[0] || null,
    });
  }

  if (state.meta.lastReconcileStable === false) {
    push({
      severity: 'warning',
      message: 'Coordination plan changed materially since last evaluation',
      actorIds: [],
      regionId: null,
    });
  }

  const suppressRate =
    state.meta.suppressedDirectiveIds.length /
    Math.max(1, state.meta.suppressedDirectiveIds.length + Object.keys(state.meta.directiveConstraints).length);
  if (state.meta.suppressedDirectiveIds.length >= 3 && suppressRate > 0.5) {
    push({
      severity: 'info',
      message: `High directive suppression rate (${state.meta.suppressedDirectiveIds.length} suppressed)`,
      actorIds: [],
      regionId: null,
    });
  }

  if (state.meta.overdueHandoffIds && state.meta.overdueHandoffIds.length > 0) {
    push({
      severity: 'warning',
      message: `Handoff SLA overdue: ${state.meta.overdueHandoffIds.join(', ')}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (state.meta.overloadedActorIds && state.meta.overloadedActorIds.length > 0) {
    push({
      severity: 'info',
      message: `Capacity overload: ${state.meta.overloadedActorIds.join(', ')}`,
      actorIds: state.meta.overloadedActorIds,
      regionId: null,
    });
  }

  if (state.meta.notReadyHandoffIds && state.meta.notReadyHandoffIds.length > 0) {
    push({
      severity: 'warning',
      message: `Handoff targets not ready: ${state.meta.notReadyHandoffIds.join(', ')}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.mutexStabilityIndex === 'number' &&
    state.meta.mutexStabilityIndex < 50 &&
    (state.meta.volatileMutexRegionIds?.length ?? 0) > 0
  ) {
    push({
      severity: 'warning',
      message: `Low mutex stability (${state.meta.mutexStabilityIndex}) on ${state.meta.volatileMutexRegionIds!.join(', ')}`,
      actorIds: [],
      regionId: state.meta.volatileMutexRegionIds![0] || null,
    });
  }

  if (state.meta.stalledWorkstreamIds && state.meta.stalledWorkstreamIds.length > 0) {
    push({
      severity: 'warning',
      message: `Workstream barrier stall: ${state.meta.stalledWorkstreamIds.join(', ')}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.roleChurnIndex === 'number' && state.meta.roleChurnIndex >= 50) {
    push({
      severity: 'warning',
      message: `High role churn (${state.meta.roleChurnIndex}) on ${(state.meta.roleChurnActorIds || []).join(', ') || 'actors'}`,
      actorIds: state.meta.roleChurnActorIds || [],
      regionId: null,
    });
  }

  if (state.meta.expiredLeaseIds && state.meta.expiredLeaseIds.length > 0) {
    push({
      severity: 'warning',
      message: `Expired leases: ${state.meta.expiredLeaseIds.join(', ')}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.coordinationCompositeScore === 'number' &&
    state.meta.coordinationCompositeScore < 55
  ) {
    push({
      severity: 'warning',
      message: `Low coordination composite (${state.meta.coordinationCompositeScore}); weakest: ${state.meta.coordinationWeakestDimension || 'unknown'}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.directiveCollisionIndex === 'number' && state.meta.directiveCollisionIndex >= 40) {
    push({
      severity: 'warning',
      message: `High directive collision index (${state.meta.directiveCollisionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.handoffIntegrityScore === 'number' && state.meta.handoffIntegrityScore < 70) {
    push({
      severity: 'warning',
      message: `Low handoff chain integrity (${state.meta.handoffIntegrityScore})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.coordinationEscalationTier === 'number' &&
    state.meta.coordinationEscalationTier >= 2
  ) {
    push({
      severity: state.meta.coordinationEscalationTier >= 3 ? 'error' : 'warning',
      message: `Coordination escalation ${state.meta.coordinationEscalationLabel || state.meta.coordinationEscalationTier} (tier ${state.meta.coordinationEscalationTier})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.coordinationRecoveryUrgency === 'number' && state.meta.coordinationRecoveryUrgency >= 75) {
    push({
      severity: 'warning',
      message: `High coordination recovery urgency (${state.meta.coordinationRecoveryUrgency})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.directivePriorityInversionIndex === 'number' &&
    state.meta.directivePriorityInversionIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Directive priority inversion index (${state.meta.directivePriorityInversionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.handoffOrphanCount === 'number' && state.meta.handoffOrphanCount > 0) {
    push({
      severity: 'warning',
      message: `Orphan handoffs pending: ${(state.meta.orphanHandoffIds || []).join(', ') || state.meta.handoffOrphanCount}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.workstreamDeadlockCount === 'number' && state.meta.workstreamDeadlockCount > 0) {
    push({
      severity: 'error',
      message: `Workstream deadlocks detected (${state.meta.workstreamDeadlockCount}): ${(state.meta.deadlockedWorkstreamIds || []).join(', ')}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.leaseContentionIndex === 'number' && state.meta.leaseContentionIndex >= 50) {
    push({
      severity: 'warning',
      message: `High lease contention index (${state.meta.leaseContentionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.coordinationSaturationIndex === 'number' &&
    state.meta.coordinationSaturationIndex >= 75
  ) {
    push({
      severity: 'warning',
      message: `Coordination saturation elevated (${state.meta.coordinationSaturationIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.mutexLeaseDivergenceIndex === 'number' &&
    state.meta.mutexLeaseDivergenceIndex >= 40
  ) {
    push({
      severity: 'warning',
      message: `Mutex/lease divergence index (${state.meta.mutexLeaseDivergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.handoffCascadeRiskIndex === 'number' &&
    state.meta.handoffCascadeRiskIndex >= 55
  ) {
    push({
      severity: 'warning',
      message: `Handoff cascade risk (${state.meta.handoffCascadeRiskIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.suppressionBacklogIndex === 'number' && state.meta.suppressionBacklogIndex >= 70) {
    push({
      severity: 'warning',
      message: `Directive suppression backlog (${state.meta.suppressionBacklogIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.reconcileDriftIndex === 'number' && state.meta.reconcileDriftIndex >= 50) {
    push({
      severity: 'warning',
      message: `Coordination reconcile drift (${state.meta.reconcileDriftIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.arbitrationPressureIndex === 'number' &&
    state.meta.arbitrationPressureIndex >= 45
  ) {
    push({
      severity: 'warning',
      message: `Arbitration demotion pressure (${state.meta.arbitrationPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.persistenceChurnIndex === 'number' && state.meta.persistenceChurnIndex >= 60) {
    push({
      severity: 'warning',
      message: `Persistence churn elevated (${state.meta.persistenceChurnIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.duplicateGuardPressureIndex === 'number' &&
    state.meta.duplicateGuardPressureIndex >= 70
  ) {
    push({
      severity: 'warning',
      message: `Duplicate guard pressure (${state.meta.duplicateGuardPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.roleTaskCoverageGapIndex === 'number' && state.meta.roleTaskCoverageGapIndex >= 50) {
    push({
      severity: 'warning',
      message: `Role/task coverage gap (${state.meta.roleTaskCoverageGapIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.compositeHealthGradientIndex === 'number' &&
    state.meta.compositeHealthGradientIndex >= 40
  ) {
    push({
      severity: 'warning',
      message: `Composite health declining (${state.meta.compositeHealthGradientIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.handoffReadinessSpreadIndex === 'number' &&
    state.meta.handoffReadinessSpreadIndex >= 45
  ) {
    push({
      severity: 'warning',
      message: `Handoff readiness spread (${state.meta.handoffReadinessSpreadIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.workstreamParallelismIndex === 'number' &&
    state.meta.workstreamParallelismIndex >= 75
  ) {
    push({
      severity: 'warning',
      message: `Workstream parallelism elevated (${state.meta.workstreamParallelismIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.escalationRecoveryAlignmentIndex === 'number' &&
    state.meta.escalationRecoveryAlignmentIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Escalation/recovery misalignment (${state.meta.escalationRecoveryAlignmentIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.roleLockFrictionIndex === 'number' && state.meta.roleLockFrictionIndex >= 55) {
    push({
      severity: 'warning',
      message: `Role lock friction (${state.meta.roleLockFrictionIndex})`,
      actorIds: state.meta.lockedRoleActorIds || [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.directiveConstraintDensityIndex === 'number' &&
    state.meta.directiveConstraintDensityIndex >= 60
  ) {
    push({
      severity: 'warning',
      message: `Directive constraint density (${state.meta.directiveConstraintDensityIndex})`,
      actorIds: state.meta.directiveConstrainedActorIds || [],
      regionId: null,
    });
  }

  if (typeof state.meta.auditPressureIndex === 'number' && state.meta.auditPressureIndex >= 65) {
    push({
      severity: 'warning',
      message: `Coordination audit pressure (${state.meta.auditPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.crossTeamRejectionIndex === 'number' && state.meta.crossTeamRejectionIndex >= 40) {
    push({
      severity: 'warning',
      message: `Cross-team directive rejections (${state.meta.crossTeamRejectionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.handoffSlaVelocityIndex === 'number' && state.meta.handoffSlaVelocityIndex >= 50) {
    push({
      severity: 'warning',
      message: `Handoff SLA velocity stress (${state.meta.handoffSlaVelocityIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.recoveryActionBreadthIndex === 'number' &&
    state.meta.recoveryActionBreadthIndex >= 45
  ) {
    push({
      severity: 'warning',
      message: `Recovery action breadth gap (${state.meta.recoveryActionBreadthIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.directiveQuotaExhaustionIndex === 'number' &&
    state.meta.directiveQuotaExhaustionIndex >= 42
  ) {
    push({
      severity: 'warning',
      message: `Directive quota exhaustion (${state.meta.directiveQuotaExhaustionIndex})`,
      actorIds: state.meta.quotaExhaustedActorIds || [],
      regionId: null,
    });
  }

  if (typeof state.meta.capacityImbalanceIndex === 'number' && state.meta.capacityImbalanceIndex >= 48) {
    push({
      severity: 'warning',
      message: `Actor capacity imbalance (${state.meta.capacityImbalanceIndex})`,
      actorIds: [...(state.meta.overloadedActorIds || []), ...(state.meta.idleActorIds || [])],
      regionId: null,
    });
  }

  if (
    typeof state.meta.workstreamBarrierStalenessIndex === 'number' &&
    state.meta.workstreamBarrierStalenessIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Workstream barrier staleness (${state.meta.workstreamBarrierStalenessIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.workstreamDeadlockPressureIndex === 'number' &&
    state.meta.workstreamDeadlockPressureIndex >= 45
  ) {
    push({
      severity: 'warning',
      message: `Workstream deadlock pressure (${state.meta.workstreamDeadlockPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.suppressionQuotaCouplingIndex === 'number' &&
    state.meta.suppressionQuotaCouplingIndex >= 44
  ) {
    push({
      severity: 'warning',
      message: `Suppression–quota coupling (${state.meta.suppressionQuotaCouplingIndex})`,
      actorIds: state.meta.quotaExhaustedActorIds || [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.handoffLeaseOverlapIndex === 'number' &&
    state.meta.handoffLeaseOverlapIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Handoff–lease overlap (${state.meta.handoffLeaseOverlapIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.saturationDeadlockCouplingIndex === 'number' &&
    state.meta.saturationDeadlockCouplingIndex >= 45
  ) {
    push({
      severity: 'warning',
      message: `Saturation–deadlock coupling (${state.meta.saturationDeadlockCouplingIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeLeaseConvergenceIndex === 'number' &&
    state.meta.cascadeLeaseConvergenceIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Cascade–lease convergence (${state.meta.cascadeLeaseConvergenceIndex})`,
      actorIds: state.meta.handoffCascadeChainActorIds || [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.gradientAuditTensionIndex === 'number' &&
    state.meta.gradientAuditTensionIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Gradient–audit tension (${state.meta.gradientAuditTensionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.escalationSaturationStackIndex === 'number' &&
    state.meta.escalationSaturationStackIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Escalation–saturation stack (${state.meta.escalationSaturationStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.recoveryCascadeMismatchIndex === 'number' &&
    state.meta.recoveryCascadeMismatchIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Recovery–cascade mismatch (${state.meta.recoveryCascadeMismatchIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.persistenceGradientFrictionIndex === 'number' &&
    state.meta.persistenceGradientFrictionIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Persistence–gradient friction (${state.meta.persistenceGradientFrictionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackMismatchCouplingIndex === 'number' &&
    state.meta.stackMismatchCouplingIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Stack–mismatch coupling (${state.meta.stackMismatchCouplingIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.auditStackAmplificationIndex === 'number' &&
    state.meta.auditStackAmplificationIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Audit–stack amplification (${state.meta.auditStackAmplificationIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.frictionAlignmentGapIndex === 'number' &&
    state.meta.frictionAlignmentGapIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Friction–alignment gap (${state.meta.frictionAlignmentGapIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.couplingAmplificationFusionIndex === 'number' &&
    state.meta.couplingAmplificationFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Coupling–amplification fusion (${state.meta.couplingAmplificationFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.gapChurnResonanceIndex === 'number' &&
    state.meta.gapChurnResonanceIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Gap–churn resonance (${state.meta.gapChurnResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackFrictionConvergenceIndex === 'number' &&
    state.meta.stackFrictionConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Stack–friction convergence (${state.meta.stackFrictionConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionResonanceCouplingIndex === 'number' &&
    state.meta.fusionResonanceCouplingIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–resonance coupling (${state.meta.fusionResonanceCouplingIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceFusionStackIndex === 'number' &&
    state.meta.convergenceFusionStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Convergence–fusion stack (${state.meta.convergenceFusionStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceAuditCascadeIndex === 'number' &&
    state.meta.resonanceAuditCascadeIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Resonance–audit cascade (${state.meta.resonanceAuditCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.couplingStackCascadeIndex === 'number' &&
    state.meta.couplingStackCascadeIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Coupling–stack cascade (${state.meta.couplingStackCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackCascadeAmplificationIndex === 'number' &&
    state.meta.stackCascadeAmplificationIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Stack–cascade amplification (${state.meta.stackCascadeAmplificationIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeCouplingSynthesisIndex === 'number' &&
    state.meta.cascadeCouplingSynthesisIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Cascade–coupling synthesis (${state.meta.cascadeCouplingSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeSynthesisFusionIndex === 'number' &&
    state.meta.cascadeSynthesisFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Cascade–synthesis fusion (${state.meta.cascadeSynthesisFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.amplificationStackResonanceIndex === 'number' &&
    state.meta.amplificationStackResonanceIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Amplification–stack resonance (${state.meta.amplificationStackResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisEscalationPressureIndex === 'number' &&
    state.meta.synthesisEscalationPressureIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–escalation pressure (${state.meta.synthesisEscalationPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionResonanceConvergenceIndex === 'number' &&
    state.meta.fusionResonanceConvergenceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–resonance convergence (${state.meta.fusionResonanceConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureFusionCascadeIndex === 'number' &&
    state.meta.pressureFusionCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–fusion cascade (${state.meta.pressureFusionCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonancePressureSynthesisIndex === 'number' &&
    state.meta.resonancePressureSynthesisIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Resonance–pressure synthesis (${state.meta.resonancePressureSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceCascadeSynthesisIndex === 'number' &&
    state.meta.convergenceCascadeSynthesisIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Convergence–cascade synthesis (${state.meta.convergenceCascadeSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisConvergenceStackIndex === 'number' &&
    state.meta.synthesisConvergenceStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–convergence stack (${state.meta.synthesisConvergenceStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeResonanceAmplificationIndex === 'number' &&
    state.meta.cascadeResonanceAmplificationIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Cascade–resonance amplification (${state.meta.cascadeResonanceAmplificationIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisStackAmplificationIndex === 'number' &&
    state.meta.synthesisStackAmplificationIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–stack amplification (${state.meta.synthesisStackAmplificationIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.amplificationConvergenceCascadeIndex === 'number' &&
    state.meta.amplificationConvergenceCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Amplification–convergence cascade (${state.meta.amplificationConvergenceCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackSynthesisResonanceIndex === 'number' &&
    state.meta.stackSynthesisResonanceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Stack–synthesis resonance (${state.meta.stackSynthesisResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackAmplificationCascadeFusionIndex === 'number' &&
    state.meta.stackAmplificationCascadeFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Stack–amplification cascade fusion (${state.meta.stackAmplificationCascadeFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceAmplificationStackIndex === 'number' &&
    state.meta.resonanceAmplificationStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Resonance–amplification stack (${state.meta.resonanceAmplificationStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeConvergenceResonanceIndex === 'number' &&
    state.meta.cascadeConvergenceResonanceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Cascade–convergence resonance (${state.meta.cascadeConvergenceResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionStackConvergenceIndex === 'number' &&
    state.meta.fusionStackConvergenceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–stack convergence (${state.meta.fusionStackConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceCascadeSynthesisIndex === 'number' &&
    state.meta.resonanceCascadeSynthesisIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Resonance–cascade synthesis (${state.meta.resonanceCascadeSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceAmplificationPressureIndex === 'number' &&
    state.meta.convergenceAmplificationPressureIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Convergence–amplification pressure (${state.meta.convergenceAmplificationPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceSynthesisFusionIndex === 'number' &&
    state.meta.convergenceSynthesisFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Convergence–synthesis fusion (${state.meta.convergenceSynthesisFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureCascadeStackIndex === 'number' &&
    state.meta.pressureCascadeStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–cascade stack (${state.meta.pressureCascadeStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisPressureResonanceIndex === 'number' &&
    state.meta.synthesisPressureResonanceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–pressure resonance (${state.meta.synthesisPressureResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionCascadeStackIndex === 'number' &&
    state.meta.fusionCascadeStackIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–cascade stack (${state.meta.fusionCascadeStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonancePressureCascadeIndex === 'number' &&
    state.meta.resonancePressureCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Resonance–pressure cascade (${state.meta.resonancePressureCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisFusionConvergenceIndex === 'number' &&
    state.meta.synthesisFusionConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–fusion convergence (${state.meta.synthesisFusionConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackCascadeResonanceIndex === 'number' &&
    state.meta.stackCascadeResonanceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Stack–cascade resonance (${state.meta.stackCascadeResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeConvergencePressureIndex === 'number' &&
    state.meta.cascadeConvergencePressureIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Cascade–convergence pressure (${state.meta.cascadeConvergencePressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceFusionSynthesisIndex === 'number' &&
    state.meta.convergenceFusionSynthesisIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Convergence–fusion synthesis (${state.meta.convergenceFusionSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceConvergenceFusionIndex === 'number' &&
    state.meta.resonanceConvergenceFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Resonance–convergence fusion (${state.meta.resonanceConvergenceFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureSynthesisCascadeIndex === 'number' &&
    state.meta.pressureSynthesisCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–synthesis cascade (${state.meta.pressureSynthesisCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisResonanceStackIndex === 'number' &&
    state.meta.synthesisResonanceStackIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–resonance stack (${state.meta.synthesisResonanceStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceFusionPressureIndex === 'number' &&
    state.meta.convergenceFusionPressureIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Convergence–fusion pressure (${state.meta.convergenceFusionPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisCascadeStackIndex === 'number' &&
    state.meta.synthesisCascadeStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–cascade stack (${state.meta.synthesisCascadeStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceStackFusionIndex === 'number' &&
    state.meta.resonanceStackFusionIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Resonance–stack fusion (${state.meta.resonanceStackFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureStackResonanceIndex === 'number' &&
    state.meta.pressureStackResonanceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Pressure–stack resonance (${state.meta.pressureStackResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackFusionCascadeIndex === 'number' &&
    state.meta.stackFusionCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Stack–fusion cascade (${state.meta.stackFusionCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionCascadeConvergenceIndex === 'number' &&
    state.meta.fusionCascadeConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Fusion–cascade convergence (${state.meta.fusionCascadeConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceFusionStackIndex === 'number' &&
    state.meta.resonanceFusionStackIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Resonance–fusion stack (${state.meta.resonanceFusionStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionCascadePressureIndex === 'number' &&
    state.meta.fusionCascadePressureIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Fusion–cascade pressure (${state.meta.fusionCascadePressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackConvergenceResonanceIndex === 'number' &&
    state.meta.stackConvergenceResonanceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Stack–convergence resonance (${state.meta.stackConvergenceResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionStackPressureIndex === 'number' &&
    state.meta.fusionStackPressureIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–stack pressure (${state.meta.fusionStackPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureResonanceCascadeIndex === 'number' &&
    state.meta.pressureResonanceCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–resonance cascade (${state.meta.pressureResonanceCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackSynthesisConvergenceIndex === 'number' &&
    state.meta.stackSynthesisConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Stack–synthesis convergence (${state.meta.stackSynthesisConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureCascadeFusionIndex === 'number' &&
    state.meta.pressureCascadeFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Pressure–cascade fusion (${state.meta.pressureCascadeFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeSynthesisResonanceIndex === 'number' &&
    state.meta.cascadeSynthesisResonanceIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Cascade–synthesis resonance (${state.meta.cascadeSynthesisResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergencePressureStackIndex === 'number' &&
    state.meta.convergencePressureStackIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Convergence–pressure stack (${state.meta.convergencePressureStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionCascadeResonanceIndex === 'number' &&
    state.meta.fusionCascadeResonanceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–cascade resonance (${state.meta.fusionCascadeResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonancePressureStackIndex === 'number' &&
    state.meta.resonancePressureStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Resonance–pressure stack (${state.meta.resonancePressureStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackSynthesisFusionIndex === 'number' &&
    state.meta.stackSynthesisFusionIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Stack–synthesis fusion (${state.meta.stackSynthesisFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeResonanceStackIndex === 'number' &&
    state.meta.cascadeResonanceStackIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Cascade–resonance stack (${state.meta.cascadeResonanceStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceFusionPressureIndex === 'number' &&
    state.meta.resonanceFusionPressureIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Resonance–fusion pressure (${state.meta.resonanceFusionPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionConvergenceSynthesisIndex === 'number' &&
    state.meta.fusionConvergenceSynthesisIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Fusion–convergence synthesis (${state.meta.fusionConvergenceSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackResonancePressureIndex === 'number' &&
    state.meta.stackResonancePressureIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Stack–resonance pressure (${state.meta.stackResonancePressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureFusionSynthesisIndex === 'number' &&
    state.meta.pressureFusionSynthesisIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–fusion synthesis (${state.meta.pressureFusionSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisStackConvergenceIndex === 'number' &&
    state.meta.synthesisStackConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–stack convergence (${state.meta.synthesisStackConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackFusionResonanceIndex === 'number' &&
    state.meta.stackFusionResonanceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Stack–fusion resonance (${state.meta.stackFusionResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionSynthesisPressureIndex === 'number' &&
    state.meta.fusionSynthesisPressureIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Fusion–synthesis pressure (${state.meta.fusionSynthesisPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisCascadeConvergenceIndex === 'number' &&
    state.meta.synthesisCascadeConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–cascade convergence (${state.meta.synthesisCascadeConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionResonanceSynthesisIndex === 'number' &&
    state.meta.fusionResonanceSynthesisIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–resonance synthesis (${state.meta.fusionResonanceSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureCascadeConvergenceIndex === 'number' &&
    state.meta.pressureCascadeConvergenceIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–cascade convergence (${state.meta.pressureCascadeConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeStackFusionIndex === 'number' &&
    state.meta.cascadeStackFusionIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Cascade–stack fusion (${state.meta.cascadeStackFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisResonanceConvergenceIndex === 'number' &&
    state.meta.synthesisResonanceConvergenceIndex >= 49
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–resonance convergence (${state.meta.synthesisResonanceConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureStackFusionIndex === 'number' &&
    state.meta.pressureStackFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Pressure–stack fusion (${state.meta.pressureStackFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionStackSynthesisIndex === 'number' &&
    state.meta.fusionStackSynthesisIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Fusion–stack synthesis (${state.meta.fusionStackSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceConvergenceStackIndex === 'number' &&
    state.meta.resonanceConvergenceStackIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Resonance–convergence stack (${state.meta.resonanceConvergenceStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureStackSynthesisIndex === 'number' &&
    state.meta.pressureStackSynthesisIndex >= 49
  ) {
    push({
      severity: 'warning',
      message: `Pressure–stack synthesis (${state.meta.pressureStackSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionStackResonanceIndex === 'number' &&
    state.meta.fusionStackResonanceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–stack resonance (${state.meta.fusionStackResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceStackSynthesisIndex === 'number' &&
    state.meta.convergenceStackSynthesisIndex >= 51
  ) {
    push({
      severity: 'warning',
      message: `Convergence–stack synthesis (${state.meta.convergenceStackSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackSynthesisPressureIndex === 'number' &&
    state.meta.stackSynthesisPressureIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Stack–synthesis pressure (${state.meta.stackSynthesisPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionResonanceStackIndex === 'number' &&
    state.meta.fusionResonanceStackIndex >= 49
  ) {
    push({
      severity: 'warning',
      message: `Fusion–resonance stack (${state.meta.fusionResonanceStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisPressureConvergenceIndex === 'number' &&
    state.meta.synthesisPressureConvergenceIndex >= 51
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–pressure convergence (${state.meta.synthesisPressureConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureFusionStackIndex === 'number' &&
    state.meta.pressureFusionStackIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Pressure–fusion stack (${state.meta.pressureFusionStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceSynthesisFusionIndex === 'number' &&
    state.meta.resonanceSynthesisFusionIndex >= 49
  ) {
    push({
      severity: 'warning',
      message: `Resonance–synthesis fusion (${state.meta.resonanceSynthesisFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergencePressureFusionIndex === 'number' &&
    state.meta.convergencePressureFusionIndex >= 52
  ) {
    push({
      severity: 'warning',
      message: `Convergence–pressure fusion (${state.meta.convergencePressureFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureResonanceSynthesisIndex === 'number' &&
    state.meta.pressureResonanceSynthesisIndex >= 51
  ) {
    push({
      severity: 'warning',
      message: `Pressure–resonance synthesis (${state.meta.pressureResonanceSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionConvergencePressureIndex === 'number' &&
    state.meta.fusionConvergencePressureIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Fusion–convergence pressure (${state.meta.fusionConvergencePressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionSynthesisResonanceIndex === 'number' &&
    state.meta.fusionSynthesisResonanceIndex >= 53
  ) {
    push({
      severity: 'warning',
      message: `Fusion–synthesis resonance (${state.meta.fusionSynthesisResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonancePressureConvergenceIndex === 'number' &&
    state.meta.resonancePressureConvergenceIndex >= 52
  ) {
    push({
      severity: 'warning',
      message: `Resonance–pressure convergence (${state.meta.resonancePressureConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureFusionConvergenceIndex === 'number' &&
    state.meta.pressureFusionConvergenceIndex >= 51
  ) {
    push({
      severity: 'warning',
      message: `Pressure–fusion convergence (${state.meta.pressureFusionConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceConvergenceSynthesisIndex === 'number' &&
    state.meta.resonanceConvergenceSynthesisIndex >= 53
  ) {
    push({
      severity: 'warning',
      message: `Resonance–convergence synthesis (${state.meta.resonanceConvergenceSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisPressureFusionIndex === 'number' &&
    state.meta.synthesisPressureFusionIndex >= 52
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–pressure fusion (${state.meta.synthesisPressureFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceSynthesisResonanceIndex === 'number' &&
    state.meta.convergenceSynthesisResonanceIndex >= 51
  ) {
    push({
      severity: 'warning',
      message: `Convergence–synthesis resonance (${state.meta.convergenceSynthesisResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisConvergencePressureIndex === 'number' &&
    state.meta.synthesisConvergencePressureIndex >= 54
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–convergence pressure (${state.meta.synthesisConvergencePressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergencePressureSynthesisIndex === 'number' &&
    state.meta.convergencePressureSynthesisIndex >= 53
  ) {
    push({
      severity: 'warning',
      message: `Convergence–pressure synthesis (${state.meta.convergencePressureSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureSynthesisConvergenceIndex === 'number' &&
    state.meta.pressureSynthesisConvergenceIndex >= 52
  ) {
    push({
      severity: 'warning',
      message: `Pressure–synthesis convergence (${state.meta.pressureSynthesisConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  state.coordination.leases.forEach(lease => {
    if (lease.expiresTurn !== null && lease.expiresTurn < state.turn) {
      push({
        severity: 'warning',
        message: `Lease ${lease.id} expired at turn ${lease.expiresTurn}`,
        actorIds: [lease.holderActorId],
        regionId: lease.regionId,
      });
    }
  });

  return findings;
}

export function attachAuditToState(
  state: TeamMultiAgentLayerState,
  findings: CoordinationAuditFinding[],
  metaPatch: Partial<TeamMultiAgentCoordinationMeta>,
): TeamMultiAgentLayerState {
  const auditFindings = findings.slice(0, AGENT18_LIMITS.maxAuditFindings);
  const meta: TeamMultiAgentCoordinationMeta = {
    ...emptyCoordinationMeta(),
    ...state.meta,
    ...metaPatch,
    auditSummary: summarizeAudit(auditFindings),
  };
  return { ...state, auditFindings, meta };
}
