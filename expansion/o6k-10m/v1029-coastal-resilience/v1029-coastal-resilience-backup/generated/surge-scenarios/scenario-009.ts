import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 009 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_009_META = {
  id: 'surge_009',
  regionId: 'VIC' as V1029CresRegionId,
  primaryChannel: 'remote' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'recovering' as V1029CresAdaptationBand,
  seed: 8720,
} as const;

const V1029_CRES_SURGE_SCENARIO_009_COEF = {
  k0: 20.8000,
  k1: 95.2000,
  k2: 69.9000,
  k3: 44.6000,
  k4: 19.3000,
  k5: 93.7000,
  k6: 68.4000,
  k7: 43.1000,
  k8: 17.8000,
  k9: 92.2000,
  k10: 66.9000,
  k11: 41.6000,
  k12: 16.3000,
  k13: 90.7000,
  k14: 65.4000,
  k15: 40.1000,
  k16: 14.8000,
  k17: 89.2000,
  k18: 63.9000,
  k19: 38.6000,
  k20: 13.3000,
  k21: 87.7000,
  k22: 62.4000,
  k23: 37.1000,
  k24: 11.8000,
  k25: 86.2000,
  k26: 60.9000,
  k27: 35.6000,
  k28: 10.3000,
  k29: 84.7000,
  k30: 59.4000,
  k31: 34.1000,
  k32: 8.8000,
  k33: 83.2000,
  k34: 57.9000,
  k35: 32.6000,
  k36: 7.3000,
  k37: 81.7000,
  k38: 56.4000,
  k39: 31.1000,
  k40: 5.8000,
  k41: 80.2000,
  k42: 54.9000,
  k43: 29.6000,
  k44: 4.3000,
  k45: 78.7000,
  k46: 53.4000,
  k47: 28.1000,
  k48: 2.8000,
  k49: 77.2000,
  k50: 51.9000,
  k51: 26.6000,
  k52: 1.3000,
  k53: 75.7000,
  k54: 50.4000,
  k55: 25.1000,
  k56: 99.5000,
  k57: 74.2000,
  k58: 48.9000,
  k59: 23.6000,
  k60: 98.0000,
  k61: 72.7000,
  k62: 47.4000,
  k63: 22.1000,
  k64: 96.5000,
  k65: 71.2000,
  k66: 45.9000,
  k67: 20.6000,
  k68: 95.0000,
  k69: 69.7000,
  k70: 44.4000,
  k71: 19.1000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_009_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_009_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_009_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_009_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_009_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_009_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_009_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_009_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_009_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_009_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_009_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_009_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
