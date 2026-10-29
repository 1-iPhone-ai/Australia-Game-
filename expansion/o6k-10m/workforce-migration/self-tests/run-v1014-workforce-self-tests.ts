/**
 * LAB suite: v1014_workforce_v2 — deterministic workforce–migration fixtures (20AC part 4).
 */
import type { V1014WorkforceSelfTestResult, V1014WorkforceTurnInput } from '../types/core';
import { V1014_WORKFORCE_SCHEMA_VERSION } from '../types/core';
import {
  runV1014WorkforceMigrationTurn,
  createEmptyV1014WorkforceMigrationPersisted,
  v1014WorkforceMigrationInputHash,
  sanitizeV1014WorkforceMigrationPersisted,
} from '../engine/workforce-migration-orchestrator';
import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../engine/workforce-migration-utils';
import { computeV1014WorkforceAf20HouseholdBridge, applyV1014WorkforceAf20DemandOverrides } from '../adapters/adapter-20af-household';
import { computeV1014WorkforceAj20MigrationDelta } from '../adapters/adapter-20aj-labor';
import { V1014_WORKFORCE_mergeSkillsEdges, V1014_WORKFORCE_skillsGraphHash } from '../skills-graph/graph-utils';
import { V1014_WORKFORCE_GENERATED_SKILLS_EDGES } from '../generated/skills-graph-bundle';
import {
  V1014_WORKFORCE_ALL_SCENARIO_IDS,
  V1014_WORKFORCE_evaluateMigrationScenarioBatch,
  V1014_WORKFORCE_listActiveScenarioIds,
} from '../generated/migration-scenario-registry';
import { V1014_WORKFORCE_MIG_SCENARIO_000_evaluate, V1014_WORKFORCE_MIG_SCENARIO_000_META } from '../generated/migration-scenarios/scenario-000';
import { V1014_WORKFORCE_CORRIDOR_00_pressure } from '../migration-corridors/corridor-00';

