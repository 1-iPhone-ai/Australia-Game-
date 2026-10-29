import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 096 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_096_META = {
  id: 'surge_096',
  regionId: 'NSW' as V1029CresRegionId,
  primaryChannel: 'aged_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'moderate' as V1029CresAdaptationBand,
  seed: 87977,
} as const;

const V1029_CRES_SURGE_SCENARIO_096_COEF = {
  k0: 65.7000,
  k1: 89.8000,
  k2: 14.2000,
  k3: 38.3000,
  k4: 62.4000,
  k5: 86.5000,
  k6: 10.9000,
  k7: 35.0000,
  k8: 59.1000,
  k9: 83.2000,
  k10: 7.6000,
  k11: 31.7000,
  k12: 55.8000,
  k13: 79.9000,
  k14: 4.3000,
  k15: 28.4000,
  k16: 52.5000,
  k17: 76.6000,
  k18: 1.0000,
  k19: 25.1000,
  k20: 49.2000,
  k21: 73.3000,
  k22: 97.4000,
  k23: 21.8000,
  k24: 45.9000,
  k25: 70.0000,
  k26: 94.1000,
  k27: 18.5000,
  k28: 42.6000,
  k29: 66.7000,
  k30: 90.8000,
  k31: 15.2000,
  k32: 39.3000,
  k33: 63.4000,
  k34: 87.5000,
  k35: 11.9000,
  k36: 36.0000,
  k37: 60.1000,
  k38: 84.2000,
  k39: 8.6000,
  k40: 32.7000,
  k41: 56.8000,
  k42: 80.9000,
  k43: 5.3000,
  k44: 29.4000,
  k45: 53.5000,
  k46: 77.6000,
  k47: 2.0000,
  k48: 26.1000,
  k49: 50.2000,
  k50: 74.3000,
  k51: 98.4000,
  k52: 22.8000,
  k53: 46.9000,
  k54: 71.0000,
  k55: 95.1000,
  k56: 19.5000,
  k57: 43.6000,
  k58: 67.7000,
  k59: 91.8000,
  k60: 16.2000,
  k61: 40.3000,
  k62: 64.4000,
  k63: 88.5000,
  k64: 12.9000,
  k65: 37.0000,
  k66: 61.1000,
  k67: 85.2000,
  k68: 9.6000,
  k69: 33.7000,
  k70: 57.8000,
  k71: 81.9000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_096_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_096_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_096_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_096_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_096_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_096_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_096_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_096_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_096_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_096_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_096_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_096_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
