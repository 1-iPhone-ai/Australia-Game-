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
import { buildAgent17CadenceLattice, cadenceLatticeBlocksRun } from '../planning/cadence-lattice.ts';
import { buildAgent17ReadinessGate, readinessGateBlocksRun } from '../planning/readiness-gate.ts';
import { buildAgent17PulseIndex, pulseIndexBlocksContinuity } from '../planning/pulse-index.ts';
import {
  buildAgent17ContinuityBridge,
  continuityBridgeBlocksHandoff,
} from '../planning/continuity-bridge.ts';
import { buildAgent17CoordinationBrief } from '../planning/coordination-brief.ts';
import {
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';
import { buildAgent17DelegationAnalytics } from '../planning/delegation-analytics.ts';
import { buildAgent17DelegationLadder } from '../planning/delegation-ladder.ts';
import { summarizeAgent17PlanLedger } from '../planning/plan-ledger.ts';
import { buildAgent17PlanningSuggestion } from '../planning/planning-orchestrator.ts';

export function runAgent17PulseDepthTests(): Agent17DevTestReport {
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
      turnCounter: 30,
      day: 30,
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
      { ...opsWithPlan, lastContextFingerprint: 'pulse_fp' },
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

    const pulseClean = buildAgent17PulseIndex({
      readinessGate: readiness,
      cadenceLattice: cadence,
      commandPosture: posture,
    });
    push(
      'pls_index_bounded',
      'Pulse index bounded with band',
      pulseClean.pulseIndex >= 0 &&
        pulseClean.pulseIndex <= 100 &&
        (pulseClean.band === 'strong' ||
          pulseClean.band === 'moderate' ||
          pulseClean.band === 'flat'),
      `${pulseClean.pulseIndex}/${pulseClean.band}`
    );

    push(
      'pls_factors',
      'Pulse index exposes weighted factors',
      pulseClean.factors.length >= 4 && pulseClean.factors.every(f => f.weight > 0),
      `factors=${pulseClean.factors.length}`
    );

    const bridgeClean = buildAgent17ContinuityBridge({
      pulseIndex: pulseClean,
      resilienceScorecard: scorecard,
      verificationPolicy: policy,
    });
    push(
      'pls_bridge_links',
      'Continuity bridge exposes links',
      bridgeClean.links.length >= 5 &&
        bridgeClean.bridgeScore >= 0 &&
        bridgeClean.bridgeScore <= 100,
      `links=${bridgeClean.links.length} score=${bridgeClean.bridgeScore}`
    );

    push(
      'pls_pulse_moderate',
      'Healthy ops yields moderate or strong pulse',
      pulseClean.band === 'moderate' || pulseClean.band === 'strong',
      pulseClean.band
    );

    push(
      'pls_bridge_partial',
      'Healthy ops yields linked or partial bridge',
      bridgeClean.band === 'linked' || bridgeClean.band === 'partial',
      bridgeClean.band
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
    push(
      'pls_flat_blocks',
      'Governance breach yields flat pulse or blocks continuity',
      pulseFlat.band === 'flat' || pulseIndexBlocksContinuity(pulseFlat),
      `${pulseFlat.band} idx=${pulseFlat.pulseIndex}`
    );

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
    push(
      'pls_broken_handoff',
      'Broken bridge blocks continuity handoff',
      bridgeBroken.band === 'broken' ||
        continuityBridgeBlocksHandoff(bridgeBroken) ||
        !bridgeBroken.continuityClearance,
      `${bridgeBroken.band} clearance=${bridgeBroken.continuityClearance}`
    );

    push(
      'pls_escalation_link',
      'Urgent escalation propagates to pulse factors',
      escalationMatrixBlocksAutomation(matrixUrgent) ||
        governanceAuditBlocksAutomation(auditBreach) ||
        rollbackAssuranceNeedsRestore(assuranceBreach) ||
        stabilizationIndexBlocksAutomation(stabilizationVolatile) ||
        commandEnvelopeNeedsThrottle(envelopeSaturated) ||
        readinessGateBlocksRun(readinessStop) ||
        cadenceLatticeBlocksRun(cadenceStalled),
      matrixUrgent.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'pls_evaluator_depth',
      'Evaluator attaches pulse index and continuity bridge',
      !!depth?.pulseIndex?.headline &&
        !!depth?.continuityBridge?.headline &&
        (depth.continuityBridge.links?.length ?? 0) >= 5,
      `${depth?.pulseIndex?.band}/${depth?.continuityBridge?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('pls_throw', 'Pulse harness did not throw', false, msg);
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
    summary: `Agent 17 Pulse Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}