function baseInput(overrides: Partial<V1014WorkforceTurnInput> = {}): V1014WorkforceTurnInput {
  return {
    turn: 1,
    seed: 5150,
    ac20: {
      turn: 1,
      nationalReadiness: 58,
      specialistGap: 32,
      regionalSkillSupply: { NSW: 54, VIC: 52 },
    },
    aj20: {
      turn: 1,
      migrationFlowBand: 'balanced',
      regionalAttractiveness: { NSW: 55, QLD: 48 },
      wagePressureIndex: 46,
      visaBacklogTurns: 3,
    },
    af20: {
      turn: 1,
      affordabilityStress: 41,
      regionalLivingStandard: { NSW: 53, WA: 49 },
      domesticDemandPull: 50,
    },
    fiscalHeadroom: 58,
    policyRetrainFocus: 44,
    activeScenarioIds: V1014_WORKFORCE_listActiveScenarioIds(1).slice(0, 8),
    activeCorridorIds: ['corr_00', 'corr_01'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1014WorkforceSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1014WorkforceMigrationSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: V1014WorkforceSelfTestResult[];
} {
  const results: V1014WorkforceSelfTestResult[] = [];

  for (let t = 1; t <= 20; t++) {
    const inp = baseInput({ turn: t, seed: 5000 + t });
    const out = runV1014WorkforceMigrationTurn(inp);
    const id = `v1014_wf_${String(t).padStart(2, '0')}`;
    check(results, id, `turn ${t} hash`, out.state.inputHash.length > 8);
    check(results, `${id}b`, `turn ${t} schema`, out.persisted.schemaVersion === V1014_WORKFORCE_SCHEMA_VERSION);
    check(
      results,
      `${id}c`,
      `turn ${t} mismatch bounded`,
      out.state.aggregateMismatchIndex >= 0 && out.state.aggregateMismatchIndex <= 100,
    );
  }

  check(
    results,
    'v1014_wf_hash_stable',
    'input hash deterministic',
    v1014WorkforceMigrationInputHash(baseInput({ turn: 3, seed: 77 })) ===
      v1014WorkforceMigrationInputHash(baseInput({ turn: 3, seed: 77 })),
  );

  {
    const p = createEmptyV1014WorkforceMigrationPersisted();
    check(
      results,
      'v1014_wf_persist_empty',
      'empty persisted factory',
      p.revision === 0 && p.schemaVersion === V1014_WORKFORCE_SCHEMA_VERSION,
    );
  }

  {
    const p = sanitizeV1014WorkforceMigrationPersisted({ revision: -5 }, 2);
    check(results, 'v1014_wf_sanitize', 'sanitize clamps revision', p.revision >= 0);
  }

  check(results, 'v1014_wf_scenario_catalog', 'scenario catalog populated', V1014_WORKFORCE_ALL_SCENARIO_IDS.length >= 100);
  {
    const batch = V1014_WORKFORCE_evaluateMigrationScenarioBatch(4, ['mig_000', 'mig_001', 'mig_002']);
    check(
      results,
      'v1014_wf_scenario_batch',
      'scenario batch mean',
      batch.snapshots.length === 3 && batch.meanMismatch > 0,
    );
  }

  {
    const r = V1014_WORKFORCE_MIG_SCENARIO_000_evaluate(2);
    check(
      results,
      'v1014_wf_scenario_000',
      'scenario 000 evaluate',
      r.skillMismatchIndex <= 100 && V1014_WORKFORCE_MIG_SCENARIO_000_META.id === 'mig_000',
    );
  }

  check(results, 'v1014_wf_skills_graph', 'skills graph hash', V1014_WORKFORCE_skillsGraphHash(V1014_WORKFORCE_GENERATED_SKILLS_EDGES).startsWith('wf_'));
  {
    const merged = V1014_WORKFORCE_mergeSkillsEdges(
      [V1014_WORKFORCE_GENERATED_SKILLS_EDGES[0], V1014_WORKFORCE_GENERATED_SKILLS_EDGES[500]],
      [V1014_WORKFORCE_GENERATED_SKILLS_EDGES[1000]],
    );
    check(results, 'v1014_wf_skills_merge', 'skills merge dedupe', merged.length === 3);
  }

  {
    const p = V1014_WORKFORCE_CORRIDOR_00_pressure(5);
    check(results, 'v1014_wf_corridor', 'corridor pressure bounded', p >= 0 && p <= 1);
  }

  {
    const b = computeV1014WorkforceAj20MigrationDelta(baseInput(), 0.3);
    check(
      results,
      'v1014_wf_aj_bridge',
      '20AJ adapter',
      b.wagePressureContribution >= 0 && b.wagePressureContribution <= 1,
    );
  }

  {
    const b = computeV1014WorkforceAf20HouseholdBridge(baseInput(), 55);
    check(
      results,
      'v1014_wf_af_bridge',
      '20AF adapter',
      b.domesticDemandMultiplier >= 0.5 && b.domesticDemandMultiplier <= 1.25,
    );
  }

  {
    const b = computeV1014WorkforceAf20HouseholdBridge(baseInput(), 40);
    const next = applyV1014WorkforceAf20DemandOverrides({ consumptionElasticity: 1 }, b);
    check(results, 'v1014_wf_af_override', '20AF override elasticity', typeof next.consumptionElasticity === 'number');
  }

  check(results, 'v1014_wf_readiness_band', 'readiness bands', V1014_WORKFORCE_readinessFromScore(75) === 'strong');
  check(results, 'v1014_wf_clamp', 'clamp finite', V1014_WORKFORCE_clamp(Number.NaN, 0, 10) === 0);

  {
    let persisted = createEmptyV1014WorkforceMigrationPersisted();
    for (let turn = 1; turn <= 4; turn++) {
      const out = runV1014WorkforceMigrationTurn(baseInput({ turn, persisted }));
      persisted = out.persisted;
    }
    check(
      results,
      'v1014_wf_multi_turn',
      'multi-turn persistence revision',
      persisted.revision === 4 && persisted.lastProcessedTurn === 4,
    );
  }

  {
    let persisted = createEmptyV1014WorkforceMigrationPersisted();
    for (let turn = 1; turn <= 20; turn++) {
      persisted = runV1014WorkforceMigrationTurn(baseInput({ turn, persisted })).persisted;
    }
    check(results, 'v1014_wf_history_tail', 'history tail depth', persisted.historyTail.length <= 12);
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, results };
}

export function runV1014WorkforceMigrationSelfTestsForLab(): V1014WorkforceSelfTestResult[] {
  return runV1014WorkforceMigrationSelfTests().results;
}
