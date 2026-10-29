/**
 * LAB suite: v1017_intercity_logistics — freight route & hub fixtures (SECTION 20BI).
 */
import type { V1017IclogSelfTestResult, V1017IclogTurnInput } from '../types/core';
import { V1017_ICLOG_SCHEMA_VERSION } from '../types/core';
import {
  runV1017IclogTurn,
  createEmptyV1017IclogPersisted,
  v1017IclogInputHash,
  sanitizeV1017IclogPersisted,
} from '../engine/intercity-logistics-orchestrator';
import {
  V1017_ICLOG_clamp,
  V1017_ICLOG_hubFromScore,
  V1017_ICLOG_routeBandRank,
} from '../engine/intercity-logistics-utils';
import { computeV1017IclogSupply20bbBridge, applyV1017IclogSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1017IclogTrade20baBridge, applyV1017IclogTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1017IclogCities20akBridge, applyV1017IclogCities20akLinkOverrides } from '../adapters/adapter-v1014-cities-20ak';
import { computeV1017IclogResilience20bgBridge, applyV1017IclogResilience20bgContinuityOverrides } from '../adapters/adapter-v1016-resilience-20bg';
import { V1017_ICLOG_mergeCorridorEdges, V1017_ICLOG_corridorGraphHash } from '../corridor-graph/graph-utils';
import { V1017_ICLOG_GENERATED_CORRIDOR_EDGES } from '../generated/corridor-graph-bundle';
import {
  V1017_ICLOG_ALL_ROUTE_SCENARIO_IDS,
  V1017_ICLOG_evaluateSupplyRouteBatch,
  V1017_ICLOG_listActiveRouteScenarioIds,
  V1017_ICLOG_runRouteScenarioRegressionSweep,
} from '../generated/freight-route-registry';
import { V1017_ICLOG_ROUTE_SCENARIO_000_evaluate, V1017_ICLOG_ROUTE_SCENARIO_000_META } from '../generated/freight-route-scenarios/route-000';
import { V1017_ICLOG_HUB_NODE_00_buffer } from '../logistics-hubs/hub-00';
import { V1017_ICLOG_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1017IclogTurnInput> = {}): V1017IclogTurnInput {
  return {
    turn: 1,
    seed: 6160,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      corridorIndex: 0.44,
    },
    trade20ba: {
      turn: 1,
      sanctionsPressure: 24,
      importDependencyRatio: 0.36,
      exportLaneStability: 54,
    },
    cities20ak: {
      turn: 1,
      intercityLinkCongestion: 59,
      corridorThroughputIndex: 13,
      hubCapacityScore: 31,
    },
    resilience20bg: {
      turn: 1,
      supplyShockPressure: 31,
      resilienceContinuityScore: 56,
      rerouteUrgencyIndex: 43,
    },
    fiscalHeadroom: 57,
    hubPolicyFocus: 46,
    activeRouteScenarioIds: V1017_ICLOG_listActiveRouteScenarioIds(1).slice(0, 8),
    activeHubNodeIds: ['hub_00', 'hub_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1017IclogSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1017IclogSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1017IclogSelfTestResult[];
} {
  const results: V1017IclogSelfTestResult[] = [];

  check(results, 'v1016_iclog_lab_id', 'LAB suite id', V1017_ICLOG_LAB_SUITE_ID === 'v1017_intercity_logistics');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 6000 + t });
    const out = runV1017IclogTurn(inp);
    const id = `v1016_iclog_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1017_ICLOG_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateSeverityIndex >= 0 && out.state.aggregateSeverityIndex <= 100,
    );
  }

  check(
    results,
    'v1016_iclog_hash_stable',
    'input hash deterministic',
    v1017IclogInputHash(baseInput({ turn: 3, seed: 88 })) === v1017IclogInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1017IclogPersisted();
    check(
      results,
      'v1016_iclog_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1017_ICLOG_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1017IclogPersisted({ revision: -3 }, 2);
    check(results, 'v1016_iclog_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1016_iclog_scenario_catalog',
    'route scenario catalog populated',
    V1017_ICLOG_ALL_ROUTE_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1017_ICLOG_evaluateSupplyRouteBatch(4, ['route_000', 'route_001', 'route_002']);
    check(
      results,
      'v1016_iclog_scenario_batch',
      'route batch mean',
      batch.snapshots.length === 3 && batch.meanSeverity > 0,
    );
  }

  {
    const r = V1017_ICLOG_ROUTE_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1016_iclog_scenario_000',
      'scenario 000 evaluate',
      r.hubScore <= 100 && V1017_ICLOG_ROUTE_SCENARIO_000_META.id === 'route_000',
    );
  }

  check(
    results,
    'v1016_iclog_prop_graph',
    'corridor graph hash',
    V1017_ICLOG_corridorGraphHash(V1017_ICLOG_GENERATED_CORRIDOR_EDGES).startsWith('cg_'),
  );

  {
    const merged = V1017_ICLOG_mergeCorridorEdges(
      [V1017_ICLOG_GENERATED_CORRIDOR_EDGES[0], V1017_ICLOG_GENERATED_CORRIDOR_EDGES[400]],
      [V1017_ICLOG_GENERATED_CORRIDOR_EDGES[800]],
    );
    check(results, 'v1016_iclog_prop_merge', 'corridor merge', merged.length === 3);
  }

  {
    const b = V1017_ICLOG_HUB_NODE_00_buffer(5);
    check(results, 'v1016_iclog_hub_buffer', 'hub node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1017IclogTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1016_iclog_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1017IclogSupply20bbBridge(baseInput(), 52);
    const next = applyV1017IclogSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1016_iclog_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1017IclogCities20akBridge(baseInput(), 48);
    const next = applyV1017IclogCities20akLinkOverrides({ intercityLinkCongestion: 60 }, b);
    check(results, 'v1016_iclog_energy_override', '20AK override', typeof next.intercityLinkCongestion === 'number');
  }

  {
    const b = computeV1017IclogResilience20bgBridge(baseInput(), 44);
    const next = applyV1017IclogResilience20bgContinuityOverrides({ resilienceContinuityScore: 55 }, b);
    check(results, 'v1016_iclog_workforce_override', '20BG override', typeof next.resilienceContinuityScore === 'number');
  }

  {
    const b = computeV1017IclogTrade20baBridge(baseInput(), 0.2);
    const next = applyV1017IclogTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1016_iclog_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  check(results, 'v1016_iclog_hub_band', 'hub bands', V1017_ICLOG_hubFromScore(76) === 'robust');
  check(results, 'v1016_iclog_route_rank', 'route band rank', V1017_ICLOG_routeBandRank('critical') === 5);
  check(results, 'v1016_iclog_clamp', 'clamp finite', V1017_ICLOG_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1017_ICLOG_runRouteScenarioRegressionSweep(3);
    check(results, 'v1016_iclog_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1017IclogPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1017IclogTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1016_iclog_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1017IclogPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1017IclogTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1016_iclog_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1017_ICLOG_LAB_SUITE_ID, results };
}

export function runV1017IclogSelfTestsForLab(): V1017IclogSelfTestResult[] {
  return runV1017IclogSelfTests().results;
}
