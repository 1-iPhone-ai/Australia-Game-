/**
 * Turn orchestrator — workforce migration v2 (20AC part 4), post–§11A.
 */
import type {
  V1014WorkforcePersisted,
  V1014WorkforceTurnInput,
  V1014WorkforceTurnResult,
  V1014WorkforceRegionId,
} from '../types/core';
import {
  V1014_WORKFORCE_clamp,
  V1014_WORKFORCE_hash,
  V1014_WORKFORCE_mixSeed,
  V1014_WORKFORCE_readinessFromScore,
  V1014_WORKFORCE_weightedMean,
} from './workforce-migration-utils';
import {
  createEmptyV1014WorkforceMigrationPersisted,
  sanitizeV1014WorkforceMigrationPersisted,
} from '../persistence/migrations';
import {
  buildV1014WorkforceMigrationBriefing,
  readV1014WorkforceAc20Bridge,
  readV1014WorkforceAf20Bridge,
  readV1014WorkforceAj20Bridge,
} from '../adapters/adapter-20ac-workforce';
import { computeV1014WorkforceAf20HouseholdBridge } from '../adapters/adapter-20af-household';
import { V1014_WORKFORCE_skillsGraphHash } from '../skills-graph/graph-utils';
import { V1014_WORKFORCE_GENERATED_SKILLS_EDGES } from '../generated/skills-graph-bundle';
import {
  V1014_WORKFORCE_evaluateMigrationScenarioBatch,
  V1014_WORKFORCE_listActiveScenarioIds,
} from '../generated/migration-scenario-registry';

