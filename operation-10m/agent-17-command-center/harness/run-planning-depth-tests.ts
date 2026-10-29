import type { Agent17DevTestReport, Agent17GameStateSlice } from '../types/command-center-types.ts';
import { evaluateAcc17CommandCenterOperations } from '../evaluation/operations-evaluator.ts';
import { createDefaultAcc17CommandCenterOpsState } from '../planning/ops-state.ts';
import { acc17InstantiatePlanFromTemplate } from '../planning/templates.ts';
import {
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';
import { assessAgent17PlanHealth } from '../planning/plan-health.ts';
import { buildAgent17PlanningDepthSnapshot } from '../planning/planning-orchestrator.ts';

export function runAgent17PlanningDepthTests(): Agent17DevTestReport {
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
    const state: Agent17GameStateSlice = {
      turnCounter: 8,
      day: 8,
      player: {
        id: 'player',
        money: 4200,
        netWorth: 9000,
        currentRegion: 'NSW',
        currentSupplies: 80,
      },
      actorsById: {
        player: {
          id: 'player',
          money: 4200,
          netWorth: 9000,
          currentRegion: 'NSW',
          currentSupplies: 80,
        },
      },
      playerTrackedObjective: {
        title: 'Expand trade routes across markets',
        sourceType: 'contract',
        sourceId: 'trade-1',
        description: 'Focus on trade arbitrage this turn',
      },
      lastExecutedAction: { type: 'wait' },
    };
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };

    const depth = summarizeAgent17CatalogDepth();
    push(
      'depth_catalog_scale',
      'Catalog depth meets scale wave minimums',
      depth.templateCount >= 12 && depth.deepTemplateCount >= 7 && depth.maxStepCount >= 6,
      JSON.stringify(depth)
    );

    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    push(
      'depth_template_routing',
      'Trade objective routes to trade category',
      routing.matchedCategory === 'trade' &&
        routing.candidateTemplateIds.includes('agent17_tpl_trade_arbitrage'),
      `${routing.matchedCategory}/${routing.candidateTemplateIds[0]}`
    );

    const plan = acc17InstantiatePlanFromTemplate(
      'agent17_tpl_diplomatic_depth',
      state,
      'player'
    );
    const health = assessAgent17PlanHealth(plan, state, 'player');
    push(
      'depth_plan_health',
      'Fresh deep plan starts steady or strong',
      health.band === 'steady' || health.band === 'strong',
      health.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(
      state,
      settings,
      'player',
      createDefaultAcc17CommandCenterOpsState()
    );
    push(
      'depth_snapshot_attached',
      'Evaluator attaches planningDepth snapshot',
      !!evalRes.snapshot.planningDepth &&
        evalRes.snapshot.planningDepth.catalogDepth.templateCount >= 12,
      String(evalRes.snapshot.planningDepth?.catalogDepth.templateCount)
    );
    push(
      'depth_suggestion',
      'Planning suggestion has kind and confidence',
      !!evalRes.snapshot.planningDepth?.suggestion.kind &&
        (evalRes.snapshot.planningDepth?.suggestion.confidence ?? 0) > 0,
      evalRes.snapshot.planningDepth?.suggestion.kind
    );

    const ops = evalRes.ops;
    const manualDepth = buildAgent17PlanningDepthSnapshot(
      ops,
      state,
      settings,
      'player',
      'copilot'
    );
    push(
      'depth_delegation_analytics',
      'Delegation analytics covers all delegate kinds',
      manualDepth.delegationAnalytics.length === 5,
      String(manualDepth.delegationAnalytics.length)
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('depth_throw', 'Planning depth harness did not throw', false, msg);
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
    summary: `Agent 17 Planning Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}
