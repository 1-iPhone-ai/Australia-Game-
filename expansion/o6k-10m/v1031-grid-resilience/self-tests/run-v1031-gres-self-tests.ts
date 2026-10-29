/**
 * LAB suite: v1020_grid_resilience — state–federal transfer & substation_zone fixtures (SECTION 20CA).
 */
import type { V1031GresSelfTestResult, V1031GresTurnInput } from '../types/core';
import { V1031_GRES_SCHEMA_VERSION } from '../types/core';
import {
  runV1031GresTurn,
  createEmptyV1031GresPersisted,
  v1031GresInputHash,
  sanitizeV1031GresPersisted,
} from '../engine/grid-resilience-orchestrator';
import {
  V1031_GRES_clamp,
  V1031_GRES_gridResilienceBandFromScore,
  V1031_GRES_gridResilienceBandRank,
} from '../engine/grid-resilience-utils';
import { computeV1031GresSupply20bbBridge, applyV1031GresSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1031GresTrade20baBridge, applyV1031GresTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1031GresEnergy20bcBridge, applyV1031GresEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1031GresWorkforce20bfBridge, applyV1031GresWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1031GresPublicServices20azBridge, applyV1031GresPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1031GresClimateAdaptation20brBridge, applyV1031GresClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1031GresDigitalGovernance20btBridge, applyV1031GresDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { computeV1031GresBiodiversityStewardship20buBridge, applyV1031GresBiodiversityStewardship20buOverrides } from '../adapters/adapter-regional-health-systems-20bv';
import { V1031_GRES_mergeGridBufferEdges, V1031_GRES_gridBufferGraphHash } from '../grid-buffer-stacks/graph-utils';
import { V1031_GRES_GENERATED_GRID_BUFFER_EDGES } from '../generated/grid-buffer-bundle';
import {
  V1031_GRES_ALL_OUTAGE_SCENARIO_IDS,
  V1031_GRES_evaluateOutageBatch,
  V1031_GRES_listActiveOutageScenarioIds,
  V1031_GRES_runOutageScenarioRegressionSweep,
} from '../generated/outage-registry';
import { V1031_GRES_OUTAGE_SCENARIO_000_evaluate, V1031_GRES_OUTAGE_SCENARIO_000_META } from '../generated/outage-scenarios/scenario-000';
import { V1031_GRES_SUBSTATION_ZONE_00_buffer } from '../substation-zone-nodes/substation-zone-00';
import { V1031_GRES_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1031GresTurnInput> = {}): V1031GresTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      gridBufferIndex: 0.44,
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
      outageCascadeRisk: 31,
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
    inlandHeat20bz: {
      turn: 1,
      inlandHeatExposurePressure: 38,
      grantStackLoad: 0.21,
      heatwaveDriftTurns: 14,
    },
    disasterResilience20bx: {
      turn: 1,
      compoundHazardLoad: 0.42,
      evacuationLagTurns: 11,
      infrastructureFailurePressure: 26,
    },
    reserveHeadroom: 57,
    gridResiliencePolicyFocus: 46,
    activeOutageScenarioIds: V1031_GRES_listActiveOutageScenarioIds(1).slice(0, 8),
    activeSubstationZoneIds: ['substation_zone_00', 'substation_zone_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1031GresSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1031GresSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1031GresSelfTestResult[];
} {
  const results: V1031GresSelfTestResult[] = [];

  check(results, 'v1031_gres_lab_id', 'LAB suite id', V1031_GRES_LAB_SUITE_ID === 'v1031_grid_resilience');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1031GresTurn(inp);
    const id = `v1031_gres_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1031_GRES_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateGridStressExposureIndex >= 0 && out.state.aggregateGridStressExposureIndex <= 100,
    );
  }

  check(
    results,
    'v1031_gres_hash_stable',
    'input hash deterministic',
    v1031GresInputHash(baseInput({ turn: 3, seed: 88 })) === v1031GresInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1031GresPersisted();
    check(
      results,
      'v1031_gres_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1031_GRES_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1031GresPersisted({ revision: -3 }, 2);
    check(results, 'v1031_gres_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1031_gres_scenario_catalog',
    'outage scenario catalog populated',
    V1031_GRES_ALL_OUTAGE_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1031_GRES_evaluateOutageBatch(4, ['outage_000', 'outage_001', 'outage_002']);
    check(
      results,
      'v1031_gres_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanGridStressExposure > 0,
    );
  }

  {
    const r = V1031_GRES_OUTAGE_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1031_gres_scenario_000',
      'scenario 000 evaluate',
      r.gridResilienceScore <= 100 && V1031_GRES_OUTAGE_SCENARIO_000_META.id === 'outage_000',
    );
  }

  check(
    results,
    'v1031_gres_prop_graph',
    'gridBuffer graph hash',
    V1031_GRES_gridBufferGraphHash(V1031_GRES_GENERATED_GRID_BUFFER_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1031_GRES_mergeGridBufferEdges(
      [V1031_GRES_GENERATED_GRID_BUFFER_EDGES[0], V1031_GRES_GENERATED_GRID_BUFFER_EDGES[400]],
      [V1031_GRES_GENERATED_GRID_BUFFER_EDGES[800]],
    );
    check(results, 'v1031_gres_prop_merge', 'gridBuffer merge', merged.length === 3);
  }

  {
    const b = V1031_GRES_SUBSTATION_ZONE_00_buffer(5);
    check(results, 'v1031_gres_substation_zone_buffer', 'substation_zone node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1031GresTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1031_gres_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1031GresSupply20bbBridge(baseInput(), 52);
    const next = applyV1031GresSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1031_gres_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1031GresEnergy20bcBridge(baseInput(), 48);
    const next = applyV1031GresEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1031_gres_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1031GresWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1031GresWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1031_gres_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1031GresTrade20baBridge(baseInput(), 0.2);
    const next = applyV1031GresTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1031_gres_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1031GresPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1031GresPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1031_gres_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1031GresClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1031GresClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1031_gres_substation_zone_adapter',
      '20BR substation zone node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1031GresDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1031GresDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1031_gres_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1031_gres_substation_zone_band', 'substation_zone bands', V1031_GRES_gridResilienceBandFromScore(76) === 'robust');
  check(results, 'v1031_gres_hazard_rank', 'transfer band rank', V1031_GRES_gridResilienceBandRank('critical') === 5);
  check(results, 'v1031_gres_clamp', 'clamp finite', V1031_GRES_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1031_GRES_runOutageScenarioRegressionSweep(3);
    check(results, 'v1031_gres_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1031GresPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1031GresTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1031_gres_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1031GresPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1031GresTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1031_gres_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1031_GRES_LAB_SUITE_ID, results };
}

export function runV1031GresSelfTestsForLab(): V1031GresSelfTestResult[] {
  return runV1031GresSelfTests().results;
}
