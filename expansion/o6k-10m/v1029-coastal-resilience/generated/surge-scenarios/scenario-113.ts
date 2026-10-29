import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 113 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_113_META = {
  id: 'surge_113',
  regionId: 'VIC' as V1029CresRegionId,
  primaryChannel: 'telehealth' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'critical' as V1029CresAdaptationBand,
  seed: 103464,
} as const;

const V1029_CRES_SURGE_SCENARIO_113_COEF = {
  k0: 52.7000,
  k1: 30.3000,
  k2: 7.9000,
  k3: 85.2000,
  k4: 62.8000,
  k5: 40.4000,
  k6: 18.0000,
  k7: 95.3000,
  k8: 72.9000,
  k9: 50.5000,
  k10: 28.1000,
  k11: 5.7000,
  k12: 83.0000,
  k13: 60.6000,
  k14: 38.2000,
  k15: 15.8000,
  k16: 93.1000,
  k17: 70.7000,
  k18: 48.3000,
  k19: 25.9000,
  k20: 3.5000,
  k21: 80.8000,
  k22: 58.4000,
  k23: 36.0000,
  k24: 13.6000,
  k25: 90.9000,
  k26: 68.5000,
  k27: 46.1000,
  k28: 23.7000,
  k29: 1.3000,
  k30: 78.6000,
  k31: 56.2000,
  k32: 33.8000,
  k33: 11.4000,
  k34: 88.7000,
  k35: 66.3000,
  k36: 43.9000,
  k37: 21.5000,
  k38: 98.8000,
  k39: 76.4000,
  k40: 54.0000,
  k41: 31.6000,
  k42: 9.2000,
  k43: 86.5000,
  k44: 64.1000,
  k45: 41.7000,
  k46: 19.3000,
  k47: 96.6000,
  k48: 74.2000,
  k49: 51.8000,
  k50: 29.4000,
  k51: 7.0000,
  k52: 84.3000,
  k53: 61.9000,
  k54: 39.5000,
  k55: 17.1000,
  k56: 94.4000,
  k57: 72.0000,
  k58: 49.6000,
  k59: 27.2000,
  k60: 4.8000,
  k61: 82.1000,
  k62: 59.7000,
  k63: 37.3000,
  k64: 14.9000,
  k65: 92.2000,
  k66: 69.8000,
  k67: 47.4000,
  k68: 25.0000,
  k69: 2.6000,
  k70: 79.9000,
  k71: 57.5000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_113_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_113_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_113_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_113_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_113_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_113_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_113_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_113_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_113_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_113_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_113_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_113_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
