/**
 * LAB suite: v1020_supply_chain_resilience — state–federal transfer & hub_zone fixtures (SECTION 20CD).
 */
import type { V1033ScresSelfTestResult, V1033ScresTurnInput } from '../types/core';
import { V1033_SCRES_SCHEMA_VERSION } from '../types/core';
import {
  runV1033ScresTurn,
  createEmptyV1033ScresPersisted,
  v1033ScresInputHash,
  sanitizeV1033ScresPersisted,
} from '../engine/supply-chain-resilience-orchestrator';
import {
  V1033_SCRES_clamp,
  V1033_SCRES_supplyChainResilienceBandFromScore,
  V1033_SCRES_supplyChainResilienceBandRank,
} from '../engine/supply-chain-resilience-utils';
import { computeV1033ScresSupply20bbBridge, applyV1033ScresSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1033ScresTrade20baBridge, applyV1033ScresTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1033ScresEnergy20bcBridge, applyV1033ScresEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1033ScresWorkforce20bfBridge, applyV1033ScresWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1033ScresPublicServices20azBridge, applyV1033ScresPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1033ScresClimateAdaptation20brBridge, applyV1033ScresClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1033ScresDigitalGovernance20btBridge, applyV1033ScresDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { computeV1033ScresBiodiversityStewardship20buBridge, applyV1033ScresBiodiversityStewardship20buOverrides } from '../adapters/adapter-regional-health-systems-20bv';
import { V1033_SCRES_mergeCorridorBufferEdges, V1033_SCRES_corridorBufferGraphHash } from '../corridor-buffer-stacks/graph-utils';
import { V1033_SCRES_GENERATED_CORRIDOR_BUFFER_EDGES } from '../generated/corridor-buffer-bundle';
import {
  V1033_SCRES_ALL_DISRUPTION_SCENARIO_IDS,
  V1033_SCRES_evaluateDisruptionBatch,
  V1033_SCRES_listActiveDisruptionScenarioIds,
  V1033_SCRES_runDisruptionScenarioRegressionSweep,
} from '../generated/disruption-registry';
import { V1033_SCRES_DISRUPTION_SCENARIO_000_evaluate, V1033_SCRES_DISRUPTION_SCENARIO_000_META } from '../generated/disruption-scenarios/scenario-000';
import { V1033_SCRES_HUB_ZONE_00_buffer } from '../hub-zone-nodes/hub-zone-00';
import { V1033_SCRES_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1033ScresTurnInput> = {}): V1033ScresTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      corridorBufferIndex: 0.44,
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
      routingCascadeRisk: 31,
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
    regionalHealthSystems20bv: {
      turn: 1,
      hospitalSurgePressure: 34,
      grantStackLoad: 0.25,
      bedCapacityDriftTurns: 16,
    },
    telecomResilience20cb: {
      turn: 1,
      gridStressExposurePressure: 38,
      grantStackLoad: 0.21,
      outageDriftTurns: 14,
    },
    disasterResilience20bx: {
      turn: 1,
      compoundHazardLoad: 0.42,
      evacuationLagTurns: 11,
      infrastructureFailurePressure: 26,
    },
    reserveHeadroom: 57,
    supplyChainResiliencePolicyFocus: 46,
    activeDisruptionScenarioIds: V1033_SCRES_listActiveDisruptionScenarioIds(1).slice(0, 8),
    activeHubZoneIds: ['hub_zone_00', 'hub_zone_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1033ScresSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1033ScresSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1033ScresSelfTestResult[];
} {
  const results: V1033ScresSelfTestResult[] = [];

  check(results, 'v1033_scres_lab_id', 'LAB suite id', V1033_SCRES_LAB_SUITE_ID === 'v1033_supply_chain_resilience');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1033ScresTurn(inp);
    const id = `v1033_scres_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1033_SCRES_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateLogisticsStressExposureIndex >= 0 && out.state.aggregateLogisticsStressExposureIndex <= 100,
    );
  }

  check(
    results,
    'v1033_scres_hash_stable',
    'input hash deterministic',
    v1033ScresInputHash(baseInput({ turn: 3, seed: 88 })) === v1033ScresInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1033ScresPersisted();
    check(
      results,
      'v1033_scres_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1033_SCRES_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1033ScresPersisted({ revision: -3 }, 2);
    check(results, 'v1033_scres_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1033_scres_scenario_catalog',
    'disruption scenario catalog populated',
    V1033_SCRES_ALL_DISRUPTION_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1033_SCRES_evaluateDisruptionBatch(4, ['disruption_000', 'disruption_001', 'disruption_002']);
    check(
      results,
      'v1033_scres_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanLogisticsStressExposure > 0,
    );
  }

  {
    const r = V1033_SCRES_DISRUPTION_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1033_scres_scenario_000',
      'scenario 000 evaluate',
      r.supplyChainResilienceScore <= 100 && V1033_SCRES_DISRUPTION_SCENARIO_000_META.id === 'disruption_000',
    );
  }

  check(
    results,
    'v1033_scres_prop_graph',
    'corridorBuffer graph hash',
    V1033_SCRES_corridorBufferGraphHash(V1033_SCRES_GENERATED_CORRIDOR_BUFFER_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1033_SCRES_mergeCorridorBufferEdges(
      [V1033_SCRES_GENERATED_CORRIDOR_BUFFER_EDGES[0], V1033_SCRES_GENERATED_CORRIDOR_BUFFER_EDGES[400]],
      [V1033_SCRES_GENERATED_CORRIDOR_BUFFER_EDGES[800]],
    );
    check(results, 'v1033_scres_prop_merge', 'corridorBuffer merge', merged.length === 3);
  }

  {
    const b = V1033_SCRES_HUB_ZONE_00_buffer(5);
    check(results, 'v1033_scres_hub_zone_buffer', 'hub_zone node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1033ScresTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1033_scres_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1033ScresSupply20bbBridge(baseInput(), 52);
    const next = applyV1033ScresSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1033_scres_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1033ScresEnergy20bcBridge(baseInput(), 48);
    const next = applyV1033ScresEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1033_scres_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1033ScresWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1033ScresWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1033_scres_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1033ScresTrade20baBridge(baseInput(), 0.2);
    const next = applyV1033ScresTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1033_scres_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1033ScresPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1033ScresPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1033_scres_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1033ScresClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1033ScresClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1033_scres_hub_zone_adapter',
      '20BR hub zone node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1033ScresDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1033ScresDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1033_scres_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1033_scres_hub_zone_band', 'hub_zone bands', V1033_SCRES_supplyChainResilienceBandFromScore(76) === 'robust');
  check(results, 'v1033_scres_hazard_rank', 'transfer band rank', V1033_SCRES_supplyChainResilienceBandRank('critical') === 5);
  check(results, 'v1033_scres_clamp', 'clamp finite', V1033_SCRES_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1033_SCRES_runDisruptionScenarioRegressionSweep(3);
    check(results, 'v1033_scres_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1033ScresPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1033ScresTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1033_scres_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1033ScresPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1033ScresTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1033_scres_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1033_SCRES_LAB_SUITE_ID, results };
}

export function runV1033ScresSelfTestsForLab(): V1033ScresSelfTestResult[] {
  return runV1033ScresSelfTests().results;
}
