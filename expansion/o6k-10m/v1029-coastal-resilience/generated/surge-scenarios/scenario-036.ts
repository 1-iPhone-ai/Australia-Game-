import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 036 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_036_META = {
  id: 'surge_036',
  regionId: 'SA' as V1029CresRegionId,
  primaryChannel: 'aged_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'moderate' as V1029CresAdaptationBand,
  seed: 33317,
} as const;

const V1029_CRES_SURGE_SCENARIO_036_COEF = {
  k0: 58.8000,
  k1: 0.7000,
  k2: 42.3000,
  k3: 83.9000,
  k4: 25.8000,
  k5: 67.4000,
  k6: 9.3000,
  k7: 50.9000,
  k8: 92.5000,
  k9: 34.4000,
  k10: 76.0000,
  k11: 17.9000,
  k12: 59.5000,
  k13: 1.4000,
  k14: 43.0000,
  k15: 84.6000,
  k16: 26.5000,
  k17: 68.1000,
  k18: 10.0000,
  k19: 51.6000,
  k20: 93.2000,
  k21: 35.1000,
  k22: 76.7000,
  k23: 18.6000,
  k24: 60.2000,
  k25: 2.1000,
  k26: 43.7000,
  k27: 85.3000,
  k28: 27.2000,
  k29: 68.8000,
  k30: 10.7000,
  k31: 52.3000,
  k32: 93.9000,
  k33: 35.8000,
  k34: 77.4000,
  k35: 19.3000,
  k36: 60.9000,
  k37: 2.8000,
  k38: 44.4000,
  k39: 86.0000,
  k40: 27.9000,
  k41: 69.5000,
  k42: 11.4000,
  k43: 53.0000,
  k44: 94.6000,
  k45: 36.5000,
  k46: 78.1000,
  k47: 20.0000,
  k48: 61.6000,
  k49: 3.5000,
  k50: 45.1000,
  k51: 86.7000,
  k52: 28.6000,
  k53: 70.2000,
  k54: 12.1000,
  k55: 53.7000,
  k56: 95.3000,
  k57: 37.2000,
  k58: 78.8000,
  k59: 20.7000,
  k60: 62.3000,
  k61: 4.2000,
  k62: 45.8000,
  k63: 87.4000,
  k64: 29.3000,
  k65: 70.9000,
  k66: 12.8000,
  k67: 54.4000,
  k68: 96.0000,
  k69: 37.9000,
  k70: 79.5000,
  k71: 21.4000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_036_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_036_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_036_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_036_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_036_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_036_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_036_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_036_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_036_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_036_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_036_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_036_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
