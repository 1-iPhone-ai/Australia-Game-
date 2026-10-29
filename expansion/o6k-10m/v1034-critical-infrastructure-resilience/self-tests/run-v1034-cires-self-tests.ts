/**
 * LAB suite: v1020_critical_infrastructure_resilience — state–federal transfer & facility_zone fixtures (SECTION 20CE).
 */
import type { V1034CiresSelfTestResult, V1034CiresTurnInput } from '../types/core';
import { V1034_CIRES_SCHEMA_VERSION } from '../types/core';
import {
  runV1034CiresTurn,
  createEmptyV1034CiresPersisted,
  v1034CiresInputHash,
  sanitizeV1034CiresPersisted,
} from '../engine/critical-infrastructure-resilience-orchestrator';
import {
  V1034_CIRES_clamp,
  V1034_CIRES_criticalInfrastructureResilienceBandFromScore,
  V1034_CIRES_criticalInfrastructureResilienceBandRank,
} from '../engine/critical-infrastructure-resilience-utils';
import { computeV1034CiresSupply20bbBridge, applyV1034CiresSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1034CiresTrade20baBridge, applyV1034CiresTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1034CiresEnergy20bcBridge, applyV1034CiresEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1034CiresWorkforce20bfBridge, applyV1034CiresWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1034CiresPublicServices20azBridge, applyV1034CiresPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1034CiresClimateAdaptation20brBridge, applyV1034CiresClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1034CiresDigitalGovernance20btBridge, applyV1034CiresDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { computeV1034CiresBiodiversityStewardship20buBridge, applyV1034CiresBiodiversityStewardship20buOverrides } from '../adapters/adapter-regional-health-systems-20bv';
import { V1034_CIRES_mergeSegmentBufferEdges, V1034_CIRES_segmentBufferGraphHash } from '../segment-buffer-stacks/graph-utils';
import { V1034_CIRES_GENERATED_SEGMENT_BUFFER_EDGES } from '../generated/segment-buffer-bundle';
import {
  V1034_CIRES_ALL_COMPROMISE_SCENARIO_IDS,
  V1034_CIRES_evaluateCompromiseBatch,
  V1034_CIRES_listActiveCompromiseScenarioIds,
  V1034_CIRES_runCompromiseScenarioRegressionSweep,
} from '../generated/compromise-registry';
import { V1034_CIRES_COMPROMISE_SCENARIO_000_evaluate, V1034_CIRES_COMPROMISE_SCENARIO_000_META } from '../generated/compromise-scenarios/scenario-000';
import { V1034_CIRES_FACILITY_ZONE_00_buffer } from '../facility-zone-nodes/facility-zone-00';
import { V1034_CIRES_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1034CiresTurnInput> = {}): V1034CiresTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      segmentBufferIndex: 0.44,
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
    supplyChainResilience20cd: {
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
    criticalInfrastructureResiliencePolicyFocus: 46,
    activeCompromiseScenarioIds: V1034_CIRES_listActiveCompromiseScenarioIds(1).slice(0, 8),
    activeFacilityZoneIds: ['facility_zone_00', 'facility_zone_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1034CiresSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1034CiresSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1034CiresSelfTestResult[];
} {
  const results: V1034CiresSelfTestResult[] = [];

  check(results, 'v1034_cires_lab_id', 'LAB suite id', V1034_CIRES_LAB_SUITE_ID === 'v1034_critical_infrastructure_resilience');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1034CiresTurn(inp);
    const id = `v1034_cires_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1034_CIRES_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateCyberPhysicalStressExposureIndex >= 0 && out.state.aggregateCyberPhysicalStressExposureIndex <= 100,
    );
  }

  check(
    results,
    'v1034_cires_hash_stable',
    'input hash deterministic',
    v1034CiresInputHash(baseInput({ turn: 3, seed: 88 })) === v1034CiresInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1034CiresPersisted();
    check(
      results,
      'v1034_cires_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1034_CIRES_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1034CiresPersisted({ revision: -3 }, 2);
    check(results, 'v1034_cires_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1034_cires_scenario_catalog',
    'compromise incident scenario catalog populated',
    V1034_CIRES_ALL_COMPROMISE_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1034_CIRES_evaluateCompromiseBatch(4, ['compromise_000', 'compromise_001', 'compromise_002']);
    check(
      results,
      'v1034_cires_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanCyberPhysicalStressExposure > 0,
    );
  }

  {
    const r = V1034_CIRES_COMPROMISE_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1034_cires_scenario_000',
      'scenario 000 evaluate',
      r.criticalInfrastructureResilienceScore <= 100 && V1034_CIRES_COMPROMISE_SCENARIO_000_META.id === 'compromise_000',
    );
  }

  check(
    results,
    'v1034_cires_prop_graph',
    'segmentBuffer graph hash',
    V1034_CIRES_segmentBufferGraphHash(V1034_CIRES_GENERATED_SEGMENT_BUFFER_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1034_CIRES_mergeSegmentBufferEdges(
      [V1034_CIRES_GENERATED_SEGMENT_BUFFER_EDGES[0], V1034_CIRES_GENERATED_SEGMENT_BUFFER_EDGES[400]],
      [V1034_CIRES_GENERATED_SEGMENT_BUFFER_EDGES[800]],
    );
    check(results, 'v1034_cires_prop_merge', 'segmentBuffer merge', merged.length === 3);
  }

  {
    const b = V1034_CIRES_FACILITY_ZONE_00_buffer(5);
    check(results, 'v1034_cires_facility_zone_buffer', 'facility_zone node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1034CiresTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1034_cires_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1034CiresSupply20bbBridge(baseInput(), 52);
    const next = applyV1034CiresSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1034_cires_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1034CiresEnergy20bcBridge(baseInput(), 48);
    const next = applyV1034CiresEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1034_cires_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1034CiresWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1034CiresWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1034_cires_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1034CiresTrade20baBridge(baseInput(), 0.2);
    const next = applyV1034CiresTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1034_cires_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1034CiresPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1034CiresPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1034_cires_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1034CiresClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1034CiresClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1034_cires_facility_zone_adapter',
      '20BR facility zone node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1034CiresDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1034CiresDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1034_cires_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1034_cires_facility_zone_band', 'facility_zone bands', V1034_CIRES_criticalInfrastructureResilienceBandFromScore(76) === 'robust');
  check(results, 'v1034_cires_hazard_rank', 'transfer band rank', V1034_CIRES_criticalInfrastructureResilienceBandRank('critical') === 5);
  check(results, 'v1034_cires_clamp', 'clamp finite', V1034_CIRES_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1034_CIRES_runCompromiseScenarioRegressionSweep(3);
    check(results, 'v1034_cires_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1034CiresPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1034CiresTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1034_cires_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1034CiresPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1034CiresTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1034_cires_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1034_CIRES_LAB_SUITE_ID, results };
}

export function runV1034CiresSelfTestsForLab(): V1034CiresSelfTestResult[] {
  return runV1034CiresSelfTests().results;
}
