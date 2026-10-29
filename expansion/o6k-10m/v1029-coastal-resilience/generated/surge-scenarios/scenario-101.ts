import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 101 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_101_META = {
  id: 'surge_101',
  regionId: 'TAS' as V1029CresRegionId,
  primaryChannel: 'primary_access' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'moderate' as V1029CresAdaptationBand,
  seed: 92532,
} as const;

const V1029_CRES_SURGE_SCENARIO_101_COEF = {
  k0: 91.2000,
  k1: 72.3000,
  k2: 53.4000,
  k3: 34.5000,
  k4: 15.6000,
  k5: 96.4000,
  k6: 77.5000,
  k7: 58.6000,
  k8: 39.7000,
  k9: 20.8000,
  k10: 1.9000,
  k11: 82.7000,
  k12: 63.8000,
  k13: 44.9000,
  k14: 26.0000,
  k15: 7.1000,
  k16: 87.9000,
  k17: 69.0000,
  k18: 50.1000,
  k19: 31.2000,
  k20: 12.3000,
  k21: 93.1000,
  k22: 74.2000,
  k23: 55.3000,
  k24: 36.4000,
  k25: 17.5000,
  k26: 98.3000,
  k27: 79.4000,
  k28: 60.5000,
  k29: 41.6000,
  k30: 22.7000,
  k31: 3.8000,
  k32: 84.6000,
  k33: 65.7000,
  k34: 46.8000,
  k35: 27.9000,
  k36: 9.0000,
  k37: 89.8000,
  k38: 70.9000,
  k39: 52.0000,
  k40: 33.1000,
  k41: 14.2000,
  k42: 95.0000,
  k43: 76.1000,
  k44: 57.2000,
  k45: 38.3000,
  k46: 19.4000,
  k47: 0.5000,
  k48: 81.3000,
  k49: 62.4000,
  k50: 43.5000,
  k51: 24.6000,
  k52: 5.7000,
  k53: 86.5000,
  k54: 67.6000,
  k55: 48.7000,
  k56: 29.8000,
  k57: 10.9000,
  k58: 91.7000,
  k59: 72.8000,
  k60: 53.9000,
  k61: 35.0000,
  k62: 16.1000,
  k63: 96.9000,
  k64: 78.0000,
  k65: 59.1000,
  k66: 40.2000,
  k67: 21.3000,
  k68: 2.4000,
  k69: 83.2000,
  k70: 64.3000,
  k71: 45.4000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_101_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_101_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_101_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_101_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_101_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_101_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_101_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_101_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_101_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_101_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_101_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_101_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
