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
  buildAgent17StrategicIndex,
  strategicIndexBlocksDoctrine,
} from '../planning/strategic-index.ts';
import {
  buildAgent17DoctrineAccord,
  doctrineAccordBlocksCommand,
} from '../planning/doctrine-accord.ts';
import {
  buildAgent17CommandIndex,
  commandIndexBlocksFederation,
} from '../planning/command-index.ts';
import {
  buildAgent17FederationAccord,
  federationAccordBlocksOps,
} from '../planning/federation-accord.ts';
import {
  buildAgent17AllianceIndex,
  allianceIndexBlocksCoalition,
} from '../planning/alliance-index.ts';
import {
  buildAgent17CoalitionAccord,
  coalitionAccordBlocksAlliance,
} from '../planning/coalition-accord.ts';
import {
  buildAgent17PactIndex,
  pactIndexBlocksUnity,
} from '../planning/pact-index.ts';
import {
  buildAgent17UnityAccord,
  unityAccordBlocksPact,
} from '../planning/unity-accord.ts';
import {
  buildAgent17CompactIndex,
  compactIndexBlocksSovereign,
} from '../planning/compact-index.ts';
import {
  buildAgent17SovereignAccord,
  sovereignAccordBlocksCompact,
} from '../planning/sovereign-accord.ts';
import {
  buildAgent17CrownIndex,
  crownIndexBlocksImperial,
} from '../planning/crown-index.ts';
import {
  buildAgent17ImperialAccord,
  imperialAccordBlocksCrown,
  imperialAccordBlocksThrone,
} from '../planning/imperial-accord.ts';
import {
  buildAgent17ThroneIndex,
  throneIndexBlocksDynasty,
} from '../planning/throne-index.ts';
import {
  buildAgent17DynastyAccord,
  dynastyAccordBlocksThrone,
  dynastyAccordBlocksRealm,
} from '../planning/dynasty-accord.ts';
import {
  buildAgent17RealmIndex,
  realmIndexBlocksSuccession,
} from '../planning/realm-index.ts';
import {
  buildAgent17SuccessionAccord,
  successionAccordBlocksRealm,
  successionAccordBlocksCanon,
} from '../planning/succession-accord.ts';
import {
  buildAgent17CanonIndex,
  canonIndexBlocksLegitimacy,
} from '../planning/canon-index.ts';
import {
  buildAgent17LegitimacyAccord,
  legitimacyAccordBlocksCanon,
  legitimacyAccordBlocksCharter,
} from '../planning/legitimacy-accord.ts';
import {
  buildAgent17CharterIndex,
  charterIndexBlocksSanction,
} from '../planning/charter-index.ts';
import {
  buildAgent17SanctionAccord,
  sanctionAccordBlocksCharter,
  sanctionAccordBlocksStatute,
} from '../planning/sanction-accord.ts';
import {
  buildAgent17StatuteIndex,
  statuteIndexBlocksCompliance,
} from '../planning/statute-index.ts';
import {
  buildAgent17ComplianceAccord,
  complianceAccordBlocksStatute,
  complianceAccordBlocksAudit,
} from '../planning/compliance-accord.ts';
import {
  buildAgent17AuditIndex,
  auditIndexBlocksAttestation,
} from '../planning/audit-index.ts';
import {
  buildAgent17AttestationAccord,
  attestationAccordBlocksAudit,
  attestationAccordBlocksRegistry,
} from '../planning/attestation-accord.ts';
import {
  buildAgent17RegistryIndex,
  registryIndexBlocksCredential,
} from '../planning/registry-index.ts';
import {
  buildAgent17CredentialAccord,
  credentialAccordBlocksRegistry,
  credentialAccordBlocksLedger,
} from '../planning/credential-accord.ts';
import {
  buildAgent17LedgerIndex,
  ledgerIndexBlocksEndorsement,
} from '../planning/ledger-index.ts';
import {
  buildAgent17EndorsementAccord,
  endorsementAccordBlocksLedger,
  endorsementAccordBlocksCustody,
} from '../planning/endorsement-accord.ts';
import {
  buildAgent17CustodyIndex,
  custodyIndexBlocksRelease,
} from '../planning/custody-index.ts';
import {
  buildAgent17ReleaseAccord,
  releaseAccordBlocksCustody,
  releaseAccordBlocksVault,
} from '../planning/release-accord.ts';
import {
  buildAgent17VaultIndex,
  vaultIndexBlocksTransfer,
} from '../planning/vault-index.ts';
import {
  buildAgent17TransferAccord,
  transferAccordBlocksVault,
  transferAccordBlocksSettlement,
} from '../planning/transfer-accord.ts';
import {
  buildAgent17SettlementIndex,
  settlementIndexBlocksClosure,
} from '../planning/settlement-index.ts';
import {
  buildAgent17ClosureAccord,
  closureAccordBlocksSettlement,
} from '../planning/closure-accord.ts';
import {
  buildAgent17ReconciliationIndex,
  reconciliationIndexBlocksFinality,
} from '../planning/reconciliation-index.ts';
import {
  buildAgent17FinalityAccord,
  finalityAccordBlocksReconciliation,
} from '../planning/finality-accord.ts';
import {
  buildAgent17ArchiveIndex,
  archiveIndexBlocksPermanence,
} from '../planning/archive-index.ts';
import {
  buildAgent17PermanenceAccord,
  permanenceAccordBlocksArchive,
} from '../planning/permanence-accord.ts';
import {
  buildAgent17LineageIndex,
  lineageIndexBlocksProvenance,
} from '../planning/lineage-index.ts';
import {
  buildAgent17ProvenanceAccord,
  provenanceAccordBlocksLineage,
} from '../planning/provenance-accord.ts';
import {
  buildAgent17WitnessIndex,
  witnessIndexBlocksTestament,
} from '../planning/witness-index.ts';
import {
  buildAgent17TestamentAccord,
  testamentAccordBlocksWitness,
} from '../planning/testament-accord.ts';
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

  const strategicIndex = depthEval.snapshot.planningDepth?.strategicIndex;
  goalResults.push(
    result(
      'G17-073',
      !!strategicIndex &&
        strategicIndex.signals.length >= 5 &&
        strategicIndex.strategicScore >= 0 &&
        strategicIndex.strategicScore <= 100 &&
        (strategicIndex.band === 'coherent' ||
          strategicIndex.band === 'forming' ||
          strategicIndex.band === 'fractured'),
      `signals=${strategicIndex?.signals.length} score=${strategicIndex?.strategicScore}`
    )
  );

  const doctrineAccord = depthEval.snapshot.planningDepth?.doctrineAccord;
  goalResults.push(
    result(
      'G17-074',
      !!doctrineAccord &&
        doctrineAccord.articles.length >= 5 &&
        doctrineAccord.doctrineScore >= 0 &&
        doctrineAccord.doctrineScore <= 100,
      `articles=${doctrineAccord?.articles.length} score=${doctrineAccord?.doctrineScore}`
    )
  );

  const fracturedStrategic = buildAgent17StrategicIndex({
    missionLattice: collapsedLattice,
    convergenceIndex: depthEval.snapshot.planningDepth!.convergenceIndex,
    commandEnvelope: depthEval.snapshot.planningDepth!.commandEnvelope,
  });
  const voidDoctrine = buildAgent17DoctrineAccord({
    strategicIndex: fracturedStrategic,
    missionLattice: collapsedLattice,
    covenantGate: depthEval.snapshot.planningDepth!.covenantGate,
  });
  goalResults.push(
    result(
      'G17-075',
      missionLatticeBlocksCampaign(collapsedLattice) ||
        strategicIndexBlocksDoctrine(fracturedStrategic) ||
        doctrineAccordBlocksCommand(voidDoctrine),
      `${fracturedStrategic.band}/${voidDoctrine.band}`
    )
  );

  const commandIndex = depthEval.snapshot.planningDepth?.commandIndex;
  goalResults.push(
    result(
      'G17-076',
      !!commandIndex &&
        commandIndex.pillars.length >= 5 &&
        commandIndex.commandScore >= 0 &&
        commandIndex.commandScore <= 100 &&
        (commandIndex.band === 'supreme' ||
          commandIndex.band === 'delegated' ||
          commandIndex.band === 'degraded'),
      `pillars=${commandIndex?.pillars.length} score=${commandIndex?.commandScore}`
    )
  );

  const federationAccord = depthEval.snapshot.planningDepth?.federationAccord;
  goalResults.push(
    result(
      'G17-077',
      !!federationAccord &&
        federationAccord.covenants.length >= 5 &&
        federationAccord.federationScore >= 0 &&
        federationAccord.federationScore <= 100,
      `covenants=${federationAccord?.covenants.length} score=${federationAccord?.federationScore}`
    )
  );

  const degradedCommand = buildAgent17CommandIndex({
    doctrineAccord: voidDoctrine,
    mandateWeave: depthEval.snapshot.planningDepth!.mandateWeave,
    sovereigntyLock: depthEval.snapshot.planningDepth!.sovereigntyLock,
  });
  const dissolvedFederation = buildAgent17FederationAccord({
    commandIndex: degradedCommand,
    doctrineAccord: voidDoctrine,
    commitLattice: depthEval.snapshot.planningDepth!.commitLattice,
  });
  goalResults.push(
    result(
      'G17-078',
      doctrineAccordBlocksCommand(voidDoctrine) ||
        commandIndexBlocksFederation(degradedCommand) ||
        federationAccordBlocksOps(dissolvedFederation),
      `${degradedCommand.band}/${dissolvedFederation.band}`
    )
  );

  const allianceIndex = depthEval.snapshot.planningDepth?.allianceIndex;
  goalResults.push(
    result(
      'G17-079',
      !!allianceIndex &&
        allianceIndex.ties.length >= 5 &&
        allianceIndex.allianceScore >= 0 &&
        allianceIndex.allianceScore <= 100 &&
        (allianceIndex.band === 'allied' ||
          allianceIndex.band === 'forming' ||
          allianceIndex.band === 'ruptured'),
      `ties=${allianceIndex?.ties.length} score=${allianceIndex?.allianceScore}`
    )
  );

  const coalitionAccord = depthEval.snapshot.planningDepth?.coalitionAccord;
  goalResults.push(
    result(
      'G17-080',
      !!coalitionAccord &&
        coalitionAccord.compacts.length >= 5 &&
        coalitionAccord.coalitionScore >= 0 &&
        coalitionAccord.coalitionScore <= 100,
      `compacts=${coalitionAccord?.compacts.length} score=${coalitionAccord?.coalitionScore}`
    )
  );

  const rupturedAlliance = buildAgent17AllianceIndex({
    federationAccord: dissolvedFederation,
    dispatchAccord: voidAccord,
    authorityCharter: revokedCharter,
  });
  const brokenCoalition = buildAgent17CoalitionAccord({
    allianceIndex: rupturedAlliance,
    federationAccord: dissolvedFederation,
    mobilizationIndex: stalledMobilization,
  });
  goalResults.push(
    result(
      'G17-081',
      federationAccordBlocksOps(dissolvedFederation) ||
        allianceIndexBlocksCoalition(rupturedAlliance) ||
        coalitionAccordBlocksAlliance(brokenCoalition),
      `${rupturedAlliance.band}/${brokenCoalition.band}`
    )
  );

  const pactIndex = depthEval.snapshot.planningDepth?.pactIndex;
  goalResults.push(
    result(
      'G17-082',
      !!pactIndex &&
        pactIndex.clauses.length >= 5 &&
        pactIndex.pactScore >= 0 &&
        pactIndex.pactScore <= 100 &&
        (pactIndex.band === 'binding' ||
          pactIndex.band === 'provisional' ||
          pactIndex.band === 'void'),
      `clauses=${pactIndex?.clauses.length} score=${pactIndex?.pactScore}`
    )
  );

  const unityAccord = depthEval.snapshot.planningDepth?.unityAccord;
  goalResults.push(
    result(
      'G17-083',
      !!unityAccord &&
        unityAccord.tenets.length >= 5 &&
        unityAccord.unityScore >= 0 &&
        unityAccord.unityScore <= 100,
      `tenets=${unityAccord?.tenets.length} score=${unityAccord?.unityScore}`
    )
  );

  const voidPact = buildAgent17PactIndex({
    coalitionAccord: brokenCoalition,
    theaterCommitment: withdrawnTheater,
    executionSummons: revokedSummons,
  });
  const shatteredUnity = buildAgent17UnityAccord({
    pactIndex: voidPact,
    coalitionAccord: brokenCoalition,
    strategicIndex: fracturedStrategic,
  });
  goalResults.push(
    result(
      'G17-084',
      coalitionAccordBlocksAlliance(brokenCoalition) ||
        pactIndexBlocksUnity(voidPact) ||
        unityAccordBlocksPact(shatteredUnity),
      `${voidPact.band}/${shatteredUnity.band}`
    )
  );

  const compactIndex = depthEval.snapshot.planningDepth?.compactIndex;
  goalResults.push(
    result(
      'G17-085',
      !!compactIndex &&
        compactIndex.facets.length >= 5 &&
        compactIndex.compactScore >= 0 &&
        compactIndex.compactScore <= 100 &&
        (compactIndex.band === 'tight' ||
          compactIndex.band === 'forming' ||
          compactIndex.band === 'loose'),
      `facets=${compactIndex?.facets.length} score=${compactIndex?.compactScore}`
    )
  );

  const sovereignAccord = depthEval.snapshot.planningDepth?.sovereignAccord;
  goalResults.push(
    result(
      'G17-086',
      !!sovereignAccord &&
        sovereignAccord.seals.length >= 5 &&
        sovereignAccord.sovereignScore >= 0 &&
        sovereignAccord.sovereignScore <= 100,
      `seals=${sovereignAccord?.seals.length} score=${sovereignAccord?.sovereignScore}`
    )
  );

  const looseCompact = buildAgent17CompactIndex({
    unityAccord: shatteredUnity,
    federationAccord: dissolvedFederation,
    doctrineAccord: voidDoctrine,
  });
  const abdicatedSovereign = buildAgent17SovereignAccord({
    compactIndex: looseCompact,
    unityAccord: shatteredUnity,
    commandIndex: degradedCommand,
  });
  goalResults.push(
    result(
      'G17-087',
      unityAccordBlocksPact(shatteredUnity) ||
        compactIndexBlocksSovereign(looseCompact) ||
        sovereignAccordBlocksCompact(abdicatedSovereign),
      `${looseCompact.band}/${abdicatedSovereign.band}`
    )
  );

  const crownIndex = depthEval.snapshot.planningDepth?.crownIndex;
  goalResults.push(
    result(
      'G17-088',
      !!crownIndex &&
        crownIndex.jewels.length >= 5 &&
        crownIndex.crownScore >= 0 &&
        crownIndex.crownScore <= 100 &&
        (crownIndex.band === 'invested' ||
          crownIndex.band === 'pending' ||
          crownIndex.band === 'uncrowned'),
      `jewels=${crownIndex?.jewels.length} score=${crownIndex?.crownScore}`
    )
  );

  const imperialAccord = depthEval.snapshot.planningDepth?.imperialAccord;
  goalResults.push(
    result(
      'G17-089',
      !!imperialAccord &&
        imperialAccord.edicts.length >= 5 &&
        imperialAccord.imperialScore >= 0 &&
        imperialAccord.imperialScore <= 100,
      `edicts=${imperialAccord?.edicts.length} score=${imperialAccord?.imperialScore}`
    )
  );

  const uncrownedCrown = buildAgent17CrownIndex({
    sovereignAccord: abdicatedSovereign,
    allianceIndex: rupturedAlliance,
    coalitionAccord: brokenCoalition,
  });
  const dissolvedImperial = buildAgent17ImperialAccord({
    crownIndex: uncrownedCrown,
    sovereignAccord: abdicatedSovereign,
    compactIndex: looseCompact,
  });
  goalResults.push(
    result(
      'G17-090',
      sovereignAccordBlocksCompact(abdicatedSovereign) ||
        crownIndexBlocksImperial(uncrownedCrown) ||
        imperialAccordBlocksCrown(dissolvedImperial),
      `${uncrownedCrown.band}/${dissolvedImperial.band}`
    )
  );

  const throneIndex = depthEval.snapshot.planningDepth?.throneIndex;
  goalResults.push(
    result(
      'G17-091',
      !!throneIndex &&
        throneIndex.regalia.length >= 5 &&
        throneIndex.throneScore >= 0 &&
        throneIndex.throneScore <= 100 &&
        (throneIndex.band === 'seated' ||
          throneIndex.band === 'vacant' ||
          throneIndex.band === 'usurped'),
      `regalia=${throneIndex?.regalia.length} score=${throneIndex?.throneScore}`
    )
  );

  const dynastyAccord = depthEval.snapshot.planningDepth?.dynastyAccord;
  goalResults.push(
    result(
      'G17-092',
      !!dynastyAccord &&
        dynastyAccord.charters.length >= 5 &&
        dynastyAccord.dynastyScore >= 0 &&
        dynastyAccord.dynastyScore <= 100,
      `charters=${dynastyAccord?.charters.length} score=${dynastyAccord?.dynastyScore}`
    )
  );

  const usurpedThrone = buildAgent17ThroneIndex({
    imperialAccord: dissolvedImperial,
    crownIndex: uncrownedCrown,
    coalitionAccord: brokenCoalition,
  });
  const extinctDynasty = buildAgent17DynastyAccord({
    throneIndex: usurpedThrone,
    imperialAccord: dissolvedImperial,
    crownIndex: uncrownedCrown,
  });
  goalResults.push(
    result(
      'G17-093',
      imperialAccordBlocksThrone(dissolvedImperial) ||
        throneIndexBlocksDynasty(usurpedThrone) ||
        dynastyAccordBlocksThrone(extinctDynasty),
      `${usurpedThrone.band}/${extinctDynasty.band}`
    )
  );

  const realmIndex = depthEval.snapshot.planningDepth?.realmIndex;
  goalResults.push(
    result(
      'G17-094',
      !!realmIndex &&
        realmIndex.banners.length >= 5 &&
        realmIndex.realmScore >= 0 &&
        realmIndex.realmScore <= 100 &&
        (realmIndex.band === 'unified' ||
          realmIndex.band === 'fractured' ||
          realmIndex.band === 'fallen'),
      `banners=${realmIndex?.banners.length} score=${realmIndex?.realmScore}`
    )
  );

  const successionAccord = depthEval.snapshot.planningDepth?.successionAccord;
  goalResults.push(
    result(
      'G17-095',
      !!successionAccord &&
        successionAccord.clauses.length >= 5 &&
        successionAccord.successionScore >= 0 &&
        successionAccord.successionScore <= 100,
      `clauses=${successionAccord?.clauses.length} score=${successionAccord?.successionScore}`
    )
  );

  const fallenRealm = buildAgent17RealmIndex({
    dynastyAccord: extinctDynasty,
    throneIndex: usurpedThrone,
    imperialAccord: dissolvedImperial,
  });
  const voidSuccession = buildAgent17SuccessionAccord({
    realmIndex: fallenRealm,
    dynastyAccord: extinctDynasty,
    throneIndex: usurpedThrone,
  });
  goalResults.push(
    result(
      'G17-096',
      dynastyAccordBlocksRealm(extinctDynasty) ||
        realmIndexBlocksSuccession(fallenRealm) ||
        successionAccordBlocksRealm(voidSuccession),
      `${fallenRealm.band}/${voidSuccession.band}`
    )
  );

  const canonIndex = depthEval.snapshot.planningDepth?.canonIndex;
  goalResults.push(
    result(
      'G17-097',
      !!canonIndex &&
        canonIndex.verses.length >= 5 &&
        canonIndex.canonScore >= 0 &&
        canonIndex.canonScore <= 100 &&
        (canonIndex.band === 'ratified' ||
          canonIndex.band === 'draft' ||
          canonIndex.band === 'revoked'),
      `verses=${canonIndex?.verses.length} score=${canonIndex?.canonScore}`
    )
  );

  const legitimacyAccord = depthEval.snapshot.planningDepth?.legitimacyAccord;
  goalResults.push(
    result(
      'G17-098',
      !!legitimacyAccord &&
        legitimacyAccord.proofs.length >= 5 &&
        legitimacyAccord.legitimacyScore >= 0 &&
        legitimacyAccord.legitimacyScore <= 100,
      `proofs=${legitimacyAccord?.proofs.length} score=${legitimacyAccord?.legitimacyScore}`
    )
  );

  const revokedCanon = buildAgent17CanonIndex({
    successionAccord: voidSuccession,
    realmIndex: fallenRealm,
    dynastyAccord: extinctDynasty,
  });
  const forfeitLegitimacy = buildAgent17LegitimacyAccord({
    canonIndex: revokedCanon,
    successionAccord: voidSuccession,
    realmIndex: fallenRealm,
  });
  goalResults.push(
    result(
      'G17-099',
      successionAccordBlocksCanon(voidSuccession) ||
        canonIndexBlocksLegitimacy(revokedCanon) ||
        legitimacyAccordBlocksCanon(forfeitLegitimacy),
      `${revokedCanon.band}/${forfeitLegitimacy.band}`
    )
  );

  const charterIndex = depthEval.snapshot.planningDepth?.charterIndex;
  goalResults.push(
    result(
      'G17-100',
      !!charterIndex &&
        charterIndex.articles.length >= 5 &&
        charterIndex.charterScore >= 0 &&
        charterIndex.charterScore <= 100 &&
        (charterIndex.band === 'enacted' ||
          charterIndex.band === 'pending' ||
          charterIndex.band === 'repealed'),
      `articles=${charterIndex?.articles.length} score=${charterIndex?.charterScore}`
    )
  );

  const sanctionAccord = depthEval.snapshot.planningDepth?.sanctionAccord;
  goalResults.push(
    result(
      'G17-101',
      !!sanctionAccord &&
        sanctionAccord.measures.length >= 5 &&
        sanctionAccord.sanctionScore >= 0 &&
        sanctionAccord.sanctionScore <= 100,
      `measures=${sanctionAccord?.measures.length} score=${sanctionAccord?.sanctionScore}`
    )
  );

  const repealedCharter = buildAgent17CharterIndex({
    legitimacyAccord: forfeitLegitimacy,
    canonIndex: revokedCanon,
    successionAccord: voidSuccession,
  });
  const liftedSanction = buildAgent17SanctionAccord({
    charterIndex: repealedCharter,
    legitimacyAccord: forfeitLegitimacy,
    canonIndex: revokedCanon,
  });
  goalResults.push(
    result(
      'G17-102',
      legitimacyAccordBlocksCharter(forfeitLegitimacy) ||
        charterIndexBlocksSanction(repealedCharter) ||
        sanctionAccordBlocksCharter(liftedSanction),
      `${repealedCharter.band}/${liftedSanction.band}`
    )
  );

  const statuteIndex = depthEval.snapshot.planningDepth?.statuteIndex;
  goalResults.push(
    result(
      'G17-103',
      !!statuteIndex &&
        statuteIndex.sections.length >= 5 &&
        statuteIndex.statuteScore >= 0 &&
        statuteIndex.statuteScore <= 100 &&
        (statuteIndex.band === 'codified' ||
          statuteIndex.band === 'drafting' ||
          statuteIndex.band === 'struck'),
      `sections=${statuteIndex?.sections.length} score=${statuteIndex?.statuteScore}`
    )
  );

  const complianceAccord = depthEval.snapshot.planningDepth?.complianceAccord;
  goalResults.push(
    result(
      'G17-104',
      !!complianceAccord &&
        complianceAccord.checks.length >= 5 &&
        complianceAccord.complianceScore >= 0 &&
        complianceAccord.complianceScore <= 100,
      `checks=${complianceAccord?.checks.length} score=${complianceAccord?.complianceScore}`
    )
  );

  const struckStatute = buildAgent17StatuteIndex({
    sanctionAccord: liftedSanction,
    charterIndex: repealedCharter,
    legitimacyAccord: forfeitLegitimacy,
  });
  const breachedCompliance = buildAgent17ComplianceAccord({
    statuteIndex: struckStatute,
    sanctionAccord: liftedSanction,
    charterIndex: repealedCharter,
  });
  goalResults.push(
    result(
      'G17-105',
      sanctionAccordBlocksStatute(liftedSanction) ||
        statuteIndexBlocksCompliance(struckStatute) ||
        complianceAccordBlocksStatute(breachedCompliance),
      `${struckStatute.band}/${breachedCompliance.band}`
    )
  );

  const auditIndex = depthEval.snapshot.planningDepth?.auditIndex;
  goalResults.push(
    result(
      'G17-106',
      !!auditIndex &&
        auditIndex.findings.length >= 5 &&
        auditIndex.auditScore >= 0 &&
        auditIndex.auditScore <= 100 &&
        (auditIndex.band === 'passed' ||
          auditIndex.band === 'open' ||
          auditIndex.band === 'failed'),
      `findings=${auditIndex?.findings.length} score=${auditIndex?.auditScore}`
    )
  );

  const attestationAccord = depthEval.snapshot.planningDepth?.attestationAccord;
  goalResults.push(
    result(
      'G17-107',
      !!attestationAccord &&
        attestationAccord.seals.length >= 5 &&
        attestationAccord.attestationScore >= 0 &&
        attestationAccord.attestationScore <= 100,
      `seals=${attestationAccord?.seals.length} score=${attestationAccord?.attestationScore}`
    )
  );

  const failedAudit = buildAgent17AuditIndex({
    complianceAccord: breachedCompliance,
    statuteIndex: struckStatute,
    sanctionAccord: liftedSanction,
  });
  const revokedAttestation = buildAgent17AttestationAccord({
    auditIndex: failedAudit,
    complianceAccord: breachedCompliance,
    statuteIndex: struckStatute,
  });
  goalResults.push(
    result(
      'G17-108',
      complianceAccordBlocksAudit(breachedCompliance) ||
        auditIndexBlocksAttestation(failedAudit) ||
        attestationAccordBlocksAudit(revokedAttestation),
      `${failedAudit.band}/${revokedAttestation.band}`
    )
  );

  const registryIndex = depthEval.snapshot.planningDepth?.registryIndex;
  goalResults.push(
    result(
      'G17-109',
      !!registryIndex &&
        registryIndex.entries.length >= 5 &&
        registryIndex.registryScore >= 0 &&
        registryIndex.registryScore <= 100 &&
        (registryIndex.band === 'canonical' ||
          registryIndex.band === 'provisional' ||
          registryIndex.band === 'corrupt'),
      `entries=${registryIndex?.entries.length} score=${registryIndex?.registryScore}`
    )
  );

  const credentialAccord = depthEval.snapshot.planningDepth?.credentialAccord;
  goalResults.push(
    result(
      'G17-110',
      !!credentialAccord &&
        credentialAccord.marks.length >= 5 &&
        credentialAccord.credentialScore >= 0 &&
        credentialAccord.credentialScore <= 100,
      `marks=${credentialAccord?.marks.length} score=${credentialAccord?.credentialScore}`
    )
  );

  const corruptRegistry = buildAgent17RegistryIndex({
    attestationAccord: revokedAttestation,
    auditIndex: failedAudit,
    complianceAccord: breachedCompliance,
  });
  const voidCredential = buildAgent17CredentialAccord({
    registryIndex: corruptRegistry,
    attestationAccord: revokedAttestation,
    auditIndex: failedAudit,
  });
  goalResults.push(
    result(
      'G17-111',
      attestationAccordBlocksRegistry(revokedAttestation) ||
        registryIndexBlocksCredential(corruptRegistry) ||
        credentialAccordBlocksRegistry(voidCredential),
      `${corruptRegistry.band}/${voidCredential.band}`
    )
  );

  const ledgerIndex = depthEval.snapshot.planningDepth?.ledgerIndex;
  goalResults.push(
    result(
      'G17-112',
      !!ledgerIndex &&
        ledgerIndex.postings.length >= 5 &&
        ledgerIndex.ledgerScore >= 0 &&
        ledgerIndex.ledgerScore <= 100 &&
        (ledgerIndex.band === 'balanced' ||
          ledgerIndex.band === 'open' ||
          ledgerIndex.band === 'closed'),
      `postings=${ledgerIndex?.postings.length} score=${ledgerIndex?.ledgerScore}`
    )
  );

  const endorsementAccord = depthEval.snapshot.planningDepth?.endorsementAccord;
  goalResults.push(
    result(
      'G17-113',
      !!endorsementAccord &&
        endorsementAccord.endorsements.length >= 5 &&
        endorsementAccord.endorsementScore >= 0 &&
        endorsementAccord.endorsementScore <= 100,
      `endorsements=${endorsementAccord?.endorsements.length} score=${endorsementAccord?.endorsementScore}`
    )
  );

  const closedLedger = buildAgent17LedgerIndex({
    credentialAccord: voidCredential,
    registryIndex: corruptRegistry,
    attestationAccord: revokedAttestation,
  });
  const withdrawnEndorsement = buildAgent17EndorsementAccord({
    ledgerIndex: closedLedger,
    credentialAccord: voidCredential,
    registryIndex: corruptRegistry,
  });
  goalResults.push(
    result(
      'G17-114',
      credentialAccordBlocksLedger(voidCredential) ||
        ledgerIndexBlocksEndorsement(closedLedger) ||
        endorsementAccordBlocksLedger(withdrawnEndorsement),
      `${closedLedger.band}/${withdrawnEndorsement.band}`
    )
  );

  const custodyIndex = depthEval.snapshot.planningDepth?.custodyIndex;
  goalResults.push(
    result(
      'G17-115',
      !!custodyIndex &&
        custodyIndex.holds.length >= 5 &&
        custodyIndex.custodyScore >= 0 &&
        custodyIndex.custodyScore <= 100 &&
        (custodyIndex.band === 'held' ||
          custodyIndex.band === 'partial' ||
          custodyIndex.band === 'breached'),
      `holds=${custodyIndex?.holds.length} score=${custodyIndex?.custodyScore}`
    )
  );

  const releaseAccord = depthEval.snapshot.planningDepth?.releaseAccord;
  goalResults.push(
    result(
      'G17-116',
      !!releaseAccord &&
        releaseAccord.gates.length >= 5 &&
        releaseAccord.releaseScore >= 0 &&
        releaseAccord.releaseScore <= 100,
      `gates=${releaseAccord?.gates.length} score=${releaseAccord?.releaseScore}`
    )
  );

  const breachedCustody = buildAgent17CustodyIndex({
    endorsementAccord: withdrawnEndorsement,
    ledgerIndex: closedLedger,
    credentialAccord: voidCredential,
  });
  const blockedRelease = buildAgent17ReleaseAccord({
    custodyIndex: breachedCustody,
    endorsementAccord: withdrawnEndorsement,
    ledgerIndex: closedLedger,
  });
  goalResults.push(
    result(
      'G17-117',
      endorsementAccordBlocksCustody(withdrawnEndorsement) ||
        custodyIndexBlocksRelease(breachedCustody) ||
        releaseAccordBlocksCustody(blockedRelease),
      `${breachedCustody.band}/${blockedRelease.band}`
    )
  );

  const vaultIndex = depthEval.snapshot.planningDepth?.vaultIndex;
  goalResults.push(
    result(
      'G17-118',
      !!vaultIndex &&
        vaultIndex.slots.length >= 5 &&
        vaultIndex.vaultScore >= 0 &&
        vaultIndex.vaultScore <= 100 &&
        (vaultIndex.band === 'sealed' ||
          vaultIndex.band === 'staging' ||
          vaultIndex.band === 'compromised'),
      `slots=${vaultIndex?.slots.length} score=${vaultIndex?.vaultScore}`
    )
  );

  const transferAccord = depthEval.snapshot.planningDepth?.transferAccord;
  goalResults.push(
    result(
      'G17-119',
      !!transferAccord &&
        transferAccord.legs.length >= 5 &&
        transferAccord.transferScore >= 0 &&
        transferAccord.transferScore <= 100,
      `legs=${transferAccord?.legs.length} score=${transferAccord?.transferScore}`
    )
  );

  const compromisedVault = buildAgent17VaultIndex({
    releaseAccord: blockedRelease,
    custodyIndex: breachedCustody,
    endorsementAccord: withdrawnEndorsement,
  });
  const haltedTransfer = buildAgent17TransferAccord({
    vaultIndex: compromisedVault,
    releaseAccord: blockedRelease,
    custodyIndex: breachedCustody,
  });
  goalResults.push(
    result(
      'G17-120',
      releaseAccordBlocksVault(blockedRelease) ||
        vaultIndexBlocksTransfer(compromisedVault) ||
        transferAccordBlocksVault(haltedTransfer),
      `${compromisedVault.band}/${haltedTransfer.band}`
    )
  );

  const settlementIndex = depthEval.snapshot.planningDepth?.settlementIndex;
  goalResults.push(
    result(
      'G17-121',
      !!settlementIndex &&
        settlementIndex.lines.length >= 5 &&
        settlementIndex.settlementScore >= 0 &&
        settlementIndex.settlementScore <= 100 &&
        (settlementIndex.band === 'posted' ||
          settlementIndex.band === 'pending' ||
          settlementIndex.band === 'failed'),
      `lines=${settlementIndex?.lines.length} score=${settlementIndex?.settlementScore}`
    )
  );

  const closureAccord = depthEval.snapshot.planningDepth?.closureAccord;
  goalResults.push(
    result(
      'G17-122',
      !!closureAccord &&
        closureAccord.filings.length >= 5 &&
        closureAccord.closureScore >= 0 &&
        closureAccord.closureScore <= 100,
      `filings=${closureAccord?.filings.length} score=${closureAccord?.closureScore}`
    )
  );

  const failedSettlement = buildAgent17SettlementIndex({
    transferAccord: haltedTransfer,
    vaultIndex: compromisedVault,
    releaseAccord: blockedRelease,
  });
  const reopenedClosure = buildAgent17ClosureAccord({
    settlementIndex: failedSettlement,
    transferAccord: haltedTransfer,
    vaultIndex: compromisedVault,
  });
  goalResults.push(
    result(
      'G17-123',
      transferAccordBlocksSettlement(haltedTransfer) ||
        settlementIndexBlocksClosure(failedSettlement) ||
        closureAccordBlocksSettlement(reopenedClosure),
      `${failedSettlement.band}/${reopenedClosure.band}`
    )
  );

  const reconciliationIndex = depthEval.snapshot.planningDepth?.reconciliationIndex;
  goalResults.push(
    result(
      'G17-124',
      !!reconciliationIndex &&
        reconciliationIndex.entries.length >= 5 &&
        reconciliationIndex.reconciliationScore >= 0 &&
        reconciliationIndex.reconciliationScore <= 100 &&
        (reconciliationIndex.band === 'matched' ||
          reconciliationIndex.band === 'pending' ||
          reconciliationIndex.band === 'disputed'),
      `entries=${reconciliationIndex?.entries.length} score=${reconciliationIndex?.reconciliationScore}`
    )
  );

  const finalityAccord = depthEval.snapshot.planningDepth?.finalityAccord;
  goalResults.push(
    result(
      'G17-125',
      !!finalityAccord &&
        finalityAccord.attestations.length >= 5 &&
        finalityAccord.finalityScore >= 0 &&
        finalityAccord.finalityScore <= 100,
      `attestations=${finalityAccord?.attestations.length} score=${finalityAccord?.finalityScore}`
    )
  );

  const disputedReconciliation = buildAgent17ReconciliationIndex({
    closureAccord: reopenedClosure,
    settlementIndex: failedSettlement,
    transferAccord: haltedTransfer,
  });
  const revokedFinality = buildAgent17FinalityAccord({
    reconciliationIndex: disputedReconciliation,
    closureAccord: reopenedClosure,
    settlementIndex: failedSettlement,
  });
  goalResults.push(
    result(
      'G17-126',
      settlementIndexBlocksClosure(failedSettlement) ||
        reconciliationIndexBlocksFinality(disputedReconciliation) ||
        finalityAccordBlocksReconciliation(revokedFinality),
      `${disputedReconciliation.band}/${revokedFinality.band}`
    )
  );

  const archiveIndex = depthEval.snapshot.planningDepth?.archiveIndex;
  goalResults.push(
    result(
      'G17-127',
      !!archiveIndex &&
        archiveIndex.volumes.length >= 5 &&
        archiveIndex.archiveScore >= 0 &&
        archiveIndex.archiveScore <= 100 &&
        (archiveIndex.band === 'archived' ||
          archiveIndex.band === 'pending' ||
          archiveIndex.band === 'exposed'),
      `volumes=${archiveIndex?.volumes.length} score=${archiveIndex?.archiveScore}`
    )
  );

  const permanenceAccord = depthEval.snapshot.planningDepth?.permanenceAccord;
  goalResults.push(
    result(
      'G17-128',
      !!permanenceAccord &&
        permanenceAccord.seals.length >= 5 &&
        permanenceAccord.permanenceScore >= 0 &&
        permanenceAccord.permanenceScore <= 100,
      `seals=${permanenceAccord?.seals.length} score=${permanenceAccord?.permanenceScore}`
    )
  );

  const exposedArchive = buildAgent17ArchiveIndex({
    finalityAccord: revokedFinality,
    reconciliationIndex: disputedReconciliation,
    closureAccord: reopenedClosure,
  });
  const dissolvedPermanence = buildAgent17PermanenceAccord({
    archiveIndex: exposedArchive,
    finalityAccord: revokedFinality,
    reconciliationIndex: disputedReconciliation,
  });
  goalResults.push(
    result(
      'G17-129',
      finalityAccordBlocksReconciliation(revokedFinality) ||
        archiveIndexBlocksPermanence(exposedArchive) ||
        permanenceAccordBlocksArchive(dissolvedPermanence),
      `${exposedArchive.band}/${dissolvedPermanence.band}`
    )
  );

  const lineageIndex = depthEval.snapshot.planningDepth?.lineageIndex;
  goalResults.push(
    result(
      'G17-130',
      !!lineageIndex &&
        lineageIndex.strands.length >= 5 &&
        lineageIndex.lineageScore >= 0 &&
        lineageIndex.lineageScore <= 100 &&
        (lineageIndex.band === 'rooted' ||
          lineageIndex.band === 'pending' ||
          lineageIndex.band === 'fractured'),
      `strands=${lineageIndex?.strands.length} score=${lineageIndex?.lineageScore}`
    )
  );

  const provenanceAccord = depthEval.snapshot.planningDepth?.provenanceAccord;
  goalResults.push(
    result(
      'G17-131',
      !!provenanceAccord &&
        provenanceAccord.proofs.length >= 5 &&
        provenanceAccord.provenanceScore >= 0 &&
        provenanceAccord.provenanceScore <= 100,
      `proofs=${provenanceAccord?.proofs.length} score=${provenanceAccord?.provenanceScore}`
    )
  );

  const fracturedLineage = buildAgent17LineageIndex({
    permanenceAccord: dissolvedPermanence,
    archiveIndex: exposedArchive,
    finalityAccord: revokedFinality,
  });
  const repudiatedProvenance = buildAgent17ProvenanceAccord({
    lineageIndex: fracturedLineage,
    permanenceAccord: dissolvedPermanence,
    archiveIndex: exposedArchive,
  });
  goalResults.push(
    result(
      'G17-132',
      permanenceAccordBlocksArchive(dissolvedPermanence) ||
        lineageIndexBlocksProvenance(fracturedLineage) ||
        provenanceAccordBlocksLineage(repudiatedProvenance),
      `${fracturedLineage.band}/${repudiatedProvenance.band}`
    )
  );

  const witnessIndex = depthEval.snapshot.planningDepth?.witnessIndex;
  goalResults.push(
    result(
      'G17-133',
      !!witnessIndex &&
        witnessIndex.depositions.length >= 5 &&
        witnessIndex.witnessScore >= 0 &&
        witnessIndex.witnessScore <= 100 &&
        (witnessIndex.band === 'affirmed' ||
          witnessIndex.band === 'pending' ||
          witnessIndex.band === 'contradicted'),
      `depositions=${witnessIndex?.depositions.length} score=${witnessIndex?.witnessScore}`
    )
  );

  const testamentAccord = depthEval.snapshot.planningDepth?.testamentAccord;
  goalResults.push(
    result(
      'G17-134',
      !!testamentAccord &&
        testamentAccord.clauses.length >= 5 &&
        testamentAccord.testamentScore >= 0 &&
        testamentAccord.testamentScore <= 100,
      `clauses=${testamentAccord?.clauses.length} score=${testamentAccord?.testamentScore}`
    )
  );

  const contradictedWitness = buildAgent17WitnessIndex({
    provenanceAccord: repudiatedProvenance,
    lineageIndex: fracturedLineage,
    permanenceAccord: dissolvedPermanence,
  });
  const voidedTestament = buildAgent17TestamentAccord({
    witnessIndex: contradictedWitness,
    provenanceAccord: repudiatedProvenance,
    lineageIndex: fracturedLineage,
  });
  goalResults.push(
    result(
      'G17-135',
      provenanceAccordBlocksLineage(repudiatedProvenance) ||
        witnessIndexBlocksTestament(contradictedWitness) ||
        testamentAccordBlocksWitness(voidedTestament),
      `${contradictedWitness.band}/${voidedTestament.band}`
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
    'G17-073',
    'G17-074',
    'G17-075',
    'G17-076',
    'G17-077',
    'G17-078',
    'G17-079',
    'G17-080',
    'G17-081',
    'G17-082',
    'G17-083',
    'G17-084',
    'G17-085',
    'G17-086',
    'G17-087',
    'G17-088',
    'G17-089',
    'G17-090',
    'G17-091',
    'G17-092',
    'G17-093',
    'G17-094',
    'G17-095',
    'G17-096',
    'G17-097',
    'G17-098',
    'G17-099',
    'G17-100',
    'G17-101',
    'G17-102',
    'G17-103',
    'G17-104',
    'G17-105',
    'G17-106',
    'G17-107',
    'G17-108',
    'G17-109',
    'G17-110',
    'G17-111',
    'G17-112',
    'G17-113',
    'G17-114',
    'G17-115',
    'G17-116',
    'G17-117',
    'G17-118',
    'G17-119',
    'G17-120',
    'G17-121',
    'G17-122',
    'G17-123',
    'G17-124',
    'G17-125',
    'G17-126',
    'G17-127',
    'G17-128',
    'G17-129',
    'G17-130',
    'G17-131',
    'G17-132',
    'G17-133',
    'G17-134',
    'G17-135',
  ]);
  const missing = AGENT17_GOAL_REGISTRY.filter(g => !verifiedIds.has(g.id)).map(g => g.id);
  return { ok: missing.length === 0, missing };
}
