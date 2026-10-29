import type { Agent17DevTestReport, Agent17GameStateSlice } from '../types/command-center-types.ts';
import { evaluateAcc17CommandCenterOperations } from '../evaluation/operations-evaluator.ts';
import {
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
import { assessAgent17PlanHealth } from '../planning/plan-health.ts';
import { buildAgent17VerificationPolicy } from '../planning/verification-policy.ts';
import { buildAgent17ExecutionPacing } from '../planning/execution-pacing.ts';
import { buildAgent17ResilienceScorecard } from '../planning/resilience-scorecard.ts';
import { buildAgent17IntentQueue } from '../planning/intent-synthesis.ts';
import { buildAgent17StrategicAlignment } from '../planning/strategic-alignment.ts';
import { buildAgent17HandoffReadiness } from '../planning/handoff-readiness.ts';
import { buildAgent17CommandPosture } from '../planning/command-posture.ts';
import {
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
import {
  buildAgent17EscalationMatrix,
  escalationMatrixBlocksAutomation,
} from '../planning/escalation-matrix.ts';
import {
  buildAgent17RollbackAssurance,
  rollbackAssuranceNeedsRestore,
} from '../planning/rollback-assurance.ts';
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
import { buildAgent17MissionDirective } from '../planning/mission-directive.ts';
import {
  buildAgent17DirectiveSynthesis,
  directiveSynthesisBlocksAdvance,
} from '../planning/directive-synthesis.ts';
import { buildAgent17ExecutionClosure } from '../planning/execution-closure.ts';
import { buildAgent17CadenceLattice } from '../planning/cadence-lattice.ts';
import { buildAgent17ReadinessGate } from '../planning/readiness-gate.ts';
import { buildAgent17PulseIndex } from '../planning/pulse-index.ts';
import { buildAgent17ContinuityBridge } from '../planning/continuity-bridge.ts';
import { buildAgent17FluxIndex } from '../planning/flux-index.ts';
import { buildAgent17IntegritySeal } from '../planning/integrity-seal.ts';
import { buildAgent17CommitLattice } from '../planning/commit-lattice.ts';
import { buildAgent17CovenantGate } from '../planning/covenant-gate.ts';
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
} from '../planning/release-accord.ts';
import { buildAgent17CoordinationBrief } from '../planning/coordination-brief.ts';
import {
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';
import { buildAgent17DelegationAnalytics } from '../planning/delegation-analytics.ts';
import { buildAgent17DelegationLadder } from '../planning/delegation-ladder.ts';
import { summarizeAgent17PlanLedger } from '../planning/plan-ledger.ts';
import { buildAgent17PlanningSuggestion } from '../planning/planning-orchestrator.ts';

export function runAgent17CustodyDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 33,
      day: 33,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = {
      ...ops,
      activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan,
    };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );
    const policy = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'adt_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policy);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policy
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policy,
      opsWithPlan,
      state,
      settings
    );
    const handoff = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policy,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const posture = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    const audit = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    const matrix = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: audit,
      handoffReadiness: handoff,
    });
    const assurance = buildAgent17RollbackAssurance(opsWithPlan, health, audit);
    const stabilization = buildAgent17StabilizationIndex({
      escalationMatrix: matrix,
      rollbackAssurance: assurance,
    });
    const envelope = buildAgent17CommandEnvelope({
      ops: opsWithPlan,
      executionPacing: pacing,
      stabilizationIndex: stabilization,
    });
    const convergence = buildAgent17ConvergenceIndex({
      commandEnvelope: envelope,
      stabilizationIndex: stabilization,
      strategicAlignment: alignment,
    });
    const directive = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelope,
      convergenceIndex: convergence,
    });
    const synthesis = buildAgent17DirectiveSynthesis({
      missionDirective: directive,
      convergenceIndex: convergence,
      intentQueue,
    });
    const closure = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesis,
      executionPacing: pacing,
      missionDirective: directive,
    });
    const cadence = buildAgent17CadenceLattice({
      executionClosure: closure,
      directiveSynthesis: synthesis,
      executionPacing: pacing,
    });
    const readiness = buildAgent17ReadinessGate({
      cadenceLattice: cadence,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulse = buildAgent17PulseIndex({
      readinessGate: readiness,
      cadenceLattice: cadence,
      commandPosture: posture,
    });
    const bridge = buildAgent17ContinuityBridge({
      pulseIndex: pulse,
      resilienceScorecard: scorecard,
      verificationPolicy: policy,
    });
    const flux = buildAgent17FluxIndex({
      continuityBridge: bridge,
      pulseIndex: pulse,
      governanceAudit: audit,
    });
    const seal = buildAgent17IntegritySeal({
      fluxIndex: flux,
      rollbackAssurance: assurance,
      verificationPolicy: policy,
    });
    const lattice = buildAgent17CommitLattice({
      integritySeal: seal,
      fluxIndex: flux,
      escalationMatrix: matrix,
    });
    const covenant = buildAgent17CovenantGate({
      commitLattice: lattice,
      planHealth: health,
      rollbackAssurance: assurance,
    });

    const weaveClean = buildAgent17MandateWeave({
      covenantGate: covenant,
      commitLattice: lattice,
      strategicAlignment: alignment,
    });
    push(
      'adt_weave_bounded',
      'Mandate weave bounded with band',
      weaveClean.weaveScore >= 0 &&
        weaveClean.weaveScore <= 100 &&
        (weaveClean.band === 'aligned' ||
          weaveClean.band === 'tensioned' ||
          weaveClean.band === 'frayed'),
      `${weaveClean.weaveScore}/${weaveClean.band}`
    );

    push(
      'adt_weave_threads',
      'Mandate weave exposes weighted threads',
      weaveClean.threads.length >= 4 && weaveClean.threads.every(t => t.weight > 0),
      `threads=${weaveClean.threads.length}`
    );

    const lockClean = buildAgent17SovereigntyLock({
      mandateWeave: weaveClean,
      governanceAudit: audit,
      stabilizationIndex: stabilization,
    });
    push(
      'adt_lock_pins',
      'Sovereignty lock exposes pins',
      lockClean.pins.length >= 5 &&
        lockClean.lockScore >= 0 &&
        lockClean.lockScore <= 100,
      `pins=${lockClean.pins.length} score=${lockClean.lockScore}`
    );

    push(
      'adt_weave_aligned',
      'Healthy ops yields aligned or tensioned weave',
      weaveClean.band === 'aligned' || weaveClean.band === 'tensioned',
      weaveClean.band
    );

    push(
      'adt_lock_conditional',
      'Healthy ops yields secured or conditional lock',
      lockClean.band === 'secured' || lockClean.band === 'conditional',
      lockClean.band
    );

    const charterClean = buildAgent17AuthorityCharter({
      sovereigntyLock: lockClean,
      mandateWeave: weaveClean,
      commandPosture: posture,
    });
    push(
      'adt_charter_bounded',
      'Authority charter bounded with band',
      charterClean.charterScore >= 0 &&
        charterClean.charterScore <= 100 &&
        (charterClean.band === 'chartered' ||
          charterClean.band === 'provisional' ||
          charterClean.band === 'revoked'),
      `${charterClean.charterScore}/${charterClean.band}`
    );

    push(
      'adt_charter_articles',
      'Authority charter exposes articles',
      charterClean.articles.length >= 5 &&
        charterClean.articles.every(a => a.weight > 0),
      `articles=${charterClean.articles.length}`
    );

    const accordClean = buildAgent17DispatchAccord({
      authorityCharter: charterClean,
      sovereigntyLock: lockClean,
      delegationLadder: core.delegationLadder,
    });
    push(
      'adt_accord_provisions',
      'Dispatch accord exposes provisions',
      accordClean.provisions.length >= 5 &&
        accordClean.accordScore >= 0 &&
        accordClean.accordScore <= 100,
      `provisions=${accordClean.provisions.length} score=${accordClean.accordScore}`
    );

    push(
      'adt_accord_ratified',
      'Healthy ops yields ratified or provisional accord',
      accordClean.band === 'ratified' || accordClean.band === 'provisional',
      accordClean.band
    );

    const mobilizationClean = buildAgent17MobilizationIndex({
      dispatchAccord: accordClean,
      coordinationBrief: brief,
      executionPacing: pacing,
    });
    push(
      'odt_mobilization_bounded',
      'Mobilization index bounded with band',
      mobilizationClean.mobilizationScore >= 0 &&
        mobilizationClean.mobilizationScore <= 100 &&
        (mobilizationClean.band === 'mobilized' ||
          mobilizationClean.band === 'forming' ||
          mobilizationClean.band === 'stalled'),
      `${mobilizationClean.mobilizationScore}/${mobilizationClean.band}`
    );

    push(
      'odt_mobilization_vectors',
      'Mobilization index exposes vectors',
      mobilizationClean.vectors.length >= 5 &&
        mobilizationClean.vectors.every(v => v.weight > 0),
      `vectors=${mobilizationClean.vectors.length}`
    );

    const summonsClean = buildAgent17ExecutionSummons({
      mobilizationIndex: mobilizationClean,
      dispatchAccord: accordClean,
      missionDirective: directive,
    });
    push(
      'odt_summons_clauses',
      'Execution summons exposes clauses',
      summonsClean.clauses.length >= 5 &&
        summonsClean.summonsScore >= 0 &&
        summonsClean.summonsScore <= 100,
      `clauses=${summonsClean.clauses.length} score=${summonsClean.summonsScore}`
    );

    push(
      'fdt_summons_issued',
      'Healthy ops yields issued or pending summons',
      summonsClean.band === 'issued' || summonsClean.band === 'pending',
      summonsClean.band
    );

    const fieldClean = buildAgent17FieldIndex({
      executionSummons: summonsClean,
      coordinationBrief: brief,
      executionClosure: closure,
    });
    push(
      'fdt_field_bounded',
      'Field index bounded with band',
      fieldClean.fieldScore >= 0 &&
        fieldClean.fieldScore <= 100 &&
        (fieldClean.band === 'engaged' ||
          fieldClean.band === 'staging' ||
          fieldClean.band === 'contested'),
      `${fieldClean.fieldScore}/${fieldClean.band}`
    );

    push(
      'fdt_field_vectors',
      'Field index exposes vectors',
      fieldClean.vectors.length >= 5 && fieldClean.vectors.every(v => v.weight > 0),
      `vectors=${fieldClean.vectors.length}`
    );

    const theaterClean = buildAgent17TheaterCommitment({
      fieldIndex: fieldClean,
      executionSummons: summonsClean,
      readinessGate: readiness,
    });
    push(
      'fdt_theater_pledges',
      'Theater commitment exposes pledges',
      theaterClean.pledges.length >= 5 &&
        theaterClean.commitmentScore >= 0 &&
        theaterClean.commitmentScore <= 100,
      `pledges=${theaterClean.pledges.length} score=${theaterClean.commitmentScore}`
    );

    push(
      'cdt_theater_bound',
      'Healthy ops yields bound or provisional theater',
      theaterClean.band === 'bound' || theaterClean.band === 'provisional',
      theaterClean.band
    );

    const campaignClean = buildAgent17CampaignIndex({
      theaterCommitment: theaterClean,
      pulseIndex: pulse,
      continuityBridge: bridge,
    });
    push(
      'cdt_campaign_bounded',
      'Campaign index bounded with band',
      campaignClean.campaignScore >= 0 &&
        campaignClean.campaignScore <= 100 &&
        (campaignClean.band === 'active' ||
          campaignClean.band === 'forming' ||
          campaignClean.band === 'stalled'),
      `${campaignClean.campaignScore}/${campaignClean.band}`
    );

    push(
      'cdt_campaign_vectors',
      'Campaign index exposes vectors',
      campaignClean.vectors.length >= 5 && campaignClean.vectors.every(v => v.weight > 0),
      `vectors=${campaignClean.vectors.length}`
    );

    const latticeClean = buildAgent17MissionLattice({
      campaignIndex: campaignClean,
      theaterCommitment: theaterClean,
      cadenceLattice: cadence,
    });
    push(
      'cdt_lattice_rungs',
      'Mission lattice exposes rungs',
      latticeClean.rungs.length >= 5 &&
        latticeClean.latticeScore >= 0 &&
        latticeClean.latticeScore <= 100,
      `rungs=${latticeClean.rungs.length} score=${latticeClean.latticeScore}`
    );

    push(
      'sdt_lattice_locked',
      'Healthy ops yields locked or flexible lattice',
      latticeClean.band === 'locked' || latticeClean.band === 'flexible',
      latticeClean.band
    );

    const strategicClean = buildAgent17StrategicIndex({
      missionLattice: latticeClean,
      convergenceIndex: convergence,
      commandEnvelope: envelope,
    });
    push(
      'sdt_strategic_bounded',
      'Strategic index bounded with band',
      strategicClean.strategicScore >= 0 &&
        strategicClean.strategicScore <= 100 &&
        (strategicClean.band === 'coherent' ||
          strategicClean.band === 'forming' ||
          strategicClean.band === 'fractured'),
      `${strategicClean.strategicScore}/${strategicClean.band}`
    );

    push(
      'sdt_strategic_signals',
      'Strategic index exposes signals',
      strategicClean.signals.length >= 5 && strategicClean.signals.every(s => s.weight > 0),
      `signals=${strategicClean.signals.length}`
    );

    const doctrineClean = buildAgent17DoctrineAccord({
      strategicIndex: strategicClean,
      missionLattice: latticeClean,
      covenantGate: covenant,
    });
    push(
      'sdt_doctrine_articles',
      'Doctrine accord exposes articles',
      doctrineClean.articles.length >= 5 &&
        doctrineClean.doctrineScore >= 0 &&
        doctrineClean.doctrineScore <= 100,
      `articles=${doctrineClean.articles.length} score=${doctrineClean.doctrineScore}`
    );

    push(
      'cmd_doctrine_ratified',
      'Healthy ops yields ratified or provisional doctrine',
      doctrineClean.band === 'ratified' || doctrineClean.band === 'provisional',
      doctrineClean.band
    );

    const commandClean = buildAgent17CommandIndex({
      doctrineAccord: doctrineClean,
      mandateWeave: weaveClean,
      sovereigntyLock: lockClean,
    });
    push(
      'cmd_index_bounded',
      'Command index bounded with band',
      commandClean.commandScore >= 0 &&
        commandClean.commandScore <= 100 &&
        (commandClean.band === 'supreme' ||
          commandClean.band === 'delegated' ||
          commandClean.band === 'degraded'),
      `${commandClean.commandScore}/${commandClean.band}`
    );

    push(
      'cmd_index_pillars',
      'Command index exposes pillars',
      commandClean.pillars.length >= 5 && commandClean.pillars.every(p => p.weight > 0),
      `pillars=${commandClean.pillars.length}`
    );

    const federationClean = buildAgent17FederationAccord({
      commandIndex: commandClean,
      doctrineAccord: doctrineClean,
      commitLattice: lattice,
    });
    push(
      'cmd_federation_covenants',
      'Federation accord exposes covenants',
      federationClean.covenants.length >= 5 &&
        federationClean.federationScore >= 0 &&
        federationClean.federationScore <= 100,
      `covenants=${federationClean.covenants.length} score=${federationClean.federationScore}`
    );

    push(
      'adt_federation_unified',
      'Healthy ops yields unified or partial federation',
      federationClean.band === 'unified' || federationClean.band === 'partial',
      federationClean.band
    );

    const allianceClean = buildAgent17AllianceIndex({
      federationAccord: federationClean,
      dispatchAccord: accordClean,
      authorityCharter: charterClean,
    });
    push(
      'adt_alliance_bounded',
      'Alliance index bounded with band',
      allianceClean.allianceScore >= 0 &&
        allianceClean.allianceScore <= 100 &&
        (allianceClean.band === 'allied' ||
          allianceClean.band === 'forming' ||
          allianceClean.band === 'ruptured'),
      `${allianceClean.allianceScore}/${allianceClean.band}`
    );

    push(
      'adt_alliance_ties',
      'Alliance index exposes ties',
      allianceClean.ties.length >= 5 && allianceClean.ties.every(t => t.weight > 0),
      `ties=${allianceClean.ties.length}`
    );

    const coalitionClean = buildAgent17CoalitionAccord({
      allianceIndex: allianceClean,
      federationAccord: federationClean,
      mobilizationIndex: mobilizationClean,
    });
    push(
      'adt_coalition_compacts',
      'Coalition accord exposes compacts',
      coalitionClean.compacts.length >= 5 &&
        coalitionClean.coalitionScore >= 0 &&
        coalitionClean.coalitionScore <= 100,
      `compacts=${coalitionClean.compacts.length} score=${coalitionClean.coalitionScore}`
    );

    push(
      'pdt_coalition_sealed',
      'Healthy ops yields sealed or draft coalition',
      coalitionClean.band === 'sealed' || coalitionClean.band === 'draft',
      coalitionClean.band
    );

    const pactClean = buildAgent17PactIndex({
      coalitionAccord: coalitionClean,
      theaterCommitment: theaterClean,
      executionSummons: summonsClean,
    });
    push(
      'pdt_pact_bounded',
      'Pact index bounded with band',
      pactClean.pactScore >= 0 &&
        pactClean.pactScore <= 100 &&
        (pactClean.band === 'binding' ||
          pactClean.band === 'provisional' ||
          pactClean.band === 'void'),
      `${pactClean.pactScore}/${pactClean.band}`
    );

    push(
      'pdt_pact_clauses',
      'Pact index exposes clauses',
      pactClean.clauses.length >= 5 && pactClean.clauses.every(c => c.weight > 0),
      `clauses=${pactClean.clauses.length}`
    );

    const unityClean = buildAgent17UnityAccord({
      pactIndex: pactClean,
      coalitionAccord: coalitionClean,
      strategicIndex: strategicClean,
    });
    push(
      'pdt_unity_tenets',
      'Unity accord exposes tenets',
      unityClean.tenets.length >= 5 &&
        unityClean.unityScore >= 0 &&
        unityClean.unityScore <= 100,
      `tenets=${unityClean.tenets.length} score=${unityClean.unityScore}`
    );

    push(
      'cdt_unity_unified',
      'Healthy ops yields unified or partial unity',
      unityClean.band === 'unified' || unityClean.band === 'partial',
      unityClean.band
    );

    const compactClean = buildAgent17CompactIndex({
      unityAccord: unityClean,
      federationAccord: federationClean,
      doctrineAccord: doctrineClean,
    });
    push(
      'cdt_compact_bounded',
      'Compact index bounded with band',
      compactClean.compactScore >= 0 &&
        compactClean.compactScore <= 100 &&
        (compactClean.band === 'tight' ||
          compactClean.band === 'forming' ||
          compactClean.band === 'loose'),
      `${compactClean.compactScore}/${compactClean.band}`
    );

    push(
      'cdt_compact_facets',
      'Compact index exposes facets',
      compactClean.facets.length >= 5 && compactClean.facets.every(f => f.weight > 0),
      `facets=${compactClean.facets.length}`
    );

    const sovereignClean = buildAgent17SovereignAccord({
      compactIndex: compactClean,
      unityAccord: unityClean,
      commandIndex: commandClean,
    });
    push(
      'cdt_sovereign_seals',
      'Sovereign accord exposes seals',
      sovereignClean.seals.length >= 5 &&
        sovereignClean.sovereignScore >= 0 &&
        sovereignClean.sovereignScore <= 100,
      `seals=${sovereignClean.seals.length} score=${sovereignClean.sovereignScore}`
    );

    push(
      'cst_sovereign_crowned',
      'Healthy ops yields crowned or regent sovereign',
      sovereignClean.band === 'crowned' || sovereignClean.band === 'regent',
      sovereignClean.band
    );

    const crownClean = buildAgent17CrownIndex({
      sovereignAccord: sovereignClean,
      allianceIndex: allianceClean,
      coalitionAccord: coalitionClean,
    });
    push(
      'cst_crown_bounded',
      'Crown index bounded with band',
      crownClean.crownScore >= 0 &&
        crownClean.crownScore <= 100 &&
        (crownClean.band === 'invested' ||
          crownClean.band === 'pending' ||
          crownClean.band === 'uncrowned'),
      `${crownClean.crownScore}/${crownClean.band}`
    );

    push(
      'cst_crown_jewels',
      'Crown index exposes jewels',
      crownClean.jewels.length >= 5 && crownClean.jewels.every(j => j.weight > 0),
      `jewels=${crownClean.jewels.length}`
    );

    const imperialClean = buildAgent17ImperialAccord({
      crownIndex: crownClean,
      sovereignAccord: sovereignClean,
      compactIndex: compactClean,
    });
    push(
      'cst_imperial_edicts',
      'Imperial accord exposes edicts',
      imperialClean.edicts.length >= 5 &&
        imperialClean.imperialScore >= 0 &&
        imperialClean.imperialScore <= 100,
      `edicts=${imperialClean.edicts.length} score=${imperialClean.imperialScore}`
    );

    push(
      'cst_imperial_empire',
      'Healthy ops yields empire or domain imperial',
      imperialClean.band === 'empire' || imperialClean.band === 'domain',
      imperialClean.band
    );

    const breachOps = {
      ...opsWithPlan,
      delegatedProjects: [
        {
          id: 'dp1',
          planId: 'p1',
          title: 'Breach project',
          delegateKind: 'team_os' as const,
          delegateTargetId: 'team',
          status: 'active' as const,
          authorityCeiling: 'delegated' as const,
          assignedTurn: 1,
          assignedDay: 1,
          lastVerifiedFingerprint: '',
          notes: '',
        },
      ],
    };
    const advisorySettings = {
      ...settings,
      aiCommunicationAutonomyLevel: 'advisory' as const,
    };
    const auditBreach = buildAgent17GovernanceAudit(breachOps, advisorySettings, policy);
    const matrixUrgent = buildAgent17EscalationMatrix({
      commandPosture: posture,
      governanceAudit: auditBreach,
      handoffReadiness: handoff,
    });
    const assuranceBreach = buildAgent17RollbackAssurance(
      breachOps,
      assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      auditBreach
    );
    const stabilizationVolatile = buildAgent17StabilizationIndex({
      escalationMatrix: matrixUrgent,
      rollbackAssurance: assuranceBreach,
    });
    const envelopeSaturated = buildAgent17CommandEnvelope({
      ops: breachOps,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      stabilizationIndex: stabilizationVolatile,
    });
    const convergenceDiverging = buildAgent17ConvergenceIndex({
      commandEnvelope: envelopeSaturated,
      stabilizationIndex: stabilizationVolatile,
      strategicAlignment: alignment,
    });
    const directiveHeld = buildAgent17MissionDirective({
      intentQueue,
      commandEnvelope: envelopeSaturated,
      convergenceIndex: convergenceDiverging,
    });
    const synthesisLocked = buildAgent17DirectiveSynthesis({
      missionDirective: directiveHeld,
      convergenceIndex: convergenceDiverging,
      intentQueue,
    });
    const closureSealed = buildAgent17ExecutionClosure({
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      missionDirective: directiveHeld,
    });
    const cadenceStalled = buildAgent17CadenceLattice({
      executionClosure: closureSealed,
      directiveSynthesis: synthesisLocked,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
    });
    const readinessStop = buildAgent17ReadinessGate({
      cadenceLattice: cadenceStalled,
      handoffReadiness: handoff,
      coordinationBrief: brief,
    });
    const pulseFlat = buildAgent17PulseIndex({
      readinessGate: readinessStop,
      cadenceLattice: cadenceStalled,
      commandPosture: posture,
    });
    const bridgeBroken = buildAgent17ContinuityBridge({
      pulseIndex: pulseFlat,
      resilienceScorecard: buildAgent17ResilienceScorecard(
        breachOps,
        state,
        'player',
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
      verificationPolicy: policy,
    });
    const fluxDisrupted = buildAgent17FluxIndex({
      continuityBridge: bridgeBroken,
      pulseIndex: pulseFlat,
      governanceAudit: auditBreach,
    });
    const sealBreached = buildAgent17IntegritySeal({
      fluxIndex: fluxDisrupted,
      rollbackAssurance: assuranceBreach,
      verificationPolicy: policy,
    });
    const latticeFragmented = buildAgent17CommitLattice({
      integritySeal: sealBreached,
      fluxIndex: fluxDisrupted,
      escalationMatrix: matrixUrgent,
    });
    const covenantVoid = buildAgent17CovenantGate({
      commitLattice: latticeFragmented,
      planHealth: assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
      rollbackAssurance: assuranceBreach,
    });
    const weaveFrayed = buildAgent17MandateWeave({
      covenantGate: covenantVoid,
      commitLattice: latticeFragmented,
      strategicAlignment: alignment,
    });
    push(
      'adt_frayed_blocks',
      'Governance breach yields frayed weave or blocks sovereignty',
      weaveFrayed.band === 'frayed' || mandateWeaveBlocksSovereignty(weaveFrayed),
      `${weaveFrayed.band} idx=${weaveFrayed.weaveScore}`
    );

    const lockReleased = buildAgent17SovereigntyLock({
      mandateWeave: weaveFrayed,
      governanceAudit: auditBreach,
      stabilizationIndex: stabilizationVolatile,
    });
    push(
      'adt_released_command',
      'Released lock blocks command sovereignty',
      lockReleased.band === 'released' ||
        sovereigntyLockBlocksCommand(lockReleased) ||
        !lockReleased.commandSovereignty,
      `${lockReleased.band} sov=${lockReleased.commandSovereignty}`
    );

    push(
      'adt_escalation_link',
      'Urgent escalation propagates to weave threads',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        convergenceIndexBlocksDirective(convergenceDiverging),
      matrixUrgent.band
    );

    const charterRevoked = buildAgent17AuthorityCharter({
      sovereigntyLock: lockReleased,
      mandateWeave: weaveFrayed,
      commandPosture: posture,
    });
    push(
      'adt_revoked_blocks',
      'Released sovereignty yields revoked charter or blocks accord',
      charterRevoked.band === 'revoked' || authorityCharterBlocksAccord(charterRevoked),
      `${charterRevoked.band} auth=${charterRevoked.commandAuthority}`
    );

    const accordVoid = buildAgent17DispatchAccord({
      authorityCharter: charterRevoked,
      sovereigntyLock: lockReleased,
      delegationLadder: core.delegationLadder,
    });
    push(
      'adt_void_dispatch',
      'Void accord blocks dispatch',
      accordVoid.band === 'void' ||
        dispatchAccordBlocksDispatch(accordVoid) ||
        !accordVoid.dispatchAllowed,
      `${accordVoid.band} dispatch=${accordVoid.dispatchAllowed}`
    );

    const mobilizationStalled = buildAgent17MobilizationIndex({
      dispatchAccord: accordVoid,
      coordinationBrief: brief,
      executionPacing: buildAgent17ExecutionPacing(
        breachOps,
        state,
        assessAgent17PlanHealth(breachOps.activePlan, state, 'player'),
        policy
      ),
    });
    push(
      'odt_stalcst_blocks',
      'Void accord yields stalled mobilization or blocks summons',
      mobilizationStalled.band === 'stalled' ||
        mobilizationIndexBlocksSummons(mobilizationStalled) ||
        !mobilizationStalled.fieldReady,
      `${mobilizationStalled.band} ready=${mobilizationStalled.fieldReady}`
    );

    const summonsRevoked = buildAgent17ExecutionSummons({
      mobilizationIndex: mobilizationStalled,
      dispatchAccord: accordVoid,
      missionDirective: directiveHeld,
    });
    push(
      'fdt_revoked_field',
      'Stalled mobilization yields revoked summons or blocks field',
      summonsRevoked.band === 'revoked' ||
        executionSummonsBlocksField(summonsRevoked) ||
        !summonsRevoked.executionAuthorized,
      `${summonsRevoked.band} auth=${summonsRevoked.executionAuthorized}`
    );

    const fieldContested = buildAgent17FieldIndex({
      executionSummons: summonsRevoked,
      coordinationBrief: brief,
      executionClosure: closureSealed,
    });
    push(
      'fdt_contested_blocks',
      'Revoked summons yields contested field or blocks commitment',
      fieldContested.band === 'contested' ||
        fieldIndexBlocksCommitment(fieldContested) ||
        !fieldContested.theaterReady,
      `${fieldContested.band} ready=${fieldContested.theaterReady}`
    );

    const theaterWithdrawn = buildAgent17TheaterCommitment({
      fieldIndex: fieldContested,
      executionSummons: summonsRevoked,
      readinessGate: readinessStop,
    });
    push(
      'cdt_withdrawn_theater',
      'Contested field yields withdrawn theater or blocks theater',
      theaterWithdrawn.band === 'withdrawn' ||
        theaterCommitmentBlocksTheater(theaterWithdrawn) ||
        !theaterWithdrawn.theaterBound,
      `${theaterWithdrawn.band} bound=${theaterWithdrawn.theaterBound}`
    );

    const campaignStalled = buildAgent17CampaignIndex({
      theaterCommitment: theaterWithdrawn,
      pulseIndex: pulseFlat,
      continuityBridge: bridgeBroken,
    });
    push(
      'cdt_stalcst_campaign',
      'Withdrawn theater yields stalled campaign or blocks lattice',
      campaignStalled.band === 'stalled' ||
        campaignIndexBlocksLattice(campaignStalled) ||
        !campaignStalled.campaignReady,
      `${campaignStalled.band} ready=${campaignStalled.campaignReady}`
    );

    const latticeCollapsed = buildAgent17MissionLattice({
      campaignIndex: campaignStalled,
      theaterCommitment: theaterWithdrawn,
      cadenceLattice: cadenceStalled,
    });
    push(
      'sdt_collapsed_lattice',
      'Stalled campaign yields collapsed lattice or blocks campaign',
      latticeCollapsed.band === 'collapsed' ||
        missionLatticeBlocksCampaign(latticeCollapsed) ||
        !latticeCollapsed.missionLocked,
      `${latticeCollapsed.band} locked=${latticeCollapsed.missionLocked}`
    );

    const strategicFractured = buildAgent17StrategicIndex({
      missionLattice: latticeCollapsed,
      convergenceIndex: convergenceDiverging,
      commandEnvelope: envelopeSaturated,
    });
    push(
      'sdt_fractured_doctrine',
      'Collapsed lattice yields fractured strategic or blocks doctrine',
      strategicFractured.band === 'fractured' ||
        strategicIndexBlocksDoctrine(strategicFractured) ||
        !strategicFractured.strategicReady,
      `${strategicFractured.band} ready=${strategicFractured.strategicReady}`
    );

    const doctrineVoid = buildAgent17DoctrineAccord({
      strategicIndex: strategicFractured,
      missionLattice: latticeCollapsed,
      covenantGate: covenantVoid,
    });
    push(
      'cmd_void_command',
      'Fractured strategic yields void doctrine or blocks command',
      doctrineVoid.band === 'void' ||
        doctrineAccordBlocksCommand(doctrineVoid) ||
        !doctrineVoid.doctrineRatified,
      `${doctrineVoid.band} ratified=${doctrineVoid.doctrineRatified}`
    );

    const commandDegraded = buildAgent17CommandIndex({
      doctrineAccord: doctrineVoid,
      mandateWeave: weaveFrayed,
      sovereigntyLock: lockReleased,
    });
    push(
      'cmd_degraded_federation',
      'Void doctrine yields degraded command or blocks federation',
      commandDegraded.band === 'degraded' ||
        commandIndexBlocksFederation(commandDegraded) ||
        !commandDegraded.commandReady,
      `${commandDegraded.band} ready=${commandDegraded.commandReady}`
    );

    const federationDissolved = buildAgent17FederationAccord({
      commandIndex: commandDegraded,
      doctrineAccord: doctrineVoid,
      commitLattice: latticeFragmented,
    });
    push(
      'adt_dissolved_ops',
      'Degraded command yields dissolved federation or blocks ops',
      federationDissolved.band === 'dissolved' ||
        federationAccordBlocksOps(federationDissolved) ||
        !federationDissolved.federationUnified,
      `${federationDissolved.band} unified=${federationDissolved.federationUnified}`
    );

    const allianceRuptured = buildAgent17AllianceIndex({
      federationAccord: federationDissolved,
      dispatchAccord: accordVoid,
      authorityCharter: charterRevoked,
    });
    push(
      'adt_ruptured_coalition',
      'Dissolved federation yields ruptured alliance or blocks coalition',
      allianceRuptured.band === 'ruptured' ||
        allianceIndexBlocksCoalition(allianceRuptured) ||
        !allianceRuptured.allianceReady,
      `${allianceRuptured.band} ready=${allianceRuptured.allianceReady}`
    );

    const coalitionBroken = buildAgent17CoalitionAccord({
      allianceIndex: allianceRuptured,
      federationAccord: federationDissolved,
      mobilizationIndex: mobilizationStalled,
    });
    push(
      'adt_broken_alliance',
      'Ruptured alliance yields broken coalition or blocks alliance',
      coalitionBroken.band === 'broken' ||
        coalitionAccordBlocksAlliance(coalitionBroken) ||
        !coalitionBroken.coalitionSealed,
      `${coalitionBroken.band} sealed=${coalitionBroken.coalitionSealed}`
    );

    const pactVoid = buildAgent17PactIndex({
      coalitionAccord: coalitionBroken,
      theaterCommitment: theaterWithdrawn,
      executionSummons: summonsRevoked,
    });
    push(
      'pdt_void_unity',
      'Broken coalition yields void pact or blocks unity',
      pactVoid.band === 'void' ||
        pactIndexBlocksUnity(pactVoid) ||
        !pactVoid.pactBinding,
      `${pactVoid.band} binding=${pactVoid.pactBinding}`
    );

    const unityShattered = buildAgent17UnityAccord({
      pactIndex: pactVoid,
      coalitionAccord: coalitionBroken,
      strategicIndex: strategicFractured,
    });
    push(
      'pdt_shattered_pact',
      'Void pact yields shattered unity or blocks pact',
      unityShattered.band === 'shattered' ||
        unityAccordBlocksPact(unityShattered) ||
        !unityShattered.unityAchieved,
      `${unityShattered.band} achieved=${unityShattered.unityAchieved}`
    );

    const compactLoose = buildAgent17CompactIndex({
      unityAccord: unityShattered,
      federationAccord: federationDissolved,
      doctrineAccord: doctrineVoid,
    });
    push(
      'cdt_loose_sovereign',
      'Shattered unity yields loose compact or blocks sovereign',
      compactLoose.band === 'loose' ||
        compactIndexBlocksSovereign(compactLoose) ||
        !compactLoose.compactLocked,
      `${compactLoose.band} locked=${compactLoose.compactLocked}`
    );

    const sovereignAbdicated = buildAgent17SovereignAccord({
      compactIndex: compactLoose,
      unityAccord: unityShattered,
      commandIndex: commandDegraded,
    });
    push(
      'cdt_abdicated_compact',
      'Loose compact yields abdicated sovereign or blocks compact',
      sovereignAbdicated.band === 'abdicated' ||
        sovereignAccordBlocksCompact(sovereignAbdicated) ||
        !sovereignAbdicated.sovereigntyCrowned,
      `${sovereignAbdicated.band} crowned=${sovereignAbdicated.sovereigntyCrowned}`
    );

    const crownUncrowned = buildAgent17CrownIndex({
      sovereignAccord: sovereignAbdicated,
      allianceIndex: allianceRuptured,
      coalitionAccord: coalitionBroken,
    });
    push(
      'cst_uncrowned_imperial',
      'Abdicated sovereign yields uncrowned crown or blocks imperial',
      crownUncrowned.band === 'uncrowned' ||
        crownIndexBlocksImperial(crownUncrowned) ||
        !crownUncrowned.crownInvested,
      `${crownUncrowned.band} invested=${crownUncrowned.crownInvested}`
    );

    const imperialDissolved = buildAgent17ImperialAccord({
      crownIndex: crownUncrowned,
      sovereignAccord: sovereignAbdicated,
      compactIndex: compactLoose,
    });
    push(
      'cst_dissolved_crown',
      'Uncrowned crown yields dissolved imperial or blocks crown',
      imperialDissolved.band === 'dissolved' ||
        imperialAccordBlocksCrown(imperialDissolved) ||
        !imperialDissolved.empireProclaimed,
      `${imperialDissolved.band} proclaimed=${imperialDissolved.empireProclaimed}`
    );

    const throneUsurped = buildAgent17ThroneIndex({
      imperialAccord: imperialDissolved,
      crownIndex: crownUncrowned,
      coalitionAccord: coalitionBroken,
    });
    push(
      'cst_usurped_dynasty',
      'Dissolved imperial yields usurped throne or blocks dynasty',
      throneUsurped.band === 'usurped' ||
        imperialAccordBlocksThrone(imperialDissolved) ||
        !throneUsurped.throneSeated,
      `${throneUsurped.band} seated=${throneUsurped.throneSeated}`
    );

    const dynastyExtinct = buildAgent17DynastyAccord({
      throneIndex: throneUsurped,
      imperialAccord: imperialDissolved,
      crownIndex: crownUncrowned,
    });
    push(
      'cst_extinct_throne',
      'Usurped throne yields extinct dynasty or blocks throne',
      dynastyExtinct.band === 'extinct' ||
        dynastyAccordBlocksThrone(dynastyExtinct) ||
        !dynastyExtinct.dynastyProclaimed,
      `${dynastyExtinct.band} proclaimed=${dynastyExtinct.dynastyProclaimed}`
    );

    const realmFallen = buildAgent17RealmIndex({
      dynastyAccord: dynastyExtinct,
      throneIndex: throneUsurped,
      imperialAccord: imperialDissolved,
    });
    push(
      'cst_fallen_succession',
      'Extinct dynasty yields fallen realm or blocks succession',
      realmFallen.band === 'fallen' ||
        dynastyAccordBlocksRealm(dynastyExtinct) ||
        !realmFallen.realmUnified,
      `${realmFallen.band} unified=${realmFallen.realmUnified}`
    );

    const successionVoid = buildAgent17SuccessionAccord({
      realmIndex: realmFallen,
      dynastyAccord: dynastyExtinct,
      throneIndex: throneUsurped,
    });
    push(
      'cst_void_realm',
      'Fallen realm yields void succession or blocks realm',
      successionVoid.band === 'void' ||
        successionAccordBlocksRealm(successionVoid) ||
        !successionVoid.successionAnchored,
      `${successionVoid.band} anchored=${successionVoid.successionAnchored}`
    );

    const canonRevoked = buildAgent17CanonIndex({
      successionAccord: successionVoid,
      realmIndex: realmFallen,
      dynastyAccord: dynastyExtinct,
    });
    push(
      'cst_revoked_legitimacy',
      'Void succession yields revoked canon or blocks legitimacy',
      canonRevoked.band === 'revoked' ||
        successionAccordBlocksCanon(successionVoid) ||
        !canonRevoked.canonRatified,
      `${canonRevoked.band} ratified=${canonRevoked.canonRatified}`
    );

    const legitimacyForfeit = buildAgent17LegitimacyAccord({
      canonIndex: canonRevoked,
      successionAccord: successionVoid,
      realmIndex: realmFallen,
    });
    push(
      'cst_forfeit_canon',
      'Revoked canon yields forfeit legitimacy or blocks canon',
      legitimacyForfeit.band === 'forfeit' ||
        legitimacyAccordBlocksCanon(legitimacyForfeit) ||
        !legitimacyForfeit.legitimacySettled,
      `${legitimacyForfeit.band} settled=${legitimacyForfeit.legitimacySettled}`
    );

    const charterRepealed = buildAgent17CharterIndex({
      legitimacyAccord: legitimacyForfeit,
      canonIndex: canonRevoked,
      successionAccord: successionVoid,
    });
    push(
      'cst_repeacst_sanction',
      'Forfeit legitimacy yields repealed charter or blocks sanction',
      charterRepealed.band === 'repealed' ||
        legitimacyAccordBlocksCharter(legitimacyForfeit) ||
        !charterRepealed.charterEnacted,
      `${charterRepealed.band} enacted=${charterRepealed.charterEnacted}`
    );

    const sanctionLifted = buildAgent17SanctionAccord({
      charterIndex: charterRepealed,
      legitimacyAccord: legitimacyForfeit,
      canonIndex: canonRevoked,
    });
    push(
      'cst_lifted_charter',
      'Repealed charter yields lifted sanction or blocks charter',
      sanctionLifted.band === 'lifted' ||
        sanctionAccordBlocksCharter(sanctionLifted) ||
        !sanctionLifted.sanctionBinding,
      `${sanctionLifted.band} binding=${sanctionLifted.sanctionBinding}`
    );

    const statuteStruck = buildAgent17StatuteIndex({
      sanctionAccord: sanctionLifted,
      charterIndex: charterRepealed,
      legitimacyAccord: legitimacyForfeit,
    });
    push(
      'cst_struck_compliance',
      'Lifted sanction yields struck statute or blocks compliance',
      statuteStruck.band === 'struck' ||
        sanctionAccordBlocksStatute(sanctionLifted) ||
        !statuteStruck.statuteCodified,
      `${statuteStruck.band} codified=${statuteStruck.statuteCodified}`
    );

    const complianceBreached = buildAgent17ComplianceAccord({
      statuteIndex: statuteStruck,
      sanctionAccord: sanctionLifted,
      charterIndex: charterRepealed,
    });
    push(
      'cst_breached_statute',
      'Struck statute yields breached compliance or blocks statute',
      complianceBreached.band === 'breached' ||
        complianceAccordBlocksStatute(complianceBreached) ||
        !complianceBreached.complianceVerified,
      `${complianceBreached.band} verified=${complianceBreached.complianceVerified}`
    );

    const auditFailed = buildAgent17AuditIndex({
      complianceAccord: complianceBreached,
      statuteIndex: statuteStruck,
      sanctionAccord: sanctionLifted,
    });
    push(
      'cst_faicst_attestation',
      'Breached compliance yields failed audit or blocks attestation',
      auditFailed.band === 'failed' ||
        complianceAccordBlocksAudit(complianceBreached) ||
        !auditFailed.auditPassed,
      `${auditFailed.band} passed=${auditFailed.auditPassed}`
    );

    const attestationRevoked = buildAgent17AttestationAccord({
      auditIndex: auditFailed,
      complianceAccord: complianceBreached,
      statuteIndex: statuteStruck,
    });
    push(
      'cst_revoked_audit',
      'Failed audit yields revoked attestation or blocks audit',
      attestationRevoked.band === 'revoked' ||
        attestationAccordBlocksAudit(attestationRevoked) ||
        !attestationRevoked.attestationSealed,
      `${attestationRevoked.band} sealed=${attestationRevoked.attestationSealed}`
    );

    const registryCorrupt = buildAgent17RegistryIndex({
      attestationAccord: attestationRevoked,
      auditIndex: auditFailed,
      complianceAccord: complianceBreached,
    });
    push(
      'cst_corrupt_credential',
      'Revoked attestation yields corrupt registry or blocks credential',
      registryCorrupt.band === 'corrupt' ||
        attestationAccordBlocksRegistry(attestationRevoked) ||
        !registryCorrupt.registryCanonical,
      `${registryCorrupt.band} canonical=${registryCorrupt.registryCanonical}`
    );

    const credentialVoid = buildAgent17CredentialAccord({
      registryIndex: registryCorrupt,
      attestationAccord: attestationRevoked,
      auditIndex: auditFailed,
    });
    push(
      'cst_void_registry',
      'Corrupt registry yields void credential or blocks registry',
      credentialVoid.band === 'void' ||
        credentialAccordBlocksRegistry(credentialVoid) ||
        !credentialVoid.credentialIssued,
      `${credentialVoid.band} issued=${credentialVoid.credentialIssued}`
    );

    const ledgerClosed = buildAgent17LedgerIndex({
      credentialAccord: credentialVoid,
      registryIndex: registryCorrupt,
      attestationAccord: attestationRevoked,
    });
    push(
      'cst_closed_endorsement',
      'Void credential yields closed ledger or blocks endorsement',
      ledgerClosed.band === 'closed' ||
        credentialAccordBlocksLedger(credentialVoid) ||
        !ledgerClosed.ledgerBalanced,
      `${ledgerClosed.band} balanced=${ledgerClosed.ledgerBalanced}`
    );

    const endorsementWithdrawn = buildAgent17EndorsementAccord({
      ledgerIndex: ledgerClosed,
      credentialAccord: credentialVoid,
      registryIndex: registryCorrupt,
    });
    push(
      'cst_withdrawn_ledger',
      'Closed ledger yields withdrawn endorsement or blocks ledger',
      endorsementWithdrawn.band === 'withdrawn' ||
        endorsementAccordBlocksLedger(endorsementWithdrawn) ||
        !endorsementWithdrawn.endorsementSigned,
      `${endorsementWithdrawn.band} signed=${endorsementWithdrawn.endorsementSigned}`
    );

    const custodyBreached = buildAgent17CustodyIndex({
      endorsementAccord: endorsementWithdrawn,
      ledgerIndex: ledgerClosed,
      credentialAccord: credentialVoid,
    });
    push(
      'cst_breached_release',
      'Withdrawn endorsement yields breached custody or blocks release',
      custodyBreached.band === 'breached' ||
        endorsementAccordBlocksCustody(endorsementWithdrawn) ||
        !custodyBreached.custodyHeld,
      `${custodyBreached.band} held=${custodyBreached.custodyHeld}`
    );

    const releaseBlocked = buildAgent17ReleaseAccord({
      custodyIndex: custodyBreached,
      endorsementAccord: endorsementWithdrawn,
      ledgerIndex: ledgerClosed,
    });
    push(
      'cst_blocked_custody',
      'Breached custody yields blocked release or blocks custody',
      releaseBlocked.band === 'blocked' ||
        releaseAccordBlocksCustody(releaseBlocked) ||
        !releaseBlocked.releaseCleared,
      `${releaseBlocked.band} cleared=${releaseBlocked.releaseCleared}`
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'cst_evaluator_depth',
      'Evaluator attaches custody index and release accord',
      !!depth?.custodyIndex?.headline &&
        !!depth?.releaseAccord?.headline &&
        (depth.custodyIndex.holds?.length ?? 0) >= 5 &&
        (depth.releaseAccord.gates?.length ?? 0) >= 5,
      `${depth?.custodyIndex?.band}/${depth?.releaseAccord?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('cst_throw', 'Custody harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Custody Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}
