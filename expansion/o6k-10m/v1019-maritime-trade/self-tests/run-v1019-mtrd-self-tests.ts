/**
 * LAB suite: v1019_maritime_trade — shipping lane & port fixtures (SECTION 20BM).
 */
import type { V1019MtrdSelfTestResult, V1019MtrdTurnInput } from '../types/core';
import { V1019_MTRD_SCHEMA_VERSION } from '../types/core';
import {
  runV1019MtrdTurn,
  createEmptyV1019MtrdPersisted,
  v1019MtrdInputHash,
  sanitizeV1019MtrdPersisted,
} from '../engine/maritime-trade-orchestrator';
import {
  V1019_MTRD_clamp,
  V1019_MTRD_portFromScore,
  V1019_MTRD_laneBandRank,
} from '../engine/maritime-trade-utils';
import { computeV1019MtrdTrade20baBridge, applyV1019MtrdTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1019MtrdEnergy20bcBridge, applyV1019MtrdEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { V1019_MTRD_mergeLaneGraphEdges, V1019_MTRD_laneGraphHash } from '../lane-graph/graph-utils';
import { V1019_MTRD_GENERATED_LANE_GRAPH_EDGES } from '../generated/lane-graph-bundle';
import {
  V1019_MTRD_ALL_LANE_SCENARIO_IDS,
  V1019_MTRD_evaluateShippingLaneBatch,
  V1019_MTRD_listActiveLaneScenarioIds,
  V1019_MTRD_runLaneScenarioRegressionSweep,
} from '../generated/shipping-lane-registry';
import { V1019_MTRD_LANE_SCENARIO_000_evaluate, V1019_MTRD_LANE_SCENARIO_000_META } from '../generated/shipping-lane-scenarios/lane-000';
import { V1019_MTRD_PORT_NODE_00_buffer } from '../maritime-ports/port-00';
import { V1019_MTRD_LAB_SUITE_ID, V1019_MTRD_PERSISTENCE_PATHS } from '../persistence/keys';

function baseInput(overrides: Partial<V1019MtrdTurnInput> = {}): V1019MtrdTurnInput {
  return {
    turn: 1,
    seed: 9190,
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
    fiscalHeadroom: 57,
    portPolicyFocus: 46,
    activeLaneScenarioIds: V1019_MTRD_listActiveLaneScenarioIds(1).slice(0, 8),
    activePortNodeIds: ['port_00', 'port_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1019MtrdSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1019MtrdSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1019MtrdSelfTestResult[];
} {
  const results: V1019MtrdSelfTestResult[] = [];

  check(results, 'v1019_mtrd_lab_id', 'LAB suite id', V1019_MTRD_LAB_SUITE_ID === 'v1019_maritime_trade');
  check(
    results,
    'v1019_mtrd_persist_root',
    'persistence root path',
    V1019_MTRD_PERSISTENCE_PATHS.root === 'save.meta.v1019.maritime_trade',
  );

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 9000 + t });
    const out = runV1019MtrdTurn(inp);
    const id = `v1019_mtrd_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1019_MTRD_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateSeverityIndex >= 0 && out.state.aggregateSeverityIndex <= 100,
    );
  }

  check(
    results,
    'v1019_mtrd_hash_stable',
    'input hash deterministic',
    v1019MtrdInputHash(baseInput({ turn: 3, seed: 88 })) === v1019MtrdInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1019MtrdPersisted();
    check(
      results,
      'v1019_mtrd_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1019_MTRD_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1019MtrdPersisted({ revision: -3 }, 2);
    check(results, 'v1019_mtrd_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1019_mtrd_scenario_catalog',
    'lane scenario catalog populated',
    V1019_MTRD_ALL_LANE_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1019_MTRD_evaluateShippingLaneBatch(4, ['lane_000', 'lane_001', 'lane_002']);
    check(
      results,
      'v1019_mtrd_scenario_batch',
      'lane batch mean',
      batch.snapshots.length === 3 && batch.meanSeverity > 0,
    );
  }

  {
    const r = V1019_MTRD_LANE_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1019_mtrd_scenario_000',
      'scenario 000 evaluate',
      r.portScore <= 100 && V1019_MTRD_LANE_SCENARIO_000_META.id === 'lane_000',
    );
  }

  check(
    results,
    'v1019_mtrd_lane_graph',
    'lane graph hash',
    V1019_MTRD_laneGraphHash(V1019_MTRD_GENERATED_LANE_GRAPH_EDGES).startsWith('cg_'),
  );

  {
    const merged = V1019_MTRD_mergeLaneGraphEdges(
      [V1019_MTRD_GENERATED_LANE_GRAPH_EDGES[0], V1019_MTRD_GENERATED_LANE_GRAPH_EDGES[400]],
      [V1019_MTRD_GENERATED_LANE_GRAPH_EDGES[800]],
    );
    check(results, 'v1019_mtrd_lane_merge', 'lane graph merge', merged.length === 3);
  }

  {
    const b = V1019_MTRD_PORT_NODE_00_buffer(5);
    check(results, 'v1019_mtrd_port_buffer', 'port node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1019MtrdTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1019_mtrd_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1019MtrdEnergy20bcBridge(baseInput(), 52);
    const next = applyV1019MtrdEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1019_mtrd_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1019MtrdTrade20baBridge(baseInput(), 0.2);
    const next = applyV1019MtrdTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1019_mtrd_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  check(results, 'v1019_mtrd_port_band', 'port bands', V1019_MTRD_portFromScore(76) === 'robust');
  check(results, 'v1019_mtrd_lane_rank', 'lane band rank', V1019_MTRD_laneBandRank('critical') === 5);
  check(results, 'v1019_mtrd_clamp', 'clamp finite', V1019_MTRD_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1019_MTRD_runLaneScenarioRegressionSweep(3);
    check(results, 'v1019_mtrd_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1019MtrdPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1019MtrdTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1019_mtrd_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1019MtrdPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1019MtrdTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1019_mtrd_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1019_MTRD_LAB_SUITE_ID, results };
}

export function runV1019MtrdSelfTestsForLab(): V1019MtrdSelfTestResult[] {
  return runV1019MtrdSelfTests().results;
}
