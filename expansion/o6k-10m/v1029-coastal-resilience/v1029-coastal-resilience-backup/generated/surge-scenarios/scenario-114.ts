import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 114 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_114_META = {
  id: 'surge_114',
  regionId: 'QLD' as V1029CresRegionId,
  primaryChannel: 'rural_clinic' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'recovering' as V1029CresAdaptationBand,
  seed: 104375,
} as const;

const V1029_CRES_SURGE_SCENARIO_114_COEF = {
  k0: 57.8000,
  k1: 26.8000,
  k2: 95.5000,
  k3: 64.5000,
  k4: 33.5000,
  k5: 2.5000,
  k6: 71.2000,
  k7: 40.2000,
  k8: 9.2000,
  k9: 77.9000,
  k10: 46.9000,
  k11: 15.9000,
  k12: 84.6000,
  k13: 53.6000,
  k14: 22.6000,
  k15: 91.3000,
  k16: 60.3000,
  k17: 29.3000,
  k18: 98.0000,
  k19: 67.0000,
  k20: 36.0000,
  k21: 5.0000,
  k22: 73.7000,
  k23: 42.7000,
  k24: 11.7000,
  k25: 80.4000,
  k26: 49.4000,
  k27: 18.4000,
  k28: 87.1000,
  k29: 56.1000,
  k30: 25.1000,
  k31: 93.8000,
  k32: 62.8000,
  k33: 31.8000,
  k34: 0.8000,
  k35: 69.5000,
  k36: 38.5000,
  k37: 7.5000,
  k38: 76.2000,
  k39: 45.2000,
  k40: 14.2000,
  k41: 82.9000,
  k42: 51.9000,
  k43: 20.9000,
  k44: 89.6000,
  k45: 58.6000,
  k46: 27.6000,
  k47: 96.3000,
  k48: 65.3000,
  k49: 34.3000,
  k50: 3.3000,
  k51: 72.0000,
  k52: 41.0000,
  k53: 10.0000,
  k54: 78.7000,
  k55: 47.7000,
  k56: 16.7000,
  k57: 85.4000,
  k58: 54.4000,
  k59: 23.4000,
  k60: 92.1000,
  k61: 61.1000,
  k62: 30.1000,
  k63: 98.8000,
  k64: 67.8000,
  k65: 36.8000,
  k66: 5.8000,
  k67: 74.5000,
  k68: 43.5000,
  k69: 12.5000,
  k70: 81.2000,
  k71: 50.2000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_114_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_114_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_114_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_114_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_114_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_114_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_114_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_114_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_114_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_114_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_114_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_114_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
