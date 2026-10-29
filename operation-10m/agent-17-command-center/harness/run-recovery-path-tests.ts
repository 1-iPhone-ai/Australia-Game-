import type { Agent17DevTestReport, Agent17GameStateSlice } from '../types/command-center-types.ts';
import { evaluateAcc17CommandCenterOperations } from '../evaluation/operations-evaluator.ts';
import { acc17InstantiatePlanFromTemplate } from '../planning/templates.ts';
import {
  detectAgent17RecoverySignals,
  maybeApplyAgent17RecoveryPath,
  pickAgent17RecoveryTemplateId,
  replanAcc17WithRecoveryTemplate,
} from '../planning/recovery-paths.ts';
import {
  acc17AdvanceVerifiedPlanProgress,
  createDefaultAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';
import { acc17ComputeRelevantStateFingerprint } from '../planning/fingerprint.ts';

export function runAgent17RecoveryPathTests(): Agent17DevTestReport {
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
    const baseState: Agent17GameStateSlice = {
      turnCounter: 5,
      day: 5,
      player: {
        id: 'player',
        money: 250,
        netWorth: 6000,
        currentRegion: 'QLD',
        currentSupplies: 20,
      },
      actorsById: {
        player: {
          id: 'player',
          money: 250,
          netWorth: 6000,
          currentRegion: 'QLD',
          currentSupplies: 20,
        },
      },
      lastExecutedAction: { type: 'wait' },
    };

    const signals = detectAgent17RecoverySignals(baseState, 'player');
    push(
      'recovery_signals',
      'Low cash and supplies emit recovery signals',
      signals.some(s => s.lane === 'liquidity_crisis') &&
        signals.some(s => s.lane === 'supply_collapse'),
      `lanes=${signals.map(s => s.lane).join(',')}`
    );

    const decision = pickAgent17RecoveryTemplateId(signals, true);
    push(
      'recovery_pick_blocked',
      'Blocked plan picks highest-severity recovery lane',
      decision?.templateId === 'agent17_tpl_supply_deep_recovery' &&
        decision?.lane === 'supply_collapse',
      `${decision?.lane}/${decision?.templateId}`
    );

    const deepPlan = acc17InstantiatePlanFromTemplate(
      'agent17_tpl_deep_capital_program',
      baseState,
      'player'
    );
    push(
      'deep_template_steps',
      'Deep capital program has six wired steps',
      !!deepPlan && deepPlan.steps.length === 6,
      `steps=${deepPlan?.steps.length}`
    );
    const step5 = deepPlan?.steps[5];
    push(
      'deep_prereq_chain',
      'Final deep phase requires prior step ids',
      (step5?.requirements.prerequisiteStepIds?.length ?? 0) >= 1,
      step5?.requirements.prerequisiteStepIds?.join(',')
    );

    let ops = createDefaultAcc17CommandCenterOpsState();
    const objectivePlan = acc17InstantiatePlanFromTemplate(
      'agent17_tpl_trade_arbitrage',
      baseState,
      'player'
    );
    ops = { ...ops, activePlan: objectivePlan };
    const fp0 = acc17ComputeRelevantStateFingerprint(baseState, 'player');
    const poorState: Agent17GameStateSlice = {
      ...baseState,
      player: { ...baseState.player!, money: 50, netWorth: 6000 },
      actorsById: {
        player: { ...baseState.actorsById!.player!, money: 50, netWorth: 6000 },
      },
      lastExecutedAction: { type: 'deposit' },
    };
    const fp1 = acc17ComputeRelevantStateFingerprint(poorState, 'player');
    ops = { ...ops, lastContextFingerprint: fp0 };
    const advanced = acc17AdvanceVerifiedPlanProgress(
      ops.activePlan!,
      poorState,
      'player',
      fp0
    );
    ops = { ...ops, activePlan: advanced.plan, lastContextFingerprint: fp1 };
    const hasBlocked = advanced.plan.steps.some(s => s.status === 'blocked');
    push('recovery_blocked_step', 'Cash drop blocks template step with minCash', hasBlocked);

    const recovery = maybeApplyAgent17RecoveryPath(ops, poorState, 'player');
    push(
      'recovery_replan',
      'Recovery replan swaps active plan',
      recovery.applied && recovery.ops.activePlan?.replanCount === 1,
      recovery.ops.activePlan?.objectiveSource
    );

    if (recovery.decision) {
      const manual = replanAcc17WithRecoveryTemplate(
        recovery.ops,
        poorState,
        'player',
        recovery.decision
      );
      push(
        'recovery_replan_count',
        'Manual replan increments replanCount',
        (manual.activePlan?.replanCount ?? 0) >= 2,
        String(manual.activePlan?.replanCount)
      );
    } else {
      push('recovery_replan_count', 'Manual replan increments replanCount', false, 'no decision');
    }

    const settings = { commandCenterSettings: { enabled: true }, aiCommunicationAutonomyLevel: 'assisted' as const };
    const evalBlocked = evaluateAcc17CommandCenterOperations(poorState, settings, 'player', {
      ...createDefaultAcc17CommandCenterOpsState(),
      activePlan: advanced.plan,
      lastContextFingerprint: fp1,
    });
    push(
      'recovery_eval_integration',
      'Evaluator applies recovery on blocked plan',
      evalBlocked.ops.activePlan?.objectiveSource?.startsWith('recovery:') === true,
      evalBlocked.ops.activePlan?.objectiveSource
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('recovery_throw', 'Recovery harness did not throw', false, msg);
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
    summary: `Agent 17 Recovery Path Tests: ${passedCount}/${testResults.length} Passed`,
  };
}
