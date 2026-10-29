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
import { combineDualTeamFusionResonanceCoupling } from './fusion-resonance-coupling-index.ts';
import { combineDualTeamConvergenceFusionStack } from './convergence-fusion-stack-index.ts';
import { combineDualTeamResonanceAuditCascade } from './resonance-audit-cascade-index.ts';
import { combineDualTeamCouplingStackCascade } from './coupling-stack-cascade-index.ts';
import { combineDualTeamStackCascadeAmplification } from './stack-cascade-amplification-index.ts';
import { combineDualTeamCascadeCouplingSynthesis } from './cascade-coupling-synthesis-index.ts';
import { combineDualTeamCascadeSynthesisFusion } from './cascade-synthesis-fusion-index.ts';
import { combineDualTeamAmplificationStackResonance } from './amplification-stack-resonance-index.ts';
import { combineDualTeamSynthesisEscalationPressure } from './synthesis-escalation-pressure-index.ts';
import { combineDualTeamFusionResonanceConvergence } from './fusion-resonance-convergence-index.ts';
import { combineDualTeamPressureFusionCascade } from './pressure-fusion-cascade-index.ts';
import { combineDualTeamResonancePressureSynthesis } from './resonance-pressure-synthesis-index.ts';
import { combineDualTeamConvergenceCascadeSynthesis } from './convergence-cascade-synthesis-index.ts';
import { combineDualTeamSynthesisConvergenceStack } from './synthesis-convergence-stack-index.ts';
import { combineDualTeamCascadeResonanceAmplification } from './cascade-resonance-amplification-index.ts';
import { combineDualTeamSynthesisStackAmplification } from './synthesis-stack-amplification-index.ts';
import { combineDualTeamAmplificationConvergenceCascade } from './amplification-convergence-cascade-index.ts';
import { combineDualTeamStackSynthesisResonance } from './stack-synthesis-resonance-index.ts';
import { combineDualTeamStackAmplificationCascadeFusion } from './stack-amplification-cascade-fusion-index.ts';
import { combineDualTeamResonanceAmplificationStack } from './resonance-amplification-stack-index.ts';
import { combineDualTeamCascadeConvergenceResonance } from './cascade-convergence-resonance-index.ts';
import { combineDualTeamFusionStackConvergence } from './fusion-stack-convergence-index.ts';
import { combineDualTeamResonanceCascadeSynthesis } from './resonance-cascade-synthesis-index.ts';
import { combineDualTeamConvergenceAmplificationPressure } from './convergence-amplification-pressure-index.ts';
import { combineDualTeamConvergenceSynthesisFusion } from './convergence-synthesis-fusion-index.ts';
import { combineDualTeamPressureCascadeStack } from './pressure-cascade-stack-index.ts';
import { combineDualTeamSynthesisPressureResonance } from './synthesis-pressure-resonance-index.ts';
import { combineDualTeamFusionCascadeStack } from './fusion-cascade-stack-index.ts';
import { combineDualTeamResonancePressureCascade } from './resonance-pressure-cascade-index.ts';
import { combineDualTeamSynthesisFusionConvergence } from './synthesis-fusion-convergence-index.ts';
import { combineDualTeamStackCascadeResonance } from './stack-cascade-resonance-index.ts';
import { combineDualTeamCascadeConvergencePressure } from './cascade-convergence-pressure-index.ts';
import { combineDualTeamConvergenceFusionSynthesis } from './convergence-fusion-synthesis-index.ts';
import { combineDualTeamResonanceConvergenceFusion } from './resonance-convergence-fusion-index.ts';
import { combineDualTeamPressureSynthesisCascade } from './pressure-synthesis-cascade-index.ts';
import { combineDualTeamSynthesisResonanceStack } from './synthesis-resonance-stack-index.ts';
import { combineDualTeamConvergenceFusionPressure } from './convergence-fusion-pressure-index.ts';
import { combineDualTeamSynthesisCascadeStack } from './synthesis-cascade-stack-index.ts';
import { combineDualTeamResonanceStackFusion } from './resonance-stack-fusion-index.ts';
import { combineDualTeamPressureStackResonance } from './pressure-stack-resonance-index.ts';
import { combineDualTeamStackFusionCascade } from './stack-fusion-cascade-index.ts';
import { combineDualTeamFusionCascadeConvergence } from './fusion-cascade-convergence-index.ts';
import { combineDualTeamResonanceFusionStack } from './resonance-fusion-stack-index.ts';
import { combineDualTeamFusionCascadePressure } from './fusion-cascade-pressure-index.ts';
import { combineDualTeamStackConvergenceResonance } from './stack-convergence-resonance-index.ts';
import { combineDualTeamFusionStackPressure } from './fusion-stack-pressure-index.ts';
import { combineDualTeamPressureResonanceCascade } from './pressure-resonance-cascade-index.ts';
import { combineDualTeamStackSynthesisConvergence } from './stack-synthesis-convergence-index.ts';
import { combineDualTeamPressureCascadeFusion } from './pressure-cascade-fusion-index.ts';
import { combineDualTeamCascadeSynthesisResonance } from './cascade-synthesis-resonance-index.ts';
import { combineDualTeamConvergencePressureStack } from './convergence-pressure-stack-index.ts';
import { combineDualTeamFusionCascadeResonance } from './fusion-cascade-resonance-index.ts';
import { combineDualTeamResonancePressureStack } from './resonance-pressure-stack-index.ts';
import { combineDualTeamStackSynthesisFusion } from './stack-synthesis-fusion-index.ts';
import { combineDualTeamCascadeResonanceStack } from './cascade-resonance-stack-index.ts';
import { combineDualTeamResonanceFusionPressure } from './resonance-fusion-pressure-index.ts';
import { combineDualTeamFusionConvergenceSynthesis } from './fusion-convergence-synthesis-index.ts';
import { combineDualTeamStackResonancePressure } from './stack-resonance-pressure-index.ts';
import { combineDualTeamPressureFusionSynthesis } from './pressure-fusion-synthesis-index.ts';
import { combineDualTeamSynthesisStackConvergence } from './synthesis-stack-convergence-index.ts';
import { combineDualTeamStackFusionResonance } from './stack-fusion-resonance-index.ts';
import { combineDualTeamFusionSynthesisPressure } from './fusion-synthesis-pressure-index.ts';
import { combineDualTeamSynthesisCascadeConvergence } from './synthesis-cascade-convergence-index.ts';
import { combineDualTeamFusionResonanceSynthesis } from './fusion-resonance-synthesis-index.ts';
import { combineDualTeamPressureCascadeConvergence } from './pressure-cascade-convergence-index.ts';
import { combineDualTeamCascadeStackFusion } from './cascade-stack-fusion-index.ts';
import { combineDualTeamSynthesisResonanceConvergence } from './synthesis-resonance-convergence-index.ts';
import { combineDualTeamPressureStackFusion } from './pressure-stack-fusion-index.ts';
import { combineDualTeamFusionStackSynthesis } from './fusion-stack-synthesis-index.ts';
import { combineDualTeamResonanceConvergenceStack } from './resonance-convergence-stack-index.ts';
import { combineDualTeamPressureStackSynthesis } from './pressure-stack-synthesis-index.ts';
import { combineDualTeamFusionStackResonance } from './fusion-stack-resonance-index.ts';
import { combineDualTeamConvergenceStackSynthesis } from './convergence-stack-synthesis-index.ts';
import { combineDualTeamStackSynthesisPressure } from './stack-synthesis-pressure-index.ts';
import { combineDualTeamFusionResonanceStack } from './fusion-resonance-stack-index.ts';
import { combineDualTeamSynthesisPressureConvergence } from './synthesis-pressure-convergence-index.ts';
import { combineDualTeamPressureFusionStack } from './pressure-fusion-stack-index.ts';
import { combineDualTeamResonanceSynthesisFusion } from './resonance-synthesis-fusion-index.ts';
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
  fusionResonanceCouplingCombined: number;
  convergenceFusionStackCombined: number;
  resonanceAuditCascadeCombined: number;
  couplingStackCascadeCombined: number;
  stackCascadeAmplificationCombined: number;
  cascadeCouplingSynthesisCombined: number;
  cascadeSynthesisFusionCombined: number;
  amplificationStackResonanceCombined: number;
  synthesisEscalationPressureCombined: number;
  fusionResonanceConvergenceCombined: number;
  pressureFusionCascadeCombined: number;
  resonancePressureSynthesisCombined: number;
  convergenceCascadeSynthesisCombined: number;
  synthesisConvergenceStackCombined: number;
  cascadeResonanceAmplificationCombined: number;
  synthesisStackAmplificationCombined: number;
  amplificationConvergenceCascadeCombined: number;
  stackSynthesisResonanceCombined: number;
  stackAmplificationCascadeFusionCombined: number;
  resonanceAmplificationStackCombined: number;
  cascadeConvergenceResonanceCombined: number;
  fusionStackConvergenceCombined: number;
  resonanceCascadeSynthesisCombined: number;
  convergenceAmplificationPressureCombined: number;
  convergenceSynthesisFusionCombined: number;
  pressureCascadeStackCombined: number;
  synthesisPressureResonanceCombined: number;
  fusionCascadeStackCombined: number;
  resonancePressureCascadeCombined: number;
  synthesisFusionConvergenceCombined: number;
  stackCascadeResonanceCombined: number;
  cascadeConvergencePressureCombined: number;
  convergenceFusionSynthesisCombined: number;
  resonanceConvergenceFusionCombined: number;
  pressureSynthesisCascadeCombined: number;
  synthesisResonanceStackCombined: number;
  convergenceFusionPressureCombined: number;
  synthesisCascadeStackCombined: number;
  resonanceStackFusionCombined: number;
  pressureStackResonanceCombined: number;
  stackFusionCascadeCombined: number;
  fusionCascadeConvergenceCombined: number;
  resonanceFusionStackCombined: number;
  fusionCascadePressureCombined: number;
  stackConvergenceResonanceCombined: number;
  fusionStackPressureCombined: number;
  pressureResonanceCascadeCombined: number;
  stackSynthesisConvergenceCombined: number;
  pressureCascadeFusionCombined: number;
  cascadeSynthesisResonanceCombined: number;
  convergencePressureStackCombined: number;
  fusionCascadeResonanceCombined: number;
  resonancePressureStackCombined: number;
  stackSynthesisFusionCombined: number;
  cascadeResonanceStackCombined: number;
  resonanceFusionPressureCombined: number;
  fusionConvergenceSynthesisCombined: number;
  stackResonancePressureCombined: number;
  pressureFusionSynthesisCombined: number;
  synthesisStackConvergenceCombined: number;
  stackFusionResonanceCombined: number;
  fusionSynthesisPressureCombined: number;
  synthesisCascadeConvergenceCombined: number;
  fusionResonanceSynthesisCombined: number;
  pressureCascadeConvergenceCombined: number;
  cascadeStackFusionCombined: number;
  synthesisResonanceConvergenceCombined: number;
  pressureStackFusionCombined: number;
  fusionStackSynthesisCombined: number;
  resonanceConvergenceStackCombined: number;
  pressureStackSynthesisCombined: number;
  fusionStackResonanceCombined: number;
  convergenceStackSynthesisCombined: number;
  stackSynthesisPressureCombined: number;
  fusionResonanceStackCombined: number;
  synthesisPressureConvergenceCombined: number;
  pressureFusionStackCombined: number;
  resonanceSynthesisFusionCombined: number;
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
      fusionResonanceCouplingCombined: friendly.state.meta.fusionResonanceCouplingIndex ?? 0,
      convergenceFusionStackCombined: friendly.state.meta.convergenceFusionStackIndex ?? 0,
      resonanceAuditCascadeCombined: friendly.state.meta.resonanceAuditCascadeIndex ?? 0,
      couplingStackCascadeCombined: friendly.state.meta.couplingStackCascadeIndex ?? 0,
      stackCascadeAmplificationCombined: friendly.state.meta.stackCascadeAmplificationIndex ?? 0,
      cascadeCouplingSynthesisCombined: friendly.state.meta.cascadeCouplingSynthesisIndex ?? 0,
      cascadeSynthesisFusionCombined: friendly.state.meta.cascadeSynthesisFusionIndex ?? 0,
      amplificationStackResonanceCombined: friendly.state.meta.amplificationStackResonanceIndex ?? 0,
      synthesisEscalationPressureCombined: friendly.state.meta.synthesisEscalationPressureIndex ?? 0,
      fusionResonanceConvergenceCombined: friendly.state.meta.fusionResonanceConvergenceIndex ?? 0,
      pressureFusionCascadeCombined: friendly.state.meta.pressureFusionCascadeIndex ?? 0,
      resonancePressureSynthesisCombined: friendly.state.meta.resonancePressureSynthesisIndex ?? 0,
      convergenceCascadeSynthesisCombined: friendly.state.meta.convergenceCascadeSynthesisIndex ?? 0,
      synthesisConvergenceStackCombined: friendly.state.meta.synthesisConvergenceStackIndex ?? 0,
      cascadeResonanceAmplificationCombined: friendly.state.meta.cascadeResonanceAmplificationIndex ?? 0,
      synthesisStackAmplificationCombined: friendly.state.meta.synthesisStackAmplificationIndex ?? 0,
      amplificationConvergenceCascadeCombined: friendly.state.meta.amplificationConvergenceCascadeIndex ?? 0,
      stackSynthesisResonanceCombined: friendly.state.meta.stackSynthesisResonanceIndex ?? 0,
      stackAmplificationCascadeFusionCombined: friendly.state.meta.stackAmplificationCascadeFusionIndex ?? 0,
      resonanceAmplificationStackCombined: friendly.state.meta.resonanceAmplificationStackIndex ?? 0,
      cascadeConvergenceResonanceCombined: friendly.state.meta.cascadeConvergenceResonanceIndex ?? 0,
      fusionStackConvergenceCombined: friendly.state.meta.fusionStackConvergenceIndex ?? 0,
      resonanceCascadeSynthesisCombined: friendly.state.meta.resonanceCascadeSynthesisIndex ?? 0,
      convergenceAmplificationPressureCombined: friendly.state.meta.convergenceAmplificationPressureIndex ?? 0,
      convergenceSynthesisFusionCombined: friendly.state.meta.convergenceSynthesisFusionIndex ?? 0,
      pressureCascadeStackCombined: friendly.state.meta.pressureCascadeStackIndex ?? 0,
      synthesisPressureResonanceCombined: friendly.state.meta.synthesisPressureResonanceIndex ?? 0,
      fusionCascadeStackCombined: friendly.state.meta.fusionCascadeStackIndex ?? 0,
      resonancePressureCascadeCombined: friendly.state.meta.resonancePressureCascadeIndex ?? 0,
      synthesisFusionConvergenceCombined: friendly.state.meta.synthesisFusionConvergenceIndex ?? 0,
      stackCascadeResonanceCombined: friendly.state.meta.stackCascadeResonanceIndex ?? 0,
      cascadeConvergencePressureCombined: friendly.state.meta.cascadeConvergencePressureIndex ?? 0,
      convergenceFusionSynthesisCombined: friendly.state.meta.convergenceFusionSynthesisIndex ?? 0,
      resonanceConvergenceFusionCombined: friendly.state.meta.resonanceConvergenceFusionIndex ?? 0,
      pressureSynthesisCascadeCombined: friendly.state.meta.pressureSynthesisCascadeIndex ?? 0,
      synthesisResonanceStackCombined: friendly.state.meta.synthesisResonanceStackIndex ?? 0,
      convergenceFusionPressureCombined: friendly.state.meta.convergenceFusionPressureIndex ?? 0,
      synthesisCascadeStackCombined: friendly.state.meta.synthesisCascadeStackIndex ?? 0,
      resonanceStackFusionCombined: friendly.state.meta.resonanceStackFusionIndex ?? 0,
      pressureStackResonanceCombined: friendly.state.meta.pressureStackResonanceIndex ?? 0,
      stackFusionCascadeCombined: friendly.state.meta.stackFusionCascadeIndex ?? 0,
      fusionCascadeConvergenceCombined: friendly.state.meta.fusionCascadeConvergenceIndex ?? 0,
      resonanceFusionStackCombined: friendly.state.meta.resonanceFusionStackIndex ?? 0,
      fusionCascadePressureCombined: friendly.state.meta.fusionCascadePressureIndex ?? 0,
      stackConvergenceResonanceCombined: friendly.state.meta.stackConvergenceResonanceIndex ?? 0,
      fusionStackPressureCombined: friendly.state.meta.fusionStackPressureIndex ?? 0,
      pressureResonanceCascadeCombined: friendly.state.meta.pressureResonanceCascadeIndex ?? 0,
      stackSynthesisConvergenceCombined: friendly.state.meta.stackSynthesisConvergenceIndex ?? 0,
      pressureCascadeFusionCombined: friendly.state.meta.pressureCascadeFusionIndex ?? 0,
      cascadeSynthesisResonanceCombined: friendly.state.meta.cascadeSynthesisResonanceIndex ?? 0,
      convergencePressureStackCombined: friendly.state.meta.convergencePressureStackIndex ?? 0,
      fusionCascadeResonanceCombined: friendly.state.meta.fusionCascadeResonanceIndex ?? 0,
      resonancePressureStackCombined: friendly.state.meta.resonancePressureStackIndex ?? 0,
      stackSynthesisFusionCombined: friendly.state.meta.stackSynthesisFusionIndex ?? 0,
      cascadeResonanceStackCombined: friendly.state.meta.cascadeResonanceStackIndex ?? 0,
      resonanceFusionPressureCombined: friendly.state.meta.resonanceFusionPressureIndex ?? 0,
      fusionConvergenceSynthesisCombined: friendly.state.meta.fusionConvergenceSynthesisIndex ?? 0,
      stackResonancePressureCombined: friendly.state.meta.stackResonancePressureIndex ?? 0,
      pressureFusionSynthesisCombined: friendly.state.meta.pressureFusionSynthesisIndex ?? 0,
      synthesisStackConvergenceCombined: friendly.state.meta.synthesisStackConvergenceIndex ?? 0,
      stackFusionResonanceCombined: friendly.state.meta.stackFusionResonanceIndex ?? 0,
      fusionSynthesisPressureCombined: friendly.state.meta.fusionSynthesisPressureIndex ?? 0,
      synthesisCascadeConvergenceCombined: friendly.state.meta.synthesisCascadeConvergenceIndex ?? 0,
      fusionResonanceSynthesisCombined: friendly.state.meta.fusionResonanceSynthesisIndex ?? 0,
      pressureCascadeConvergenceCombined: friendly.state.meta.pressureCascadeConvergenceIndex ?? 0,
      cascadeStackFusionCombined: friendly.state.meta.cascadeStackFusionIndex ?? 0,
      synthesisResonanceConvergenceCombined: friendly.state.meta.synthesisResonanceConvergenceIndex ?? 0,
      pressureStackFusionCombined: friendly.state.meta.pressureStackFusionIndex ?? 0,
      fusionStackSynthesisCombined: friendly.state.meta.fusionStackSynthesisIndex ?? 0,
      resonanceConvergenceStackCombined: friendly.state.meta.resonanceConvergenceStackIndex ?? 0,
      pressureStackSynthesisCombined: friendly.state.meta.pressureStackSynthesisIndex ?? 0,
      fusionStackResonanceCombined: friendly.state.meta.fusionStackResonanceIndex ?? 0,
      convergenceStackSynthesisCombined: friendly.state.meta.convergenceStackSynthesisIndex ?? 0,
      stackSynthesisPressureCombined: friendly.state.meta.stackSynthesisPressureIndex ?? 0,
      fusionResonanceStackCombined: friendly.state.meta.fusionResonanceStackIndex ?? 0,
      synthesisPressureConvergenceCombined: friendly.state.meta.synthesisPressureConvergenceIndex ?? 0,
      pressureFusionStackCombined: friendly.state.meta.pressureFusionStackIndex ?? 0,
      resonanceSynthesisFusionCombined: friendly.state.meta.resonanceSynthesisFusionIndex ?? 0,
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
    fusionResonanceCouplingCombined: combineDualTeamFusionResonanceCoupling(
      friendly.state.meta.fusionResonanceCouplingIndex ?? 0,
      enemy.state.meta.fusionResonanceCouplingIndex ?? 0,
    ),
    convergenceFusionStackCombined: combineDualTeamConvergenceFusionStack(
      friendly.state.meta.convergenceFusionStackIndex ?? 0,
      enemy.state.meta.convergenceFusionStackIndex ?? 0,
    ),
    resonanceAuditCascadeCombined: combineDualTeamResonanceAuditCascade(
      friendly.state.meta.resonanceAuditCascadeIndex ?? 0,
      enemy.state.meta.resonanceAuditCascadeIndex ?? 0,
    ),
    couplingStackCascadeCombined: combineDualTeamCouplingStackCascade(
      friendly.state.meta.couplingStackCascadeIndex ?? 0,
      enemy.state.meta.couplingStackCascadeIndex ?? 0,
    ),
    stackCascadeAmplificationCombined: combineDualTeamStackCascadeAmplification(
      friendly.state.meta.stackCascadeAmplificationIndex ?? 0,
      enemy.state.meta.stackCascadeAmplificationIndex ?? 0,
    ),
    cascadeCouplingSynthesisCombined: combineDualTeamCascadeCouplingSynthesis(
      friendly.state.meta.cascadeCouplingSynthesisIndex ?? 0,
      enemy.state.meta.cascadeCouplingSynthesisIndex ?? 0,
    ),
    cascadeSynthesisFusionCombined: combineDualTeamCascadeSynthesisFusion(
      friendly.state.meta.cascadeSynthesisFusionIndex ?? 0,
      enemy.state.meta.cascadeSynthesisFusionIndex ?? 0,
    ),
    amplificationStackResonanceCombined: combineDualTeamAmplificationStackResonance(
      friendly.state.meta.amplificationStackResonanceIndex ?? 0,
      enemy.state.meta.amplificationStackResonanceIndex ?? 0,
    ),
    synthesisEscalationPressureCombined: combineDualTeamSynthesisEscalationPressure(
      friendly.state.meta.synthesisEscalationPressureIndex ?? 0,
      enemy.state.meta.synthesisEscalationPressureIndex ?? 0,
    ),
    fusionResonanceConvergenceCombined: combineDualTeamFusionResonanceConvergence(
      friendly.state.meta.fusionResonanceConvergenceIndex ?? 0,
      enemy.state.meta.fusionResonanceConvergenceIndex ?? 0,
    ),
    pressureFusionCascadeCombined: combineDualTeamPressureFusionCascade(
      friendly.state.meta.pressureFusionCascadeIndex ?? 0,
      enemy.state.meta.pressureFusionCascadeIndex ?? 0,
    ),
    resonancePressureSynthesisCombined: combineDualTeamResonancePressureSynthesis(
      friendly.state.meta.resonancePressureSynthesisIndex ?? 0,
      enemy.state.meta.resonancePressureSynthesisIndex ?? 0,
    ),
    convergenceCascadeSynthesisCombined: combineDualTeamConvergenceCascadeSynthesis(
      friendly.state.meta.convergenceCascadeSynthesisIndex ?? 0,
      enemy.state.meta.convergenceCascadeSynthesisIndex ?? 0,
    ),
    synthesisConvergenceStackCombined: combineDualTeamSynthesisConvergenceStack(
      friendly.state.meta.synthesisConvergenceStackIndex ?? 0,
      enemy.state.meta.synthesisConvergenceStackIndex ?? 0,
    ),
    cascadeResonanceAmplificationCombined: combineDualTeamCascadeResonanceAmplification(
      friendly.state.meta.cascadeResonanceAmplificationIndex ?? 0,
      enemy.state.meta.cascadeResonanceAmplificationIndex ?? 0,
    ),
    synthesisStackAmplificationCombined: combineDualTeamSynthesisStackAmplification(
      friendly.state.meta.synthesisStackAmplificationIndex ?? 0,
      enemy.state.meta.synthesisStackAmplificationIndex ?? 0,
    ),
    amplificationConvergenceCascadeCombined: combineDualTeamAmplificationConvergenceCascade(
      friendly.state.meta.amplificationConvergenceCascadeIndex ?? 0,
      enemy.state.meta.amplificationConvergenceCascadeIndex ?? 0,
    ),
    stackSynthesisResonanceCombined: combineDualTeamStackSynthesisResonance(
      friendly.state.meta.stackSynthesisResonanceIndex ?? 0,
      enemy.state.meta.stackSynthesisResonanceIndex ?? 0,
    ),
    stackAmplificationCascadeFusionCombined: combineDualTeamStackAmplificationCascadeFusion(
      friendly.state.meta.stackAmplificationCascadeFusionIndex ?? 0,
      enemy.state.meta.stackAmplificationCascadeFusionIndex ?? 0,
    ),
    resonanceAmplificationStackCombined: combineDualTeamResonanceAmplificationStack(
      friendly.state.meta.resonanceAmplificationStackIndex ?? 0,
      enemy.state.meta.resonanceAmplificationStackIndex ?? 0,
    ),
    cascadeConvergenceResonanceCombined: combineDualTeamCascadeConvergenceResonance(
      friendly.state.meta.cascadeConvergenceResonanceIndex ?? 0,
      enemy.state.meta.cascadeConvergenceResonanceIndex ?? 0,
    ),
    fusionStackConvergenceCombined: combineDualTeamFusionStackConvergence(
      friendly.state.meta.fusionStackConvergenceIndex ?? 0,
      enemy.state.meta.fusionStackConvergenceIndex ?? 0,
    ),
    resonanceCascadeSynthesisCombined: combineDualTeamResonanceCascadeSynthesis(
      friendly.state.meta.resonanceCascadeSynthesisIndex ?? 0,
      enemy.state.meta.resonanceCascadeSynthesisIndex ?? 0,
    ),
    convergenceAmplificationPressureCombined: combineDualTeamConvergenceAmplificationPressure(
      friendly.state.meta.convergenceAmplificationPressureIndex ?? 0,
      enemy.state.meta.convergenceAmplificationPressureIndex ?? 0,
    ),
    convergenceSynthesisFusionCombined: combineDualTeamConvergenceSynthesisFusion(
      friendly.state.meta.convergenceSynthesisFusionIndex ?? 0,
      enemy.state.meta.convergenceSynthesisFusionIndex ?? 0,
    ),
    pressureCascadeStackCombined: combineDualTeamPressureCascadeStack(
      friendly.state.meta.pressureCascadeStackIndex ?? 0,
      enemy.state.meta.pressureCascadeStackIndex ?? 0,
    ),
    synthesisPressureResonanceCombined: combineDualTeamSynthesisPressureResonance(
      friendly.state.meta.synthesisPressureResonanceIndex ?? 0,
      enemy.state.meta.synthesisPressureResonanceIndex ?? 0,
    ),
    fusionCascadeStackCombined: combineDualTeamFusionCascadeStack(
      friendly.state.meta.fusionCascadeStackIndex ?? 0,
      enemy.state.meta.fusionCascadeStackIndex ?? 0,
    ),
    resonancePressureCascadeCombined: combineDualTeamResonancePressureCascade(
      friendly.state.meta.resonancePressureCascadeIndex ?? 0,
      enemy.state.meta.resonancePressureCascadeIndex ?? 0,
    ),
    synthesisFusionConvergenceCombined: combineDualTeamSynthesisFusionConvergence(
      friendly.state.meta.synthesisFusionConvergenceIndex ?? 0,
      enemy.state.meta.synthesisFusionConvergenceIndex ?? 0,
    ),
    stackCascadeResonanceCombined: combineDualTeamStackCascadeResonance(
      friendly.state.meta.stackCascadeResonanceIndex ?? 0,
      enemy.state.meta.stackCascadeResonanceIndex ?? 0,
    ),
    cascadeConvergencePressureCombined: combineDualTeamCascadeConvergencePressure(
      friendly.state.meta.cascadeConvergencePressureIndex ?? 0,
      enemy.state.meta.cascadeConvergencePressureIndex ?? 0,
    ),
    convergenceFusionSynthesisCombined: combineDualTeamConvergenceFusionSynthesis(
      friendly.state.meta.convergenceFusionSynthesisIndex ?? 0,
      enemy.state.meta.convergenceFusionSynthesisIndex ?? 0,
    ),
    resonanceConvergenceFusionCombined: combineDualTeamResonanceConvergenceFusion(
      friendly.state.meta.resonanceConvergenceFusionIndex ?? 0,
      enemy.state.meta.resonanceConvergenceFusionIndex ?? 0,
    ),
    pressureSynthesisCascadeCombined: combineDualTeamPressureSynthesisCascade(
      friendly.state.meta.pressureSynthesisCascadeIndex ?? 0,
      enemy.state.meta.pressureSynthesisCascadeIndex ?? 0,
    ),
    synthesisResonanceStackCombined: combineDualTeamSynthesisResonanceStack(
      friendly.state.meta.synthesisResonanceStackIndex ?? 0,
      enemy.state.meta.synthesisResonanceStackIndex ?? 0,
    ),
    convergenceFusionPressureCombined: combineDualTeamConvergenceFusionPressure(
      friendly.state.meta.convergenceFusionPressureIndex ?? 0,
      enemy.state.meta.convergenceFusionPressureIndex ?? 0,
    ),
    synthesisCascadeStackCombined: combineDualTeamSynthesisCascadeStack(
      friendly.state.meta.synthesisCascadeStackIndex ?? 0,
      enemy.state.meta.synthesisCascadeStackIndex ?? 0,
    ),
    resonanceStackFusionCombined: combineDualTeamResonanceStackFusion(
      friendly.state.meta.resonanceStackFusionIndex ?? 0,
      enemy.state.meta.resonanceStackFusionIndex ?? 0,
    ),
    pressureStackResonanceCombined: combineDualTeamPressureStackResonance(
      friendly.state.meta.pressureStackResonanceIndex ?? 0,
      enemy.state.meta.pressureStackResonanceIndex ?? 0,
    ),
    stackFusionCascadeCombined: combineDualTeamStackFusionCascade(
      friendly.state.meta.stackFusionCascadeIndex ?? 0,
      enemy.state.meta.stackFusionCascadeIndex ?? 0,
    ),
    fusionCascadeConvergenceCombined: combineDualTeamFusionCascadeConvergence(
      friendly.state.meta.fusionCascadeConvergenceIndex ?? 0,
      enemy.state.meta.fusionCascadeConvergenceIndex ?? 0,
    ),
    resonanceFusionStackCombined: combineDualTeamResonanceFusionStack(
      friendly.state.meta.resonanceFusionStackIndex ?? 0,
      enemy.state.meta.resonanceFusionStackIndex ?? 0,
    ),
    fusionCascadePressureCombined: combineDualTeamFusionCascadePressure(
      friendly.state.meta.fusionCascadePressureIndex ?? 0,
      enemy.state.meta.fusionCascadePressureIndex ?? 0,
    ),
    stackConvergenceResonanceCombined: combineDualTeamStackConvergenceResonance(
      friendly.state.meta.stackConvergenceResonanceIndex ?? 0,
      enemy.state.meta.stackConvergenceResonanceIndex ?? 0,
    ),
    fusionStackPressureCombined: combineDualTeamFusionStackPressure(
      friendly.state.meta.fusionStackPressureIndex ?? 0,
      enemy.state.meta.fusionStackPressureIndex ?? 0,
    ),
    pressureResonanceCascadeCombined: combineDualTeamPressureResonanceCascade(
      friendly.state.meta.pressureResonanceCascadeIndex ?? 0,
      enemy.state.meta.pressureResonanceCascadeIndex ?? 0,
    ),
    stackSynthesisConvergenceCombined: combineDualTeamStackSynthesisConvergence(
      friendly.state.meta.stackSynthesisConvergenceIndex ?? 0,
      enemy.state.meta.stackSynthesisConvergenceIndex ?? 0,
    ),
    pressureCascadeFusionCombined: combineDualTeamPressureCascadeFusion(
      friendly.state.meta.pressureCascadeFusionIndex ?? 0,
      enemy.state.meta.pressureCascadeFusionIndex ?? 0,
    ),
    cascadeSynthesisResonanceCombined: combineDualTeamCascadeSynthesisResonance(
      friendly.state.meta.cascadeSynthesisResonanceIndex ?? 0,
      enemy.state.meta.cascadeSynthesisResonanceIndex ?? 0,
    ),
    convergencePressureStackCombined: combineDualTeamConvergencePressureStack(
      friendly.state.meta.convergencePressureStackIndex ?? 0,
      enemy.state.meta.convergencePressureStackIndex ?? 0,
    ),
    fusionCascadeResonanceCombined: combineDualTeamFusionCascadeResonance(
      friendly.state.meta.fusionCascadeResonanceIndex ?? 0,
      enemy.state.meta.fusionCascadeResonanceIndex ?? 0,
    ),
    resonancePressureStackCombined: combineDualTeamResonancePressureStack(
      friendly.state.meta.resonancePressureStackIndex ?? 0,
      enemy.state.meta.resonancePressureStackIndex ?? 0,
    ),
    stackSynthesisFusionCombined: combineDualTeamStackSynthesisFusion(
      friendly.state.meta.stackSynthesisFusionIndex ?? 0,
      enemy.state.meta.stackSynthesisFusionIndex ?? 0,
    ),
    cascadeResonanceStackCombined: combineDualTeamCascadeResonanceStack(
      friendly.state.meta.cascadeResonanceStackIndex ?? 0,
      enemy.state.meta.cascadeResonanceStackIndex ?? 0,
    ),
    resonanceFusionPressureCombined: combineDualTeamResonanceFusionPressure(
      friendly.state.meta.resonanceFusionPressureIndex ?? 0,
      enemy.state.meta.resonanceFusionPressureIndex ?? 0,
    ),
    fusionConvergenceSynthesisCombined: combineDualTeamFusionConvergenceSynthesis(
      friendly.state.meta.fusionConvergenceSynthesisIndex ?? 0,
      enemy.state.meta.fusionConvergenceSynthesisIndex ?? 0,
    ),
    stackResonancePressureCombined: combineDualTeamStackResonancePressure(
      friendly.state.meta.stackResonancePressureIndex ?? 0,
      enemy.state.meta.stackResonancePressureIndex ?? 0,
    ),
    pressureFusionSynthesisCombined: combineDualTeamPressureFusionSynthesis(
      friendly.state.meta.pressureFusionSynthesisIndex ?? 0,
      enemy.state.meta.pressureFusionSynthesisIndex ?? 0,
    ),
    synthesisStackConvergenceCombined: combineDualTeamSynthesisStackConvergence(
      friendly.state.meta.synthesisStackConvergenceIndex ?? 0,
      enemy.state.meta.synthesisStackConvergenceIndex ?? 0,
    ),
    stackFusionResonanceCombined: combineDualTeamStackFusionResonance(
      friendly.state.meta.stackFusionResonanceIndex ?? 0,
      enemy.state.meta.stackFusionResonanceIndex ?? 0,
    ),
    fusionSynthesisPressureCombined: combineDualTeamFusionSynthesisPressure(
      friendly.state.meta.fusionSynthesisPressureIndex ?? 0,
      enemy.state.meta.fusionSynthesisPressureIndex ?? 0,
    ),
    synthesisCascadeConvergenceCombined: combineDualTeamSynthesisCascadeConvergence(
      friendly.state.meta.synthesisCascadeConvergenceIndex ?? 0,
      enemy.state.meta.synthesisCascadeConvergenceIndex ?? 0,
    ),
    fusionResonanceSynthesisCombined: combineDualTeamFusionResonanceSynthesis(
      friendly.state.meta.fusionResonanceSynthesisIndex ?? 0,
      enemy.state.meta.fusionResonanceSynthesisIndex ?? 0,
    ),
    pressureCascadeConvergenceCombined: combineDualTeamPressureCascadeConvergence(
      friendly.state.meta.pressureCascadeConvergenceIndex ?? 0,
      enemy.state.meta.pressureCascadeConvergenceIndex ?? 0,
    ),
    cascadeStackFusionCombined: combineDualTeamCascadeStackFusion(
      friendly.state.meta.cascadeStackFusionIndex ?? 0,
      enemy.state.meta.cascadeStackFusionIndex ?? 0,
    ),
    synthesisResonanceConvergenceCombined: combineDualTeamSynthesisResonanceConvergence(
      friendly.state.meta.synthesisResonanceConvergenceIndex ?? 0,
      enemy.state.meta.synthesisResonanceConvergenceIndex ?? 0,
    ),
    pressureStackFusionCombined: combineDualTeamPressureStackFusion(
      friendly.state.meta.pressureStackFusionIndex ?? 0,
      enemy.state.meta.pressureStackFusionIndex ?? 0,
    ),
    fusionStackSynthesisCombined: combineDualTeamFusionStackSynthesis(
      friendly.state.meta.fusionStackSynthesisIndex ?? 0,
      enemy.state.meta.fusionStackSynthesisIndex ?? 0,
    ),
    resonanceConvergenceStackCombined: combineDualTeamResonanceConvergenceStack(
      friendly.state.meta.resonanceConvergenceStackIndex ?? 0,
      enemy.state.meta.resonanceConvergenceStackIndex ?? 0,
    ),
    pressureStackSynthesisCombined: combineDualTeamPressureStackSynthesis(
      friendly.state.meta.pressureStackSynthesisIndex ?? 0,
      enemy.state.meta.pressureStackSynthesisIndex ?? 0,
    ),
    fusionStackResonanceCombined: combineDualTeamFusionStackResonance(
      friendly.state.meta.fusionStackResonanceIndex ?? 0,
      enemy.state.meta.fusionStackResonanceIndex ?? 0,
    ),
    convergenceStackSynthesisCombined: combineDualTeamConvergenceStackSynthesis(
      friendly.state.meta.convergenceStackSynthesisIndex ?? 0,
      enemy.state.meta.convergenceStackSynthesisIndex ?? 0,
    ),
    stackSynthesisPressureCombined: combineDualTeamStackSynthesisPressure(
      friendly.state.meta.stackSynthesisPressureIndex ?? 0,
      enemy.state.meta.stackSynthesisPressureIndex ?? 0,
    ),
    fusionResonanceStackCombined: combineDualTeamFusionResonanceStack(
      friendly.state.meta.fusionResonanceStackIndex ?? 0,
      enemy.state.meta.fusionResonanceStackIndex ?? 0,
    ),
    synthesisPressureConvergenceCombined: combineDualTeamSynthesisPressureConvergence(
      friendly.state.meta.synthesisPressureConvergenceIndex ?? 0,
      enemy.state.meta.synthesisPressureConvergenceIndex ?? 0,
    ),
    pressureFusionStackCombined: combineDualTeamPressureFusionStack(
      friendly.state.meta.pressureFusionStackIndex ?? 0,
      enemy.state.meta.pressureFusionStackIndex ?? 0,
    ),
    resonanceSynthesisFusionCombined: combineDualTeamResonanceSynthesisFusion(
      friendly.state.meta.resonanceSynthesisFusionIndex ?? 0,
      enemy.state.meta.resonanceSynthesisFusionIndex ?? 0,
    ),
  };
}
