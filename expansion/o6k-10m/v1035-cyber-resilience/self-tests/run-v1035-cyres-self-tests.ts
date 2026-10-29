/**
 * LAB suite: v1020_cyber_resilience — state–federal transfer & facility_zone fixtures (SECTION 20CG).
 */
import type { V1035CyresSelfTestResult, V1035CyresTurnInput } from '../types/core';
import { V1035_CYRES_SCHEMA_VERSION } from '../types/core';
import {
  runV1035CyresTurn,
  createEmptyV1035CyresPersisted,
  v1035CyresInputHash,
  sanitizeV1035CyresPersisted,
} from '../engine/cyber-resilience-orchestrator';
import {
  V1035_CYRES_clamp,
  V1035_CYRES_cyberResilienceBandFromScore,
  V1035_CYRES_cyberResilienceBandRank,
} from '../engine/cyber-resilience-utils';
import { computeV1035CyresSupply20bbBridge, applyV1035CyresSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1035CyresTrade20baBridge, applyV1035CyresTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1035CyresEnergy20bcBridge, applyV1035CyresEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1035CyresWorkforce20bfBridge, applyV1035CyresWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1035CyresPublicServices20azBridge, applyV1035CyresPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1035CyresClimateAdaptation20brBridge, applyV1035CyresClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1035CyresDigitalGovernance20btBridge, applyV1035CyresDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { computeV1035CyresBiodiversityStewardship20buBridge, applyV1035CyresBiodiversityStewardship20buOverrides } from '../adapters/adapter-regional-health-systems-20bv';
import { V1035_CYRES_mergeSegmentBufferEdges, V1035_CYRES_segmentBufferGraphHash } from '../segment-buffer-stacks/graph-utils';
import { V1035_CYRES_GENERATED_SEGMENT_BUFFER_EDGES } from '../generated/segment-buffer-bundle';
import {
  V1035_CYRES_ALL_INTRUSION_SCENARIO_IDS,
  V1035_CYRES_evaluateIntrusionBatch,
  V1035_CYRES_listActiveIntrusionScenarioIds,
  V1035_CYRES_runIntrusionScenarioRegressionSweep,
} from '../generated/intrusion-registry';
import { V1035_CYRES_INTRUSION_SCENARIO_000_evaluate, V1035_CYRES_INTRUSION_SCENARIO_000_META } from '../generated/intrusion-scenarios/scenario-000';
import { V1035_CYRES_FACILITY_ZONE_00_buffer } from '../facility-zone-nodes/facility-zone-00';
import { V1035_CYRES_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1035CyresTurnInput> = {}): V1035CyresTurnInput {
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
    criticalInfrastructureResilience20ce: {
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
    cyberResiliencePolicyFocus: 46,
    activeIntrusionScenarioIds: V1035_CYRES_listActiveIntrusionScenarioIds(1).slice(0, 8),
    activeFacilityZoneIds: ['facility_zone_00', 'facility_zone_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1035CyresSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1035CyresSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1035CyresSelfTestResult[];
} {
  const results: V1035CyresSelfTestResult[] = [];

  check(results, 'v1035_cyres_lab_id', 'LAB suite id', V1035_CYRES_LAB_SUITE_ID === 'v1035_cyber_resilience');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1035CyresTurn(inp);
    const id = `v1035_cyres_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1035_CYRES_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateSovereignDigitalStressExposureIndex >= 0 && out.state.aggregateSovereignDigitalStressExposureIndex <= 100,
    );
  }

  check(
    results,
    'v1035_cyres_hash_stable',
    'input hash deterministic',
    v1035CyresInputHash(baseInput({ turn: 3, seed: 88 })) === v1035CyresInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1035CyresPersisted();
    check(
      results,
      'v1035_cyres_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1035_CYRES_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1035CyresPersisted({ revision: -3 }, 2);
    check(results, 'v1035_cyres_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1035_cyres_scenario_catalog',
    'intrusion incident scenario catalog populated',
    V1035_CYRES_ALL_INTRUSION_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1035_CYRES_evaluateIntrusionBatch(4, ['intrusion_000', 'intrusion_001', 'intrusion_002']);
    check(
      results,
      'v1035_cyres_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanSovereignDigitalStressExposure > 0,
    );
  }

  {
    const r = V1035_CYRES_INTRUSION_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1035_cyres_scenario_000',
      'scenario 000 evaluate',
      r.cyberResilienceScore <= 100 && V1035_CYRES_INTRUSION_SCENARIO_000_META.id === 'intrusion_000',
    );
  }

  check(
    results,
    'v1035_cyres_prop_graph',
    'segmentBuffer graph hash',
    V1035_CYRES_segmentBufferGraphHash(V1035_CYRES_GENERATED_SEGMENT_BUFFER_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1035_CYRES_mergeSegmentBufferEdges(
      [V1035_CYRES_GENERATED_SEGMENT_BUFFER_EDGES[0], V1035_CYRES_GENERATED_SEGMENT_BUFFER_EDGES[400]],
      [V1035_CYRES_GENERATED_SEGMENT_BUFFER_EDGES[800]],
    );
    check(results, 'v1035_cyres_prop_merge', 'segmentBuffer merge', merged.length === 3);
  }

  {
    const b = V1035_CYRES_FACILITY_ZONE_00_buffer(5);
    check(results, 'v1035_cyres_facility_zone_buffer', 'facility_zone node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1035CyresTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1035_cyres_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1035CyresSupply20bbBridge(baseInput(), 52);
    const next = applyV1035CyresSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1035_cyres_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1035CyresEnergy20bcBridge(baseInput(), 48);
    const next = applyV1035CyresEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1035_cyres_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1035CyresWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1035CyresWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1035_cyres_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1035CyresTrade20baBridge(baseInput(), 0.2);
    const next = applyV1035CyresTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1035_cyres_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1035CyresPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1035CyresPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1035_cyres_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1035CyresClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1035CyresClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1035_cyres_facility_zone_adapter',
      '20BR facility zone node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1035CyresDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1035CyresDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1035_cyres_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1035_cyres_facility_zone_band', 'facility_zone bands', V1035_CYRES_cyberResilienceBandFromScore(76) === 'robust');
  check(results, 'v1035_cyres_hazard_rank', 'transfer band rank', V1035_CYRES_cyberResilienceBandRank('critical') === 5);
  check(results, 'v1035_cyres_clamp', 'clamp finite', V1035_CYRES_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1035_CYRES_runIntrusionScenarioRegressionSweep(3);
    check(results, 'v1035_cyres_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1035CyresPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1035CyresTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1035_cyres_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1035CyresPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1035CyresTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1035_cyres_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1035_CYRES_LAB_SUITE_ID, results };
}

export function runV1035CyresSelfTestsForLab(): V1035CyresSelfTestResult[] {
  return runV1035CyresSelfTests().results;
}
