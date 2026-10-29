/**
 * LAB suite: v1020_intermodal_freight — state–federal transfer & dwell_hub fixtures (SECTION 20BO).
 */
import type { V1021ImfdSelfTestResult, V1021ImfdTurnInput } from '../types/core';
import { V1021_IMFD_SCHEMA_VERSION } from '../types/core';
import {
  runV1021ImfdTurn,
  createEmptyV1021ImfdPersisted,
  v1021ImfdInputHash,
  sanitizeV1021ImfdPersisted,
} from '../engine/intermodal-freight-orchestrator';
import {
  V1021_IMFD_clamp,
  V1021_IMFD_handoffFromScore,
  V1021_IMFD_dwellBandRank,
} from '../engine/intermodal-freight-utils';
import { computeV1021ImfdSupply20bbBridge, applyV1021ImfdSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1021ImfdTrade20baBridge, applyV1021ImfdTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1021ImfdEnergy20bcBridge, applyV1021ImfdEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1021ImfdWorkforce20bfBridge, applyV1021ImfdWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1021ImfdMaritime20bnBridge, applyV1021ImfdMaritime20bnHandoffOverrides } from '../adapters/adapter-maritime-20bn';
import { computeV1021ImfdIclog20bkBridge, applyV1021ImfdIclog20bkLabTransferOverrides } from '../adapters/adapter-iclog-20bk';
import { V1021_IMFD_mergeHandoffStackEdges, V1021_IMFD_handoffStackGraphHash } from '../handoff-stacks/graph-utils';
import { V1021_IMFD_GENERATED_HANDOFF_STACK_EDGES } from '../generated/handoff-stack-bundle';
import {
  V1021_IMFD_ALL_CORRIDOR_SCENARIO_IDS,
  V1021_IMFD_evaluateCorridorBatch,
  V1021_IMFD_listActiveCorridorScenarioIds,
  V1021_IMFD_runCorridorScenarioRegressionSweep,
} from '../generated/corridor-registry';
import { V1021_IMFD_CORRIDOR_SCENARIO_000_evaluate, V1021_IMFD_CORRIDOR_SCENARIO_000_META } from '../generated/corridor-scenarios/scenario-000';
import { V1021_IMFD_DWELL_HUB_00_buffer } from '../dwell-hubs/dwell-hub-00';
import { V1021_IMFD_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1021ImfdTurnInput> = {}): V1021ImfdTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      handoffStackIndex: 0.44,
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
    maritime20bn: {
      turn: 1,
      berthUtilizationScore: 62,
      craneAutomationCoverage: 0.41,
      handoffReadiness: 48,
    },
    iclog20bk: {
      turn: 1,
      iclogBackpressure: 36,
      corridorLoadFactor: 0.33,
      dwellBacklogTurns: 22,
    },
    freightHeadroom: 57,
    corridorPolicyFocus: 46,
    activeCorridorScenarioIds: V1021_IMFD_listActiveCorridorScenarioIds(1).slice(0, 8),
    activeDwellHubNodeIds: ['dwell_hub_00', 'dwell_hub_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1021ImfdSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1021ImfdSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1021ImfdSelfTestResult[];
} {
  const results: V1021ImfdSelfTestResult[] = [];

  check(results, 'v1021_imfd_lab_id', 'LAB suite id', V1021_IMFD_LAB_SUITE_ID === 'v1021_intermodal_freight');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1021ImfdTurn(inp);
    const id = `v1021_imfd_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1021_IMFD_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateDwellPenaltyIndex >= 0 && out.state.aggregateDwellPenaltyIndex <= 100,
    );
  }

  check(
    results,
    'v1021_imfd_hash_stable',
    'input hash deterministic',
    v1021ImfdInputHash(baseInput({ turn: 3, seed: 88 })) === v1021ImfdInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1021ImfdPersisted();
    check(
      results,
      'v1021_imfd_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1021_IMFD_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1021ImfdPersisted({ revision: -3 }, 2);
    check(results, 'v1021_imfd_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1021_imfd_scenario_catalog',
    'corridor scenario catalog populated',
    V1021_IMFD_ALL_CORRIDOR_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1021_IMFD_evaluateCorridorBatch(4, ['corridor_000', 'corridor_001', 'corridor_002']);
    check(
      results,
      'v1021_imfd_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanDwellPenalty > 0,
    );
  }

  {
    const r = V1021_IMFD_CORRIDOR_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1021_imfd_scenario_000',
      'scenario 000 evaluate',
      r.corridorCapacityScore <= 100 && V1021_IMFD_CORRIDOR_SCENARIO_000_META.id === 'corridor_000',
    );
  }

  check(
    results,
    'v1021_imfd_prop_graph',
    'handoffStack graph hash',
    V1021_IMFD_handoffStackGraphHash(V1021_IMFD_GENERATED_HANDOFF_STACK_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1021_IMFD_mergeHandoffStackEdges(
      [V1021_IMFD_GENERATED_HANDOFF_STACK_EDGES[0], V1021_IMFD_GENERATED_HANDOFF_STACK_EDGES[400]],
      [V1021_IMFD_GENERATED_HANDOFF_STACK_EDGES[800]],
    );
    check(results, 'v1021_imfd_prop_merge', 'handoffStack merge', merged.length === 3);
  }

  {
    const b = V1021_IMFD_DWELL_HUB_00_buffer(5);
    check(results, 'v1021_imfd_dwell_hub_buffer', 'dwell_hub node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1021ImfdTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1021_imfd_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1021ImfdSupply20bbBridge(baseInput(), 52);
    const next = applyV1021ImfdSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1021_imfd_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1021ImfdEnergy20bcBridge(baseInput(), 48);
    const next = applyV1021ImfdEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1021_imfd_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1021ImfdWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1021ImfdWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1021_imfd_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1021ImfdTrade20baBridge(baseInput(), 0.2);
    const next = applyV1021ImfdTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1021_imfd_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1021ImfdMaritime20bnBridge(baseInput(), 0.15);
    const next = applyV1021ImfdMaritime20bnHandoffOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1021_imfd_handoff_adapter',
      '20BN handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1021ImfdIclog20bkBridge(baseInput(), 0.18);
    const next = applyV1021ImfdIclog20bkLabTransferOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1021_imfd_dwell_hub_adapter',
      '20BK dwell hub adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1021_imfd_dwell_hub_band', 'dwell_hub bands', V1021_IMFD_handoffFromScore(76) === 'robust');
  check(results, 'v1021_imfd_corridor_rank', 'transfer band rank', V1021_IMFD_dwellBandRank('critical') === 5);
  check(results, 'v1021_imfd_clamp', 'clamp finite', V1021_IMFD_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1021_IMFD_runCorridorScenarioRegressionSweep(3);
    check(results, 'v1021_imfd_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1021ImfdPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1021ImfdTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1021_imfd_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1021ImfdPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1021ImfdTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1021_imfd_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1021_IMFD_LAB_SUITE_ID, results };
}

export function runV1021ImfdSelfTestsForLab(): V1021ImfdSelfTestResult[] {
  return runV1021ImfdSelfTests().results;
}
