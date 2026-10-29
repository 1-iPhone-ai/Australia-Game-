/**
 * LAB suite: v1020_climate_adaptation — state–federal transfer & flood_node fixtures (SECTION 20BR).
 */
import type { V1023CladSelfTestResult, V1023CladTurnInput } from '../types/core';
import { V1023_CLAD_SCHEMA_VERSION } from '../types/core';
import {
  runV1023CladTurn,
  createEmptyV1023CladPersisted,
  v1023CladInputHash,
  sanitizeV1023CladPersisted,
} from '../engine/climate-adaptation-orchestrator';
import {
  V1023_CLAD_clamp,
  V1023_CLAD_hazardBandFromScore,
  V1023_CLAD_hazardBandRank,
} from '../engine/climate-adaptation-utils';
import { computeV1023CladSupply20bbBridge, applyV1023CladSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1023CladTrade20baBridge, applyV1023CladTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1023CladEnergy20bcBridge, applyV1023CladEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1023CladWorkforce20bfBridge, applyV1023CladWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1023CladPublicServices20azBridge, applyV1023CladPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1023CladScenarioPacks20bdBridge, applyV1023CladScenarioPacks20bdScenarioPackOverrides } from '../adapters/adapter-scenarios-20bd';
import { V1023_CLAD_mergeDroughtBufferEdges, V1023_CLAD_droughtBufferGraphHash } from '../drought-buffer-stacks/graph-utils';
import { V1023_CLAD_GENERATED_DROUGHT_BUFFER_EDGES } from '../generated/drought-buffer-bundle';
import {
  V1023_CLAD_ALL_HAZARD_SCENARIO_IDS,
  V1023_CLAD_evaluateHazardBatch,
  V1023_CLAD_listActiveHazardScenarioIds,
  V1023_CLAD_runHazardScenarioRegressionSweep,
} from '../generated/hazard-registry';
import { V1023_CLAD_HAZARD_SCENARIO_000_evaluate, V1023_CLAD_HAZARD_SCENARIO_000_META } from '../generated/hazard-scenarios/scenario-000';
import { V1023_CLAD_FLOOD_NODE_00_buffer } from '../flood-defend-nodes/flood-node-00';
import { V1023_CLAD_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1023CladTurnInput> = {}): V1023CladTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      droughtBufferIndex: 0.44,
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
    scenarioPacks20bd: {
      turn: 1,
      packCohesionPressure: 36,
      grantStackLoad: 0.33,
      objectiveDriftTurns: 22,
    },
    coolingHeadroom: 57,
    adaptationPolicyFocus: 46,
    activeHazardScenarioIds: V1023_CLAD_listActiveHazardScenarioIds(1).slice(0, 8),
    activeFloodNodeIds: ['flood_node_00', 'flood_node_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1023CladSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1023CladSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1023CladSelfTestResult[];
} {
  const results: V1023CladSelfTestResult[] = [];

  check(results, 'v1023_clad_lab_id', 'LAB suite id', V1023_CLAD_LAB_SUITE_ID === 'v1023_climate_adaptation');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1023CladTurn(inp);
    const id = `v1023_clad_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1023_CLAD_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateHeatStressIndex >= 0 && out.state.aggregateHeatStressIndex <= 100,
    );
  }

  check(
    results,
    'v1023_clad_hash_stable',
    'input hash deterministic',
    v1023CladInputHash(baseInput({ turn: 3, seed: 88 })) === v1023CladInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1023CladPersisted();
    check(
      results,
      'v1023_clad_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1023_CLAD_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1023CladPersisted({ revision: -3 }, 2);
    check(results, 'v1023_clad_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1023_clad_scenario_catalog',
    'hazard scenario catalog populated',
    V1023_CLAD_ALL_HAZARD_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1023_CLAD_evaluateHazardBatch(4, ['stress_000', 'stress_001', 'stress_002']);
    check(
      results,
      'v1023_clad_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanHeatStress > 0,
    );
  }

  {
    const r = V1023_CLAD_HAZARD_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1023_clad_scenario_000',
      'scenario 000 evaluate',
      r.resilienceScore <= 100 && V1023_CLAD_HAZARD_SCENARIO_000_META.id === 'stress_000',
    );
  }

  check(
    results,
    'v1023_clad_prop_graph',
    'droughtBuffer graph hash',
    V1023_CLAD_droughtBufferGraphHash(V1023_CLAD_GENERATED_DROUGHT_BUFFER_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1023_CLAD_mergeDroughtBufferEdges(
      [V1023_CLAD_GENERATED_DROUGHT_BUFFER_EDGES[0], V1023_CLAD_GENERATED_DROUGHT_BUFFER_EDGES[400]],
      [V1023_CLAD_GENERATED_DROUGHT_BUFFER_EDGES[800]],
    );
    check(results, 'v1023_clad_prop_merge', 'droughtBuffer merge', merged.length === 3);
  }

  {
    const b = V1023_CLAD_FLOOD_NODE_00_buffer(5);
    check(results, 'v1023_clad_flood_node_buffer', 'flood_node node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1023CladTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1023_clad_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1023CladSupply20bbBridge(baseInput(), 52);
    const next = applyV1023CladSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1023_clad_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1023CladEnergy20bcBridge(baseInput(), 48);
    const next = applyV1023CladEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1023_clad_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1023CladWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1023CladWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1023_clad_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1023CladTrade20baBridge(baseInput(), 0.2);
    const next = applyV1023CladTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1023_clad_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1023CladPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1023CladPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1023_clad_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1023CladScenarioPacks20bdBridge(baseInput(), 0.18);
    const next = applyV1023CladScenarioPacks20bdScenarioPackOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1023_clad_flood_node_adapter',
      '20BD flood defend node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1023_clad_flood_node_band', 'flood_node bands', V1023_CLAD_hazardBandFromScore(76) === 'robust');
  check(results, 'v1023_clad_stress_rank', 'transfer band rank', V1023_CLAD_hazardBandRank('critical') === 5);
  check(results, 'v1023_clad_clamp', 'clamp finite', V1023_CLAD_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1023_CLAD_runHazardScenarioRegressionSweep(3);
    check(results, 'v1023_clad_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1023CladPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1023CladTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1023_clad_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1023CladPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1023CladTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1023_clad_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1023_CLAD_LAB_SUITE_ID, results };
}

export function runV1023CladSelfTestsForLab(): V1023CladSelfTestResult[] {
  return runV1023CladSelfTests().results;
}
