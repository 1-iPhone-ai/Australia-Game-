import type { Agent17DevTestReport, Agent17GameStateSlice } from '../types/command-center-types.ts';
import { evaluateAcc17CommandCenterOperations } from '../evaluation/operations-evaluator.ts';
import { createDefaultAcc17CommandCenterOpsState, acc17CreateMultiStepPlanFromObjective, defaultObjectiveResolver } from '../planning/ops-state.ts';
import { buildAgent17IntentQueue, intentQueueRequiresRecovery } from '../planning/intent-synthesis.ts';
import {
  buildAgent17VerificationPolicy,
  verificationPolicyBlocksAdvance,
} from '../planning/verification-policy.ts';
import {
  buildAgent17CoordinationBrief,
  coordinationBriefReadyForGi,
} from '../planning/coordination-brief.ts';
import { assessAgent17PlanHealth } from '../planning/plan-health.ts';
import { acc17ComputeRelevantStateFingerprint } from '../planning/fingerprint.ts';

export function runAgent17CoordinationDepthTests(): Agent17DevTestReport {
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
      money: 150,
      netWorth: 4000,
      currentRegion: 'QLD',
      currentSupplies: 15,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 9,
      day: 9,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: { title: 'Restock and recover supplies', sourceType: 'contract' },
      gi3Strategy: { headline: 'Hold liquidity above $500' },
      lastExecutedAction: { type: 'restock_supplies' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = { ...ops, activePlan: plan };
    const health = assessAgent17PlanHealth(null, state, 'player');
    const intent = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    push(
      'coord_intent_queue',
      'Intent queue prioritizes objective and recovery',
      intent.queueDepth >= 3 && intent.primaryIntentId === 'intent_objective',
      `depth=${intent.queueDepth} primary=${intent.primaryIntentId}`
    );
    push(
      'coord_recovery_intent',
      'Low supplies emit recovery intent',
      intentQueueRequiresRecovery(intent) || intent.items.some(i => i.source === 'recovery'),
      intent.items.map(i => i.source).join(',')
    );

    const fp = acc17ComputeRelevantStateFingerprint(state, 'player');
    const policySame = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: fp },
      state,
      'player'
    );
    push(
      'coord_verify_block_same_fp',
      'Verification blocked when fingerprint unchanged',
      !policySame.allowVerification,
      policySame.blockingRuleIds.join(',')
    );

    const policyDelta = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'old_fp' },
      state,
      'player'
    );
    push(
      'coord_verify_allow_delta',
      'Verification allowed when fingerprint delta satisfied',
      policyDelta.allowVerification === true,
      String(policyDelta.allowVerification)
    );
    push(
      'coord_verify_blocks_advance',
      'Policy helper detects fingerprint hold',
      verificationPolicyBlocksAdvance(policySame) === true,
      String(verificationPolicyBlocksAdvance(policySame))
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'coord_brief_attached',
      'Evaluator attaches coordination brief',
      !!depth?.coordinationBrief?.headline && (depth.coordinationBrief.sections.length ?? 0) >= 3,
      String(depth?.coordinationBrief?.sections.length)
    );
    push(
      'coord_gi_handoff',
      'Coordination brief ready for GI handoff tags',
      depth?.coordinationBrief
        ? coordinationBriefReadyForGi(depth.coordinationBrief)
        : false,
      depth?.coordinationBrief?.giHandoffTags?.join(',')
    );

    if (depth) {
      const manualBrief = buildAgent17CoordinationBrief(
        {
          turn: depth.turn,
          actorId: depth.actorId,
          planHealth: depth.planHealth,
          suggestion: depth.suggestion,
          templateRouting: depth.templateRouting,
          delegationAnalytics: depth.delegationAnalytics,
          delegationLadder: depth.delegationLadder,
          planLedger: depth.planLedger,
          catalogDepth: depth.catalogDepth,
        },
        depth.intentQueue,
        depth.verificationPolicy,
        evalRes.ops,
        state,
        settings
      );
      push(
        'coord_brief_confidence',
        'Brief confidence bounded',
        manualBrief.confidence >= 0.35 && manualBrief.confidence <= 0.99,
        String(manualBrief.confidence)
      );
    } else {
      push('coord_brief_confidence', 'Brief confidence bounded', false, 'no depth');
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('coord_throw', 'Coordination harness did not throw', false, msg);
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
    summary: `Agent 17 Coordination Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}
