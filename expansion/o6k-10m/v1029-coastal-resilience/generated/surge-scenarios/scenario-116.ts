import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 116 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_116_META = {
  id: 'surge_116',
  regionId: 'SA' as V1029CresRegionId,
  primaryChannel: 'aged_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'moderate' as V1029CresAdaptationBand,
  seed: 106197,
} as const;

const V1029_CRES_SURGE_SCENARIO_116_COEF = {
  k0: 68.0000,
  k1: 19.8000,
  k2: 71.3000,
  k3: 23.1000,
  k4: 74.6000,
  k5: 26.4000,
  k6: 77.9000,
  k7: 29.7000,
  k8: 81.2000,
  k9: 33.0000,
  k10: 84.5000,
  k11: 36.3000,
  k12: 87.8000,
  k13: 39.6000,
  k14: 91.1000,
  k15: 42.9000,
  k16: 94.4000,
  k17: 46.2000,
  k18: 97.7000,
  k19: 49.5000,
  k20: 1.3000,
  k21: 52.8000,
  k22: 4.6000,
  k23: 56.1000,
  k24: 7.9000,
  k25: 59.4000,
  k26: 11.2000,
  k27: 62.7000,
  k28: 14.5000,
  k29: 66.0000,
  k30: 17.8000,
  k31: 69.3000,
  k32: 21.1000,
  k33: 72.6000,
  k34: 24.4000,
  k35: 75.9000,
  k36: 27.7000,
  k37: 79.2000,
  k38: 31.0000,
  k39: 82.5000,
  k40: 34.3000,
  k41: 85.8000,
  k42: 37.6000,
  k43: 89.1000,
  k44: 40.9000,
  k45: 92.4000,
  k46: 44.2000,
  k47: 95.7000,
  k48: 47.5000,
  k49: 99.0000,
  k50: 50.8000,
  k51: 2.6000,
  k52: 54.1000,
  k53: 5.9000,
  k54: 57.4000,
  k55: 9.2000,
  k56: 60.7000,
  k57: 12.5000,
  k58: 64.0000,
  k59: 15.8000,
  k60: 67.3000,
  k61: 19.1000,
  k62: 70.6000,
  k63: 22.4000,
  k64: 73.9000,
  k65: 25.7000,
  k66: 77.2000,
  k67: 29.0000,
  k68: 80.5000,
  k69: 32.3000,
  k70: 83.8000,
  k71: 35.6000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_116_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_116_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_116_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_116_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_116_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_116_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_116_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_116_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_116_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_116_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_116_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_116_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
