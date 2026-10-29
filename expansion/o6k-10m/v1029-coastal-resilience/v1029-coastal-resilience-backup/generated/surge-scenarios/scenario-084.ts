import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 084 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_084_META = {
  id: 'surge_084',
  regionId: 'SA' as V1029CresRegionId,
  primaryChannel: 'rural_clinic' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'recovering' as V1029CresAdaptationBand,
  seed: 77045,
} as const;

const V1029_CRES_SURGE_SCENARIO_084_COEF = {
  k0: 4.5000,
  k1: 32.1000,
  k2: 59.7000,
  k3: 87.3000,
  k4: 15.2000,
  k5: 42.8000,
  k6: 70.4000,
  k7: 98.0000,
  k8: 25.9000,
  k9: 53.5000,
  k10: 81.1000,
  k11: 9.0000,
  k12: 36.6000,
  k13: 64.2000,
  k14: 91.8000,
  k15: 19.7000,
  k16: 47.3000,
  k17: 74.9000,
  k18: 2.8000,
  k19: 30.4000,
  k20: 58.0000,
  k21: 85.6000,
  k22: 13.5000,
  k23: 41.1000,
  k24: 68.7000,
  k25: 96.3000,
  k26: 24.2000,
  k27: 51.8000,
  k28: 79.4000,
  k29: 7.3000,
  k30: 34.9000,
  k31: 62.5000,
  k32: 90.1000,
  k33: 18.0000,
  k34: 45.6000,
  k35: 73.2000,
  k36: 1.1000,
  k37: 28.7000,
  k38: 56.3000,
  k39: 83.9000,
  k40: 11.8000,
  k41: 39.4000,
  k42: 67.0000,
  k43: 94.6000,
  k44: 22.5000,
  k45: 50.1000,
  k46: 77.7000,
  k47: 5.6000,
  k48: 33.2000,
  k49: 60.8000,
  k50: 88.4000,
  k51: 16.3000,
  k52: 43.9000,
  k53: 71.5000,
  k54: 99.1000,
  k55: 27.0000,
  k56: 54.6000,
  k57: 82.2000,
  k58: 10.1000,
  k59: 37.7000,
  k60: 65.3000,
  k61: 92.9000,
  k62: 20.8000,
  k63: 48.4000,
  k64: 76.0000,
  k65: 3.9000,
  k66: 31.5000,
  k67: 59.1000,
  k68: 86.7000,
  k69: 14.6000,
  k70: 42.2000,
  k71: 69.8000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_084_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_084_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_084_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_084_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_084_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_084_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_084_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_084_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_084_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_084_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_084_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_084_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
