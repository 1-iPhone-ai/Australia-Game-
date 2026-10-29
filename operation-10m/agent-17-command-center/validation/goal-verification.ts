import type {
  Acc17CommandCenterOpsState,
  Agent17DevTestReport,
  Agent17GameStateSlice,
  Agent17GoalVerificationResult,
  Agent17SettingsSlice,
  Agent17ValidationReport,
} from '../types/command-center-types.ts';
import { AGENT17_GOAL_REGISTRY } from '../goals/goal-registry.ts';
import { evaluateAcc17CommandCenterOperations } from '../evaluation/operations-evaluator.ts';
import { acc17ComputeRelevantStateFingerprint } from '../planning/fingerprint.ts';
import {
  createDefaultAcc17CommandCenterOpsState,
  sanitizeAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';
import { AGENT17_PROJECT_TEMPLATE_CATALOG, acc17InstantiatePlanFromTemplate } from '../planning/templates.ts';
import {
  detectAgent17RecoverySignals,
  maybeApplyAgent17RecoveryPath,
  pickAgent17RecoveryTemplateId,
} from '../planning/recovery-paths.ts';
import { rankAgent17TemplateCandidates } from '../planning/template-selector.ts';
import { buildAgent17DelegationAnalytics } from '../planning/delegation-analytics.ts';
import { buildAgent17DelegationLadder } from '../planning/delegation-ladder.ts';
import { summarizeAgent17PlanLedger } from '../planning/plan-ledger.ts';
import { computeAgent17DelegationDepthScore } from '../planning/delegation-depth.ts';
import { buildAgent17IntentQueue } from '../planning/intent-synthesis.ts';
import { buildAgent17VerificationPolicy } from '../planning/verification-policy.ts';
import { coordinationBriefReadyForGi } from '../planning/coordination-brief.ts';
import { assessAgent17PlanHealth } from '../planning/plan-health.ts';
import { buildAgent17ExecutionPacing } from '../planning/execution-pacing.ts';
import { buildAgent17ResilienceScorecard } from '../planning/resilience-scorecard.ts';
import { buildAgent17HandoffReadiness, handoffReadinessBlocked } from '../planning/handoff-readiness.ts';
import { buildAgent17GovernanceAudit, governanceAuditBlocksAutomation } from '../planning/governance-audit.ts';
import {
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
import { buildAgent17RollbackAssurance } from '../planning/rollback-assurance.ts';
import {
  buildAgent17StabilizationIndex,
  stabilizationIndexBlocksAutomation,
} from '../planning/stabilization-index.ts';
import {
  buildAgent17CommandEnvelope,
  commandEnvelopeNeedsThrottle,
} from '../planning/command-envelope.ts';
import {
  buildAgent17ConvergenceIndex,
  convergenceIndexBlocksDirective,
} from '../planning/convergence-index.ts';
import {
  buildAgent17MissionDirective,
  missionDirectiveBlocksExecution,
} from '../planning/mission-directive.ts';
import {
  buildAgent17DirectiveSynthesis,
  directiveSynthesisBlocksAdvance,
} from '../planning/directive-synthesis.ts';
import {
  buildAgent17ExecutionClosure,
  executionClosureBlocksAdvance,
} from '../planning/execution-closure.ts';
import {
  buildAgent17CadenceLattice,
  cadenceLatticeBlocksRun,
} from '../planning/cadence-lattice.ts';
import {
  buildAgent17ReadinessGate,
  readinessGateBlocksRun,
} from '../planning/readiness-gate.ts';
import {
  buildAgent17PulseIndex,
  pulseIndexBlocksContinuity,
} from '../planning/pulse-index.ts';
import {
  buildAgent17ContinuityBridge,
  continuityBridgeBlocksHandoff,
} from '../planning/continuity-bridge.ts';
import {
  buildAgent17FluxIndex,
  fluxIndexBlocksSeal,
} from '../planning/flux-index.ts';
import {
  buildAgent17IntegritySeal,
  integritySealBlocksCommit,
} from '../planning/integrity-seal.ts';
import {
  buildAgent17CommitLattice,
  commitLatticeBlocksCovenant,
} from '../planning/commit-lattice.ts';
import {
  buildAgent17CovenantGate,
  covenantGateBlocksOps,
} from '../planning/covenant-gate.ts';
import {
  buildAgent17MandateWeave,
  mandateWeaveBlocksSovereignty,
} from '../planning/mandate-weave.ts';
import {
  buildAgent17SovereigntyLock,
  sovereigntyLockBlocksCommand,
} from '../planning/sovereignty-lock.ts';
import {
  buildAgent17AuthorityCharter,
  authorityCharterBlocksAccord,
} from '../planning/authority-charter.ts';
import {
  buildAgent17DispatchAccord,
  dispatchAccordBlocksDispatch,
} from '../planning/dispatch-accord.ts';
import {
  buildAgent17MobilizationIndex,
  mobilizationIndexBlocksSummons,
} from '../planning/mobilization-index.ts';
import {
  buildAgent17ExecutionSummons,
  executionSummonsBlocksField,
} from '../planning/execution-summons.ts';
import {
  buildAgent17FieldIndex,
  fieldIndexBlocksCommitment,
} from '../planning/field-index.ts';
import {
  buildAgent17TheaterCommitment,
  theaterCommitmentBlocksTheater,
} from '../planning/theater-commitment.ts';
import {
  buildAgent17CampaignIndex,
  campaignIndexBlocksLattice,
} from '../planning/campaign-index.ts';
import {
  buildAgent17MissionLattice,
  missionLatticeBlocksCampaign,
} from '../planning/mission-lattice.ts';
import {
  Agent17RollbackController,
  createAgent17RollbackController,
} from '../rollback/rollback-controller.ts';

export interface GoalVerificationContext {
  rollback: Agent17RollbackController;
  lastDevReport?: Agent17DevTestReport;
}

function result(goalId: string, passed: boolean, evidence: string): Agent17GoalVerificationResult {
  return { goalId, passed, evidence, measuredAt: Date.now() };
}

export function verifyAgent17Goals(ctx: GoalVerificationContext): Agent17ValidationReport {
  const goalResults: Agent17GoalVerificationResult[] = [];

  const actor = { id: 'player', money: 5000, netWorth: 8000, currentRegion: 'NSW' };
  const baseState: Agent17GameStateSlice = {
    turnCounter: 3,
    day: 3,
    player: actor,
    actorsById: { player: actor },
    playerTrackedObjective: {
      id: 'c1',
      sourceType: 'contract',
      sourceId: 'c1',
      title: 'Test Contract',
    },
    lastExecutedAction: { type: 'wait' },
  };
  const settings: Agent17SettingsSlice = {
    aiCommunicationAutonomyLevel: 'assisted',
    commandCenterSettings: { enabled: true },
  };

  // G17-001
  goalResults.push(
    result(
      'G17-001',
      sanitizeAcc17CommandCenterOpsState({ version: 2 }).version === 1,
      'sanitizeAcc17CommandCenterOpsState({ version: 2 }).version === 1'
    )
  );

  // G17-002
  const fp1 = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const mutated: Agent17GameStateSlice = {
    ...baseState,
    player: { ...actor, money: 5100 },
    lastExecutedAction: { type: 'travel' },
  };
  const fp2 = acc17ComputeRelevantStateFingerprint(mutated, 'player');
  goalResults.push(result('G17-002', fp1 !== fp2, `fp1=${fp1} fp2=${fp2}`));

  // G17-003
  let ops = createDefaultAcc17CommandCenterOpsState();
  const eval1 = evaluateAcc17CommandCenterOperations(baseState, settings, 'player', ops);
  ops = eval1.ops;
  goalResults.push(
    result(
      'G17-003',
      !!ops.activePlan && ops.activePlan.steps.length >= 3,
      `steps=${ops.activePlan?.steps.length ?? 0}`
    )
  );

  // G17-004
  ops = { ...ops, lastContextFingerprint: fp1 };
  const noAdvance = evaluateAcc17CommandCenterOperations(baseState, settings, 'player', ops);
  const prevLogLen = ops.verificationLog.length;
  const newEntries = noAdvance.ops.verificationLog.length - prevLogLen;
  goalResults.push(result('G17-004', newEntries === 0, `newLogEntries=${newEntries}`));

  // G17-005
  goalResults.push(
    result(
      'G17-005',
      eval1.snapshot.deepContext.slices.length >= 1,
      `slices=${eval1.snapshot.deepContext.slices.length}`
    )
  );

  // G17-006
  goalResults.push(
    result(
      'G17-006',
      eval1.snapshot.delegatedProjects.length >= 1,
      `delegated=${eval1.snapshot.delegatedProjects.length}`
    )
  );

  // G17-007
  const tplOk = AGENT17_PROJECT_TEMPLATE_CATALOG.every(
    t => (acc17InstantiatePlanFromTemplate(t.id, baseState, 'player')?.steps.length || 0) > 0
  );
  goalResults.push(result('G17-007', tplOk, `templates=${AGENT17_PROJECT_TEMPLATE_CATALOG.length}`));

  // G17-008 / G17-009 rollback
  ctx.rollback.clear();
  ctx.rollback.capture('pre-mutation', 3, ops);
  const tampered: Acc17CommandCenterOpsState = {
    ...ops,
    activePlan: ops.activePlan
      ? { ...ops.activePlan, id: 'tampered_plan_id' }
      : null,
  };
  const restored = ctx.rollback.rollbackToLatest();
  goalResults.push(
    result(
      'G17-008',
      restored?.activePlan?.id === ops.activePlan?.id,
      `restoredId=${restored?.activePlan?.id}`
    )
  );
  for (let i = 0; i < 20; i++) {
    ctx.rollback.capture(`cp-${i}`, i, createDefaultAcc17CommandCenterOpsState());
  }
  goalResults.push(result('G17-009', ctx.rollback.listCheckpoints().length <= 16, `count=${ctx.rollback.listCheckpoints().length}`));

  // G17-010
  const disabledEval = evaluateAcc17CommandCenterOperations(
    baseState,
    { commandCenterSettings: { enabled: false } },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  );
  goalResults.push(
    result(
      'G17-010',
      !disabledEval.snapshot.activePlan && disabledEval.snapshot.delegatedProjects.length === 0,
      'disabled snapshot empty'
    )
  );

  // G17-011
  const recDelegated = evaluateAcc17CommandCenterOperations(
    baseState,
    { ...settings, aiCommunicationAutonomyLevel: 'delegated' },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  ).snapshot.recommendedDelegateKind;
  const recAssisted = evaluateAcc17CommandCenterOperations(
    baseState,
    { ...settings, aiCommunicationAutonomyLevel: 'assisted' },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  ).snapshot.recommendedDelegateKind;
  const recAdvisory = evaluateAcc17CommandCenterOperations(
    baseState,
    { aiCommunicationAutonomyLevel: 'advisory', commandCenterSettings: { enabled: true } },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  ).snapshot.recommendedDelegateKind;
  goalResults.push(
    result(
      'G17-011',
      recDelegated === 'team_os' && recAssisted === 'copilot' && recAdvisory === 'strategy_planner',
      `${recDelegated}/${recAssisted}/${recAdvisory}`
    )
  );

  // G17-012
  const harnessOk =
    !!ctx.lastDevReport &&
    ctx.lastDevReport.totalTests > 0 &&
    typeof ctx.lastDevReport.success === 'boolean';
  goalResults.push(
    result(
      'G17-012',
      harnessOk === true,
      ctx.lastDevReport
        ? `tests=${ctx.lastDevReport.totalTests} success=${ctx.lastDevReport.success}`
        : 'no dev report'
    )
  );

  const crisisState: Agent17GameStateSlice = {
    turnCounter: 2,
    day: 2,
    player: { id: 'player', money: 200, netWorth: 5000, currentRegion: 'QLD', currentSupplies: 10 },
    actorsById: {
      player: { id: 'player', money: 200, netWorth: 5000, currentRegion: 'QLD', currentSupplies: 10 },
    },
  };
  const deepPlan = acc17InstantiatePlanFromTemplate(
    'agent17_tpl_deep_capital_program',
    crisisState,
    'player'
  );
  goalResults.push(
    result(
      'G17-013',
      (deepPlan?.steps[5]?.requirements.prerequisiteStepIds?.length ?? 0) >= 1,
      deepPlan?.steps[5]?.requirements.prerequisiteStepIds?.join(',') || 'none'
    )
  );

  const sig = detectAgent17RecoverySignals(crisisState, 'player');
  const rec = pickAgent17RecoveryTemplateId(sig, true);
  goalResults.push(
    result(
      'G17-014',
      rec?.templateId === 'agent17_tpl_supply_deep_recovery' && rec?.lane === 'supply_collapse',
      `${rec?.lane}/${rec?.templateId}`
    )
  );

  let blockedOps = createDefaultAcc17CommandCenterOpsState();
  const tradePlan = acc17InstantiatePlanFromTemplate('agent17_tpl_trade_arbitrage', crisisState, 'player');
  if (tradePlan) {
    tradePlan.steps[2] = { ...tradePlan.steps[2], status: 'blocked', blockerReason: 'test' };
    blockedOps = { ...blockedOps, activePlan: tradePlan };
  }
  const recoveryEval = maybeApplyAgent17RecoveryPath(blockedOps, crisisState, 'player');
  goalResults.push(
    result(
      'G17-015',
      recoveryEval.applied && recoveryEval.ops.activePlan?.objectiveSource?.startsWith('recovery:') === true,
      recoveryEval.ops.activePlan?.objectiveSource || 'not applied'
    )
  );

  const tradeState: Agent17GameStateSlice = {
    turnCounter: 4,
    day: 4,
    player: { id: 'player', money: 3000, netWorth: 7000, currentRegion: 'NSW' },
    actorsById: { player: { id: 'player', money: 3000, netWorth: 7000, currentRegion: 'NSW' } },
    playerTrackedObjective: {
      title: 'Trade market expansion',
      sourceType: 'contract',
      sourceId: 't1',
    },
  };
  const tradeRoute = rankAgent17TemplateCandidates(tradeState, settings, 'player');
  goalResults.push(
    result(
      'G17-017',
      tradeRoute.matchedCategory === 'trade' &&
        tradeRoute.candidateTemplateIds.includes('agent17_tpl_trade_arbitrage'),
      `${tradeRoute.matchedCategory}/${tradeRoute.candidateTemplateIds[0]}`
    )
  );

  const depthEval = evaluateAcc17CommandCenterOperations(
    baseState,
    settings,
    'player',
    createDefaultAcc17CommandCenterOpsState()
  );
  goalResults.push(
    result(
      'G17-016',
      (depthEval.snapshot.planningDepth?.catalogDepth.templateCount ?? 0) >= 12,
      String(depthEval.snapshot.planningDepth?.catalogDepth.templateCount)
    )
  );

  const delegationRows = buildAgent17DelegationAnalytics(
    depthEval.ops,
    settings
  );
  goalResults.push(
    result('G17-018', delegationRows.length === 5, String(delegationRows.length))
  );

  const ladder = buildAgent17DelegationLadder(delegationRows, settings, 'copilot');
  goalResults.push(
    result(
      'G17-019',
      ladder.rungs.length === 5 && ladder.headline.length > 0,
      String(ladder.rungs.length)
    )
  );

  const ledger = summarizeAgent17PlanLedger(depthEval.ops, baseState);
  goalResults.push(
    result(
      'G17-020',
      ledger.entries.length >= 0 && typeof ledger.lastFingerprint === 'string',
      `entries=${ledger.entries.length}`
    )
  );

  const depthScore = computeAgent17DelegationDepthScore(depthEval.ops, settings, 'copilot');
  goalResults.push(
    result('G17-021', depthScore >= 0 && depthScore <= 100, String(depthScore))
  );

  const intentQ = buildAgent17IntentQueue(
    depthEval.ops,
    baseState,
    settings,
    'player',
    assessAgent17PlanHealth(depthEval.ops.activePlan, baseState, 'player')
  );
  goalResults.push(
    result('G17-022', intentQ.queueDepth >= 1, String(intentQ.queueDepth))
  );

  const fp = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const pol = buildAgent17VerificationPolicy(
    { ...depthEval.ops, lastContextFingerprint: fp },
    baseState,
    'player'
  );
  goalResults.push(
    result('G17-023', pol.allowVerification === false, pol.blockingRuleIds.join(','))
  );

  const brief = depthEval.snapshot.planningDepth?.coordinationBrief;
  goalResults.push(
    result(
      'G17-024',
      !!brief && coordinationBriefReadyForGi(brief),
      brief?.giHandoffTags?.join(',') || 'none'
    )
  );

  const pacing = depthEval.snapshot.planningDepth?.executionPacing;
  goalResults.push(
    result(
      'G17-025',
      !!pacing &&
        typeof pacing.turnBudgetRemaining === 'number' &&
        (pacing.pacingBand === 'steady' ||
          pacing.pacingBand === 'urgent' ||
          pacing.pacingBand === 'throttled'),
      pacing?.pacingBand || 'none'
    )
  );

  const scorecard = depthEval.snapshot.planningDepth?.resilienceScorecard;
  goalResults.push(
    result(
      'G17-026',
      !!scorecard &&
        scorecard.compositeIndex >= 0 &&
        scorecard.compositeIndex <= 100 &&
        scorecard.mitigationHints.length >= 1,
      String(scorecard?.compositeIndex)
    )
  );

  const fpHold = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const pacingHeld = buildAgent17ExecutionPacing(
    { ...depthEval.ops, lastContextFingerprint: fpHold },
    baseState,
    assessAgent17PlanHealth(depthEval.ops.activePlan, baseState, 'player'),
    buildAgent17VerificationPolicy(
      { ...depthEval.ops, lastContextFingerprint: fpHold },
      baseState,
      'player'
    )
  );
  goalResults.push(
    result(
      'G17-027',
      pacingHeld.pacingBand === 'throttled' || !pacingHeld.verificationGateOpen,
      `${pacingHeld.pacingBand} gate=${pacingHeld.verificationGateOpen}`
    )
  );

  const strat = depthEval.snapshot.planningDepth?.strategicAlignment;
  goalResults.push(
    result(
      'G17-028',
      !!strat &&
        strat.alignmentIndex >= 0 &&
        strat.alignmentIndex <= 100 &&
        (strat.band === 'aligned' || strat.band === 'drifting' || strat.band === 'divergent'),
      `${strat?.alignmentIndex}/${strat?.band}`
    )
  );

  const handoff = depthEval.snapshot.planningDepth?.handoffReadiness;
  goalResults.push(
    result(
      'G17-029',
      !!handoff &&
        handoff.checks.length >= 5 &&
        handoff.readinessScore >= 0 &&
        handoff.readinessScore <= 100,
      `checks=${handoff?.checks.length} score=${handoff?.readinessScore}`
    )
  );

  const fpBlock = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const blockedHandoff = buildAgent17HandoffReadiness({
    coordinationBrief: brief!,
    verificationPolicy: buildAgent17VerificationPolicy(
      { ...depthEval.ops, lastContextFingerprint: fpBlock },
      baseState,
      'player'
    ),
    executionPacing: pacingHeld,
    resilienceScorecard: scorecard!,
    strategicAlignment: strat!,
  });
  goalResults.push(
    result(
      'G17-030',
      blockedHandoff.blockers.includes('verify_gate') || handoffReadinessBlocked(blockedHandoff),
      blockedHandoff.blockers.join(',')
    )
  );

  const posture = depthEval.snapshot.planningDepth?.commandPosture;
  goalResults.push(
    result(
      'G17-031',
      !!posture &&
        posture.postureIndex >= 0 &&
        posture.postureIndex <= 100 &&
        (posture.band === 'commanding' ||
          posture.band === 'contested' ||
          posture.band === 'degraded'),
      `${posture?.postureIndex}/${posture?.band}`
    )
  );

  const govAudit = depthEval.snapshot.planningDepth?.governanceAudit;
  goalResults.push(
    result(
      'G17-032',
      !!govAudit &&
        govAudit.findings.length >= 4 &&
        govAudit.auditScore >= 0 &&
        govAudit.auditScore <= 100,
      `findings=${govAudit?.findings.length} score=${govAudit?.auditScore}`
    )
  );

  const breachOps: Acc17CommandCenterOpsState = {
    ...depthEval.ops,
    delegatedProjects: [
      {
        id: 'g17-breach',
        planId: 'plan',
        title: 'Advisory breach',
        delegateKind: 'team_os',
        delegateTargetId: 'team',
        status: 'active',
        authorityCeiling: 'delegated',
        assignedTurn: 1,
        assignedDay: 1,
        lastVerifiedFingerprint: '',
        notes: '',
      },
    ],
  };
  const breachAudit = buildAgent17GovernanceAudit(
    breachOps,
    { ...settings, aiCommunicationAutonomyLevel: 'advisory' },
    buildAgent17VerificationPolicy(breachOps, baseState, 'player')
  );
  goalResults.push(
    result(
      'G17-033',
      breachAudit.band === 'breach' || governanceAuditBlocksAutomation(breachAudit),
      `${breachAudit.band} critical=${breachAudit.openCriticalCount}`
    )
  );

  const matrix = depthEval.snapshot.planningDepth?.escalationMatrix;
  goalResults.push(
    result(
      'G17-034',
      !!matrix &&
        matrix.escalationIndex >= 0 &&
        matrix.escalationIndex <= 100 &&
        (matrix.band === 'none' || matrix.band === 'watch' || matrix.band === 'urgent'),
      `${matrix?.escalationIndex}/${matrix?.band}`
    )
  );

  const rollbackAssurance = depthEval.snapshot.planningDepth?.rollbackAssurance;
  goalResults.push(
    result(
      'G17-035',
      !!rollbackAssurance &&
        rollbackAssurance.checks.length >= 4 &&
        rollbackAssurance.assuranceScore >= 0 &&
        rollbackAssurance.assuranceScore <= 100,
      `checks=${rollbackAssurance?.checks.length} score=${rollbackAssurance?.assuranceScore}`
    )
  );

  const breachMatrix = buildAgent17EscalationMatrix({
    commandPosture: posture!,
    governanceAudit: breachAudit,
    handoffReadiness: handoff!,
  });
  goalResults.push(
    result(
      'G17-036',
      breachMatrix.band === 'urgent' || escalationMatrixBlocksAutomation(breachMatrix),
      `${breachMatrix.band} idx=${breachMatrix.escalationIndex}`
    )
  );

  const stabilization = depthEval.snapshot.planningDepth?.stabilizationIndex;
  goalResults.push(
    result(
      'G17-037',
      !!stabilization &&
        stabilization.stabilizationIndex >= 0 &&
        stabilization.stabilizationIndex <= 100 &&
        (stabilization.band === 'stable' ||
          stabilization.band === 'adjusting' ||
          stabilization.band === 'volatile'),
      `${stabilization?.stabilizationIndex}/${stabilization?.band}`
    )
  );

  const envelope = depthEval.snapshot.planningDepth?.commandEnvelope;
  goalResults.push(
    result(
      'G17-038',
      !!envelope &&
        envelope.signals.length >= 5 &&
        envelope.horizonTurns >= 1 &&
        envelope.delegationCap >= 1,
      `signals=${envelope?.signals.length} horizon=${envelope?.horizonTurns}`
    )
  );

  const volatileStabilization = buildAgent17StabilizationIndex({
    escalationMatrix: breachMatrix,
    rollbackAssurance: buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      breachAudit
    ),
  });
  const saturatedEnvelope = buildAgent17CommandEnvelope({
    ops: breachOps,
    executionPacing: buildAgent17ExecutionPacing(
      breachOps,
      baseState,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      buildAgent17VerificationPolicy(breachOps, baseState, 'player')
    ),
    stabilizationIndex: volatileStabilization,
  });
  goalResults.push(
    result(
      'G17-039',
      stabilizationIndexBlocksAutomation(volatileStabilization) ||
        commandEnvelopeNeedsThrottle(saturatedEnvelope),
      `${volatileStabilization.band}/${saturatedEnvelope.capacityBand}`
    )
  );

  const convergence = depthEval.snapshot.planningDepth?.convergenceIndex;
  goalResults.push(
    result(
      'G17-040',
      !!convergence &&
        convergence.convergenceIndex >= 0 &&
        convergence.convergenceIndex <= 100 &&
        (convergence.band === 'aligned' ||
          convergence.band === 'adjusting' ||
          convergence.band === 'diverging'),
      `${convergence?.convergenceIndex}/${convergence?.band}`
    )
  );

  const missionDirective = depthEval.snapshot.planningDepth?.missionDirective;
  goalResults.push(
    result(
      'G17-041',
      !!missionDirective &&
        missionDirective.lanes.length >= 5 &&
        missionDirective.clearanceScore >= 0 &&
        missionDirective.clearanceScore <= 100,
      `lanes=${missionDirective?.lanes.length} score=${missionDirective?.clearanceScore}`
    )
  );

  const divergingConvergence = buildAgent17ConvergenceIndex({
    commandEnvelope: saturatedEnvelope,
    stabilizationIndex: volatileStabilization,
    strategicAlignment: depthEval.snapshot.planningDepth!.strategicAlignment,
  });
  const heldDirective = buildAgent17MissionDirective({
    intentQueue: depthEval.snapshot.planningDepth!.intentQueue,
    commandEnvelope: saturatedEnvelope,
    convergenceIndex: divergingConvergence,
  });
  goalResults.push(
    result(
      'G17-042',
      convergenceIndexBlocksDirective(divergingConvergence) ||
        missionDirectiveBlocksExecution(heldDirective),
      `${divergingConvergence.band}/${heldDirective.band}`
    )
  );

  const directiveSynthesis = depthEval.snapshot.planningDepth?.directiveSynthesis;
  goalResults.push(
    result(
      'G17-043',
      !!directiveSynthesis &&
        directiveSynthesis.synthesisIndex >= 0 &&
        directiveSynthesis.synthesisIndex <= 100 &&
        (directiveSynthesis.band === 'ready' ||
          directiveSynthesis.band === 'pending' ||
          directiveSynthesis.band === 'locked'),
      `${directiveSynthesis?.synthesisIndex}/${directiveSynthesis?.band}`
    )
  );

  const executionClosure = depthEval.snapshot.planningDepth?.executionClosure;
  goalResults.push(
    result(
      'G17-044',
      !!executionClosure &&
        executionClosure.checkpoints.length >= 5 &&
        executionClosure.closureScore >= 0 &&
        executionClosure.closureScore <= 100,
      `checks=${executionClosure?.checkpoints.length} score=${executionClosure?.closureScore}`
    )
  );

  const lockedSynthesis = buildAgent17DirectiveSynthesis({
    missionDirective: heldDirective,
    convergenceIndex: divergingConvergence,
    intentQueue: depthEval.snapshot.planningDepth!.intentQueue,
  });
  const sealedClosure = buildAgent17ExecutionClosure({
    directiveSynthesis: lockedSynthesis,
    executionPacing: buildAgent17ExecutionPacing(
      breachOps,
      baseState,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      buildAgent17VerificationPolicy(breachOps, baseState, 'player')
    ),
    missionDirective: heldDirective,
  });
  goalResults.push(
    result(
      'G17-045',
      directiveSynthesisBlocksAdvance(lockedSynthesis) ||
        executionClosureBlocksAdvance(sealedClosure),
      `${lockedSynthesis.band}/${sealedClosure.band}`
    )
  );

  const cadenceLattice = depthEval.snapshot.planningDepth?.cadenceLattice;
  goalResults.push(
    result(
      'G17-046',
      !!cadenceLattice &&
        cadenceLattice.cadenceIndex >= 0 &&
        cadenceLattice.cadenceIndex <= 100 &&
        (cadenceLattice.band === 'flowing' ||
          cadenceLattice.band === 'steady' ||
          cadenceLattice.band === 'stalled'),
      `${cadenceLattice?.cadenceIndex}/${cadenceLattice?.band}`
    )
  );

  const readinessGate = depthEval.snapshot.planningDepth?.readinessGate;
  goalResults.push(
    result(
      'G17-047',
      !!readinessGate &&
        readinessGate.signals.length >= 5 &&
        readinessGate.readinessScore >= 0 &&
        readinessGate.readinessScore <= 100,
      `signals=${readinessGate?.signals.length} score=${readinessGate?.readinessScore}`
    )
  );

  const stalledCadence = buildAgent17CadenceLattice({
    executionClosure: sealedClosure,
    directiveSynthesis: lockedSynthesis,
    executionPacing: buildAgent17ExecutionPacing(
      breachOps,
      baseState,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      buildAgent17VerificationPolicy(breachOps, baseState, 'player')
    ),
  });
  const stopReadiness = buildAgent17ReadinessGate({
    cadenceLattice: stalledCadence,
    handoffReadiness: handoff!,
    coordinationBrief: depthEval.snapshot.planningDepth!.coordinationBrief,
  });
  goalResults.push(
    result(
      'G17-048',
      cadenceLatticeBlocksRun(stalledCadence) || readinessGateBlocksRun(stopReadiness),
      `${stalledCadence.band}/${stopReadiness.band}`
    )
  );

  const pulseIndexSnap = depthEval.snapshot.planningDepth?.pulseIndex;
  goalResults.push(
    result(
      'G17-049',
      !!pulseIndexSnap &&
        pulseIndexSnap.pulseIndex >= 0 &&
        pulseIndexSnap.pulseIndex <= 100 &&
        (pulseIndexSnap.band === 'strong' ||
          pulseIndexSnap.band === 'moderate' ||
          pulseIndexSnap.band === 'flat'),
      `${pulseIndexSnap?.pulseIndex}/${pulseIndexSnap?.band}`
    )
  );

  const continuityBridge = depthEval.snapshot.planningDepth?.continuityBridge;
  goalResults.push(
    result(
      'G17-050',
      !!continuityBridge &&
        continuityBridge.links.length >= 5 &&
        continuityBridge.bridgeScore >= 0 &&
        continuityBridge.bridgeScore <= 100,
      `links=${continuityBridge?.links.length} score=${continuityBridge?.bridgeScore}`
    )
  );

  const flatPulse = buildAgent17PulseIndex({
    readinessGate: stopReadiness,
    cadenceLattice: stalledCadence,
    commandPosture: posture!,
  });
  const brokenBridge = buildAgent17ContinuityBridge({
    pulseIndex: flatPulse,
    resilienceScorecard: buildAgent17ResilienceScorecard(
      breachOps,
      baseState,
      'player',
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      buildAgent17VerificationPolicy(breachOps, baseState, 'player')
    ),
    verificationPolicy: buildAgent17VerificationPolicy(breachOps, baseState, 'player'),
  });
  goalResults.push(
    result(
      'G17-051',
      pulseIndexBlocksContinuity(flatPulse) || continuityBridgeBlocksHandoff(brokenBridge),
      `${flatPulse.band}/${brokenBridge.band}`
    )
  );

  const fluxIndexSnap = depthEval.snapshot.planningDepth?.fluxIndex;
  goalResults.push(
    result(
      'G17-052',
      !!fluxIndexSnap &&
        fluxIndexSnap.fluxIndex >= 0 &&
        fluxIndexSnap.fluxIndex <= 100 &&
        (fluxIndexSnap.band === 'coherent' ||
          fluxIndexSnap.band === 'noisy' ||
          fluxIndexSnap.band === 'disrupted'),
      `${fluxIndexSnap?.fluxIndex}/${fluxIndexSnap?.band}`
    )
  );

  const integritySeal = depthEval.snapshot.planningDepth?.integritySeal;
  goalResults.push(
    result(
      'G17-053',
      !!integritySeal &&
        integritySeal.facets.length >= 5 &&
        integritySeal.sealScore >= 0 &&
        integritySeal.sealScore <= 100,
      `facets=${integritySeal?.facets.length} score=${integritySeal?.sealScore}`
    )
  );

  const disruptedFlux = buildAgent17FluxIndex({
    continuityBridge: brokenBridge,
    pulseIndex: flatPulse,
    governanceAudit: breachAudit,
  });
  const breachedSeal = buildAgent17IntegritySeal({
    fluxIndex: disruptedFlux,
    rollbackAssurance: buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      breachAudit
    ),
    verificationPolicy: buildAgent17VerificationPolicy(breachOps, baseState, 'player'),
  });
  goalResults.push(
    result(
      'G17-054',
      fluxIndexBlocksSeal(disruptedFlux) || integritySealBlocksCommit(breachedSeal),
      `${disruptedFlux.band}/${breachedSeal.band}`
    )
  );

  const commitLattice = depthEval.snapshot.planningDepth?.commitLattice;
  goalResults.push(
    result(
      'G17-055',
      !!commitLattice &&
        commitLattice.latticeScore >= 0 &&
        commitLattice.latticeScore <= 100 &&
        (commitLattice.band === 'bound' ||
          commitLattice.band === 'flex' ||
          commitLattice.band === 'fragmented'),
      `${commitLattice?.latticeScore}/${commitLattice?.band}`
    )
  );

  const covenantGate = depthEval.snapshot.planningDepth?.covenantGate;
  goalResults.push(
    result(
      'G17-056',
      !!covenantGate &&
        covenantGate.clauses.length >= 5 &&
        covenantGate.covenantScore >= 0 &&
        covenantGate.covenantScore <= 100,
      `clauses=${covenantGate?.clauses.length} score=${covenantGate?.covenantScore}`
    )
  );

  const fragmentedLattice = buildAgent17CommitLattice({
    integritySeal: breachedSeal,
    fluxIndex: disruptedFlux,
    escalationMatrix: breachMatrix,
  });
  const voidCovenant = buildAgent17CovenantGate({
    commitLattice: fragmentedLattice,
    planHealth: assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
    rollbackAssurance: buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, baseState, 'player'),
      breachAudit
    ),
  });
  goalResults.push(
    result(
      'G17-057',
      commitLatticeBlocksCovenant(fragmentedLattice) || covenantGateBlocksOps(voidCovenant),
      `${fragmentedLattice.band}/${voidCovenant.band}`
    )
  );

  const mandateWeave = depthEval.snapshot.planningDepth?.mandateWeave;
  goalResults.push(
    result(
      'G17-058',
      !!mandateWeave &&
        mandateWeave.weaveScore >= 0 &&
        mandateWeave.weaveScore <= 100 &&
        (mandateWeave.band === 'aligned' ||
          mandateWeave.band === 'tensioned' ||
          mandateWeave.band === 'frayed'),
      `${mandateWeave?.weaveScore}/${mandateWeave?.band}`
    )
  );

  const sovereigntyLock = depthEval.snapshot.planningDepth?.sovereigntyLock;
  goalResults.push(
    result(
      'G17-059',
      !!sovereigntyLock &&
        sovereigntyLock.pins.length >= 5 &&
        sovereigntyLock.lockScore >= 0 &&
        sovereigntyLock.lockScore <= 100,
      `pins=${sovereigntyLock?.pins.length} score=${sovereigntyLock?.lockScore}`
    )
  );

  const frayedWeave = buildAgent17MandateWeave({
    covenantGate: voidCovenant,
    commitLattice: fragmentedLattice,
    strategicAlignment: depthEval.snapshot.planningDepth!.strategicAlignment,
  });
  const releasedLock = buildAgent17SovereigntyLock({
    mandateWeave: frayedWeave,
    governanceAudit: breachAudit,
    stabilizationIndex: volatileStabilization,
  });
  goalResults.push(
    result(
      'G17-060',
      mandateWeaveBlocksSovereignty(frayedWeave) || sovereigntyLockBlocksCommand(releasedLock),
      `${frayedWeave.band}/${releasedLock.band}`
    )
  );

  const authorityCharter = depthEval.snapshot.planningDepth?.authorityCharter;
  goalResults.push(
    result(
      'G17-061',
      !!authorityCharter &&
        authorityCharter.articles.length >= 5 &&
        authorityCharter.charterScore >= 0 &&
        authorityCharter.charterScore <= 100 &&
        (authorityCharter.band === 'chartered' ||
          authorityCharter.band === 'provisional' ||
          authorityCharter.band === 'revoked'),
      `articles=${authorityCharter?.articles.length} score=${authorityCharter?.charterScore}`
    )
  );

  const dispatchAccord = depthEval.snapshot.planningDepth?.dispatchAccord;
  goalResults.push(
    result(
      'G17-062',
      !!dispatchAccord &&
        dispatchAccord.provisions.length >= 5 &&
        dispatchAccord.accordScore >= 0 &&
        dispatchAccord.accordScore <= 100,
      `provisions=${dispatchAccord?.provisions.length} score=${dispatchAccord?.accordScore}`
    )
  );

  const revokedCharter = buildAgent17AuthorityCharter({
    sovereigntyLock: releasedLock,
    mandateWeave: frayedWeave,
    commandPosture: depthEval.snapshot.planningDepth!.commandPosture,
  });
  const voidAccord = buildAgent17DispatchAccord({
    authorityCharter: revokedCharter,
    sovereigntyLock: releasedLock,
    delegationLadder: depthEval.snapshot.planningDepth!.delegationLadder,
  });
  goalResults.push(
    result(
      'G17-063',
      sovereigntyLockBlocksCommand(releasedLock) ||
        authorityCharterBlocksAccord(revokedCharter) ||
        dispatchAccordBlocksDispatch(voidAccord),
      `${revokedCharter.band}/${voidAccord.band}`
    )
  );

  const mobilizationIndex = depthEval.snapshot.planningDepth?.mobilizationIndex;
  goalResults.push(
    result(
      'G17-064',
      !!mobilizationIndex &&
        mobilizationIndex.vectors.length >= 5 &&
        mobilizationIndex.mobilizationScore >= 0 &&
        mobilizationIndex.mobilizationScore <= 100 &&
        (mobilizationIndex.band === 'mobilized' ||
          mobilizationIndex.band === 'forming' ||
          mobilizationIndex.band === 'stalled'),
      `vectors=${mobilizationIndex?.vectors.length} score=${mobilizationIndex?.mobilizationScore}`
    )
  );

  const executionSummons = depthEval.snapshot.planningDepth?.executionSummons;
  goalResults.push(
    result(
      'G17-065',
      !!executionSummons &&
        executionSummons.clauses.length >= 5 &&
        executionSummons.summonsScore >= 0 &&
        executionSummons.summonsScore <= 100,
      `clauses=${executionSummons?.clauses.length} score=${executionSummons?.summonsScore}`
    )
  );

  const stalledMobilization = buildAgent17MobilizationIndex({
    dispatchAccord: voidAccord,
    coordinationBrief: depthEval.snapshot.planningDepth!.coordinationBrief,
    executionPacing: depthEval.snapshot.planningDepth!.executionPacing,
  });
  const revokedSummons = buildAgent17ExecutionSummons({
    mobilizationIndex: stalledMobilization,
    dispatchAccord: voidAccord,
    missionDirective: depthEval.snapshot.planningDepth!.missionDirective,
  });
  goalResults.push(
    result(
      'G17-066',
      dispatchAccordBlocksDispatch(voidAccord) ||
        mobilizationIndexBlocksSummons(stalledMobilization) ||
        executionSummonsBlocksField(revokedSummons),
      `${stalledMobilization.band}/${revokedSummons.band}`
    )
  );

  const fieldIndex = depthEval.snapshot.planningDepth?.fieldIndex;
  goalResults.push(
    result(
      'G17-067',
      !!fieldIndex &&
        fieldIndex.vectors.length >= 5 &&
        fieldIndex.fieldScore >= 0 &&
        fieldIndex.fieldScore <= 100 &&
        (fieldIndex.band === 'engaged' ||
          fieldIndex.band === 'staging' ||
          fieldIndex.band === 'contested'),
      `vectors=${fieldIndex?.vectors.length} score=${fieldIndex?.fieldScore}`
    )
  );

  const theaterCommitment = depthEval.snapshot.planningDepth?.theaterCommitment;
  goalResults.push(
    result(
      'G17-068',
      !!theaterCommitment &&
        theaterCommitment.pledges.length >= 5 &&
        theaterCommitment.commitmentScore >= 0 &&
        theaterCommitment.commitmentScore <= 100,
      `pledges=${theaterCommitment?.pledges.length} score=${theaterCommitment?.commitmentScore}`
    )
  );

  const contestedField = buildAgent17FieldIndex({
    executionSummons: revokedSummons,
    coordinationBrief: depthEval.snapshot.planningDepth!.coordinationBrief,
    executionClosure: depthEval.snapshot.planningDepth!.executionClosure,
  });
  const withdrawnTheater = buildAgent17TheaterCommitment({
    fieldIndex: contestedField,
    executionSummons: revokedSummons,
    readinessGate: depthEval.snapshot.planningDepth!.readinessGate,
  });
  goalResults.push(
    result(
      'G17-069',
      executionSummonsBlocksField(revokedSummons) ||
        fieldIndexBlocksCommitment(contestedField) ||
        theaterCommitmentBlocksTheater(withdrawnTheater),
      `${contestedField.band}/${withdrawnTheater.band}`
    )
  );

  const campaignIndex = depthEval.snapshot.planningDepth?.campaignIndex;
  goalResults.push(
    result(
      'G17-070',
      !!campaignIndex &&
        campaignIndex.vectors.length >= 5 &&
        campaignIndex.campaignScore >= 0 &&
        campaignIndex.campaignScore <= 100 &&
        (campaignIndex.band === 'active' ||
          campaignIndex.band === 'forming' ||
          campaignIndex.band === 'stalled'),
      `vectors=${campaignIndex?.vectors.length} score=${campaignIndex?.campaignScore}`
    )
  );

  const missionLattice = depthEval.snapshot.planningDepth?.missionLattice;
  goalResults.push(
    result(
      'G17-071',
      !!missionLattice &&
        missionLattice.rungs.length >= 5 &&
        missionLattice.latticeScore >= 0 &&
        missionLattice.latticeScore <= 100,
      `rungs=${missionLattice?.rungs.length} score=${missionLattice?.latticeScore}`
    )
  );

  const stalledCampaign = buildAgent17CampaignIndex({
    theaterCommitment: withdrawnTheater,
    pulseIndex: depthEval.snapshot.planningDepth!.pulseIndex,
    continuityBridge: depthEval.snapshot.planningDepth!.continuityBridge,
  });
  const collapsedLattice = buildAgent17MissionLattice({
    campaignIndex: stalledCampaign,
    theaterCommitment: withdrawnTheater,
    cadenceLattice: depthEval.snapshot.planningDepth!.cadenceLattice,
  });
  goalResults.push(
    result(
      'G17-072',
      theaterCommitmentBlocksTheater(withdrawnTheater) ||
        campaignIndexBlocksLattice(stalledCampaign) ||
        missionLatticeBlocksCampaign(collapsedLattice),
      `${stalledCampaign.band}/${collapsedLattice.band}`
    )
  );

  void buildAgent17ResilienceScorecard(
    depthEval.ops,
    baseState,
    'player',
    assessAgent17PlanHealth(depthEval.ops.activePlan, baseState, 'player'),
    buildAgent17VerificationPolicy(depthEval.ops, baseState, 'player')
  );

  const passedCount = goalResults.filter(r => r.passed).length;
  const failedCount = goalResults.length - passedCount;
  return {
    timestamp: Date.now(),
    goalResults,
    passedCount,
    failedCount,
    success: failedCount === 0,
  };
}

