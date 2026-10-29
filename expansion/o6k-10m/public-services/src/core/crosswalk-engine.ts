import {
  V1014_PUBSVC_apply20AFStressToFiscal,
  V1014_PUBSVC_apply20AJToPolicyFocus,
  V1014_PUBSVC_extractDemandFrom20AP,
  V1014_PUBSVC_extractQueueBaselinesFrom20AP,
  V1014_PUBSVC_mergeCrosswalkInputs,
} from '../adapters/crosswalk-adapters.ts';
import { V1014_PUBSVC_LIMITS, V1014_PUBSVC_PILLAR_WEIGHT, V1014_PUBSVC_REGION_WEIGHT } from '../core/constants.ts';
import { V1014_PUBSVC_clamp, V1014_PUBSVC_weightedMean } from '../core/math.ts';
import {
  V1014_PUBSVC_buildMigrationFeedbackGrid,
  V1014_PUBSVC_nationalMigrationLoop,
} from '../migration/migration-feedback-engine.ts';
import {
  V1014_PUBSVC_rollSection6History,
  V1014_PUBSVC_migrateSection6Persisted,
} from '../persistence/section6-regional-aggregates.ts';
import {
  V1014_PUBSVC_buildInitialQueueGrid,
  V1014_PUBSVC_computeQueueStep,
  V1014_PUBSVC_nationalQueuePressure,
} from '../queues/delivery-queue-engine.ts';
import {
  V1014_PUBSVC_buildSkillMismatchGrid,
  V1014_PUBSVC_nationalSkillMismatch,
} from '../skills/skill-mismatch-engine.ts';
import {
  V1014_PUBSVC_SCHEMA_VERSION,
  V1014_PUBSVC_CORE_REGIONS,
} from '../core/types.ts';
import type {
  V1014PubsSvcCrosswalkInputs,
  V1014PubsSvcNationalSnapshot,
  V1014PubsSvcPillar,
  V1014PubsSvcRegionalAggregate,
  V1014PubsSvcRegionId,
  V1014PubsSvcSection6Persisted,
  V1014PubsSvcTickResult,
} from '../core/types.ts';

const PILLARS: V1014PubsSvcPillar[] = ['housing', 'healthcare', 'education'];

function V1014_PUBSVC_buildRegionalAggregate(
  regionId: V1014PubsSvcRegionId,
  turn: number,
  queuePressureIndex: number,
  skillMismatchIndex: number,
  migrationLoopIndex: number,
  queues: ReturnType<typeof V1014_PUBSVC_buildInitialQueueGrid>,
  skillSlices: ReturnType<typeof V1014_PUBSVC_buildSkillMismatchGrid>,
): V1014PubsSvcRegionalAggregate {
  const pillars = {} as V1014PubsSvcRegionalAggregate['pillars'];
  for (const pillar of PILLARS) {
    const q = queues.find((s) => s.regionId === regionId && s.pillar === pillar);
    const sk = skillSlices.find((s) => s.regionId === regionId && s.pillar === pillar);
    pillars[pillar] = {
      waitTurns: q?.waitTurns ?? 20,
      backlogBand: q?.band ?? 'stable',
      skillGapBand: sk?.band ?? 'mild_gap',
    };
  }
  const compositeKpi = V1014_PUBSVC_clamp(
    100 -
      queuePressureIndex * 0.38 -
      skillMismatchIndex * 0.32 -
      migrationLoopIndex * 0.22,
    V1014_PUBSVC_LIMITS.minCompositeKpi,
    V1014_PUBSVC_LIMITS.maxCompositeKpi,
  );
  return {
    regionId,
    turn,
    queuePressureIndex,
    skillMismatchIndex,
    migrationLoopIndex,
    compositeKpi,
    pillars,
  };
}

