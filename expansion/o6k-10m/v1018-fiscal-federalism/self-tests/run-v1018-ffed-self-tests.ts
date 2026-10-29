/**
 * LAB suite: v1018_fiscal_federalism — state–federal transfer & audit_trail fixtures (SECTION 20BI).
 */
import type { V1018FfedSelfTestResult, V1018FfedTurnInput } from '../types/core';
import { V1018_FFED_SCHEMA_VERSION } from '../types/core';
import {
  runV1018FfedTurn,
  createEmptyV1018FfedPersisted,
  v1018FfedInputHash,
  sanitizeV1018FfedPersisted,
} from '../engine/fiscal-federalism-orchestrator';
import {
  V1018_FFED_clamp,
  V1018_FFED_complianceFromScore,
  V1018_FFED_transferBandRank,
} from '../engine/fiscal-federalism-utils';
import { computeV1018FfedSupply20bbBridge, applyV1018FfedSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1018FfedTrade20baBridge, applyV1018FfedTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1018FfedEnergy20bcBridge, applyV1018FfedEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1018FfedWorkforce20bfBridge, applyV1018FfedWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { V1018_FFED_mergeGrantStackEdges, V1018_FFED_grantStackGraphHash } from '../grant-stacks/graph-utils';
import { V1018_FFED_GENERATED_GRANT_STACK_EDGES } from '../generated/grant-stack-bundle';
import {
  V1018_FFED_ALL_TRANSFER_SCENARIO_IDS,
  V1018_FFED_evaluateTransferBatch,
  V1018_FFED_listActiveTransferScenarioIds,
  V1018_FFED_runTransferScenarioRegressionSweep,
} from '../generated/transfer-registry';
import { V1018_FFED_TRANSFER_SCENARIO_000_evaluate, V1018_FFED_TRANSFER_SCENARIO_000_META } from '../generated/transfer-scenarios/scenario-000';
import { V1018_FFED_AUDIT_NODE_00_buffer } from '../audit-trails/audit-00';
import { V1018_FFED_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1018FfedTurnInput> = {}): V1018FfedTurnInput {
  return {
    turn: 1,
    seed: 8180,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      grantStackIndex: 0.44,
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
    federalismPolicyFocus: 46,
    activeTransferScenarioIds: V1018_FFED_listActiveTransferScenarioIds(1).slice(0, 8),
    activeComplianceNodeIds: ['audit_00', 'audit_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1018FfedSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1018FfedSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1018FfedSelfTestResult[];
} {
  const results: V1018FfedSelfTestResult[] = [];

  check(results, 'v1016_ffed_lab_id', 'LAB suite id', V1018_FFED_LAB_SUITE_ID === 'v1018_fiscal_federalism');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 8000 + t });
    const out = runV1018FfedTurn(inp);
    const id = `v1016_ffed_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1018_FFED_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateSeverityIndex >= 0 && out.state.aggregateSeverityIndex <= 100,
    );
  }

  check(
    results,
    'v1016_ffed_hash_stable',
    'input hash deterministic',
    v1018FfedInputHash(baseInput({ turn: 3, seed: 88 })) === v1018FfedInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1018FfedPersisted();
    check(
      results,
      'v1016_ffed_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1018_FFED_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1018FfedPersisted({ revision: -3 }, 2);
    check(results, 'v1016_ffed_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1016_ffed_scenario_catalog',
    'transfer scenario catalog populated',
    V1018_FFED_ALL_TRANSFER_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1018_FFED_evaluateTransferBatch(4, ['transfer_000', 'transfer_001', 'transfer_002']);
    check(
      results,
      'v1016_ffed_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanSeverity > 0,
    );
  }

  {
    const r = V1018_FFED_TRANSFER_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1016_ffed_scenario_000',
      'scenario 000 evaluate',
      r.complianceScore <= 100 && V1018_FFED_TRANSFER_SCENARIO_000_META.id === 'transfer_000',
    );
  }

  check(
    results,
    'v1016_ffed_prop_graph',
    'grantStack graph hash',
    V1018_FFED_grantStackGraphHash(V1018_FFED_GENERATED_GRANT_STACK_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1018_FFED_mergeGrantStackEdges(
      [V1018_FFED_GENERATED_GRANT_STACK_EDGES[0], V1018_FFED_GENERATED_GRANT_STACK_EDGES[400]],
      [V1018_FFED_GENERATED_GRANT_STACK_EDGES[800]],
    );
    check(results, 'v1016_ffed_prop_merge', 'grantStack merge', merged.length === 3);
  }

  {
    const b = V1018_FFED_AUDIT_NODE_00_buffer(5);
    check(results, 'v1016_ffed_audit_buffer', 'audit_trail node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1018FfedTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1016_ffed_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1018FfedSupply20bbBridge(baseInput(), 52);
    const next = applyV1018FfedSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1016_ffed_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1018FfedEnergy20bcBridge(baseInput(), 48);
    const next = applyV1018FfedEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1016_ffed_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1018FfedWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1018FfedWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1016_ffed_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1018FfedTrade20baBridge(baseInput(), 0.2);
    const next = applyV1018FfedTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1016_ffed_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  check(results, 'v1016_ffed_audit_trail_band', 'audit_trail bands', V1018_FFED_complianceFromScore(76) === 'robust');
  check(results, 'v1016_ffed_transfer_rank', 'transfer band rank', V1018_FFED_transferBandRank('critical') === 5);
  check(results, 'v1016_ffed_clamp', 'clamp finite', V1018_FFED_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1018_FFED_runTransferScenarioRegressionSweep(3);
    check(results, 'v1016_ffed_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1018FfedPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1018FfedTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1016_ffed_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1018FfedPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1018FfedTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1016_ffed_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1018_FFED_LAB_SUITE_ID, results };
}

export function runV1018FfedSelfTestsForLab(): V1018FfedSelfTestResult[] {
  return runV1018FfedSelfTests().results;
}
