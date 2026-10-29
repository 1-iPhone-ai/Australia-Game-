/**
 * LAB suite: v1020_provenance_chain_resilience — state–federal transfer & facility_zone fixtures (SECTION 20CK).
 */
import type { V1037PcresSelfTestResult, V1037PcresTurnInput } from '../types/core';
import { V1037_PCRS_SCHEMA_VERSION } from '../types/core';
import {
  runV1037PcresTurn,
  createEmptyV1037PcresPersisted,
  v1037PcresInputHash,
  sanitizeV1037PcresPersisted,
} from '../engine/provenance-chain-resilience-orchestrator';
import {
  V1037_PCRS_clamp,
  V1037_PCRS_provenanceChainResilienceBandFromScore,
  V1037_PCRS_provenanceChainResilienceBandRank,
} from '../engine/provenance-chain-resilience-utils';
import { computeV1037PcresSupply20bbBridge, applyV1037PcresSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1037PcresTrade20baBridge, applyV1037PcresTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1037PcresEnergy20bcBridge, applyV1037PcresEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1037PcresWorkforce20bfBridge, applyV1037PcresWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1037PcresPublicServices20azBridge, applyV1037PcresPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1037PcresClimateAdaptation20brBridge, applyV1037PcresClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { computeV1037PcresDigitalGovernance20btBridge, applyV1037PcresDigitalGovernance20btDigitalGovernanceOverrides } from '../adapters/adapter-digital-governance-20bt';
import { computeV1037PcresBiodiversityStewardship20buBridge, applyV1037PcresBiodiversityStewardship20buOverrides } from '../adapters/adapter-regional-health-systems-20bv';
import { V1037_PCRS_mergeCustodyChainMeshEdges, V1037_PCRS_custodyChainMeshGraphHash } from '../custody-chain-mesh-stacks/graph-utils';
import { V1037_PCRS_GENERATED_CUSTODY_CHAIN_MESH_EDGES } from '../generated/custody-chain-mesh-bundle';
import {
  V1037_PCRS_ALL_CUSTODY_SCENARIO_IDS,
  V1037_PCRS_evaluateCustodyBatch,
  V1037_PCRS_listActiveCustodyScenarioIds,
  V1037_PCRS_runCustodyScenarioRegressionSweep,
} from '../generated/custody-registry';
import { V1037_PCRS_CUSTODY_SCENARIO_000_evaluate, V1037_PCRS_CUSTODY_SCENARIO_000_META } from '../generated/custody-scenarios/scenario-000';
import { V1037_PCRS_FACILITY_ZONE_00_buffer } from '../facility-zone-nodes/facility-zone-00';
import { V1037_PCRS_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1037PcresTurnInput> = {}): V1037PcresTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      custodyChainMeshIndex: 0.44,
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
    informationIntegrityResilience20ci: {
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
    provenanceChainResiliencePolicyFocus: 46,
    activeCustodyScenarioIds: V1037_PCRS_listActiveCustodyScenarioIds(1).slice(0, 8),
    activeFacilityZoneIds: ['facility_zone_00', 'facility_zone_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1037PcresSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1037PcresSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1037PcresSelfTestResult[];
} {
  const results: V1037PcresSelfTestResult[] = [];

  check(results, 'v1037_pcres_lab_id', 'LAB suite id', V1037_PCRS_LAB_SUITE_ID === 'v1037_provenance_chain_resilience');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1037PcresTurn(inp);
    const id = `v1037_pcres_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1037_PCRS_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateCustodyChainStressExposureIndex >= 0 && out.state.aggregateCustodyChainStressExposureIndex <= 100,
    );
  }

  check(
    results,
    'v1037_pcres_hash_stable',
    'input hash deterministic',
    v1037PcresInputHash(baseInput({ turn: 3, seed: 88 })) === v1037PcresInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1037PcresPersisted();
    check(
      results,
      'v1037_pcres_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1037_PCRS_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1037PcresPersisted({ revision: -3 }, 2);
    check(results, 'v1037_pcres_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1037_pcres_scenario_catalog',
    'chain-of-custody incident scenario catalog populated',
    V1037_PCRS_ALL_CUSTODY_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1037_PCRS_evaluateCustodyBatch(4, ['custody_000', 'custody_001', 'custody_002']);
    check(
      results,
      'v1037_pcres_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanCustodyChainStressExposure > 0,
    );
  }

  {
    const r = V1037_PCRS_CUSTODY_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1037_pcres_scenario_000',
      'scenario 000 evaluate',
      r.provenanceChainResilienceScore <= 100 && V1037_PCRS_CUSTODY_SCENARIO_000_META.id === 'custody_000',
    );
  }

  check(
    results,
    'v1037_pcres_prop_graph',
    'custodyChainMesh graph hash',
    V1037_PCRS_custodyChainMeshGraphHash(V1037_PCRS_GENERATED_CUSTODY_CHAIN_MESH_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1037_PCRS_mergeCustodyChainMeshEdges(
      [V1037_PCRS_GENERATED_CUSTODY_CHAIN_MESH_EDGES[0], V1037_PCRS_GENERATED_CUSTODY_CHAIN_MESH_EDGES[400]],
      [V1037_PCRS_GENERATED_CUSTODY_CHAIN_MESH_EDGES[800]],
    );
    check(results, 'v1037_pcres_prop_merge', 'custodyChainMesh merge', merged.length === 3);
  }

  {
    const b = V1037_PCRS_FACILITY_ZONE_00_buffer(5);
    check(results, 'v1037_pcres_facility_zone_buffer', 'facility_zone node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1037PcresTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1037_pcres_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1037PcresSupply20bbBridge(baseInput(), 52);
    const next = applyV1037PcresSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1037_pcres_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1037PcresEnergy20bcBridge(baseInput(), 48);
    const next = applyV1037PcresEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1037_pcres_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1037PcresWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1037PcresWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1037_pcres_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1037PcresTrade20baBridge(baseInput(), 0.2);
    const next = applyV1037PcresTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1037_pcres_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1037PcresPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1037PcresPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1037_pcres_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1037PcresClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1037PcresClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1037_pcres_facility_zone_adapter',
      '20BR facility zone node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1037PcresDigitalGovernance20btBridge(baseInput(), 0.22);
    const next = applyV1037PcresDigitalGovernance20btDigitalGovernanceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1037_pcres_20bt_dgov',
      '20BT digital governance adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1037_pcres_facility_zone_band', 'facility_zone bands', V1037_PCRS_provenanceChainResilienceBandFromScore(76) === 'robust');
  check(results, 'v1037_pcres_hazard_rank', 'transfer band rank', V1037_PCRS_provenanceChainResilienceBandRank('critical') === 5);
  check(results, 'v1037_pcres_clamp', 'clamp finite', V1037_PCRS_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1037_PCRS_runCustodyScenarioRegressionSweep(3);
    check(results, 'v1037_pcres_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1037PcresPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1037PcresTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1037_pcres_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1037PcresPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1037PcresTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1037_pcres_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1037_PCRS_LAB_SUITE_ID, results };
}

export function runV1037PcresSelfTestsForLab(): V1037PcresSelfTestResult[] {
  return runV1037PcresSelfTests().results;
}
