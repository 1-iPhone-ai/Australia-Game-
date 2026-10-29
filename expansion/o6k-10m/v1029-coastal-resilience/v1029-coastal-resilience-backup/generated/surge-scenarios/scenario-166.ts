import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 166 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_166_META = {
  id: 'surge_166',
  regionId: 'NT' as V1029CresRegionId,
  primaryChannel: 'aged_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'moderate' as V1029CresAdaptationBand,
  seed: 151747,
} as const;

const V1029_CRES_SURGE_SCENARIO_166_COEF = {
  k0: 23.9000,
  k1: 44.2000,
  k2: 64.5000,
  k3: 84.8000,
  k4: 5.4000,
  k5: 25.7000,
  k6: 46.0000,
  k7: 66.3000,
  k8: 86.6000,
  k9: 7.2000,
  k10: 27.5000,
  k11: 47.8000,
  k12: 68.1000,
  k13: 88.4000,
  k14: 9.0000,
  k15: 29.3000,
  k16: 49.6000,
  k17: 69.9000,
  k18: 90.2000,
  k19: 10.8000,
  k20: 31.1000,
  k21: 51.4000,
  k22: 71.7000,
  k23: 92.0000,
  k24: 12.6000,
  k25: 32.9000,
  k26: 53.2000,
  k27: 73.5000,
  k28: 93.8000,
  k29: 14.4000,
  k30: 34.7000,
  k31: 55.0000,
  k32: 75.3000,
  k33: 95.6000,
  k34: 16.2000,
  k35: 36.5000,
  k36: 56.8000,
  k37: 77.1000,
  k38: 97.4000,
  k39: 18.0000,
  k40: 38.3000,
  k41: 58.6000,
  k42: 78.9000,
  k43: 99.2000,
  k44: 19.8000,
  k45: 40.1000,
  k46: 60.4000,
  k47: 80.7000,
  k48: 1.3000,
  k49: 21.6000,
  k50: 41.9000,
  k51: 62.2000,
  k52: 82.5000,
  k53: 3.1000,
  k54: 23.4000,
  k55: 43.7000,
  k56: 64.0000,
  k57: 84.3000,
  k58: 4.9000,
  k59: 25.2000,
  k60: 45.5000,
  k61: 65.8000,
  k62: 86.1000,
  k63: 6.7000,
  k64: 27.0000,
  k65: 47.3000,
  k66: 67.6000,
  k67: 87.9000,
  k68: 8.5000,
  k69: 28.8000,
  k70: 49.1000,
  k71: 69.4000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_166_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_166_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_166_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_166_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_166_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_166_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_166_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_166_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_166_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_166_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_166_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_166_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
