/**
 * LAB suite: v1020_digital_governance — state–federal transfer & platform_node fixtures (SECTION 20BT).
 */
import type { V1024DgovSelfTestResult, V1024DgovTurnInput } from '../types/core';
import { V1024_DGOV_SCHEMA_VERSION } from '../types/core';
import {
  runV1024DgovTurn,
  createEmptyV1024DgovPersisted,
  v1024DgovInputHash,
  sanitizeV1024DgovPersisted,
} from '../engine/digital-governance-orchestrator';
import {
  V1024_DGOV_clamp,
  V1024_DGOV_governanceBandFromScore,
  V1024_DGOV_governanceBandRank,
} from '../engine/digital-governance-utils';
import { computeV1024DgovSupply20bbBridge, applyV1024DgovSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1024DgovTrade20baBridge, applyV1024DgovTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1024DgovEnergy20bcBridge, applyV1024DgovEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1024DgovWorkforce20bfBridge, applyV1024DgovWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1024DgovPublicServices20azBridge, applyV1024DgovPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1024DgovAiFidelity20beBridge, applyV1024DgovAiFidelity20beAiFidelityOverrides } from '../adapters/adapter-ai-fidelity-20be';
import { V1024_DGOV_mergeDataSovereigntyEdges, V1024_DGOV_dataSovereigntyGraphHash } from '../data-sovereignty-stacks/graph-utils';
import { V1024_DGOV_GENERATED_DATA_SOVEREIGNTY_EDGES } from '../generated/data-sovereignty-bundle';
import {
  V1024_DGOV_ALL_POLICY_SCENARIO_IDS,
  V1024_DGOV_evaluatePolicyBatch,
  V1024_DGOV_listActivePolicyScenarioIds,
  V1024_DGOV_runPolicyScenarioRegressionSweep,
} from '../generated/policy-registry';
import { V1024_DGOV_POLICY_SCENARIO_000_evaluate, V1024_DGOV_POLICY_SCENARIO_000_META } from '../generated/policy-scenarios/scenario-000';
import { V1024_DGOV_PLATFORM_NODE_00_buffer } from '../platform-regulation-nodes/platform-node-00';
import { V1024_DGOV_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1024DgovTurnInput> = {}): V1024DgovTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      dataSovereigntyIndex: 0.44,
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
      platformRiskStress: 31,
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
    aiFidelity20be: {
      turn: 1,
      modelGovernancePressure: 36,
      grantStackLoad: 0.33,
      alignmentDriftTurns: 22,
    },
    auditHeadroom: 57,
    governancePolicyFocus: 46,
    activePolicyScenarioIds: V1024_DGOV_listActivePolicyScenarioIds(1).slice(0, 8),
    activePlatformNodeIds: ['platform_node_00', 'platform_node_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1024DgovSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1024DgovSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1024DgovSelfTestResult[];
} {
  const results: V1024DgovSelfTestResult[] = [];

  check(results, 'v1024_dgov_lab_id', 'LAB suite id', V1024_DGOV_LAB_SUITE_ID === 'v1024_digital_governance');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1024DgovTurn(inp);
    const id = `v1024_dgov_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1024_DGOV_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateComplianceStressIndex >= 0 && out.state.aggregateComplianceStressIndex <= 100,
    );
  }

  check(
    results,
    'v1024_dgov_hash_stable',
    'input hash deterministic',
    v1024DgovInputHash(baseInput({ turn: 3, seed: 88 })) === v1024DgovInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1024DgovPersisted();
    check(
      results,
      'v1024_dgov_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1024_DGOV_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1024DgovPersisted({ revision: -3 }, 2);
    check(results, 'v1024_dgov_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1024_dgov_scenario_catalog',
    'policy scenario catalog populated',
    V1024_DGOV_ALL_POLICY_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1024_DGOV_evaluatePolicyBatch(4, ['stress_000', 'stress_001', 'stress_002']);
    check(
      results,
      'v1024_dgov_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanComplianceStress > 0,
    );
  }

  {
    const r = V1024_DGOV_POLICY_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1024_dgov_scenario_000',
      'scenario 000 evaluate',
      r.governanceScore <= 100 && V1024_DGOV_POLICY_SCENARIO_000_META.id === 'stress_000',
    );
  }

  check(
    results,
    'v1024_dgov_prop_graph',
    'dataSovereignty graph hash',
    V1024_DGOV_dataSovereigntyGraphHash(V1024_DGOV_GENERATED_DATA_SOVEREIGNTY_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1024_DGOV_mergeDataSovereigntyEdges(
      [V1024_DGOV_GENERATED_DATA_SOVEREIGNTY_EDGES[0], V1024_DGOV_GENERATED_DATA_SOVEREIGNTY_EDGES[400]],
      [V1024_DGOV_GENERATED_DATA_SOVEREIGNTY_EDGES[800]],
    );
    check(results, 'v1024_dgov_prop_merge', 'dataSovereignty merge', merged.length === 3);
  }

  {
    const b = V1024_DGOV_PLATFORM_NODE_00_buffer(5);
    check(results, 'v1024_dgov_platform_node_buffer', 'platform_node node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1024DgovTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1024_dgov_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1024DgovSupply20bbBridge(baseInput(), 52);
    const next = applyV1024DgovSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1024_dgov_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1024DgovEnergy20bcBridge(baseInput(), 48);
    const next = applyV1024DgovEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1024_dgov_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1024DgovWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1024DgovWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1024_dgov_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1024DgovTrade20baBridge(baseInput(), 0.2);
    const next = applyV1024DgovTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1024_dgov_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1024DgovPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1024DgovPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1024_dgov_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1024DgovAiFidelity20beBridge(baseInput(), 0.18);
    const next = applyV1024DgovAiFidelity20beAiFidelityOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1024_dgov_platform_node_adapter',
      '20BE platform regulation node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1024_dgov_platform_node_band', 'platform_node bands', V1024_DGOV_governanceBandFromScore(76) === 'robust');
  check(results, 'v1024_dgov_stress_rank', 'transfer band rank', V1024_DGOV_governanceBandRank('critical') === 5);
  check(results, 'v1024_dgov_clamp', 'clamp finite', V1024_DGOV_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1024_DGOV_runPolicyScenarioRegressionSweep(3);
    check(results, 'v1024_dgov_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1024DgovPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1024DgovTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1024_dgov_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1024DgovPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1024DgovTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1024_dgov_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1024_DGOV_LAB_SUITE_ID, results };
}

export function runV1024DgovSelfTestsForLab(): V1024DgovSelfTestResult[] {
  return runV1024DgovSelfTests().results;
}
