/**
 * LAB suite: v1020_inland_heat — state–federal transfer & inland_zone fixtures (SECTION 20BZ).
 */
import type { V1030IheatSelfTestResult, V1030IheatTurnInput } from '../types/core';
import { V1030_IHEAT_SCHEMA_VERSION } from '../types/core';
import {
  runV1030IheatTurn,
  createEmptyV1030IheatPersisted,
  v1030IheatInputHash,
  sanitizeV1030IheatPersisted,
} from '../engine/inland-heat-orchestrator';
import {
  V1030_IHEAT_clamp,
  V1030_IHEAT_aridAdaptationBandFromScore,
  V1030_IHEAT_aridAdaptationBandRank,
} from '../engine/inland-heat-utils';
import { computeV1030IheatSupply20bbBridge, applyV1030IheatSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1030IheatTrade20baBridge, applyV1030IheatTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1030IheatEnergy20bcBridge, applyV1030IheatEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1030IheatWorkforce20bfBridge, applyV1030IheatWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1030IheatPublicServices20azBridge, applyV1030IheatPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1030IheatClimateAdaptation20brBridge, applyV1030IheatClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1030IheatDigitalGovernance20btBridge, applyV1030IheatDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { computeV1030IheatBiodiversityStewardship20buBridge, applyV1030IheatBiodiversityStewardship20buOverrides } from '../adapters/adapter-regional-health-systems-20bv';
import { V1030_IHEAT_mergeAridBufferEdges, V1030_IHEAT_aridBufferGraphHash } from '../arid-buffer-stacks/graph-utils';
import { V1030_IHEAT_GENERATED_ARID_BUFFER_EDGES } from '../generated/arid-buffer-bundle';
import {
  V1030_IHEAT_ALL_HEATWAVE_SCENARIO_IDS,
  V1030_IHEAT_evaluateHeatwaveBatch,
  V1030_IHEAT_listActiveHeatwaveScenarioIds,
  V1030_IHEAT_runHeatwaveScenarioRegressionSweep,
} from '../generated/heatwave-registry';
import { V1030_IHEAT_HEATWAVE_SCENARIO_000_evaluate, V1030_IHEAT_HEATWAVE_SCENARIO_000_META } from '../generated/heatwave-scenarios/scenario-000';
import { V1030_IHEAT_INLAND_ZONE_00_buffer } from '../inland-zone-nodes/inland-zone-00';
import { V1030_IHEAT_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1030IheatTurnInput> = {}): V1030IheatTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      aridBufferIndex: 0.44,
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
      heatStressRisk: 31,
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
    coastalResilience20by: {
      turn: 1,
      seaLevelExposurePressure: 38,
      grantStackLoad: 0.21,
      surgeDriftTurns: 14,
    },
    disasterResilience20bx: {
      turn: 1,
      compoundHazardLoad: 0.42,
      evacuationLagTurns: 11,
      infrastructureFailurePressure: 26,
    },
    shadeHeadroom: 57,
    inlandHeatPolicyFocus: 46,
    activeHeatwaveScenarioIds: V1030_IHEAT_listActiveHeatwaveScenarioIds(1).slice(0, 8),
    activeInlandZoneIds: ['inland_zone_00', 'inland_zone_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1030IheatSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1030IheatSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1030IheatSelfTestResult[];
} {
  const results: V1030IheatSelfTestResult[] = [];

  check(results, 'v1030_iheat_lab_id', 'LAB suite id', V1030_IHEAT_LAB_SUITE_ID === 'v1030_inland_heat');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1030IheatTurn(inp);
    const id = `v1030_iheat_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1030_IHEAT_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateInlandHeatExposureIndex >= 0 && out.state.aggregateInlandHeatExposureIndex <= 100,
    );
  }

  check(
    results,
    'v1030_iheat_hash_stable',
    'input hash deterministic',
    v1030IheatInputHash(baseInput({ turn: 3, seed: 88 })) === v1030IheatInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1030IheatPersisted();
    check(
      results,
      'v1030_iheat_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1030_IHEAT_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1030IheatPersisted({ revision: -3 }, 2);
    check(results, 'v1030_iheat_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1030_iheat_scenario_catalog',
    'heatwave scenario catalog populated',
    V1030_IHEAT_ALL_HEATWAVE_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1030_IHEAT_evaluateHeatwaveBatch(4, ['heatwave_000', 'heatwave_001', 'heatwave_002']);
    check(
      results,
      'v1030_iheat_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanInlandHeatExposure > 0,
    );
  }

  {
    const r = V1030_IHEAT_HEATWAVE_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1030_iheat_scenario_000',
      'scenario 000 evaluate',
      r.aridAdaptationScore <= 100 && V1030_IHEAT_HEATWAVE_SCENARIO_000_META.id === 'heatwave_000',
    );
  }

  check(
    results,
    'v1030_iheat_prop_graph',
    'aridBuffer graph hash',
    V1030_IHEAT_aridBufferGraphHash(V1030_IHEAT_GENERATED_ARID_BUFFER_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1030_IHEAT_mergeAridBufferEdges(
      [V1030_IHEAT_GENERATED_ARID_BUFFER_EDGES[0], V1030_IHEAT_GENERATED_ARID_BUFFER_EDGES[400]],
      [V1030_IHEAT_GENERATED_ARID_BUFFER_EDGES[800]],
    );
    check(results, 'v1030_iheat_prop_merge', 'aridBuffer merge', merged.length === 3);
  }

  {
    const b = V1030_IHEAT_INLAND_ZONE_00_buffer(5);
    check(results, 'v1030_iheat_inland_zone_buffer', 'inland_zone node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1030IheatTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1030_iheat_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1030IheatSupply20bbBridge(baseInput(), 52);
    const next = applyV1030IheatSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1030_iheat_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1030IheatEnergy20bcBridge(baseInput(), 48);
    const next = applyV1030IheatEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1030_iheat_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1030IheatWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1030IheatWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1030_iheat_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1030IheatTrade20baBridge(baseInput(), 0.2);
    const next = applyV1030IheatTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1030_iheat_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1030IheatPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1030IheatPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1030_iheat_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1030IheatClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1030IheatClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1030_iheat_inland_zone_adapter',
      '20BR inland zone node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1030IheatDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1030IheatDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1030_iheat_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1030_iheat_inland_zone_band', 'inland_zone bands', V1030_IHEAT_aridAdaptationBandFromScore(76) === 'robust');
  check(results, 'v1030_iheat_hazard_rank', 'transfer band rank', V1030_IHEAT_aridAdaptationBandRank('critical') === 5);
  check(results, 'v1030_iheat_clamp', 'clamp finite', V1030_IHEAT_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1030_IHEAT_runHeatwaveScenarioRegressionSweep(3);
    check(results, 'v1030_iheat_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1030IheatPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1030IheatTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1030_iheat_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1030IheatPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1030IheatTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1030_iheat_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1030_IHEAT_LAB_SUITE_ID, results };
}

export function runV1030IheatSelfTestsForLab(): V1030IheatSelfTestResult[] {
  return runV1030IheatSelfTests().results;
}
