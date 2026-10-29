/**
 * LAB suite: v1020_disaster_resilience — state–federal transfer & emergency_response fixtures (SECTION 20BX).
 */
import type { V1028DresSelfTestResult, V1028DresTurnInput } from '../types/core';
import { V1028_DRES_SCHEMA_VERSION } from '../types/core';
import {
  runV1028DresTurn,
  createEmptyV1028DresPersisted,
  v1028DresInputHash,
  sanitizeV1028DresPersisted,
} from '../engine/disaster-resilience-orchestrator';
import {
  V1028_DRES_clamp,
  V1028_DRES_resilienceBandFromScore,
  V1028_DRES_resilienceBandRank,
} from '../engine/disaster-resilience-utils';
import { computeV1028DresSupply20bbBridge, applyV1028DresSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1028DresTrade20baBridge, applyV1028DresTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1028DresEnergy20bcBridge, applyV1028DresEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1028DresWorkforce20bfBridge, applyV1028DresWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1028DresPublicServices20azBridge, applyV1028DresPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1028DresClimateAdaptation20brBridge, applyV1028DresClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1028DresDigitalGovernance20btBridge, applyV1028DresDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { computeV1028DresBiodiversityStewardship20buBridge, applyV1028DresBiodiversityStewardship20buOverrides } from '../adapters/adapter-regional-health-systems-20bv';
import { V1028_DRES_mergeEvacuationCapacityEdges, V1028_DRES_evacuationCapacityGraphHash } from '../evacuation-capacity-stacks/graph-utils';
import { V1028_DRES_GENERATED_EVACUATION_CAPACITY_EDGES } from '../generated/evacuation-capacity-bundle';
import {
  V1028_DRES_ALL_HAZARD_SCENARIO_IDS,
  V1028_DRES_evaluateHazardBatch,
  V1028_DRES_listActiveHazardScenarioIds,
  V1028_DRES_runHazardScenarioRegressionSweep,
} from '../generated/hazard-registry';
import { V1028_DRES_HAZARD_SCENARIO_000_evaluate, V1028_DRES_HAZARD_SCENARIO_000_META } from '../generated/hazard-scenarios/scenario-000';
import { V1028_DRES_EMERGENCY_RESPONSE_00_buffer } from '../emergency-response-nodes/emergency-response-00';
import { V1028_DRES_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1028DresTurnInput> = {}): V1028DresTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      evacuationCapacityIndex: 0.44,
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
      cascadeRiskStress: 31,
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
    waterSecurity20bw: {
      turn: 1,
      supplyStressPressure: 38,
      grantStackLoad: 0.21,
      basinDriftTurns: 14,
    },
    crisisSpine20as: {
      turn: 1,
      activeCrisisLoad: 0.42,
      coordinationLagTurns: 11,
      escalationPressure: 26,
    },
    shelterHeadroom: 57,
    emergencyPolicyFocus: 46,
    activeHazardScenarioIds: V1028_DRES_listActiveHazardScenarioIds(1).slice(0, 8),
    activeEmergencyResponseIds: ['emergency_response_00', 'emergency_response_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1028DresSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1028DresSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1028DresSelfTestResult[];
} {
  const results: V1028DresSelfTestResult[] = [];

  check(results, 'v1028_dres_lab_id', 'LAB suite id', V1028_DRES_LAB_SUITE_ID === 'v1028_disaster_resilience');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1028DresTurn(inp);
    const id = `v1028_dres_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1028_DRES_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateDisasterRiskIndex >= 0 && out.state.aggregateDisasterRiskIndex <= 100,
    );
  }

  check(
    results,
    'v1028_dres_hash_stable',
    'input hash deterministic',
    v1028DresInputHash(baseInput({ turn: 3, seed: 88 })) === v1028DresInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1028DresPersisted();
    check(
      results,
      'v1028_dres_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1028_DRES_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1028DresPersisted({ revision: -3 }, 2);
    check(results, 'v1028_dres_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1028_dres_scenario_catalog',
    'hazard scenario catalog populated',
    V1028_DRES_ALL_HAZARD_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1028_DRES_evaluateHazardBatch(4, ['hazard_000', 'hazard_001', 'hazard_002']);
    check(
      results,
      'v1028_dres_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanDisasterRisk > 0,
    );
  }

  {
    const r = V1028_DRES_HAZARD_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1028_dres_scenario_000',
      'scenario 000 evaluate',
      r.resilienceScore <= 100 && V1028_DRES_HAZARD_SCENARIO_000_META.id === 'hazard_000',
    );
  }

  check(
    results,
    'v1028_dres_prop_graph',
    'evacuationCapacity graph hash',
    V1028_DRES_evacuationCapacityGraphHash(V1028_DRES_GENERATED_EVACUATION_CAPACITY_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1028_DRES_mergeEvacuationCapacityEdges(
      [V1028_DRES_GENERATED_EVACUATION_CAPACITY_EDGES[0], V1028_DRES_GENERATED_EVACUATION_CAPACITY_EDGES[400]],
      [V1028_DRES_GENERATED_EVACUATION_CAPACITY_EDGES[800]],
    );
    check(results, 'v1028_dres_prop_merge', 'evacuationCapacity merge', merged.length === 3);
  }

  {
    const b = V1028_DRES_EMERGENCY_RESPONSE_00_buffer(5);
    check(results, 'v1028_dres_emergency_response_buffer', 'emergency_response node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1028DresTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1028_dres_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1028DresSupply20bbBridge(baseInput(), 52);
    const next = applyV1028DresSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1028_dres_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1028DresEnergy20bcBridge(baseInput(), 48);
    const next = applyV1028DresEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1028_dres_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1028DresWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1028DresWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1028_dres_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1028DresTrade20baBridge(baseInput(), 0.2);
    const next = applyV1028DresTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1028_dres_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1028DresPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1028DresPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1028_dres_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1028DresClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1028DresClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1028_dres_emergency_response_adapter',
      '20BR emergency response node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1028DresDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1028DresDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1028_dres_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1028_dres_emergency_response_band', 'emergency_response bands', V1028_DRES_resilienceBandFromScore(76) === 'robust');
  check(results, 'v1028_dres_hazard_rank', 'transfer band rank', V1028_DRES_resilienceBandRank('critical') === 5);
  check(results, 'v1028_dres_clamp', 'clamp finite', V1028_DRES_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1028_DRES_runHazardScenarioRegressionSweep(3);
    check(results, 'v1028_dres_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1028DresPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1028DresTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1028_dres_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1028DresPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1028DresTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1028_dres_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1028_DRES_LAB_SUITE_ID, results };
}

export function runV1028DresSelfTestsForLab(): V1028DresSelfTestResult[] {
  return runV1028DresSelfTests().results;
}