export function assertAgent17Goals(ctx: GoalVerificationContext): void {
  const report = verifyAgent17Goals(ctx);
  if (!report.success) {
    const failed = report.goalResults.filter(r => !r.passed).map(r => r.goalId);
    throw new Error(`Agent 17 goal verification failed: ${failed.join(', ')}`);
  }
}

/** Cross-check registry ids vs verification set. */
export function validateGoalRegistryCoverage(): { ok: boolean; missing: string[] } {
  const verifiedIds = new Set([
    'G17-001',
    'G17-002',
    'G17-003',
    'G17-004',
    'G17-005',
    'G17-006',
    'G17-007',
    'G17-008',
    'G17-009',
    'G17-010',
    'G17-011',
    'G17-012',
    'G17-013',
    'G17-014',
    'G17-015',
    'G17-016',
    'G17-017',
    'G17-018',
    'G17-019',
    'G17-020',
    'G17-021',
    'G17-022',
    'G17-023',
    'G17-024',
    'G17-025',
    'G17-026',
    'G17-027',
    'G17-028',
    'G17-029',
    'G17-030',
    'G17-031',
    'G17-032',
    'G17-033',
    'G17-034',
    'G17-035',
    'G17-036',
    'G17-037',
    'G17-038',
    'G17-039',
    'G17-040',
    'G17-041',
    'G17-042',
    'G17-043',
    'G17-044',
    'G17-045',
    'G17-046',
    'G17-047',
    'G17-048',
    'G17-049',
    'G17-050',
    'G17-051',
    'G17-052',
    'G17-053',
    'G17-054',
    'G17-055',
    'G17-056',
    'G17-057',
    'G17-058',
    'G17-059',
    'G17-060',
    'G17-061',
    'G17-062',
    'G17-063',
    'G17-064',
    'G17-065',
    'G17-066',
    'G17-067',
    'G17-068',
    'G17-069',
    'G17-070',
    'G17-071',
    'G17-072',
  ]);
  const missing = AGENT17_GOAL_REGISTRY.filter(g => !verifiedIds.has(g.id)).map(g => g.id);
  return { ok: missing.length === 0, missing };
}
