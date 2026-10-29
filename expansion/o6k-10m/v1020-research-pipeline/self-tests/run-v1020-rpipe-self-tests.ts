/**
 * LAB suite: v1020_research_pipeline — state–federal transfer & lab_transfer fixtures (SECTION 20BL).
 */
import type { V1020RpipeSelfTestResult, V1020RpipeTurnInput } from '../types/core';
import { V1020_RPIPE_SCHEMA_VERSION } from '../types/core';
import {
  runV1020RpipeTurn,
  createEmptyV1020RpipePersisted,
  v1020RpipeInputHash,
  sanitizeV1020RpipePersisted,
} from '../engine/research-pipeline-orchestrator';
import {
  V1020_RPIPE_clamp,
  V1020_RPIPE_complianceFromScore,
  V1020_RPIPE_transferBandRank,
} from '../engine/research-pipeline-utils';
import { computeV1020RpipeSupply20bbBridge, applyV1020RpipeSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1020RpipeTrade20baBridge, applyV1020RpipeTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1020RpipeEnergy20bcBridge, applyV1020RpipeEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1020RpipeWorkforce20bfBridge, applyV1020RpipeWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1020RpipeCommercialization20beBridge, applyV1020RpipeCommercialization20beCommercializationOverrides } from '../adapters/adapter-commercialization-20be';
import { computeV1020RpipeLabTransfer20bjBridge, applyV1020RpipeLabTransfer20bjLabTransferOverrides } from '../adapters/adapter-lab-transfer-20bj';
import { V1020_RPIPE_mergeCommercializationStackEdges, V1020_RPIPE_commercializationStackGraphHash } from '../commercialization-stacks/graph-utils';
import { V1020_RPIPE_GENERATED_COMMERCIALIZATION_STACK_EDGES } from '../generated/commercialization-stack-bundle';
import {
  V1020_RPIPE_ALL_PIPELINE_SCENARIO_IDS,
  V1020_RPIPE_evaluatePipelineBatch,
  V1020_RPIPE_listActivePipelineScenarioIds,
  V1020_RPIPE_runPipelineScenarioRegressionSweep,
} from '../generated/pipeline-registry';
import { V1020_RPIPE_PIPELINE_SCENARIO_000_evaluate, V1020_RPIPE_PIPELINE_SCENARIO_000_META } from '../generated/pipeline-scenarios/scenario-000';
import { V1020_RPIPE_LAB_TRANSFER_NODE_00_buffer } from '../lab-transfers/lab-transfer-00';
import { V1020_RPIPE_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1020RpipeTurnInput> = {}): V1020RpipeTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      commercializationStackIndex: 0.44,
    },
    trade20ba: {
      turn: 1,
      sanctionsPressure: 24,
      importDependencyRatio: 0.36,
      exportLaneStability: 54,
    },
    energy20bc: {
      turn: 1,
      gridStability: 59,
      reserveMarginPct: 13,
      carbonStress: 31,
    },
    workforce20bf: {
      turn: 1,
      specialistGap: 31,
      nationalReadiness: 56,
      mismatchIndex: 43,
    },
    aiFidelity20be: {
      turn: 1,
      planVerifyScore: 62,
      automationCoverage: 0.41,
      commercializationReadiness: 48,
    },
    fiscalFederalism20bj: {
      turn: 1,
      transferPressure: 36,
      grantStackLoad: 0.33,
      labTransferBacklog: 22,
    },
    researchHeadroom: 57,
    pipelinePolicyFocus: 46,
    activeTransferScenarioIds: V1020_RPIPE_listActivePipelineScenarioIds(1).slice(0, 8),
    activeLabTransferNodeIds: ['lab_transfer_00', 'lab_transfer_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1020RpipeSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1020RpipeSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1020RpipeSelfTestResult[];
} {
  const results: V1020RpipeSelfTestResult[] = [];

  check(results, 'v1020_rpipe_lab_id', 'LAB suite id', V1020_RPIPE_LAB_SUITE_ID === 'v1020_research_pipeline');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1020RpipeTurn(inp);
    const id = `v1020_rpipe_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1020_RPIPE_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateSeverityIndex >= 0 && out.state.aggregateSeverityIndex <= 100,
    );
  }

  check(
    results,
    'v1020_rpipe_hash_stable',
    'input hash deterministic',
    v1020RpipeInputHash(baseInput({ turn: 3, seed: 88 })) === v1020RpipeInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1020RpipePersisted();
    check(
      results,
      'v1020_rpipe_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1020_RPIPE_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1020RpipePersisted({ revision: -3 }, 2);
    check(results, 'v1020_rpipe_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1020_rpipe_scenario_catalog',
    'pipeline scenario catalog populated',
    V1020_RPIPE_ALL_PIPELINE_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1020_RPIPE_evaluatePipelineBatch(4, ['pipeline_000', 'pipeline_001', 'pipeline_002']);
    check(
      results,
      'v1020_rpipe_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanSeverity > 0,
    );
  }

  {
    const r = V1020_RPIPE_PIPELINE_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1020_rpipe_scenario_000',
      'scenario 000 evaluate',
      r.complianceScore <= 100 && V1020_RPIPE_PIPELINE_SCENARIO_000_META.id === 'pipeline_000',
    );
  }

  check(
    results,
    'v1020_rpipe_prop_graph',
    'commercializationStack graph hash',
    V1020_RPIPE_commercializationStackGraphHash(V1020_RPIPE_GENERATED_COMMERCIALIZATION_STACK_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1020_RPIPE_mergeCommercializationStackEdges(
      [V1020_RPIPE_GENERATED_COMMERCIALIZATION_STACK_EDGES[0], V1020_RPIPE_GENERATED_COMMERCIALIZATION_STACK_EDGES[400]],
      [V1020_RPIPE_GENERATED_COMMERCIALIZATION_STACK_EDGES[800]],
    );
    check(results, 'v1020_rpipe_prop_merge', 'commercializationStack merge', merged.length === 3);
  }

  {
    const b = V1020_RPIPE_LAB_TRANSFER_NODE_00_buffer(5);
    check(results, 'v1020_rpipe_lab_transfer_buffer', 'lab_transfer node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1020RpipeTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1020_rpipe_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1020RpipeSupply20bbBridge(baseInput(), 52);
    const next = applyV1020RpipeSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1020_rpipe_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1020RpipeEnergy20bcBridge(baseInput(), 48);
    const next = applyV1020RpipeEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1020_rpipe_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1020RpipeWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1020RpipeWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1020_rpipe_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1020RpipeTrade20baBridge(baseInput(), 0.2);
    const next = applyV1020RpipeTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1020_rpipe_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1020RpipeCommercialization20beBridge(baseInput(), 0.15);
    const next = applyV1020RpipeCommercialization20beCommercializationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1020_rpipe_commercialization_adapter',
      '20BE commercialization adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1020RpipeLabTransfer20bjBridge(baseInput(), 0.18);
    const next = applyV1020RpipeLabTransfer20bjLabTransferOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1020_rpipe_lab_transfer_adapter',
      '20BJ lab transfer adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1020_rpipe_lab_transfer_band', 'lab_transfer bands', V1020_RPIPE_complianceFromScore(76) === 'robust');
  check(results, 'v1020_rpipe_pipeline_rank', 'transfer band rank', V1020_RPIPE_transferBandRank('critical') === 5);
  check(results, 'v1020_rpipe_clamp', 'clamp finite', V1020_RPIPE_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1020_RPIPE_runPipelineScenarioRegressionSweep(3);
    check(results, 'v1020_rpipe_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1020RpipePersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1020RpipeTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1020_rpipe_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1020RpipePersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1020RpipeTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1020_rpipe_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1020_RPIPE_LAB_SUITE_ID, results };
}

export function runV1020RpipeSelfTestsForLab(): V1020RpipeSelfTestResult[] {
  return runV1020RpipeSelfTests().results;
}
