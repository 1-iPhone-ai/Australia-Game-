/**
 * LAB suite: v1016_national_resilience — supply shock & continuity fixtures (SECTION 20BG).
 */
import type { V1016NresSelfTestResult, V1016NresTurnInput } from '../types/core';
import { V1016_NRES_SCHEMA_VERSION } from '../types/core';
import {
  runV1016NresTurn,
  createEmptyV1016NresPersisted,
  v1016NresInputHash,
  sanitizeV1016NresPersisted,
} from '../engine/national-resilience-orchestrator';
import {
  V1016_NRES_clamp,
  V1016_NRES_continuityFromScore,
  V1016_NRES_shockBandRank,
} from '../engine/national-resilience-utils';
import { computeV1016NresSupply20bbBridge, applyV1016NresSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1016NresTrade20baBridge, applyV1016NresTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1016NresEnergy20bcBridge, applyV1016NresEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1016NresWorkforce20bfBridge, applyV1016NresWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { V1016_NRES_mergePropagationEdges, V1016_NRES_propagationGraphHash } from '../propagation-graph/graph-utils';
import { V1016_NRES_GENERATED_PROPAGATION_EDGES } from '../generated/propagation-graph-bundle';
import {
  V1016_NRES_ALL_SHOCK_SCENARIO_IDS,
  V1016_NRES_evaluateSupplyShockBatch,
  V1016_NRES_listActiveShockScenarioIds,
  V1016_NRES_runShockScenarioRegressionSweep,
} from '../generated/supply-shock-registry';
import { V1016_NRES_SHOCK_SCENARIO_000_evaluate, V1016_NRES_SHOCK_SCENARIO_000_META } from '../generated/supply-shock-scenarios/scenario-000';
import { V1016_NRES_CONTINUITY_NODE_00_buffer } from '../continuity-nodes/node-00';
import { V1016_NRES_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1016NresTurnInput> = {}): V1016NresTurnInput {
  return {
    turn: 1,
    seed: 6160,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      propagationIndex: 0.44,
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
    fiscalHeadroom: 57,
    continuityPolicyFocus: 46,
    activeShockScenarioIds: V1016_NRES_listActiveShockScenarioIds(1).slice(0, 8),
    activeContinuityNodeIds: ['node_00', 'node_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1016NresSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1016NresSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1016NresSelfTestResult[];
} {
  const results: V1016NresSelfTestResult[] = [];

  check(results, 'v1016_nres_lab_id', 'LAB suite id', V1016_NRES_LAB_SUITE_ID === 'v1016_national_resilience');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 6000 + t });
    const out = runV1016NresTurn(inp);
    const id = `v1016_nres_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1016_NRES_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateSeverityIndex >= 0 && out.state.aggregateSeverityIndex <= 100,
    );
  }

  check(
    results,
    'v1016_nres_hash_stable',
    'input hash deterministic',
    v1016NresInputHash(baseInput({ turn: 3, seed: 88 })) === v1016NresInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1016NresPersisted();
    check(
      results,
      'v1016_nres_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1016_NRES_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1016NresPersisted({ revision: -3 }, 2);
    check(results, 'v1016_nres_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1016_nres_scenario_catalog',
    'shock scenario catalog populated',
    V1016_NRES_ALL_SHOCK_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1016_NRES_evaluateSupplyShockBatch(4, ['shock_000', 'shock_001', 'shock_002']);
    check(
      results,
      'v1016_nres_scenario_batch',
      'shock batch mean',
      batch.snapshots.length === 3 && batch.meanSeverity > 0,
    );
  }

  {
    const r = V1016_NRES_SHOCK_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1016_nres_scenario_000',
      'scenario 000 evaluate',
      r.continuityScore <= 100 && V1016_NRES_SHOCK_SCENARIO_000_META.id === 'shock_000',
    );
  }

  check(
    results,
    'v1016_nres_prop_graph',
    'propagation graph hash',
    V1016_NRES_propagationGraphHash(V1016_NRES_GENERATED_PROPAGATION_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1016_NRES_mergePropagationEdges(
      [V1016_NRES_GENERATED_PROPAGATION_EDGES[0], V1016_NRES_GENERATED_PROPAGATION_EDGES[400]],
      [V1016_NRES_GENERATED_PROPAGATION_EDGES[800]],
    );
    check(results, 'v1016_nres_prop_merge', 'propagation merge', merged.length === 3);
  }

  {
    const b = V1016_NRES_CONTINUITY_NODE_00_buffer(5);
    check(results, 'v1016_nres_node_buffer', 'continuity node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1016NresTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1016_nres_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1016NresSupply20bbBridge(baseInput(), 52);
    const next = applyV1016NresSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1016_nres_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1016NresEnergy20bcBridge(baseInput(), 48);
    const next = applyV1016NresEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1016_nres_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1016NresWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1016NresWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1016_nres_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1016NresTrade20baBridge(baseInput(), 0.2);
    const next = applyV1016NresTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1016_nres_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  check(results, 'v1016_nres_continuity_band', 'continuity bands', V1016_NRES_continuityFromScore(76) === 'robust');
  check(results, 'v1016_nres_shock_rank', 'shock band rank', V1016_NRES_shockBandRank('critical') === 5);
  check(results, 'v1016_nres_clamp', 'clamp finite', V1016_NRES_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1016_NRES_runShockScenarioRegressionSweep(3);
    check(results, 'v1016_nres_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1016NresPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1016NresTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1016_nres_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1016NresPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1016NresTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1016_nres_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1016_NRES_LAB_SUITE_ID, results };
}

export function runV1016NresSelfTestsForLab(): V1016NresSelfTestResult[] {
  return runV1016NresSelfTests().results;
}
