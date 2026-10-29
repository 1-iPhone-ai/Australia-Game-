import { V1014_PUBSVC_LIMITS, V1014_PUBSVC_REGION_WEIGHT } from '../core/constants.ts';
import { V1014_PUBSVC_clamp, V1014_PUBSVC_weightedMean } from '../core/math.ts';
import type {
  V1014PubsSvcAdapter20AF,
  V1014PubsSvcAdapter20AJ,
  V1014PubsSvcMigrationFeedbackBand,
  V1014PubsSvcMigrationFeedbackSlice,
  V1014PubsSvcRegionId,
} from '../core/types.ts';

const MIGRATION_BANDS: V1014PubsSvcMigrationFeedbackBand[] = [
  'dampening',
  'neutral',
  'amplifying',
  'runaway_pressure',
];

export function V1014_PUBSVC_migrationFeedbackBand(loopGain: number): V1014PubsSvcMigrationFeedbackBand {
  if (loopGain >= 1.45) return 'runaway_pressure';
  if (loopGain >= 1.05) return 'amplifying';
  if (loopGain >= 0.75) return 'neutral';
  return 'dampening';
}

export interface V1014PubsSvcMigrationFeedbackInput {
  regionId: V1014PubsSvcRegionId;
  aj: V1014PubsSvcAdapter20AJ;
  af: V1014PubsSvcAdapter20AF;
  queuePressureIndex: number;
}

export function V1014_PUBSVC_computeMigrationFeedbackSlice(
  input: V1014PubsSvcMigrationFeedbackInput,
): V1014PubsSvcMigrationFeedbackSlice {
  const attract = input.aj.regionalAttractiveness[input.regionId] ?? 50;
  const living = input.af.regionalLivingStandard[input.regionId] ?? 50;
  const inflowPressure = V1014_PUBSVC_clamp(
    attract * 0.55 + (100 - input.af.affordabilityStress) * 0.2 + input.aj.wagePressureIndex * 0.15,
    0,
    100,
  );
  const serviceAbsorption = V1014_PUBSVC_clamp(
    living * 0.4 + (100 - input.queuePressureIndex) * 0.35,
    0,
    100,
  );
  const strain = inflowPressure - serviceAbsorption;
  const housingQueueDelta = strain * 0.14;
  const healthQueueDelta = strain * 0.11;
  const educationQueueDelta = strain * 0.09;
  const inflowBoost = input.aj.migrationFlowBand.includes('inflow') ? 0.18 : 0;
  const loopGain = V1014_PUBSVC_clamp(
    0.55 + strain / 120 + inflowBoost,
    0.2,
    V1014_PUBSVC_LIMITS.maxMigrationLoopGain,
  );

  return {
    regionId: input.regionId,
    inflowPressure,
    serviceAbsorption,
    housingQueueDelta,
    healthQueueDelta,
    educationQueueDelta,
    band: V1014_PUBSVC_migrationFeedbackBand(loopGain),
    loopGain,
  };
}

export function V1014_PUBSVC_nationalMigrationLoop(slices: V1014PubsSvcMigrationFeedbackSlice[]): number {
  const pairs = slices.map((s) => ({
    weight: V1014_PUBSVC_REGION_WEIGHT[s.regionId] ?? 0.1,
    value: s.loopGain * 50,
  }));
  return V1014_PUBSVC_clamp(V1014_PUBSVC_weightedMean(pairs), 0, 100);
}

export function V1014_PUBSVC_buildMigrationFeedbackGrid(
  aj: V1014PubsSvcAdapter20AJ,
  af: V1014PubsSvcAdapter20AF,
  queuePressureByRegion: Partial<Record<V1014PubsSvcRegionId, number>>,
): V1014PubsSvcMigrationFeedbackSlice[] {
  const regions = Object.keys(V1014_PUBSVC_REGION_WEIGHT) as V1014PubsSvcRegionId[];
  return regions.map((regionId) =>
    V1014_PUBSVC_computeMigrationFeedbackSlice({
      regionId,
      aj,
      af,
      queuePressureIndex: queuePressureByRegion[regionId] ?? 45,
    }),
  );
}

export { MIGRATION_BANDS as V1014_PUBSVC_MIGRATION_FEEDBACK_BANDS };
