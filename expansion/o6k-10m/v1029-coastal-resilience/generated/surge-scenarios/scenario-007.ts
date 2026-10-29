import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 007 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_007_META = {
  id: 'surge_007',
  regionId: 'ACT' as V1029CresRegionId,
  primaryChannel: 'mental_health' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'elevated' as V1029CresAdaptationBand,
  seed: 6898,
} as const;

const V1029_CRES_SURGE_SCENARIO_007_COEF = {
  k0: 10.6000,
  k1: 2.5000,
  k2: 94.1000,
  k3: 86.0000,
  k4: 77.9000,
  k5: 69.8000,
  k6: 61.7000,
  k7: 53.6000,
  k8: 45.5000,
  k9: 37.4000,
  k10: 29.3000,
  k11: 21.2000,
  k12: 13.1000,
  k13: 5.0000,
  k14: 96.6000,
  k15: 88.5000,
  k16: 80.4000,
  k17: 72.3000,
  k18: 64.2000,
  k19: 56.1000,
  k20: 48.0000,
  k21: 39.9000,
  k22: 31.8000,
  k23: 23.7000,
  k24: 15.6000,
  k25: 7.5000,
  k26: 99.1000,
  k27: 91.0000,
  k28: 82.9000,
  k29: 74.8000,
  k30: 66.7000,
  k31: 58.6000,
  k32: 50.5000,
  k33: 42.4000,
  k34: 34.3000,
  k35: 26.2000,
  k36: 18.1000,
  k37: 10.0000,
  k38: 1.9000,
  k39: 93.5000,
  k40: 85.4000,
  k41: 77.3000,
  k42: 69.2000,
  k43: 61.1000,
  k44: 53.0000,
  k45: 44.9000,
  k46: 36.8000,
  k47: 28.7000,
  k48: 20.6000,
  k49: 12.5000,
  k50: 4.4000,
  k51: 96.0000,
  k52: 87.9000,
  k53: 79.8000,
  k54: 71.7000,
  k55: 63.6000,
  k56: 55.5000,
  k57: 47.4000,
  k58: 39.3000,
  k59: 31.2000,
  k60: 23.1000,
  k61: 15.0000,
  k62: 6.9000,
  k63: 98.5000,
  k64: 90.4000,
  k65: 82.3000,
  k66: 74.2000,
  k67: 66.1000,
  k68: 58.0000,
  k69: 49.9000,
  k70: 41.8000,
  k71: 33.7000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_007_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_007_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_007_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_007_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_007_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_007_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_007_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_007_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_007_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_007_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_007_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_007_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
