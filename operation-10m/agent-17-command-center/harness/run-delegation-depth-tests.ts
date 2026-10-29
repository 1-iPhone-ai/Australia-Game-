import type { Agent17DevTestReport, Agent17GameStateSlice } from '../types/command-center-types.ts';
import { evaluateAcc17CommandCenterOperations } from '../evaluation/operations-evaluator.ts';
import {
  acc17DelegateProject,
  createDefaultAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';
import { acc17InstantiatePlanFromTemplate } from '../planning/templates.ts';
import { buildAgent17DelegationAnalytics } from '../planning/delegation-analytics.ts';
import {
  buildAgent17DelegationLadder,
  delegationLadderHasCapacity,
} from '../planning/delegation-ladder.ts';
import { summarizeAgent17PlanLedger, planLedgerIndicatesInstability } from '../planning/plan-ledger.ts';
import { computeAgent17DelegationDepthScore, refineAgent17DelegationSuggestion } from '../planning/delegation-depth.ts';

export function runAgent17DelegationDepthTests(): Agent17DevTestReport {
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
      aiCommunicationAutonomyLevel: 'delegated' as const,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 12,
      day: 12,
      player: { id: 'player', money: 8000, netWorth: 12000, currentRegion: 'NSW' },
      actorsById: { player: { id: 'player', money: 8000, netWorth: 12000, currentRegion: 'NSW' } },
      playerTrackedObjective: { title: 'Team treasury coordination', sourceType: 'team' },
      lastExecutedAction: { type: 'invest' },
    };

    const plan = acc17InstantiatePlanFromTemplate('agent17_tpl_team_synergy', state, 'player');
    let ops = createDefaultAcc17CommandCenterOpsState();
    ops = {
      ...ops,
      activePlan: plan,
      delegatedProjects: [
        acc17DelegateProject(ops, plan!, 'copilot', 'c1', 'assisted'),
        acc17DelegateProject(ops, plan!, 'copilot', 'c2', 'assisted'),
      ],
    };

    const analytics = buildAgent17DelegationAnalytics(ops, settings);
    const ladder = buildAgent17DelegationLadder(analytics, settings, 'copilot');
    push(
      'delegation_ladder_rungs',
      'Delegation ladder exposes five rungs',
      ladder.rungs.length === 5,
      String(ladder.rungs.length)
    );
    push(
      'delegation_capacity',
      'Copilot at capacity triggers reroute candidate',
      !delegationLadderHasCapacity(ladder, 'copilot'),
      String(ladder.rungs.find(r => r.delegateKind === 'copilot')?.slotsRemaining)
    );

    const ledger = summarizeAgent17PlanLedger(ops, state);
    push(
      'plan_ledger_delegate',
      'Plan ledger records delegate events',
      ledger.entries.some(e => e.kind === 'delegate'),
      String(ledger.entries.length)
    );

    const score = computeAgent17DelegationDepthScore(ops, settings, 'copilot');
    push('delegation_depth_score', 'Delegation depth score bounded 0-100', score >= 0 && score <= 100, String(score));

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'depth_ladder_attached',
      'Snapshot includes delegation ladder headline',
      !!depth?.delegationLadder.headline,
      depth?.delegationLadder.headline
    );
    push(
      'depth_ledger_attached',
      'Snapshot includes plan ledger fingerprint',
      depth?.planLedger.lastFingerprint !== undefined,
      depth?.planLedger.lastFingerprint
    );

    ops = {
      ...ops,
      activePlan: plan
        ? { ...plan, replanCount: 2, steps: plan.steps.map((s, i) => (i === 1 ? { ...s, status: 'blocked' as const, blockerReason: 'x' } : s)) }
        : null,
    };
    const unstableLedger = summarizeAgent17PlanLedger(ops, state);
    push(
      'ledger_instability',
      'Ledger flags instability on replans and blocks',
      planLedgerIndicatesInstability(unstableLedger),
      `replan=${unstableLedger.replanEvents} blocks=${unstableLedger.blockedStepEvents}`
    );

    const refined = refineAgent17DelegationSuggestion(
      ops,
      state,
      settings,
      'player',
      { kind: 'hold', headline: 'hold', rationale: 'hold', confidence: 0.5 },
      'copilot'
    );
    push(
      'delegation_refine_risk',
      'Refiner upgrades hold under at-risk health',
      refined.kind === 'delegate',
      refined.delegateKind
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('delegation_throw', 'Delegation depth harness did not throw', false, msg);
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
    summary: `Agent 17 Delegation Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}
