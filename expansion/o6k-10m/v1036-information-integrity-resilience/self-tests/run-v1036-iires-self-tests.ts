/**
 * LAB suite: v1020_information_integrity_resilience — state–federal transfer & facility_zone fixtures (SECTION 20CI).
 */
import type { V1036IiresSelfTestResult, V1036IiresTurnInput } from '../types/core';
import { V1036_IIRES_SCHEMA_VERSION } from '../types/core';
import {
  runV1036IiresTurn,
  createEmptyV1036IiresPersisted,
  v1036IiresInputHash,
  sanitizeV1036IiresPersisted,
} from '../engine/information-integrity-resilience-orchestrator';
import {
  V1036_IIRES_clamp,
  V1036_IIRES_informationIntegrityResilienceBandFromScore,
  V1036_IIRES_informationIntegrityResilienceBandRank,
} from '../engine/information-integrity-resilience-utils';
import { computeV1036IiresSupply20bbBridge, applyV1036IiresSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1036IiresTrade20baBridge, applyV1036IiresTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1036IiresEnergy20bcBridge, applyV1036IiresEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1036IiresWorkforce20bfBridge, applyV1036IiresWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1036IiresPublicServices20azBridge, applyV1036IiresPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1036IiresClimateAdaptation20brBridge, applyV1036IiresClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1036IiresDigitalGovernance20btBridge, applyV1036IiresDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { computeV1036IiresBiodiversityStewardship20buBridge, applyV1036IiresBiodiversityStewardship20buOverrides } from '../adapters/adapter-regional-health-systems-20bv';
import { V1036_IIRES_mergeAttestationMeshEdges, V1036_IIRES_attestationMeshGraphHash } from '../attestation-mesh-stacks/graph-utils';
import { V1036_IIRES_GENERATED_ATTESTATION_MESH_EDGES } from '../generated/attestation-mesh-bundle';
import {
  V1036_IIRES_ALL_ATTESTATION_SCENARIO_IDS,
  V1036_IIRES_evaluateAttestationBatch,
  V1036_IIRES_listActiveAttestationScenarioIds,
  V1036_IIRES_runAttestationScenarioRegressionSweep,
} from '../generated/attestation-registry';
import { V1036_IIRES_ATTESTATION_SCENARIO_000_evaluate, V1036_IIRES_ATTESTATION_SCENARIO_000_META } from '../generated/attestation-scenarios/scenario-000';
import { V1036_IIRES_FACILITY_ZONE_00_buffer } from '../facility-zone-nodes/facility-zone-00';
import { V1036_IIRES_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1036IiresTurnInput> = {}): V1036IiresTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      attestationMeshIndex: 0.44,
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
    sovereignCyberResilience20cg: {
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
    informationIntegrityResiliencePolicyFocus: 46,
    activeAttestationScenarioIds: V1036_IIRES_listActiveAttestationScenarioIds(1).slice(0, 8),
    activeFacilityZoneIds: ['facility_zone_00', 'facility_zone_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1036IiresSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1036IiresSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1036IiresSelfTestResult[];
} {
  const results: V1036IiresSelfTestResult[] = [];

  check(results, 'v1036_iires_lab_id', 'LAB suite id', V1036_IIRES_LAB_SUITE_ID === 'v1036_information_integrity_resilience');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1036IiresTurn(inp);
    const id = `v1036_iires_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1036_IIRES_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateAttestationMeshStressExposureIndex >= 0 && out.state.aggregateAttestationMeshStressExposureIndex <= 100,
    );
  }

  check(
    results,
    'v1036_iires_hash_stable',
    'input hash deterministic',
    v1036IiresInputHash(baseInput({ turn: 3, seed: 88 })) === v1036IiresInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1036IiresPersisted();
    check(
      results,
      'v1036_iires_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1036_IIRES_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1036IiresPersisted({ revision: -3 }, 2);
    check(results, 'v1036_iires_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1036_iires_scenario_catalog',
    'attestation integrity scenario catalog populated',
    V1036_IIRES_ALL_ATTESTATION_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1036_IIRES_evaluateAttestationBatch(4, ['attestation_000', 'attestation_001', 'attestation_002']);
    check(
      results,
      'v1036_iires_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanAttestationMeshStressExposure > 0,
    );
  }

  {
    const r = V1036_IIRES_ATTESTATION_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1036_iires_scenario_000',
      'scenario 000 evaluate',
      r.informationIntegrityResilienceScore <= 100 && V1036_IIRES_ATTESTATION_SCENARIO_000_META.id === 'attestation_000',
    );
  }

  check(
    results,
    'v1036_iires_prop_graph',
    'attestationMesh graph hash',
    V1036_IIRES_attestationMeshGraphHash(V1036_IIRES_GENERATED_ATTESTATION_MESH_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1036_IIRES_mergeAttestationMeshEdges(
      [V1036_IIRES_GENERATED_ATTESTATION_MESH_EDGES[0], V1036_IIRES_GENERATED_ATTESTATION_MESH_EDGES[400]],
      [V1036_IIRES_GENERATED_ATTESTATION_MESH_EDGES[800]],
    );
    check(results, 'v1036_iires_prop_merge', 'attestationMesh merge', merged.length === 3);
  }

  {
    const b = V1036_IIRES_FACILITY_ZONE_00_buffer(5);
    check(results, 'v1036_iires_facility_zone_buffer', 'facility_zone node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1036IiresTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1036_iires_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1036IiresSupply20bbBridge(baseInput(), 52);
    const next = applyV1036IiresSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1036_iires_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1036IiresEnergy20bcBridge(baseInput(), 48);
    const next = applyV1036IiresEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1036_iires_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1036IiresWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1036IiresWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1036_iires_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1036IiresTrade20baBridge(baseInput(), 0.2);
    const next = applyV1036IiresTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1036_iires_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1036IiresPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1036IiresPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1036_iires_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1036IiresClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1036IiresClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1036_iires_facility_zone_adapter',
      '20BR facility zone node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1036IiresDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1036IiresDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1036_iires_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1036_iires_facility_zone_band', 'facility_zone bands', V1036_IIRES_informationIntegrityResilienceBandFromScore(76) === 'robust');
  check(results, 'v1036_iires_hazard_rank', 'transfer band rank', V1036_IIRES_informationIntegrityResilienceBandRank('critical') === 5);
  check(results, 'v1036_iires_clamp', 'clamp finite', V1036_IIRES_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1036_IIRES_runAttestationScenarioRegressionSweep(3);
    check(results, 'v1036_iires_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1036IiresPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1036IiresTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1036_iires_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1036IiresPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1036IiresTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1036_iires_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1036_IIRES_LAB_SUITE_ID, results };
}

export function runV1036IiresSelfTestsForLab(): V1036IiresSelfTestResult[] {
  return runV1036IiresSelfTests().results;
}