export function V1014_PUBSVC_computePublicServicesCrosswalk(
  rawInputs: Partial<V1014PubsSvcCrosswalkInputs>,
  rawPersisted?: Partial<V1014PubsSvcSection6Persisted> | null,
): V1014PubsSvcTickResult {
  const inputs = V1014_PUBSVC_mergeCrosswalkInputs(rawInputs);
  const persisted = V1014_PUBSVC_migrateSection6Persisted(rawPersisted);
  const fiscal = V1014_PUBSVC_apply20AFStressToFiscal(inputs.fiscalHeadroom, inputs.af20);
  const policyFocus = V1014_PUBSVC_apply20AJToPolicyFocus(inputs.policyFocus, inputs.aj20);
  const demandMap = V1014_PUBSVC_extractDemandFrom20AP(inputs.ap20);
  const baselineMap = V1014_PUBSVC_extractQueueBaselinesFrom20AP(inputs.ap20);

  const queues = V1014_PUBSVC_CORE_REGIONS.flatMap((regionId) =>
    PILLARS.map((pillar) => {
      const prior = persisted.regionalAggregates[regionId]?.pillars[pillar]?.waitTurns ?? 18;
      return V1014_PUBSVC_computeQueueStep({
        turn: inputs.turn,
        regionId,
        pillar,
        demandPressure: demandMap[regionId]?.[pillar] ?? baselineMap[regionId]?.[pillar] ?? 45,
        throughputCapacity: baselineMap[regionId]?.[pillar] ?? 48,
        staffingCoverage: inputs.ac20.regionalSkillSupply[regionId] ?? inputs.ac20.nationalReadiness,
        policyFocus: policyFocus[pillar] ?? 50,
        fiscalHeadroom: fiscal,
        priorWaitTurns: prior,
      });
    }),
  );

  const skillSlices = V1014_PUBSVC_buildSkillMismatchGrid(inputs.ac20, demandMap);
  const queuePressureByRegion: Partial<Record<V1014PubsSvcRegionId, number>> = {};
  for (const regionId of V1014_PUBSVC_CORE_REGIONS) {
    const regionalQueues = queues.filter((q) => q.regionId === regionId);
    queuePressureByRegion[regionId] = V1014_PUBSVC_nationalQueuePressure(regionalQueues);
  }

  const migrationSlices = V1014_PUBSVC_buildMigrationFeedbackGrid(
    inputs.aj20,
    inputs.af20,
    queuePressureByRegion,
  );

  for (const m of migrationSlices) {
    for (const q of queues) {
      if (q.regionId !== m.regionId) continue;
      if (q.pillar === 'housing') q.waitTurns = V1014_PUBSVC_clamp(q.waitTurns + m.housingQueueDelta, 0, 240);
      if (q.pillar === 'healthcare') q.waitTurns = V1014_PUBSVC_clamp(q.waitTurns + m.healthQueueDelta, 0, 240);
      if (q.pillar === 'education') q.waitTurns = V1014_PUBSVC_clamp(q.waitTurns + m.educationQueueDelta, 0, 240);
      q.band = q.waitTurns > 64 ? 'critical' : q.waitTurns > 48 ? 'severe' : q.band;
    }
  }

  const nationalQueuePressure = V1014_PUBSVC_nationalQueuePressure(queues);
  const nationalSkillMismatch = V1014_PUBSVC_nationalSkillMismatch(skillSlices);
  const nationalMigrationLoop = V1014_PUBSVC_nationalMigrationLoop(migrationSlices);

  const regions = {} as V1014PubsSvcNationalSnapshot['regions'];
  for (const regionId of V1014_PUBSVC_CORE_REGIONS) {
    const rq = queues.filter((q) => q.regionId === regionId);
    const rs = skillSlices.filter((s) => s.regionId === regionId);
    const rm = migrationSlices.find((s) => s.regionId === regionId);
    regions[regionId] = V1014_PUBSVC_buildRegionalAggregate(
      regionId,
      inputs.turn,
      V1014_PUBSVC_nationalQueuePressure(rq),
      V1014_PUBSVC_clamp(
        V1014_PUBSVC_weightedMean(rs.map((s) => ({ weight: V1014_PUBSVC_PILLAR_WEIGHT[s.pillar], value: s.gapScore }))),
        0,
        100,
      ),
      rm ? rm.loopGain * 50 : 40,
      queues,
      skillSlices,
    );
  }

  const nationalCompositeKpi = V1014_PUBSVC_clamp(
    V1014_PUBSVC_weightedMean(
      V1014_PUBSVC_CORE_REGIONS.map((r) => ({
        weight: V1014_PUBSVC_REGION_WEIGHT[r],
        value: regions[r].compositeKpi,
      })),
    ),
    0,
    100,
  );

  const snapshot: V1014PubsSvcNationalSnapshot = {
    turn: inputs.turn,
    schemaVersion: V1014_PUBSVC_SCHEMA_VERSION,
    nationalQueuePressure,
    nationalSkillMismatch,
    nationalMigrationLoop,
    nationalCompositeKpi,
    regions,
    queues,
    skillSlices,
    migrationSlices,
  };

  const nextPersisted = V1014_PUBSVC_rollSection6History(persisted, snapshot);
  const events: string[] = [];
  if (nationalQueuePressure > 45) events.push('V1014_PUBSVC_EVENT_QUEUE_PRESSURE_ELEVATED');
  if (nationalSkillMismatch > 40) events.push('V1014_PUBSVC_EVENT_SKILL_MISMATCH_ELEVATED');
  if (nationalMigrationLoop > 32) events.push('V1014_PUBSVC_EVENT_MIGRATION_LOOP_AMPLIFYING');

  return { snapshot, persisted: nextPersisted, events };
}

export function V1014_PUBSVC_makeDefaultCrosswalkInputs(
  overrides: Partial<V1014PubsSvcCrosswalkInputs> = {},
): V1014PubsSvcCrosswalkInputs {
  return V1014_PUBSVC_mergeCrosswalkInputs({
    turn: 3,
    fiscalHeadroom: 58,
    policyFocus: { housing: 54, healthcare: 56, education: 58 },
    ap20: {
      turn: 3,
      nationalOutcomeIndex: 62,
      regionalOutcome: {
        NT: {
          healthcare: { accessScore: 38, backlogPressure: 72, staffingBand: 'shortage' },
          housing: { accessScore: 42, backlogPressure: 65, staffingBand: 'shortage' },
        },
      },
    },
    ac20: { turn: 3, nationalReadiness: 56, specialistGap: 34 },
    aj20: { turn: 3, migrationFlowBand: 'inflow', wagePressureIndex: 52 },
    af20: { turn: 3, affordabilityStress: 48, domesticDemandPull: 54 },
    ...overrides,
  });
}
