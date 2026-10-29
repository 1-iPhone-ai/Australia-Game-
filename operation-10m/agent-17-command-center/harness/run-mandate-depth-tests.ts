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
import { buildAgent17CoordinationBrief } from '../planning/coordination-brief.ts';
import {
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';
import { buildAgent17DelegationAnalytics } from '../planning/delegation-analytics.ts';
import { buildAgent17DelegationLadder } from '../planning/delegation-ladder.ts';
import { summarizeAgent17PlanLedger } from '../planning/plan-ledger.ts';
import { buildAgent17PlanningSuggestion } from '../planning/planning-orchestrator.ts';

export function runAgent17MandateDepthTests(): Agent17DevTestReport {
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
      { ...opsWithPlan, lastContextFingerprint: 'mdt_fp' },
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
      'mdt_weave_bounded',
      'Mandate weave bounded with band',
      weaveClean.weaveScore >= 0 &&
        weaveClean.weaveScore <= 100 &&
        (weaveClean.band === 'aligned' ||
          weaveClean.band === 'tensioned' ||
          weaveClean.band === 'frayed'),
      `${weaveClean.weaveScore}/${weaveClean.band}`
    );

    push(
      'mdt_weave_threads',
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
      'mdt_lock_pins',
      'Sovereignty lock exposes pins',
      lockClean.pins.length >= 5 &&
        lockClean.lockScore >= 0 &&
        lockClean.lockScore <= 100,
      `pins=${lockClean.pins.length} score=${lockClean.lockScore}`
    );

    push(
      'mdt_weave_aligned',
      'Healthy ops yields aligned or tensioned weave',
      weaveClean.band === 'aligned' || weaveClean.band === 'tensioned',
      weaveClean.band
    );

    push(
      'mdt_lock_conditional',
      'Healthy ops yields secured or conditional lock',
      lockClean.band === 'secured' || lockClean.band === 'conditional',
      lockClean.band
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
      'mdt_frayed_blocks',
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
      'mdt_released_command',
      'Released lock blocks command sovereignty',
      lockReleased.band === 'released' ||
        sovereigntyLockBlocksCommand(lockReleased) ||
        !lockReleased.commandSovereignty,
      `${lockReleased.band} sov=${lockReleased.commandSovereignty}`
    );

    push(
      'mdt_escalation_link',
      'Urgent escalation propagates to weave threads',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        convergenceIndexBlocksDirective(convergenceDiverging),
      matrixUrgent.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'mdt_evaluator_depth',
      'Evaluator attaches mandate weave and sovereignty lock',
      !!depth?.mandateWeave?.headline &&
        !!depth?.sovereigntyLock?.headline &&
        (depth.sovereigntyLock.pins?.length ?? 0) >= 5,
      `${depth?.mandateWeave?.band}/${depth?.sovereigntyLock?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('mdt_throw', 'Mandate harness did not throw', false, msg);
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
    summary: `Agent 17 Mandate Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}
