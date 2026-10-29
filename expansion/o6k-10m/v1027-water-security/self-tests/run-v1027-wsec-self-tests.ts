/**
 * LAB suite: v1020_water_security — state–federal transfer & distribution_network fixtures (SECTION 20BW).
 */
import type { V1027WsecSelfTestResult, V1027WsecTurnInput } from '../types/core';
import { V1027_WSEC_SCHEMA_VERSION } from '../types/core';
import {
  runV1027WsecTurn,
  createEmptyV1027WsecPersisted,
  v1027WsecInputHash,
  sanitizeV1027WsecPersisted,
} from '../engine/water-security-orchestrator';
import {
  V1027_WSEC_clamp,
  V1027_WSEC_waterSecurityBandFromScore,
  V1027_WSEC_waterSecurityBandRank,
} from '../engine/water-security-utils';
import { computeV1027WsecSupply20bbBridge, applyV1027WsecSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1027WsecTrade20baBridge, applyV1027WsecTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1027WsecEnergy20bcBridge, applyV1027WsecEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1027WsecWorkforce20bfBridge, applyV1027WsecWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1027WsecPublicServices20azBridge, applyV1027WsecPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1027WsecClimateAdaptation20brBridge, applyV1027WsecClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1027WsecDigitalGovernance20btBridge, applyV1027WsecDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { computeV1027WsecBiodiversityStewardship20buBridge, applyV1027WsecBiodiversityStewardship20buOverrides } from '../adapters/adapter-biodiversity-stewardship-20bu';
import { V1027_WSEC_mergeAquiferReserveEdges, V1027_WSEC_aquiferReserveGraphHash } from '../aquifer-reserve-stacks/graph-utils';
import { V1027_WSEC_GENERATED_AQUIFER_RESERVE_EDGES } from '../generated/aquifer-reserve-bundle';
import {
  V1027_WSEC_ALL_BASIN_SCENARIO_IDS,
  V1027_WSEC_evaluateBasinBatch,
  V1027_WSEC_listActiveBasinScenarioIds,
  V1027_WSEC_runBasinScenarioRegressionSweep,
} from '../generated/basin-registry';
import { V1027_WSEC_BASIN_SCENARIO_000_evaluate, V1027_WSEC_BASIN_SCENARIO_000_META } from '../generated/basin-scenarios/scenario-000';
import { V1027_WSEC_DISTRIBUTION_NETWORK_00_buffer } from '../distribution-network-nodes/distribution-network-00';
import { V1027_WSEC_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1027WsecTurnInput> = {}): V1027WsecTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      aquiferReserveIndex: 0.44,
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
      droughtRiskStress: 31,
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
    climateAdaptation20br: {
      turn: 1,
      heatStressPressure: 36,
      grantStackLoad: 0.33,
      resilienceDriftTurns: 22,
    },
    digitalGovernance20bt: {
      turn: 1,
      modelGovernancePressure: 28,
      grantStackLoad: 0.29,
      alignmentDriftTurns: 18,
    },
    biodiversityStewardship20bu: {
      turn: 1,
      catchmentIntegrityPressure: 34,
      grantStackLoad: 0.25,
      offsetDriftTurns: 16,
    },
    storageHeadroom: 57,
    waterPolicyFocus: 46,
    activeBasinScenarioIds: V1027_WSEC_listActiveBasinScenarioIds(1).slice(0, 8),
    activeDistributionNetworkIds: ['distribution_network_00', 'distribution_network_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1027WsecSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1027WsecSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1027WsecSelfTestResult[];
} {
  const results: V1027WsecSelfTestResult[] = [];

  check(results, 'v1027_wsec_lab_id', 'LAB suite id', V1027_WSEC_LAB_SUITE_ID === 'v1027_water_security');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1027WsecTurn(inp);
    const id = `v1027_wsec_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1027_WSEC_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateWaterStressIndex >= 0 && out.state.aggregateWaterStressIndex <= 100,
    );
  }

  check(
    results,
    'v1027_wsec_hash_stable',
    'input hash deterministic',
    v1027WsecInputHash(baseInput({ turn: 3, seed: 88 })) === v1027WsecInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1027WsecPersisted();
    check(
      results,
      'v1027_wsec_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1027_WSEC_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1027WsecPersisted({ revision: -3 }, 2);
    check(results, 'v1027_wsec_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1027_wsec_scenario_catalog',
    'basin scenario catalog populated',
    V1027_WSEC_ALL_BASIN_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1027_WSEC_evaluateBasinBatch(4, ['basin_000', 'basin_001', 'basin_002']);
    check(
      results,
      'v1027_wsec_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanWaterStress > 0,
    );
  }

  {
    const r = V1027_WSEC_BASIN_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1027_wsec_scenario_000',
      'scenario 000 evaluate',
      r.waterSecurityScore <= 100 && V1027_WSEC_BASIN_SCENARIO_000_META.id === 'basin_000',
    );
  }

  check(
    results,
    'v1027_wsec_prop_graph',
    'aquiferReserve graph hash',
    V1027_WSEC_aquiferReserveGraphHash(V1027_WSEC_GENERATED_AQUIFER_RESERVE_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1027_WSEC_mergeAquiferReserveEdges(
      [V1027_WSEC_GENERATED_AQUIFER_RESERVE_EDGES[0], V1027_WSEC_GENERATED_AQUIFER_RESERVE_EDGES[400]],
      [V1027_WSEC_GENERATED_AQUIFER_RESERVE_EDGES[800]],
    );
    check(results, 'v1027_wsec_prop_merge', 'aquiferReserve merge', merged.length === 3);
  }

  {
    const b = V1027_WSEC_DISTRIBUTION_NETWORK_00_buffer(5);
    check(results, 'v1027_wsec_distribution_network_buffer', 'distribution_network node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1027WsecTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1027_wsec_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1027WsecSupply20bbBridge(baseInput(), 52);
    const next = applyV1027WsecSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1027_wsec_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1027WsecEnergy20bcBridge(baseInput(), 48);
    const next = applyV1027WsecEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1027_wsec_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1027WsecWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1027WsecWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1027_wsec_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1027WsecTrade20baBridge(baseInput(), 0.2);
    const next = applyV1027WsecTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1027_wsec_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1027WsecPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1027WsecPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1027_wsec_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1027WsecClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1027WsecClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1027_wsec_distribution_network_adapter',
      '20BR distribution network node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1027WsecDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1027WsecDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1027_wsec_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1027_wsec_distribution_network_band', 'distribution_network bands', V1027_WSEC_waterSecurityBandFromScore(76) === 'robust');
  check(results, 'v1027_wsec_basin_rank', 'transfer band rank', V1027_WSEC_waterSecurityBandRank('critical') === 5);
  check(results, 'v1027_wsec_clamp', 'clamp finite', V1027_WSEC_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1027_WSEC_runBasinScenarioRegressionSweep(3);
    check(results, 'v1027_wsec_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1027WsecPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1027WsecTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1027_wsec_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1027WsecPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1027WsecTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1027_wsec_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1027_WSEC_LAB_SUITE_ID, results };
}

export function runV1027WsecSelfTestsForLab(): V1027WsecSelfTestResult[] {
  return runV1027WsecSelfTests().results;
}
