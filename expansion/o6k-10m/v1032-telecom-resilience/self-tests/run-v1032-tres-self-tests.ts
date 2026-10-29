/**
 * LAB suite: v1020_telecom_resilience — state–federal transfer & exchange_zone fixtures (SECTION 20CB).
 */
import type { V1032TresSelfTestResult, V1032TresTurnInput } from '../types/core';
import { V1032_TRES_SCHEMA_VERSION } from '../types/core';
import {
  runV1032TresTurn,
  createEmptyV1032TresPersisted,
  v1032TresInputHash,
  sanitizeV1032TresPersisted,
} from '../engine/telecom-resilience-orchestrator';
import {
  V1032_TRES_clamp,
  V1032_TRES_telecomResilienceBandFromScore,
  V1032_TRES_telecomResilienceBandRank,
} from '../engine/telecom-resilience-utils';
import { computeV1032TresSupply20bbBridge, applyV1032TresSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1032TresTrade20baBridge, applyV1032TresTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1032TresEnergy20bcBridge, applyV1032TresEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1032TresWorkforce20bfBridge, applyV1032TresWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1032TresPublicServices20azBridge, applyV1032TresPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1032TresClimateAdaptation20brBridge, applyV1032TresClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1032TresDigitalGovernance20btBridge, applyV1032TresDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { computeV1032TresBiodiversityStewardship20buBridge, applyV1032TresBiodiversityStewardship20buOverrides } from '../adapters/adapter-regional-health-systems-20bv';
import { V1032_TRES_mergeBackboneBufferEdges, V1032_TRES_backboneBufferGraphHash } from '../backbone-buffer-stacks/graph-utils';
import { V1032_TRES_GENERATED_BACKBONE_BUFFER_EDGES } from '../generated/backbone-buffer-bundle';
import {
  V1032_TRES_ALL_FAILOVER_SCENARIO_IDS,
  V1032_TRES_evaluateFailoverBatch,
  V1032_TRES_listActiveFailoverScenarioIds,
  V1032_TRES_runFailoverScenarioRegressionSweep,
} from '../generated/failover-registry';
import { V1032_TRES_FAILOVER_SCENARIO_000_evaluate, V1032_TRES_FAILOVER_SCENARIO_000_META } from '../generated/failover-scenarios/scenario-000';
import { V1032_TRES_EXCHANGE_ZONE_00_buffer } from '../exchange-zone-nodes/exchange-zone-00';
import { V1032_TRES_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1032TresTurnInput> = {}): V1032TresTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      backboneBufferIndex: 0.44,
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
    gridResilience20ca: {
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
    telecomResiliencePolicyFocus: 46,
    activeFailoverScenarioIds: V1032_TRES_listActiveFailoverScenarioIds(1).slice(0, 8),
    activeExchangeZoneIds: ['exchange_zone_00', 'exchange_zone_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1032TresSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1032TresSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1032TresSelfTestResult[];
} {
  const results: V1032TresSelfTestResult[] = [];

  check(results, 'v1032_tres_lab_id', 'LAB suite id', V1032_TRES_LAB_SUITE_ID === 'v1032_telecom_resilience');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1032TresTurn(inp);
    const id = `v1032_tres_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1032_TRES_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateTelecomStressExposureIndex >= 0 && out.state.aggregateTelecomStressExposureIndex <= 100,
    );
  }

  check(
    results,
    'v1032_tres_hash_stable',
    'input hash deterministic',
    v1032TresInputHash(baseInput({ turn: 3, seed: 88 })) === v1032TresInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1032TresPersisted();
    check(
      results,
      'v1032_tres_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1032_TRES_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1032TresPersisted({ revision: -3 }, 2);
    check(results, 'v1032_tres_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1032_tres_scenario_catalog',
    'failover scenario catalog populated',
    V1032_TRES_ALL_FAILOVER_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1032_TRES_evaluateFailoverBatch(4, ['failover_000', 'failover_001', 'failover_002']);
    check(
      results,
      'v1032_tres_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanTelecomStressExposure > 0,
    );
  }

  {
    const r = V1032_TRES_FAILOVER_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1032_tres_scenario_000',
      'scenario 000 evaluate',
      r.telecomResilienceScore <= 100 && V1032_TRES_FAILOVER_SCENARIO_000_META.id === 'failover_000',
    );
  }

  check(
    results,
    'v1032_tres_prop_graph',
    'backboneBuffer graph hash',
    V1032_TRES_backboneBufferGraphHash(V1032_TRES_GENERATED_BACKBONE_BUFFER_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1032_TRES_mergeBackboneBufferEdges(
      [V1032_TRES_GENERATED_BACKBONE_BUFFER_EDGES[0], V1032_TRES_GENERATED_BACKBONE_BUFFER_EDGES[400]],
      [V1032_TRES_GENERATED_BACKBONE_BUFFER_EDGES[800]],
    );
    check(results, 'v1032_tres_prop_merge', 'backboneBuffer merge', merged.length === 3);
  }

  {
    const b = V1032_TRES_EXCHANGE_ZONE_00_buffer(5);
    check(results, 'v1032_tres_exchange_zone_buffer', 'exchange_zone node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1032TresTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1032_tres_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1032TresSupply20bbBridge(baseInput(), 52);
    const next = applyV1032TresSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1032_tres_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1032TresEnergy20bcBridge(baseInput(), 48);
    const next = applyV1032TresEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1032_tres_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1032TresWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1032TresWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1032_tres_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1032TresTrade20baBridge(baseInput(), 0.2);
    const next = applyV1032TresTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1032_tres_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1032TresPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1032TresPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1032_tres_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1032TresClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1032TresClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1032_tres_exchange_zone_adapter',
      '20BR exchange zone node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1032TresDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1032TresDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1032_tres_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1032_tres_exchange_zone_band', 'exchange_zone bands', V1032_TRES_telecomResilienceBandFromScore(76) === 'robust');
  check(results, 'v1032_tres_hazard_rank', 'transfer band rank', V1032_TRES_telecomResilienceBandRank('critical') === 5);
  check(results, 'v1032_tres_clamp', 'clamp finite', V1032_TRES_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1032_TRES_runFailoverScenarioRegressionSweep(3);
    check(results, 'v1032_tres_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1032TresPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1032TresTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1032_tres_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1032TresPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1032TresTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1032_tres_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1032_TRES_LAB_SUITE_ID, results };
}

export function runV1032TresSelfTestsForLab(): V1032TresSelfTestResult[] {
  return runV1032TresSelfTests().results;
}
