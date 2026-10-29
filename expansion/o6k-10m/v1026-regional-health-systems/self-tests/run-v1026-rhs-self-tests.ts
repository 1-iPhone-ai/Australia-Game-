/**
 * LAB suite: v1020_regional_health_systems — state–federal transfer & hospital_network fixtures (SECTION 20BV).
 */
import type { V1026RhsSelfTestResult, V1026RhsTurnInput } from '../types/core';
import { V1026_RHS_SCHEMA_VERSION } from '../types/core';
import {
  runV1026RhsTurn,
  createEmptyV1026RhsPersisted,
  v1026RhsInputHash,
  sanitizeV1026RhsPersisted,
} from '../engine/regional-health-systems-orchestrator';
import {
  V1026_RHS_clamp,
  V1026_RHS_healthSystemBandFromScore,
  V1026_RHS_healthSystemBandRank,
} from '../engine/regional-health-systems-utils';
import { computeV1026RhsSupply20bbBridge, applyV1026RhsSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1026RhsTrade20baBridge, applyV1026RhsTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1026RhsEnergy20bcBridge, applyV1026RhsEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1026RhsWorkforce20bfBridge, applyV1026RhsWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1026RhsPublicServices20azBridge, applyV1026RhsPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1026RhsClimateAdaptation20brBridge, applyV1026RhsClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1026RhsDigitalGovernance20btBridge, applyV1026RhsDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { V1026_RHS_mergePrimaryCareAccessEdges, V1026_RHS_primaryCareAccessGraphHash } from '../primary-care-access-stacks/graph-utils';
import { V1026_RHS_GENERATED_PRIMARY_CARE_ACCESS_EDGES } from '../generated/primary-care-access-bundle';
import {
  V1026_RHS_ALL_CARE_SCENARIO_IDS,
  V1026_RHS_evaluateCareBatch,
  V1026_RHS_listActiveCareScenarioIds,
  V1026_RHS_runCareScenarioRegressionSweep,
} from '../generated/care-registry';
import { V1026_RHS_CARE_SCENARIO_000_evaluate, V1026_RHS_CARE_SCENARIO_000_META } from '../generated/care-scenarios/scenario-000';
import { V1026_RHS_HOSPITAL_NETWORK_00_buffer } from '../hospital-network-nodes/hospital-network-00';
import { V1026_RHS_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1026RhsTurnInput> = {}): V1026RhsTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      primaryCareAccessIndex: 0.44,
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
      surgeRiskStress: 31,
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
    bedHeadroom: 57,
    healthPolicyFocus: 46,
    activeCareScenarioIds: V1026_RHS_listActiveCareScenarioIds(1).slice(0, 8),
    activeHospitalNetworkIds: ['hospital_network_00', 'hospital_network_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1026RhsSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1026RhsSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1026RhsSelfTestResult[];
} {
  const results: V1026RhsSelfTestResult[] = [];

  check(results, 'v1026_rhs_lab_id', 'LAB suite id', V1026_RHS_LAB_SUITE_ID === 'v1026_regional_health_systems');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1026RhsTurn(inp);
    const id = `v1026_rhs_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1026_RHS_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateCapacityStressIndex >= 0 && out.state.aggregateCapacityStressIndex <= 100,
    );
  }

  check(
    results,
    'v1026_rhs_hash_stable',
    'input hash deterministic',
    v1026RhsInputHash(baseInput({ turn: 3, seed: 88 })) === v1026RhsInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1026RhsPersisted();
    check(
      results,
      'v1026_rhs_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1026_RHS_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1026RhsPersisted({ revision: -3 }, 2);
    check(results, 'v1026_rhs_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1026_rhs_scenario_catalog',
    'care scenario catalog populated',
    V1026_RHS_ALL_CARE_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1026_RHS_evaluateCareBatch(4, ['stress_000', 'stress_001', 'stress_002']);
    check(
      results,
      'v1026_rhs_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanCapacityStress > 0,
    );
  }

  {
    const r = V1026_RHS_CARE_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1026_rhs_scenario_000',
      'scenario 000 evaluate',
      r.healthSystemScore <= 100 && V1026_RHS_CARE_SCENARIO_000_META.id === 'stress_000',
    );
  }

  check(
    results,
    'v1026_rhs_prop_graph',
    'primaryCareAccess graph hash',
    V1026_RHS_primaryCareAccessGraphHash(V1026_RHS_GENERATED_PRIMARY_CARE_ACCESS_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1026_RHS_mergePrimaryCareAccessEdges(
      [V1026_RHS_GENERATED_PRIMARY_CARE_ACCESS_EDGES[0], V1026_RHS_GENERATED_PRIMARY_CARE_ACCESS_EDGES[400]],
      [V1026_RHS_GENERATED_PRIMARY_CARE_ACCESS_EDGES[800]],
    );
    check(results, 'v1026_rhs_prop_merge', 'primaryCareAccess merge', merged.length === 3);
  }

  {
    const b = V1026_RHS_HOSPITAL_NETWORK_00_buffer(5);
    check(results, 'v1026_rhs_hospital_network_buffer', 'hospital_network node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1026RhsTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1026_rhs_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1026RhsSupply20bbBridge(baseInput(), 52);
    const next = applyV1026RhsSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1026_rhs_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1026RhsEnergy20bcBridge(baseInput(), 48);
    const next = applyV1026RhsEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1026_rhs_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1026RhsWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1026RhsWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1026_rhs_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1026RhsTrade20baBridge(baseInput(), 0.2);
    const next = applyV1026RhsTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1026_rhs_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1026RhsPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1026RhsPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1026_rhs_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1026RhsClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1026RhsClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1026_rhs_hospital_network_adapter',
      '20BR hospital network node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1026RhsDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1026RhsDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1026_rhs_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1026_rhs_hospital_network_band', 'hospital_network bands', V1026_RHS_healthSystemBandFromScore(76) === 'robust');
  check(results, 'v1026_rhs_stress_rank', 'transfer band rank', V1026_RHS_healthSystemBandRank('critical') === 5);
  check(results, 'v1026_rhs_clamp', 'clamp finite', V1026_RHS_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1026_RHS_runCareScenarioRegressionSweep(3);
    check(results, 'v1026_rhs_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1026RhsPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1026RhsTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1026_rhs_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1026RhsPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1026RhsTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1026_rhs_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1026_RHS_LAB_SUITE_ID, results };
}

export function runV1026RhsSelfTestsForLab(): V1026RhsSelfTestResult[] {
  return runV1026RhsSelfTests().results;
}
