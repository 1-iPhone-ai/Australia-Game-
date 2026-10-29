import type {
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17OperationsSnapshot,
  Agent17PlanningDepthSnapshot,
  Agent17PlanningSuggestion,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
import { assessAgent17PlanHealth, planHealthNeedsRecovery } from './plan-health.ts';
import {
  buildAgent17DelegationAnalytics,
  pickAgent17DelegateKindFromAnalytics,
} from './delegation-analytics.ts';
import {
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from './template-selector.ts';
import { detectAgent17RecoverySignals, pickAgent17RecoveryTemplateId } from './recovery-paths.ts';
import { buildAgent17DelegationLadder } from './delegation-ladder.ts';
import { summarizeAgent17PlanLedger } from './plan-ledger.ts';
import { refineAgent17DelegationSuggestion } from './delegation-depth.ts';
import { buildAgent17IntentQueue } from './intent-synthesis.ts';
import { buildAgent17VerificationPolicy } from './verification-policy.ts';
import { buildAgent17CoordinationBrief } from './coordination-brief.ts';
import { buildAgent17ExecutionPacing } from './execution-pacing.ts';
import { buildAgent17ResilienceScorecard } from './resilience-scorecard.ts';
import { buildAgent17StrategicAlignment } from './strategic-alignment.ts';
import { buildAgent17HandoffReadiness } from './handoff-readiness.ts';
import { buildAgent17CommandPosture } from './command-posture.ts';
import { buildAgent17GovernanceAudit } from './governance-audit.ts';
import { buildAgent17EscalationMatrix } from './escalation-matrix.ts';
import { buildAgent17RollbackAssurance } from './rollback-assurance.ts';
import { buildAgent17StabilizationIndex } from './stabilization-index.ts';
import { buildAgent17CommandEnvelope } from './command-envelope.ts';
import { buildAgent17ConvergenceIndex } from './convergence-index.ts';
import { buildAgent17MissionDirective } from './mission-directive.ts';
import { buildAgent17DirectiveSynthesis } from './directive-synthesis.ts';
import { buildAgent17ExecutionClosure } from './execution-closure.ts';
import { buildAgent17CadenceLattice } from './cadence-lattice.ts';
import { buildAgent17ReadinessGate } from './readiness-gate.ts';
import { buildAgent17PulseIndex } from './pulse-index.ts';
import { buildAgent17ContinuityBridge } from './continuity-bridge.ts';
import { buildAgent17FluxIndex } from './flux-index.ts';
import { buildAgent17IntegritySeal } from './integrity-seal.ts';
import { buildAgent17CommitLattice } from './commit-lattice.ts';
import { buildAgent17CovenantGate } from './covenant-gate.ts';
import { buildAgent17MandateWeave } from './mandate-weave.ts';
import { buildAgent17SovereigntyLock } from './sovereignty-lock.ts';
import { buildAgent17AuthorityCharter } from './authority-charter.ts';
import { buildAgent17DispatchAccord } from './dispatch-accord.ts';
import { buildAgent17MobilizationIndex } from './mobilization-index.ts';
import { buildAgent17ExecutionSummons } from './execution-summons.ts';
import { buildAgent17FieldIndex } from './field-index.ts';
import { buildAgent17TheaterCommitment } from './theater-commitment.ts';
import { buildAgent17CampaignIndex } from './campaign-index.ts';
import { buildAgent17MissionLattice } from './mission-lattice.ts';
import { buildAgent17StrategicIndex } from './strategic-index.ts';
import { buildAgent17DoctrineAccord } from './doctrine-accord.ts';
import { buildAgent17CommandIndex } from './command-index.ts';
import { buildAgent17FederationAccord } from './federation-accord.ts';
import { buildAgent17AllianceIndex } from './alliance-index.ts';
import { buildAgent17CoalitionAccord } from './coalition-accord.ts';
import { buildAgent17PactIndex } from './pact-index.ts';
import { buildAgent17UnityAccord } from './unity-accord.ts';
import { buildAgent17CompactIndex } from './compact-index.ts';
import { buildAgent17SovereignAccord } from './sovereign-accord.ts';
import { buildAgent17CrownIndex } from './crown-index.ts';
import { buildAgent17ImperialAccord } from './imperial-accord.ts';
import { buildAgent17ThroneIndex } from './throne-index.ts';
import { buildAgent17DynastyAccord } from './dynasty-accord.ts';
import { buildAgent17RealmIndex } from './realm-index.ts';
import { buildAgent17SuccessionAccord } from './succession-accord.ts';
import { buildAgent17CanonIndex } from './canon-index.ts';
import { buildAgent17LegitimacyAccord } from './legitimacy-accord.ts';
import { buildAgent17CharterIndex } from './charter-index.ts';
import { buildAgent17SanctionAccord } from './sanction-accord.ts';
import { buildAgent17StatuteIndex } from './statute-index.ts';
import { buildAgent17ComplianceAccord } from './compliance-accord.ts';
import { buildAgent17AuditIndex } from './audit-index.ts';
import { buildAgent17AttestationAccord } from './attestation-accord.ts';
import { buildAgent17RegistryIndex } from './registry-index.ts';
import { buildAgent17CredentialAccord } from './credential-accord.ts';
import { buildAgent17LedgerIndex } from './ledger-index.ts';
import { buildAgent17EndorsementAccord } from './endorsement-accord.ts';
import { buildAgent17CustodyIndex } from './custody-index.ts';
import { buildAgent17ReleaseAccord } from './release-accord.ts';
import { buildAgent17VaultIndex } from './vault-index.ts';
import { buildAgent17TransferAccord } from './transfer-accord.ts';
import { buildAgent17SettlementIndex } from './settlement-index.ts';
import { buildAgent17ClosureAccord } from './closure-accord.ts';
import { buildAgent17ReconciliationIndex } from './reconciliation-index.ts';
import { buildAgent17FinalityAccord } from './finality-accord.ts';
import { buildAgent17ArchiveIndex } from './archive-index.ts';
import { buildAgent17PermanenceAccord } from './permanence-accord.ts';
import { buildAgent17LineageIndex } from './lineage-index.ts';
import { buildAgent17ProvenanceAccord } from './provenance-accord.ts';

export function buildAgent17PlanningSuggestion(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  recommendedDelegateKind: Acc17DelegateTargetKind
): Agent17PlanningSuggestion {
  const plan = ops.activePlan;
  const health = assessAgent17PlanHealth(plan, state, actorId);
  const blocked = plan?.steps.some(s => s.status === 'blocked' || s.status === 'failed') ?? false;
  const signals = detectAgent17RecoverySignals(state, actorId);
  const recovery = pickAgent17RecoveryTemplateId(signals, blocked);
  if (recovery && (blocked || planHealthNeedsRecovery(health))) {
    return {
      kind: 'recovery',
      templateId: recovery.templateId,
      headline: `Recovery lane: ${recovery.lane}`,
      rationale: recovery.rationale,
      confidence: Math.min(0.95, 0.55 + (signals[0]?.severity ?? 40) / 200),
    };
  }
  const routing = rankAgent17TemplateCandidates(state, settings, actorId);
  const templateId = routing.candidateTemplateIds[0];
  if (templateId && (!plan || health.band === 'steady' || health.band === 'strong')) {
    return {
      kind: 'template',
      templateId,
      headline: `Route ${routing.matchedCategory} → ${templateId}`,
      rationale: `Category ${routing.matchedCategory} from objective and state cues.`,
      confidence: 0.72,
    };
  }
  const analytics = buildAgent17DelegationAnalytics(ops, settings);
  const delegateKind = pickAgent17DelegateKindFromAnalytics(analytics, recommendedDelegateKind);
  if (plan && plan.completionPercent < 100) {
    return {
      kind: 'delegate',
      delegateKind,
      headline: `Delegate via ${delegateKind}`,
      rationale: 'Active plan incomplete; delegation analytics favor this target.',
      confidence: 0.65,
    };
  }
  return {
    kind: 'hold',
    headline: 'Hold planning posture',
    rationale: 'No recovery, template, or delegation action required this turn.',
    confidence: 0.5,
  };
}

export function buildAgent17PlanningDepthSnapshot(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  recommendedDelegateKind: Acc17DelegateTargetKind
): Agent17PlanningDepthSnapshot {
  const turn = state.turnCounter || state.day || 1;
  const planHealth = assessAgent17PlanHealth(ops.activePlan, state, actorId);
  const templateRouting = rankAgent17TemplateCandidates(state, settings, actorId);
  const delegationAnalytics = buildAgent17DelegationAnalytics(ops, settings);
  const delegationLadder = buildAgent17DelegationLadder(
    delegationAnalytics,
    settings,
    recommendedDelegateKind
  );
  const planLedger = summarizeAgent17PlanLedger(ops, state);
  let suggestion = buildAgent17PlanningSuggestion(
    ops,
    state,
    settings,
    actorId,
    recommendedDelegateKind
  );
  suggestion = refineAgent17DelegationSuggestion(
    ops,
    state,
    settings,
    actorId,
    suggestion,
    recommendedDelegateKind
  );
  const intentQueue = buildAgent17IntentQueue(ops, state, settings, actorId, planHealth);
  const verificationPolicy = buildAgent17VerificationPolicy(ops, state, actorId);
  const core = {
    turn,
    actorId,
    planHealth,
    suggestion,
    templateRouting,
    delegationAnalytics,
    delegationLadder,
    planLedger,
    catalogDepth: summarizeAgent17CatalogDepth(),
  };
  const coordinationBrief = buildAgent17CoordinationBrief(
    core,
    intentQueue,
    verificationPolicy,
    ops,
    state,
    settings
  );
  const executionPacing = buildAgent17ExecutionPacing(
    ops,
    state,
    planHealth,
    verificationPolicy
  );
  const resilienceScorecard = buildAgent17ResilienceScorecard(
    ops,
    state,
    actorId,
    planHealth,
    verificationPolicy
  );
  const strategicAlignment = buildAgent17StrategicAlignment(
    ops,
    state,
    settings,
    actorId,
    intentQueue
  );
  const handoffReadiness = buildAgent17HandoffReadiness({
    coordinationBrief,
    verificationPolicy,
    executionPacing,
    resilienceScorecard,
    strategicAlignment,
  });
  const commandPosture = buildAgent17CommandPosture({
    planHealth,
    handoffReadiness,
    resilienceScorecard,
    strategicAlignment,
  });
  const governanceAudit = buildAgent17GovernanceAudit(ops, settings, verificationPolicy);
  const escalationMatrix = buildAgent17EscalationMatrix({
    commandPosture,
    governanceAudit,
    handoffReadiness,
  });
  const rollbackAssurance = buildAgent17RollbackAssurance(ops, planHealth, governanceAudit);
  const stabilizationIndex = buildAgent17StabilizationIndex({
    escalationMatrix,
    rollbackAssurance,
  });
  const commandEnvelope = buildAgent17CommandEnvelope({
    ops,
    executionPacing,
    stabilizationIndex,
  });
  const convergenceIndex = buildAgent17ConvergenceIndex({
    commandEnvelope,
    stabilizationIndex,
    strategicAlignment,
  });
  const missionDirective = buildAgent17MissionDirective({
    intentQueue,
    commandEnvelope,
    convergenceIndex,
  });
  const directiveSynthesis = buildAgent17DirectiveSynthesis({
    missionDirective,
    convergenceIndex,
    intentQueue,
  });
  const executionClosure = buildAgent17ExecutionClosure({
    directiveSynthesis,
    executionPacing,
    missionDirective,
  });
  const cadenceLattice = buildAgent17CadenceLattice({
    executionClosure,
    directiveSynthesis,
    executionPacing,
  });
  const readinessGate = buildAgent17ReadinessGate({
    cadenceLattice,
    handoffReadiness,
    coordinationBrief,
  });
  const pulseIndex = buildAgent17PulseIndex({
    readinessGate,
    cadenceLattice,
    commandPosture,
  });
  const continuityBridge = buildAgent17ContinuityBridge({
    pulseIndex,
    resilienceScorecard,
    verificationPolicy,
  });
  const fluxIndex = buildAgent17FluxIndex({
    continuityBridge,
    pulseIndex,
    governanceAudit,
  });
  const integritySeal = buildAgent17IntegritySeal({
    fluxIndex,
    rollbackAssurance,
    verificationPolicy,
  });
  const commitLattice = buildAgent17CommitLattice({
    integritySeal,
    fluxIndex,
    escalationMatrix,
  });
  const covenantGate = buildAgent17CovenantGate({
    commitLattice,
    planHealth,
    rollbackAssurance,
  });
  const mandateWeave = buildAgent17MandateWeave({
    covenantGate,
    commitLattice,
    strategicAlignment,
  });
  const sovereigntyLock = buildAgent17SovereigntyLock({
    mandateWeave,
    governanceAudit,
    stabilizationIndex,
  });
  const authorityCharter = buildAgent17AuthorityCharter({
    sovereigntyLock,
    mandateWeave,
    commandPosture,
  });
  const dispatchAccord = buildAgent17DispatchAccord({
    authorityCharter,
    sovereigntyLock,
    delegationLadder,
  });
  const mobilizationIndex = buildAgent17MobilizationIndex({
    dispatchAccord,
    coordinationBrief,
    executionPacing,
  });
  const executionSummons = buildAgent17ExecutionSummons({
    mobilizationIndex,
    dispatchAccord,
    missionDirective,
  });
  const fieldIndex = buildAgent17FieldIndex({
    executionSummons,
    coordinationBrief,
    executionClosure,
  });
  const theaterCommitment = buildAgent17TheaterCommitment({
    fieldIndex,
    executionSummons,
    readinessGate,
  });
  const campaignIndex = buildAgent17CampaignIndex({
    theaterCommitment,
    pulseIndex,
    continuityBridge,
  });
  const missionLattice = buildAgent17MissionLattice({
    campaignIndex,
    theaterCommitment,
    cadenceLattice,
  });
  const strategicIndex = buildAgent17StrategicIndex({
    missionLattice,
    convergenceIndex,
    commandEnvelope,
  });
  const doctrineAccord = buildAgent17DoctrineAccord({
    strategicIndex,
    missionLattice,
    covenantGate,
  });
  const commandIndex = buildAgent17CommandIndex({
    doctrineAccord,
    mandateWeave,
    sovereigntyLock,
  });
  const federationAccord = buildAgent17FederationAccord({
    commandIndex,
    doctrineAccord,
    commitLattice,
  });
  const allianceIndex = buildAgent17AllianceIndex({
    federationAccord,
    dispatchAccord,
    authorityCharter,
  });
  const coalitionAccord = buildAgent17CoalitionAccord({
    allianceIndex,
    federationAccord,
    mobilizationIndex,
  });
  const pactIndex = buildAgent17PactIndex({
    coalitionAccord,
    theaterCommitment,
    executionSummons,
  });
  const unityAccord = buildAgent17UnityAccord({
    pactIndex,
    coalitionAccord,
    strategicIndex,
  });
  const compactIndex = buildAgent17CompactIndex({
    unityAccord,
    federationAccord,
    doctrineAccord,
  });
  const sovereignAccord = buildAgent17SovereignAccord({
    compactIndex,
    unityAccord,
    commandIndex,
  });
  const crownIndex = buildAgent17CrownIndex({
    sovereignAccord,
    allianceIndex,
    coalitionAccord,
  });
  const imperialAccord = buildAgent17ImperialAccord({
    crownIndex,
    sovereignAccord,
    compactIndex,
  });
  const throneIndex = buildAgent17ThroneIndex({
    imperialAccord,
    crownIndex,
    coalitionAccord,
  });
  const dynastyAccord = buildAgent17DynastyAccord({
    throneIndex,
    imperialAccord,
    crownIndex,
  });
  const realmIndex = buildAgent17RealmIndex({
    dynastyAccord,
    throneIndex,
    imperialAccord,
  });
  const successionAccord = buildAgent17SuccessionAccord({
    realmIndex,
    dynastyAccord,
    throneIndex,
  });
  const canonIndex = buildAgent17CanonIndex({
    successionAccord,
    realmIndex,
    dynastyAccord,
  });
  const legitimacyAccord = buildAgent17LegitimacyAccord({
    canonIndex,
    successionAccord,
    realmIndex,
  });
  const charterIndex = buildAgent17CharterIndex({
    legitimacyAccord,
    canonIndex,
    successionAccord,
  });
  const sanctionAccord = buildAgent17SanctionAccord({
    charterIndex,
    legitimacyAccord,
    canonIndex,
  });
  const statuteIndex = buildAgent17StatuteIndex({
    sanctionAccord,
    charterIndex,
    legitimacyAccord,
  });
  const complianceAccord = buildAgent17ComplianceAccord({
    statuteIndex,
    sanctionAccord,
    charterIndex,
  });
  const auditIndex = buildAgent17AuditIndex({
    complianceAccord,
    statuteIndex,
    sanctionAccord,
  });
  const attestationAccord = buildAgent17AttestationAccord({
    auditIndex,
    complianceAccord,
    statuteIndex,
  });
  const registryIndex = buildAgent17RegistryIndex({
    attestationAccord,
    auditIndex,
    complianceAccord,
  });
  const credentialAccord = buildAgent17CredentialAccord({
    registryIndex,
    attestationAccord,
    auditIndex,
  });
  const ledgerIndex = buildAgent17LedgerIndex({
    credentialAccord,
    registryIndex,
    attestationAccord,
  });
  const endorsementAccord = buildAgent17EndorsementAccord({
    ledgerIndex,
    credentialAccord,
    registryIndex,
  });
  const custodyIndex = buildAgent17CustodyIndex({
    endorsementAccord,
    ledgerIndex,
    credentialAccord,
  });
  const releaseAccord = buildAgent17ReleaseAccord({
    custodyIndex,
    endorsementAccord,
    ledgerIndex,
  });
  const vaultIndex = buildAgent17VaultIndex({
    releaseAccord,
    custodyIndex,
    endorsementAccord,
  });
  const transferAccord = buildAgent17TransferAccord({
    vaultIndex,
    releaseAccord,
    custodyIndex,
  });
  const settlementIndex = buildAgent17SettlementIndex({
    transferAccord,
    vaultIndex,
    releaseAccord,
  });
  const closureAccord = buildAgent17ClosureAccord({
    settlementIndex,
    transferAccord,
    vaultIndex,
  });
  const reconciliationIndex = buildAgent17ReconciliationIndex({
    closureAccord,
    settlementIndex,
    transferAccord,
  });
  const finalityAccord = buildAgent17FinalityAccord({
    reconciliationIndex,
    closureAccord,
    settlementIndex,
  });
  const archiveIndex = buildAgent17ArchiveIndex({
    finalityAccord,
    reconciliationIndex,
    closureAccord,
  });
  const permanenceAccord = buildAgent17PermanenceAccord({
    archiveIndex,
    finalityAccord,
    reconciliationIndex,
  });
  const lineageIndex = buildAgent17LineageIndex({
    permanenceAccord,
    archiveIndex,
    finalityAccord,
  });
  const provenanceAccord = buildAgent17ProvenanceAccord({
    lineageIndex,
    permanenceAccord,
    archiveIndex,
  });
  return {
    ...core,
    intentQueue,
    verificationPolicy,
    coordinationBrief,
    executionPacing,
    resilienceScorecard,
    strategicAlignment,
    handoffReadiness,
    commandPosture,
    governanceAudit,
    escalationMatrix,
    rollbackAssurance,
    stabilizationIndex,
    commandEnvelope,
    convergenceIndex,
    missionDirective,
    directiveSynthesis,
    executionClosure,
    cadenceLattice,
    readinessGate,
    pulseIndex,
    continuityBridge,
    fluxIndex,
    integritySeal,
    commitLattice,
    covenantGate,
    mandateWeave,
    sovereigntyLock,
    authorityCharter,
    dispatchAccord,
    mobilizationIndex,
    executionSummons,
    fieldIndex,
    theaterCommitment,
    campaignIndex,
    missionLattice,
    strategicIndex,
    doctrineAccord,
    commandIndex,
    federationAccord,
    allianceIndex,
    coalitionAccord,
    pactIndex,
    unityAccord,
    compactIndex,
    sovereignAccord,
    crownIndex,
    imperialAccord,
    throneIndex,
    dynastyAccord,
    realmIndex,
    successionAccord,
    canonIndex,
    legitimacyAccord,
    charterIndex,
    sanctionAccord,
    statuteIndex,
    complianceAccord,
    auditIndex,
    attestationAccord,
    registryIndex,
    credentialAccord,
    ledgerIndex,
    endorsementAccord,
    custodyIndex,
    releaseAccord,
    vaultIndex,
    transferAccord,
    settlementIndex,
    closureAccord,
    reconciliationIndex,
    finalityAccord,
    archiveIndex,
    permanenceAccord,
    lineageIndex,
    provenanceAccord,
  };
}

export function attachAgent17PlanningDepth(
  snapshot: Acc17OperationsSnapshot,
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string
): Acc17OperationsSnapshot {
  return {
    ...snapshot,
    planningDepth: buildAgent17PlanningDepthSnapshot(
      ops,
      state,
      settings,
      actorId,
      snapshot.recommendedDelegateKind
    ),
  };
}
