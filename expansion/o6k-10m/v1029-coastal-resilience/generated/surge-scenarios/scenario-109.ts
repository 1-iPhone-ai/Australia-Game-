import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 109 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_109_META = {
  id: 'surge_109',
  regionId: 'TAS' as V1029CresRegionId,
  primaryChannel: 'remote' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'recovering' as V1029CresAdaptationBand,
  seed: 99820,
} as const;

const V1029_CRES_SURGE_SCENARIO_109_COEF = {
  k0: 32.3000,
  k1: 44.3000,
  k2: 56.3000,
  k3: 68.3000,
  k4: 80.3000,
  k5: 92.3000,
  k6: 4.6000,
  k7: 16.6000,
  k8: 28.6000,
  k9: 40.6000,
  k10: 52.6000,
  k11: 64.6000,
  k12: 76.6000,
  k13: 88.6000,
  k14: 0.9000,
  k15: 12.9000,
  k16: 24.9000,
  k17: 36.9000,
  k18: 48.9000,
  k19: 60.9000,
  k20: 72.9000,
  k21: 84.9000,
  k22: 96.9000,
  k23: 9.2000,
  k24: 21.2000,
  k25: 33.2000,
  k26: 45.2000,
  k27: 57.2000,
  k28: 69.2000,
  k29: 81.2000,
  k30: 93.2000,
  k31: 5.5000,
  k32: 17.5000,
  k33: 29.5000,
  k34: 41.5000,
  k35: 53.5000,
  k36: 65.5000,
  k37: 77.5000,
  k38: 89.5000,
  k39: 1.8000,
  k40: 13.8000,
  k41: 25.8000,
  k42: 37.8000,
  k43: 49.8000,
  k44: 61.8000,
  k45: 73.8000,
  k46: 85.8000,
  k47: 97.8000,
  k48: 10.1000,
  k49: 22.1000,
  k50: 34.1000,
  k51: 46.1000,
  k52: 58.1000,
  k53: 70.1000,
  k54: 82.1000,
  k55: 94.1000,
  k56: 6.4000,
  k57: 18.4000,
  k58: 30.4000,
  k59: 42.4000,
  k60: 54.4000,
  k61: 66.4000,
  k62: 78.4000,
  k63: 90.4000,
  k64: 2.7000,
  k65: 14.7000,
  k66: 26.7000,
  k67: 38.7000,
  k68: 50.7000,
  k69: 62.7000,
  k70: 74.7000,
  k71: 86.7000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_109_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_109_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_109_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_109_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_109_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_109_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_109_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_109_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_109_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_109_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_109_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_109_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
