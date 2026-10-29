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
import {
  buildAgent17CommandPosture,
  commandPostureNeedsEscalation,
} from '../planning/command-posture.ts';
import {
  buildAgent17GovernanceAudit,
  governanceAuditBlocksAutomation,
} from '../planning/governance-audit.ts';
import { buildAgent17CoordinationBrief } from '../planning/coordination-brief.ts';
import {
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';
import { buildAgent17DelegationAnalytics } from '../planning/delegation-analytics.ts';
import { buildAgent17DelegationLadder } from '../planning/delegation-ladder.ts';
import { summarizeAgent17PlanLedger } from '../planning/plan-ledger.ts';
import { buildAgent17PlanningSuggestion } from '../planning/planning-orchestrator.ts';

export function runAgent17GovernanceDepthTests(): Agent17DevTestReport {
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
      turnCounter: 22,
      day: 22,
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
      { ...opsWithPlan, lastContextFingerprint: 'other_fp' },
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

    push(
      'gov_posture_bounded',
      'Command posture index bounded with band',
      posture.postureIndex >= 0 &&
        posture.postureIndex <= 100 &&
        (posture.band === 'commanding' ||
          posture.band === 'contested' ||
          posture.band === 'degraded'),
      `${posture.postureIndex}/${posture.band}`
    );

    push(
      'gov_posture_contributions',
      'Posture exposes weighted contributions',
      posture.handoffContribution >= 0 &&
        posture.resilienceContribution >= 0 &&
        posture.alignmentContribution >= 0,
      `h=${posture.handoffContribution} r=${posture.resilienceContribution}`
    );

    const auditClean = buildAgent17GovernanceAudit(opsWithPlan, settings, policy);
    push(
      'gov_audit_findings',
      'Governance audit exposes findings',
      auditClean.findings.length >= 4 &&
        auditClean.auditScore >= 0 &&
        auditClean.auditScore <= 100,
      `findings=${auditClean.findings.length} score=${auditClean.auditScore}`
    );

    push(
      'gov_audit_band',
      'Clean ops yields compliant or review band',
      auditClean.band === 'compliant' || auditClean.band === 'review',
      auditClean.band
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
    push(
      'gov_breach_blocks',
      'Authority breach triggers governance breach',
      auditBreach.band === 'breach' || governanceAuditBlocksAutomation(auditBreach),
      `${auditBreach.band} critical=${auditBreach.openCriticalCount}`
    );

    const divergentState: Agent17GameStateSlice = {
      ...state,
      gi3Strategy: { headline: 'Retreat mining operations entirely' },
    };
    const alignDrift = buildAgent17StrategicAlignment(
      opsWithPlan,
      divergentState,
      settings,
      'player',
      buildAgent17IntentQueue(opsWithPlan, divergentState, settings, 'player', health)
    );
    const postureDrift = buildAgent17CommandPosture({
      planHealth: health,
      handoffReadiness: handoff,
      resilienceScorecard: scorecard,
      strategicAlignment: alignDrift,
    });
    push(
      'gov_posture_escalation',
      'Degraded alignment can trigger escalation',
      alignDrift.band !== 'aligned' ||
        commandPostureNeedsEscalation(postureDrift) ||
        postureDrift.band !== 'commanding',
      `${alignDrift.band}/${postureDrift.band}`
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'gov_evaluator_depth',
      'Evaluator attaches command posture and governance audit',
      !!depth?.commandPosture?.headline &&
        !!depth?.governanceAudit?.headline &&
        (depth.governanceAudit.findings?.length ?? 0) >= 4,
      `${depth?.commandPosture?.band}/${depth?.governanceAudit?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('gov_throw', 'Governance harness did not throw', false, msg);
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
    summary: `Agent 17 Governance Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}
