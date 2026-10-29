/**
 * LAB suite: v1020_housing_affordability — state–federal transfer & zoning_node fixtures (SECTION 20BQ).
 */
import type { V1022HaffSelfTestResult, V1022HaffTurnInput } from '../types/core';
import { V1022_HAFF_SCHEMA_VERSION } from '../types/core';
import {
  runV1022HaffTurn,
  createEmptyV1022HaffPersisted,
  v1022HaffInputHash,
  sanitizeV1022HaffPersisted,
} from '../engine/housing-affordability-orchestrator';
import {
  V1022_HAFF_clamp,
  V1022_HAFF_tenureBandFromScore,
  V1022_HAFF_stressBandRank,
} from '../engine/housing-affordability-utils';
import { computeV1022HaffSupply20bbBridge, applyV1022HaffSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1022HaffTrade20baBridge, applyV1022HaffTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1022HaffEnergy20bcBridge, applyV1022HaffEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1022HaffWorkforce20bfBridge, applyV1022HaffWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1022HaffPublicServices20azBridge, applyV1022HaffPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1022HaffFiscalFederalism20bjBridge, applyV1022HaffFiscalFederalism20bjZoningOverrides } from '../adapters/adapter-fiscal-20bj';
import { V1022_HAFF_mergeSupplyPipelineEdges, V1022_HAFF_supplyPipelineGraphHash } from '../supply-pipeline-stacks/graph-utils';
import { V1022_HAFF_GENERATED_SUPPLY_PIPELINE_EDGES } from '../generated/supply-pipeline-bundle';
import {
  V1022_HAFF_ALL_STRESS_SCENARIO_IDS,
  V1022_HAFF_evaluateStressBatch,
  V1022_HAFF_listActiveStressScenarioIds,
  V1022_HAFF_runStressScenarioRegressionSweep,
} from '../generated/stress-registry';
import { V1022_HAFF_STRESS_SCENARIO_000_evaluate, V1022_HAFF_STRESS_SCENARIO_000_META } from '../generated/stress-scenarios/scenario-000';
import { V1022_HAFF_ZONING_NODE_00_buffer } from '../zoning-friction-nodes/zoning-node-00';
import { V1022_HAFF_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1022HaffTurnInput> = {}): V1022HaffTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      supplyPipelineIndex: 0.44,
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
    publicServices20az: {
      turn: 1,
      clinicCapacityScore: 62,
      digitalServiceCoverage: 0.41,
      serviceDeliveryReadiness: 48,
    },
    fiscalFederalism20bj: {
      turn: 1,
      transferBackpressure: 36,
      grantStackLoad: 0.33,
      zoningBacklogTurns: 22,
    },
    constructionHeadroom: 57,
    housingPolicyFocus: 46,
    activeStressScenarioIds: V1022_HAFF_listActiveStressScenarioIds(1).slice(0, 8),
    activeZoningNodeIds: ['zoning_node_00', 'zoning_node_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1022HaffSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1022HaffSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1022HaffSelfTestResult[];
} {
  const results: V1022HaffSelfTestResult[] = [];

  check(results, 'v1022_haff_lab_id', 'LAB suite id', V1022_HAFF_LAB_SUITE_ID === 'v1022_housing_affordability');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1022HaffTurn(inp);
    const id = `v1022_haff_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1022_HAFF_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateRentStressIndex >= 0 && out.state.aggregateRentStressIndex <= 100,
    );
  }

  check(
    results,
    'v1022_haff_hash_stable',
    'input hash deterministic',
    v1022HaffInputHash(baseInput({ turn: 3, seed: 88 })) === v1022HaffInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1022HaffPersisted();
    check(
      results,
      'v1022_haff_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1022_HAFF_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1022HaffPersisted({ revision: -3 }, 2);
    check(results, 'v1022_haff_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1022_haff_scenario_catalog',
    'stress scenario catalog populated',
    V1022_HAFF_ALL_STRESS_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1022_HAFF_evaluateStressBatch(4, ['stress_000', 'stress_001', 'stress_002']);
    check(
      results,
      'v1022_haff_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanRentStress > 0,
    );
  }

  {
    const r = V1022_HAFF_STRESS_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1022_haff_scenario_000',
      'scenario 000 evaluate',
      r.affordabilityScore <= 100 && V1022_HAFF_STRESS_SCENARIO_000_META.id === 'stress_000',
    );
  }

  check(
    results,
    'v1022_haff_prop_graph',
    'supplyPipeline graph hash',
    V1022_HAFF_supplyPipelineGraphHash(V1022_HAFF_GENERATED_SUPPLY_PIPELINE_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1022_HAFF_mergeSupplyPipelineEdges(
      [V1022_HAFF_GENERATED_SUPPLY_PIPELINE_EDGES[0], V1022_HAFF_GENERATED_SUPPLY_PIPELINE_EDGES[400]],
      [V1022_HAFF_GENERATED_SUPPLY_PIPELINE_EDGES[800]],
    );
    check(results, 'v1022_haff_prop_merge', 'supplyPipeline merge', merged.length === 3);
  }

  {
    const b = V1022_HAFF_ZONING_NODE_00_buffer(5);
    check(results, 'v1022_haff_zoning_node_buffer', 'zoning_node node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1022HaffTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1022_haff_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1022HaffSupply20bbBridge(baseInput(), 52);
    const next = applyV1022HaffSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1022_haff_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1022HaffEnergy20bcBridge(baseInput(), 48);
    const next = applyV1022HaffEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1022_haff_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1022HaffWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1022HaffWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1022_haff_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1022HaffTrade20baBridge(baseInput(), 0.2);
    const next = applyV1022HaffTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1022_haff_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1022HaffPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1022HaffPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1022_haff_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1022HaffFiscalFederalism20bjBridge(baseInput(), 0.18);
    const next = applyV1022HaffFiscalFederalism20bjZoningOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1022_haff_zoning_node_adapter',
      '20BJ zoning friction node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1022_haff_zoning_node_band', 'zoning_node bands', V1022_HAFF_tenureBandFromScore(76) === 'robust');
  check(results, 'v1022_haff_stress_rank', 'transfer band rank', V1022_HAFF_stressBandRank('critical') === 5);
  check(results, 'v1022_haff_clamp', 'clamp finite', V1022_HAFF_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1022_HAFF_runStressScenarioRegressionSweep(3);
    check(results, 'v1022_haff_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1022HaffPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1022HaffTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1022_haff_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1022HaffPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1022HaffTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1022_haff_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1022_HAFF_LAB_SUITE_ID, results };
}

export function runV1022HaffSelfTestsForLab(): V1022HaffSelfTestResult[] {
  return runV1022HaffSelfTests().results;
}
