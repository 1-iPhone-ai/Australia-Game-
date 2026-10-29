/**
 * LAB suite: v1020_biodiversity_stewardship — state–federal transfer & protected_area fixtures (SECTION 20BU).
 */
import type { V1025BioSelfTestResult, V1025BioTurnInput } from '../types/core';
import { V1025_BIO_SCHEMA_VERSION } from '../types/core';
import {
  runV1025BioTurn,
  createEmptyV1025BioPersisted,
  v1025BioInputHash,
  sanitizeV1025BioPersisted,
} from '../engine/biodiversity-stewardship-orchestrator';
import {
  V1025_BIO_clamp,
  V1025_BIO_stewardshipBandFromScore,
  V1025_BIO_stewardshipBandRank,
} from '../engine/biodiversity-stewardship-utils';
import { computeV1025BioSupply20bbBridge, applyV1025BioSupply20bbBottleneckOverrides } from '../adapters/adapter-v1014-supply-20bb';
import { computeV1025BioTrade20baBridge, applyV1025BioTrade20baLaneOverrides } from '../adapters/adapter-v1014-trade-20ba';
import { computeV1025BioEnergy20bcBridge, applyV1025BioEnergy20bcGridOverrides } from '../adapters/adapter-v1014-energy-20bc';
import { computeV1025BioWorkforce20bfBridge, applyV1025BioWorkforce20bfReadinessOverrides } from '../adapters/adapter-v1014-workforce-20bf';
import { computeV1025BioPublicServices20azBridge, applyV1025BioPublicServices20azServiceOverrides } from '../adapters/adapter-public-services-20az';
import { computeV1025BioClimateAdaptation20brBridge, applyV1025BioClimateAdaptation20brClimateAdaptationOverrides } from '../adapters/adapter-climate-adaptation-20br';
import { V1025_BIO_mergeConservationOffsetEdges, V1025_BIO_conservationOffsetGraphHash } from '../conservation-offset-stacks/graph-utils';
import { V1025_BIO_GENERATED_CONSERVATION_OFFSET_EDGES } from '../generated/conservation-offset-bundle';
import {
  V1025_BIO_ALL_RECOVERY_SCENARIO_IDS,
  V1025_BIO_evaluateRecoveryBatch,
  V1025_BIO_listActiveRecoveryScenarioIds,
  V1025_BIO_runRecoveryScenarioRegressionSweep,
} from '../generated/recovery-registry';
import { V1025_BIO_RECOVERY_SCENARIO_000_evaluate, V1025_BIO_RECOVERY_SCENARIO_000_META } from '../generated/recovery-scenarios/scenario-000';
import { V1025_BIO_PROTECTED_AREA_00_buffer } from '../protected-area-nodes/protected-area-00';
import { V1025_BIO_LAB_SUITE_ID } from '../persistence/keys';

