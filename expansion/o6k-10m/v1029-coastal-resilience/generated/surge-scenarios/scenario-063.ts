import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 063 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_063_META = {
  id: 'surge_063',
  regionId: 'ACT' as V1029CresRegionId,
  primaryChannel: 'telehealth' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'critical' as V1029CresAdaptationBand,
  seed: 57914,
} as const;

const V1029_CRES_SURGE_SCENARIO_063_COEF = {
  k0: 96.8000,
  k1: 5.9000,
  k2: 14.7000,
  k3: 23.5000,
  k4: 32.3000,
  k5: 41.1000,
  k6: 49.9000,
  k7: 58.7000,
  k8: 67.5000,
  k9: 76.3000,
  k10: 85.1000,
  k11: 93.9000,
  k12: 3.0000,
  k13: 11.8000,
  k14: 20.6000,
  k15: 29.4000,
  k16: 38.2000,
  k17: 47.0000,
  k18: 55.8000,
  k19: 64.6000,
  k20: 73.4000,
  k21: 82.2000,
  k22: 91.0000,
  k23: 0.1000,
  k24: 8.9000,
  k25: 17.7000,
  k26: 26.5000,
  k27: 35.3000,
  k28: 44.1000,
  k29: 52.9000,
  k30: 61.7000,
  k31: 70.5000,
  k32: 79.3000,
  k33: 88.1000,
  k34: 96.9000,
  k35: 6.0000,
  k36: 14.8000,
  k37: 23.6000,
  k38: 32.4000,
  k39: 41.2000,
  k40: 50.0000,
  k41: 58.8000,
  k42: 67.6000,
  k43: 76.4000,
  k44: 85.2000,
  k45: 94.0000,
  k46: 3.1000,
  k47: 11.9000,
  k48: 20.7000,
  k49: 29.5000,
  k50: 38.3000,
  k51: 47.1000,
  k52: 55.9000,
  k53: 64.7000,
  k54: 73.5000,
  k55: 82.3000,
  k56: 91.1000,
  k57: 0.2000,
  k58: 9.0000,
  k59: 17.8000,
  k60: 26.6000,
  k61: 35.4000,
  k62: 44.2000,
  k63: 53.0000,
  k64: 61.8000,
  k65: 70.6000,
  k66: 79.4000,
  k67: 88.2000,
  k68: 97.0000,
  k69: 6.1000,
  k70: 14.9000,
  k71: 23.7000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_063_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_063_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_063_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_063_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_063_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_063_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_063_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_063_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_063_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_063_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_063_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_063_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
