import { V1014_PUBSVC_PILLAR_WEIGHT, V1014_PUBSVC_REGION_WEIGHT } from '../core/constants.ts';
import {
  V1014_PUBSVC_clamp,
  V1014_PUBSVC_deadband,
  V1014_PUBSVC_deterministicJitter,
  V1014_PUBSVC_weightedMean,
} from '../core/math.ts';
import type {
  V1014PubsSvcPillar,
  V1014PubsSvcQueueBand,
  V1014PubsSvcQueueSlot,
  V1014PubsSvcRegionId,
} from '../core/types.ts';

const QUEUE_BAND_THRESHOLDS = [18, 32, 48, 64] as const;
const QUEUE_BANDS: V1014PubsSvcQueueBand[] = ['clearing', 'stable', 'building', 'severe', 'critical'];

export function V1014_PUBSVC_queueBandFromPressure(pressure: number): V1014PubsSvcQueueBand {
  if (pressure >= QUEUE_BAND_THRESHOLDS[3]) return 'critical';
  if (pressure >= QUEUE_BAND_THRESHOLDS[2]) return 'severe';
  if (pressure >= QUEUE_BAND_THRESHOLDS[1]) return 'building';
  if (pressure >= QUEUE_BAND_THRESHOLDS[0]) return 'stable';
  return 'clearing';
}

export interface V1014PubsSvcQueueStepInput {
  turn: number;
  regionId: V1014PubsSvcRegionId;
  pillar: V1014PubsSvcPillar;
  demandPressure: number;
  throughputCapacity: number;
  staffingCoverage: number;
  policyFocus: number;
  fiscalHeadroom: number;
  priorWaitTurns: number;
}

export function V1014_PUBSVC_computeQueueStep(input: V1014PubsSvcQueueStepInput): V1014PubsSvcQueueSlot {
  const cap = V1014_PUBSVC_clamp(input.throughputCapacity, 5, 120);
  const staff = V1014_PUBSVC_clamp(input.staffingCoverage, 5, 120);
  const demand = V1014_PUBSVC_clamp(input.demandPressure, 0, 120);
  const focus = V1014_PUBSVC_clamp(input.policyFocus, 0, 100);
  const fiscal = V1014_PUBSVC_clamp(input.fiscalHeadroom, 0, 100);

  const effectiveThroughput =
    cap * (0.55 + staff / 200) * (0.7 + fiscal / 250) * (0.75 + focus / 400);
  const netFlow = demand - effectiveThroughput;
  const jitter = V1014_PUBSVC_deterministicJitter(
    input.turn * 17 + input.regionId.charCodeAt(0) + input.pillar.length * 3,
    0.6,
  );
  const rawWait = V1014_PUBSVC_clamp(input.priorWaitTurns + netFlow * 0.12 + jitter, 0, 240);
  const waitTurns = V1014_PUBSVC_deadband(input.priorWaitTurns, rawWait, 0.85);
  const pressure = waitTurns * 0.42 + demand * 0.35 - effectiveThroughput * 0.18;

  return {
    id: `${input.regionId}_${input.pillar}_q`,
    pillar: input.pillar,
    regionId: input.regionId,
    waitTurns,
    demandPressure: demand,
    throughputCapacity: cap,
    staffingCoverage: staff,
    band: V1014_PUBSVC_queueBandFromPressure(pressure),
  };
}

export function V1014_PUBSVC_nationalQueuePressure(slots: V1014PubsSvcQueueSlot[]): number {
  const pairs = slots.map((s) => ({
    weight: (V1014_PUBSVC_REGION_WEIGHT[s.regionId] ?? 0.1) * (V1014_PUBSVC_PILLAR_WEIGHT[s.pillar] ?? 0.33),
    value: s.waitTurns * 0.55 + (s.demandPressure - s.throughputCapacity) * 0.25,
  }));
  return V1014_PUBSVC_clamp(V1014_PUBSVC_weightedMean(pairs), 0, 100);
}

export function V1014_PUBSVC_buildInitialQueueGrid(
  turn: number,
  baselines: Partial<Record<V1014PubsSvcRegionId, Partial<Record<V1014PubsSvcPillar, number>>>>,
): V1014PubsSvcQueueSlot[] {
  const pillars: V1014PubsSvcPillar[] = ['housing', 'healthcare', 'education'];
  const regions = Object.keys(V1014_PUBSVC_REGION_WEIGHT) as V1014PubsSvcRegionId[];
  const out: V1014PubsSvcQueueSlot[] = [];
  for (const regionId of regions) {
    for (const pillar of pillars) {
      const base = baselines[regionId]?.[pillar] ?? 42;
      out.push(
        V1014_PUBSVC_computeQueueStep({
          turn,
          regionId,
          pillar,
          demandPressure: base + 8,
          throughputCapacity: base,
          staffingCoverage: base - 4,
          policyFocus: 50,
          fiscalHeadroom: 55,
          priorWaitTurns: base * 0.35,
        }),
      );
    }
  }
  return out;
}