function baseInput(overrides: Partial<V1025BioTurnInput> = {}): V1025BioTurnInput {
  return {
    turn: 1,
    seed: 10200,
    supply20bb: {
      turn: 1,
      bottleneckPressure: 46,
      regionalStockDays: { NSW: 20, QLD: 17 },
      conservationOffsetIndex: 0.44,
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
      invasiveRiskStress: 31,
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
    habitatHeadroom: 57,
    stewardshipPolicyFocus: 46,
    activeRecoveryScenarioIds: V1025_BIO_listActiveRecoveryScenarioIds(1).slice(0, 8),
    activeProtectedAreaIds: ['protected_area_00', 'protected_area_02'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1025BioSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1025BioSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  labSuiteId: string;
  results: V1025BioSelfTestResult[];
} {
  const results: V1025BioSelfTestResult[] = [];

  check(results, 'v1025_bio_lab_id', 'LAB suite id', V1025_BIO_LAB_SUITE_ID === 'v1025_biodiversity_stewardship');

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 10200 + t });
    const out = runV1025BioTurn(inp);
    const id = `v1025_bio_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1025_BIO_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} severity bounded`,
      out.state.aggregateEcosystemStressIndex >= 0 && out.state.aggregateEcosystemStressIndex <= 100,
    );
  }

  check(
    results,
    'v1025_bio_hash_stable',
    'input hash deterministic',
    v1025BioInputHash(baseInput({ turn: 3, seed: 88 })) === v1025BioInputHash(baseInput({ turn: 3, seed: 88 })),
  );

  {
    const p = createEmptyV1025BioPersisted();
    check(
      results,
      'v1025_bio_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1025_BIO_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1025BioPersisted({ revision: -3 }, 2);
    check(results, 'v1025_bio_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(
    results,
    'v1025_bio_scenario_catalog',
    'recovery scenario catalog populated',
    V1025_BIO_ALL_RECOVERY_SCENARIO_IDS.length >= 100,
  );

  {
    const batch = V1025_BIO_evaluateRecoveryBatch(4, ['stress_000', 'stress_001', 'stress_002']);
    check(
      results,
      'v1025_bio_scenario_batch',
      'transfer batch mean',
      batch.snapshots.length === 3 && batch.meanEcosystemStress > 0,
    );
  }

  {
    const r = V1025_BIO_RECOVERY_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1025_bio_scenario_000',
      'scenario 000 evaluate',
      r.stewardshipScore <= 100 && V1025_BIO_RECOVERY_SCENARIO_000_META.id === 'stress_000',
    );
  }

  check(
    results,
    'v1025_bio_prop_graph',
    'conservationOffset graph hash',
    V1025_BIO_conservationOffsetGraphHash(V1025_BIO_GENERATED_CONSERVATION_OFFSET_EDGES).startsWith('pg_'),
  );

  {
    const merged = V1025_BIO_mergeConservationOffsetEdges(
      [V1025_BIO_GENERATED_CONSERVATION_OFFSET_EDGES[0], V1025_BIO_GENERATED_CONSERVATION_OFFSET_EDGES[400]],
      [V1025_BIO_GENERATED_CONSERVATION_OFFSET_EDGES[800]],
    );
    check(results, 'v1025_bio_prop_merge', 'conservationOffset merge', merged.length === 3);
  }

  {
    const b = V1025_BIO_PROTECTED_AREA_00_buffer(5);
    check(results, 'v1025_bio_protected_area_buffer', 'protected_area node buffer bounded', b >= 0 && b <= 1);
  }

  {
    const b = computeV1025BioTrade20baBridge(baseInput(), 0.32);
    check(
      results,
      'v1025_bio_trade_bridge',
      '20BA adapter',
      b.importStressContribution >= 0 && b.importStressContribution <= 1,
    );
  }

  {
    const b = computeV1025BioSupply20bbBridge(baseInput(), 52);
    const next = applyV1025BioSupply20bbBottleneckOverrides({ bottleneckPressure: 40 }, b);
    check(results, 'v1025_bio_supply_override', '20BB override', typeof next.bottleneckPressure === 'number');
  }

  {
    const b = computeV1025BioEnergy20bcBridge(baseInput(), 48);
    const next = applyV1025BioEnergy20bcGridOverrides({ gridStability: 60 }, b);
    check(results, 'v1025_bio_energy_override', '20BC override', typeof next.gridStability === 'number');
  }

  {
    const b = computeV1025BioWorkforce20bfBridge(baseInput(), 44);
    const next = applyV1025BioWorkforce20bfReadinessOverrides({ nationalReadiness: 55 }, b);
    check(results, 'v1025_bio_workforce_override', '20BF override', typeof next.nationalReadiness === 'number');
  }

  {
    const b = computeV1025BioTrade20baBridge(baseInput(), 0.2);
    const next = applyV1025BioTrade20baLaneOverrides({ exportLaneStability: 50 }, b);
    check(results, 'v1025_bio_trade_override', '20BA lane override', typeof next.exportLaneStability === 'number');
  }

  {
    const b = computeV1025BioPublicServices20azBridge(baseInput(), 0.15);
    const next = applyV1025BioPublicServices20azServiceOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1025_bio_handoff_adapter',
      '20AZ handoff adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  {
    const b = computeV1025BioClimateAdaptation20brBridge(baseInput(), 0.18);
    const next = applyV1025BioClimateAdaptation20brClimateAdaptationOverrides({ bottleneckPressure: 40 }, b);
    check(
      results,
      'v1025_bio_protected_area_adapter',
      '20BR protected area node adapter',
      typeof next.bottleneckPressure === 'number' && next.bottleneckPressure !== 40,
    );
  }

  check(results, 'v1025_bio_protected_area_band', 'protected_area bands', V1025_BIO_stewardshipBandFromScore(76) === 'robust');
  check(results, 'v1025_bio_stress_rank', 'transfer band rank', V1025_BIO_stewardshipBandRank('critical') === 5);
  check(results, 'v1025_bio_clamp', 'clamp finite', V1025_BIO_clamp(Number.NaN, 0, 10) === 0);

  {
    const sweep = V1025_BIO_runRecoveryScenarioRegressionSweep(3);
    check(results, 'v1025_bio_regression_sweep', 'scenario regression sweep', sweep >= 100);
  }

  {
    let persisted = createEmptyV1025BioPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1025BioTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1025_bio_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1025BioPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1025BioTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1025_bio_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, labSuiteId: V1025_BIO_LAB_SUITE_ID, results };
}

export function runV1025BioSelfTestsForLab(): V1025BioSelfTestResult[] {
  return runV1025BioSelfTests().results;
}
