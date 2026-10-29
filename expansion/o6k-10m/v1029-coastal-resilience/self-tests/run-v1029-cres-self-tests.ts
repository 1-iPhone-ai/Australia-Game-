/**
 * LAB suite: v1020_coastal_resilience — state–federal transfer & littoral_zone fixtures (SECTION 20BY).
 */
import type { V1029CresSelfTestResult, V1029CresTurnInput } from '../types/core';
import { V1029_CRES_SCHEMA_VERSION } from '../types/core';
import {
  runV1029CresTurn,
  createEmptyV1029CresPersisted,
  v1029CresInputHash,
  sanitizeV1029CresPersisted,
} from '../engine/coastal-resilience-orchestrator';
import {
  V1029_CRES_clamp,
  V1029_CRES_adaptationBandFromScore,
  V1029_CRES_adaptationBandRank,
} from '../engine/coastal-resilience-utils';
import { computeV1029CresSupply20bbBridge, applyV1029CresSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1029CresTrade20baBridge, applyV1029CresTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1029CresEnergy20bcBridge, applyV1029CresEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1029CresWorkforce20bfBridge, applyV1029CresWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1029CresPublicServices20azBridge, applyV1029CresPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1029CresClimateAdaptation20brBridge, applyV1029CresClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1029CresDigitalGovernance20btBridge, applyV1029CresDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { computeV1029CresBiodiversityStewardship20buBridge, applyV1029CresBiodiversityStewardship20buOverrides } from '../adapters/adapter-regional-health-systems-20bv';
import { V1029_CRES_mergeAdaptationBufferEdges, V1029_CRES_adaptationBufferGraphHash } from '../adaptation-buffer-stacks/graph-utils';
import { V1029_CRES_GENERATED_ADAPTATION_BUFFER_EDGES } from '../generated/adaptation-buffer-bundle';
import {
  V1029_CRES_ALL_SURGE_SCENARIO_IDS,
  V1029_CRES_evaluateSurgeBatch,
  V1029_CRES_listActiveSurgeScenarioIds,
  V1029_CRES_runSurgeScenarioRegressionSweep,
} from '../generated/surge-registry';
import { V1029_CRES_SURGE_SCENARIO_000_evaluate, V1029_CRES_SURGE_SCENARIO_000_META } from '../generated/surge-scenarios/scenario-000';
import { V1029_CRES_LITTORAL_ZONE_00_buffer } from '../littoral-zone-nodes/littoral-zone-00';
import { V1029_CRES_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1029CresTurnInput> = {}): V1029CresTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      adaptationBufferIndex: 0.44,
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
      inundationRiskStress: 31,
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
    disasterResilience20bx: {
      turn: 1,
      compoundHazardLoad: 0.42,
      evacuationLagTurns: 11,
      infrastructureFailurePressure: 26,
    },
    bermHeadroom: 57,
    coastalPolicyFocus: 46,
    activeSurgeScenarioIds: V1029_CRES_listActiveSurgeScenarioIds(1).slice(0, 8),
    activeLittoralZoneIds: ['littoral_zone_00', 'littoral_zone_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1029CresSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1029CresSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1029CresSelfTestResult[];
} {
  const results: V1029CresSelfTestResult[] = [];

  check(results, 'v1029_cres_lab_id', 'LAB suite id', V1029_CRES_LAB_SUITE_ID === 'v1029_coastal_resilience');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1029CresTurn(inp);
    const id = `v1029_cres_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1029_CRES_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateSeaLevelExposureIndex >= 0 && out.state.aggregateSeaLevelExposureIndex <= 100,
    );
  }

  check(
    results,
    'v1029_cres_hash_stable',
    'input hash deterministic',
    v1029CresInputHash(baseInput({ turn: 3, seed: 88 })) === v1029CresInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1029CresPersisted();
    check(
      results,
      'v1029_cres_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1029_CRES_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1029CresPersisted({ revision: -3 }, 2);
    check(results, 'v1029_cres_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1029_cres_scenario_catalog',
    'surge scenario catalog populated',
    V1029_CRES_ALL_SURGE_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1029_CRES_evaluateSurgeBatch(4, ['surge_000', 'surge_001', 'surge_002']);
    check(
      results,
      'v1029_cres_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanSeaLevelExposure > 0,
    );
  }

  {
    const r = V1029_CRES_SURGE_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1029_cres_scenario_000',
      'scenario 000 evaluate',
      r.adaptationScore <= 100 && V1029_CRES_SURGE_SCENARIO_000_META.id === 'surge_000',
    );
  }

  check(
    results,
    'v1029_cres_prop_graph',
    'adaptationBuffer graph hash',
    V1029_CRES_adaptationBufferGraphHash(V1029_CRES_GENERATED_ADAPTATION_BUFFER_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1029_CRES_mergeAdaptationBufferEdges(
      [V1029_CRES_GENERATED_ADAPTATION_BUFFER_EDGES[0], V1029_CRES_GENERATED_ADAPTATION_BUFFER_EDGES[400]],
      [V1029_CRES_GENERATED_ADAPTATION_BUFFER_EDGES[800]],
    );
    check(results, 'v1029_cres_prop_merge', 'adaptationBuffer merge', merged.length === 3);
  }

  {
    const b = V1029_CRES_LITTORAL_ZONE_00_buffer(5);
    check(results, 'v1029_cres_littoral_zone_buffer', 'littoral_zone node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1029CresTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1029_cres_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1029CresSupply20bbBridge(baseInput(), 52);
    const next = applyV1029CresSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1029_cres_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1029CresEnergy20bcBridge(baseInput(), 48);
    const next = applyV1029CresEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1029_cres_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1029CresWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1029CresWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1029_cres_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1029CresTrade20baBridge(baseInput(), 0.2);
    const next = applyV1029CresTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1029_cres_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1029CresPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1029CresPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1029_cres_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1029CresClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1029CresClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1029_cres_littoral_zone_adapter',
      '20BR littoral zone node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1029CresDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1029CresDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1029_cres_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1029_cres_littoral_zone_band', 'littoral_zone bands', V1029_CRES_adaptationBandFromScore(76) === 'robust');
  check(results, 'v1029_cres_hazard_rank', 'transfer band rank', V1029_CRES_adaptationBandRank('critical') === 5);
  check(results, 'v1029_cres_clamp', 'clamp finite', V1029_CRES_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1029_CRES_runSurgeScenarioRegressionSweep(3);
    check(results, 'v1029_cres_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1029CresPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1029CresTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1029_cres_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1029CresPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1029CresTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1029_cres_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1029_CRES_LAB_SUITE_ID, results };
}

export function runV1029CresSelfTestsForLab(): V1029CresSelfTestResult[] {
  return runV1029CresSelfTests().results;
}
