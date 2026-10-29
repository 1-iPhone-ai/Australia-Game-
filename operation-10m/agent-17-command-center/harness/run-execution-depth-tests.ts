import type { Agent17DevTestReport, Agent17GameStateSlice } from '../types/command-center-types.ts';
import { evaluateAcc17CommandCenterOperations } from '../evaluation/operations-evaluator.ts';
import {
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
import { assessAgent17PlanHealth } from '../planning/plan-health.ts';
import { buildAgent17VerificationPolicy } from '../planning/verification-policy.ts';
import {
  buildAgent17ExecutionPacing,
  executionPacingRequiresThrottle,
} from '../planning/execution-pacing.ts';
import {
  buildAgent17ResilienceScorecard,
  resilienceScorecardNeedsIntervention,
} from '../planning/resilience-scorecard.ts';
import { acc17ComputeRelevantStateFingerprint } from '../planning/fingerprint.ts';

export function runAgent17ExecutionDepthTests(): Agent17DevTestReport {
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
      money: 80,
      netWorth: 1200,
      currentRegion: 'VIC',
      currentSupplies: 4,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 14,
      day: 14,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: { title: 'Stabilize supply chain', sourceType: 'contract' },
      gi3Strategy: { headline: 'Avoid cash crunch' },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = { ...ops, activePlan: plan };
    const health = assessAgent17PlanHealth(plan, state, 'player');
    const fp = acc17ComputeRelevantStateFingerprint(state, 'player');
    const policyOpen = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'prior_fp' },
      state,
      'player'
    );
    const policyClosed = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: fp },
      state,
      'player'
    );

    const pacingOpen = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyOpen);
    push(
      'exec_pacing_attached',
      'Execution pacing exposes budget and steps remaining',
      pacingOpen.stepsRemaining >= 1 && pacingOpen.turnBudgetRemaining >= 0,
      `steps=${pacingOpen.stepsRemaining} budget=${pacingOpen.turnBudgetRemaining}`
    );
    push(
      'exec_advance_when_open',
      'Can advance when verification gate open',
      pacingOpen.verificationGateOpen === true,
      String(pacingOpen.canAdvanceActiveStep)
    );

    const pacingClosed = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyClosed);
    push(
      'exec_throttle_on_fp',
      'Pacing throttles when fingerprint unchanged',
      pacingClosed.pacingBand === 'throttled' || executionPacingRequiresThrottle(pacingClosed),
      pacingClosed.pacingBand
    );
    push(
      'exec_cooldown_bounded',
      'Delegate cooldown non-negative',
      pacingOpen.cooldownTurns >= 0 && pacingOpen.cooldownTurns <= 2,
      String(pacingOpen.cooldownTurns)
    );

    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policyOpen
    );
    push(
      'exec_resilience_bounded',
      'Resilience composite index bounded 0–100',
      scorecard.compositeIndex >= 0 &&
        scorecard.compositeIndex <= 100 &&
        scorecard.recoveryPressure >= 0 &&
        scorecard.verificationStability >= 0,
      String(scorecard.compositeIndex)
    );
    push(
      'exec_mitigation_hints',
      'Scorecard emits mitigation hints',
      scorecard.mitigationHints.length >= 1 && scorecard.headline.length > 10,
      scorecard.mitigationHints[0]
    );
    push(
      'exec_low_supplies_intervention',
      'Low supplies raise recovery pressure',
      scorecard.recoveryPressure >= 20 || resilienceScorecardNeedsIntervention(scorecard),
      String(scorecard.recoveryPressure)
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'exec_evaluator_depth',
      'Evaluator attaches execution pacing and resilience scorecard',
      !!depth?.executionPacing?.headline &&
        !!depth?.resilienceScorecard?.headline &&
        depth.resilienceScorecard.mitigationHints.length >= 1,
      `${depth?.executionPacing?.pacingBand}/${depth?.resilienceScorecard?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('exec_throw', 'Execution harness did not throw', false, msg);
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
    summary: `Agent 17 Execution Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}