const REGIONS: V1014WorkforceRegionId[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

export function v1014WorkforceMigrationInputHash(input: V1014WorkforceTurnInput): string {
  return V1014_WORKFORCE_hash({
    turn: input.turn,
    seed: input.seed,
    flow: input.aj20.migrationFlowBand,
    readiness: input.ac20.nationalReadiness,
    scenarios: input.activeScenarioIds.slice(0, 12),
    corridors: input.activeCorridorIds.slice(0, 12),
  });
}

export function runV1014WorkforceMigrationTurn(input: V1014WorkforceTurnInput): V1014WorkforceTurnResult {
  const persisted = sanitizeV1014WorkforceMigrationPersisted(
    input.persisted ?? createEmptyV1014WorkforceMigrationPersisted(),
    input.turn,
  );

  const mix = V1014_WORKFORCE_mixSeed(input.seed, input.turn, 'workforce_migration_v2');
  const scenarioIds =
    input.activeScenarioIds.length > 0 ? input.activeScenarioIds : V1014_WORKFORCE_listActiveScenarioIds(input.turn);
  const scenarioBatch = V1014_WORKFORCE_evaluateMigrationScenarioBatch(input.turn, scenarioIds);

  let aggregateMismatch = V1014_WORKFORCE_clamp(
    scenarioBatch.meanMismatch * 0.55 +
      (100 - input.ac20.nationalReadiness) * 0.22 +
      input.aj20.wagePressureIndex * 0.08 +
      mix * 6,
    0,
    100,
  );

  const migrationPressure = V1014_WORKFORCE_clamp(
    scenarioBatch.meanNetInflow * 0.04 + (input.aj20.visaBacklogTurns ?? 0) * 0.02,
    0,
    1,
  );

  const acBridge = readV1014WorkforceAc20Bridge(input.ac20, aggregateMismatch);
  const ajBridge = readV1014WorkforceAj20Bridge(input.aj20, migrationPressure);
  const afBridge = readV1014WorkforceAf20Bridge(input.af20, aggregateMismatch);
  const householdBridge = computeV1014WorkforceAf20HouseholdBridge(input, aggregateMismatch);

  const nationalReadiness = V1014_WORKFORCE_clamp(
    input.ac20.nationalReadiness + acBridge.readinessDelta - aggregateMismatch * 0.08 + input.policyRetrainFocus * 0.04,
    0,
    100,
  );

  const skillsGraphHash = V1014_WORKFORCE_skillsGraphHash(V1014_WORKFORCE_GENERATED_SKILLS_EDGES);
  const inputHash = v1014WorkforceMigrationInputHash(input);
  const briefing = buildV1014WorkforceMigrationBriefing(input, aggregateMismatch, nationalReadiness);

  const regionalAggregates = { ...persisted.regionalAggregates };
  REGIONS.forEach((region, idx) => {
    const prior = regionalAggregates[region] ?? {
      queuePressure: 40,
      mismatchIndex: 40,
      migrationLoopGain: 0.5,
      compositeReadiness: 50,
    };
    const regionalScenario = scenarioBatch.byRegion[region];
    const mismatchIndex = V1014_WORKFORCE_clamp(
      prior.mismatchIndex * 0.65 +
        (regionalScenario?.skillMismatchIndex ?? aggregateMismatch) * 0.35 +
        ajBridge.wagePressureContribution * 12,
      0,
      100,
    );
    const compositeReadiness = V1014_WORKFORCE_clamp(
      V1014_WORKFORCE_weightedMean([
        { weight: 1.2, value: nationalReadiness - idx * 0.2 },
        { weight: 0.8, value: 100 - mismatchIndex },
        { weight: 0.5, value: input.af20.regionalLivingStandard?.[region] ?? 52 },
      ]),
      0,
      100,
    );
    regionalAggregates[region] = {
      queuePressure: V1014_WORKFORCE_clamp(prior.queuePressure + scenarioBatch.meanNetInflow * 0.02, 0, 100),
      mismatchIndex,
      migrationLoopGain: V1014_WORKFORCE_clamp(
        prior.migrationLoopGain + (regionalScenario?.netInflow ?? 0) * 0.001,
        0,
        2,
      ),
      compositeReadiness,
    };
  });

  const migrationSnapshots = { ...persisted.migrationSnapshots };
  scenarioBatch.snapshots.forEach((snap) => {
    migrationSnapshots[snap.scenarioId] = snap;
  });

  const nextPersisted: V1014WorkforcePersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    skillsGraphRevision: persisted.skillsGraphRevision + 1,
    migrationSnapshots,
    regionalAggregates,
    historyTail: [
      ...persisted.historyTail.slice(-11),
      { turn: input.turn, inputHash, aggregateMismatch },
    ],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: briefing.slice(0, 280),
    },
  };

  const worldEvents =
    aggregateMismatch > 62
      ? [
          {
            id: `wf_mis_${input.turn}`,
            turn: input.turn,
            kind: 'workforce',
            title: 'Skills mismatch elevated',
            summary: `Mismatch ${aggregateMismatch.toFixed(1)}; readiness ${nationalReadiness.toFixed(1)}.`,
          },
        ]
      : [];

  if (migrationPressure > 0.42) {
    worldEvents.push({
      id: `wf_mig_${input.turn}`,
      turn: input.turn,
      kind: 'migration',
      title: 'Migration corridor pressure',
      summary: `Flow band ${ajBridge.flowBandHint}; wage pressure ${ajBridge.wagePressureContribution.toFixed(2)}.`,
    });
  }

  void householdBridge;
  void afBridge;
  void V1014_WORKFORCE_readinessFromScore(nationalReadiness);

  return {
    state: {
      turn: input.turn,
      aggregateMismatchIndex: aggregateMismatch,
      aggregateMigrationPressure: migrationPressure,
      nationalReadinessScore: nationalReadiness,
      householdLaborIncomeEffect: householdBridge.affordabilityDrag,
      skillsGraphHash,
      inputHash,
      briefing,
    },
    persisted: nextPersisted,
    worldEvents,
  };
}

export { createEmptyV1014WorkforceMigrationPersisted, sanitizeV1014WorkforceMigrationPersisted };
