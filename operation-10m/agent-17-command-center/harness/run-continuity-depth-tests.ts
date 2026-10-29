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
import {
  buildAgent17StrategicAlignment,
  strategicAlignmentNeedsReconcile,
} from '../planning/strategic-alignment.ts';
import {
  buildAgent17HandoffReadiness,
  handoffReadinessBlocked,
} from '../planning/handoff-readiness.ts';
import { buildAgent17CoordinationBrief } from '../planning/coordination-brief.ts';
import { acc17ComputeRelevantStateFingerprint } from '../planning/fingerprint.ts';
import {
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';
import { buildAgent17DelegationAnalytics } from '../planning/delegation-analytics.ts';
import { buildAgent17DelegationLadder } from '../planning/delegation-ladder.ts';
import { summarizeAgent17PlanLedger } from '../planning/plan-ledger.ts';
import { buildAgent17PlanningSuggestion } from '../planning/planning-orchestrator.ts';

export function runAgent17ContinuityDepthTests(): Agent17DevTestReport {
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
      turnCounter: 21,
      day: 21,
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
    const opsWithPlan = { ...ops, activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );

    push(
      'cont_align_bounded',
      'Strategic alignment index bounded with band',
      alignment.alignmentIndex >= 0 &&
        alignment.alignmentIndex <= 100 &&
        (alignment.band === 'aligned' ||
          alignment.band === 'drifting' ||
          alignment.band === 'divergent'),
      `${alignment.alignmentIndex}/${alignment.band}`
    );
    push(
      'cont_align_high_when_cues_match',
      'Matching GI3/objective cues raise overlap',
      alignment.gi3Overlap >= 40 && !strategicAlignmentNeedsReconcile(alignment),
      `gi3=${alignment.gi3Overlap} flags=${alignment.driftFlags.length}`
    );

    const fp = acc17ComputeRelevantStateFingerprint(state, 'player');
    const policyOpen = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'other_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyOpen);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policyOpen
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
      policyOpen,
      opsWithPlan,
      state,
      settings
    );
    const handoffOpen = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policyOpen,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });

    push(
      'cont_handoff_checks',
      'Handoff readiness exposes weighted checks',
      handoffOpen.checks.length >= 5 &&
        handoffOpen.readinessScore >= 0 &&
        handoffOpen.readinessScore <= 100,
      `checks=${handoffOpen.checks.length} score=${handoffOpen.readinessScore}`
    );
    push(
      'cont_handoff_partial_or_ready',
      'Open gates yield partial or ready band',
      handoffOpen.band === 'partial' || handoffOpen.band === 'ready',
      handoffOpen.band
    );

    const policyClosed = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: fp },
      state,
      'player'
    );
    const pacingClosed = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyClosed);
    const handoffClosed = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policyClosed,
      executionPacing: pacingClosed,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    push(
      'cont_handoff_blocked_verify',
      'Closed verification blocks handoff',
      handoffClosed.blockers.includes('verify_gate') || handoffReadinessBlocked(handoffClosed),
      handoffClosed.blockers.join(',')
    );

    const divergentState: Agent17GameStateSlice = {
      ...state,
      gi3Strategy: { headline: 'Retreat mining operations entirely' },
      strategyPlannerState: { activePlan: { title: 'Liquidate regional assets' } },
    };
    const alignDrift = buildAgent17StrategicAlignment(
      opsWithPlan,
      divergentState,
      settings,
      'player',
      buildAgent17IntentQueue(opsWithPlan, divergentState, settings, 'player', health)
    );
    push(
      'cont_drift_flags',
      'Divergent upstream cues emit drift flags',
      alignDrift.driftFlags.length >= 1 || alignDrift.band !== 'aligned',
      alignDrift.driftFlags.join(',') || alignDrift.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'cont_evaluator_depth',
      'Evaluator attaches strategic alignment and handoff readiness',
      !!depth?.strategicAlignment?.headline &&
        !!depth?.handoffReadiness?.headline &&
        (depth.handoffReadiness.checks?.length ?? 0) >= 5,
      `${depth?.strategicAlignment?.band}/${depth?.handoffReadiness?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('cont_throw', 'Continuity harness did not throw', false, msg);
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
    summary: `Agent 17 Continuity Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}
