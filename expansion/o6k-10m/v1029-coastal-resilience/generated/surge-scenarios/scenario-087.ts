import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 087 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_087_META = {
  id: 'surge_087',
  regionId: 'ACT' as V1029CresRegionId,
  primaryChannel: 'mental_health' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'elevated' as V1029CresAdaptationBand,
  seed: 79778,
} as const;

const V1029_CRES_SURGE_SCENARIO_087_COEF = {
  k0: 19.8000,
  k1: 21.6000,
  k2: 23.4000,
  k3: 25.2000,
  k4: 27.0000,
  k5: 28.8000,
  k6: 30.6000,
  k7: 32.4000,
  k8: 34.2000,
  k9: 36.0000,
  k10: 37.8000,
  k11: 39.6000,
  k12: 41.4000,
  k13: 43.2000,
  k14: 45.0000,
  k15: 46.8000,
  k16: 48.6000,
  k17: 50.4000,
  k18: 52.2000,
  k19: 54.0000,
  k20: 55.8000,
  k21: 57.6000,
  k22: 59.4000,
  k23: 61.2000,
  k24: 63.0000,
  k25: 64.8000,
  k26: 66.6000,
  k27: 68.4000,
  k28: 70.2000,
  k29: 72.0000,
  k30: 73.8000,
  k31: 75.6000,
  k32: 77.4000,
  k33: 79.2000,
  k34: 81.0000,
  k35: 82.8000,
  k36: 84.6000,
  k37: 86.4000,
  k38: 88.2000,
  k39: 90.0000,
  k40: 91.8000,
  k41: 93.6000,
  k42: 95.4000,
  k43: 97.2000,
  k44: 99.0000,
  k45: 1.1000,
  k46: 2.9000,
  k47: 4.7000,
  k48: 6.5000,
  k49: 8.3000,
  k50: 10.1000,
  k51: 11.9000,
  k52: 13.7000,
  k53: 15.5000,
  k54: 17.3000,
  k55: 19.1000,
  k56: 20.9000,
  k57: 22.7000,
  k58: 24.5000,
  k59: 26.3000,
  k60: 28.1000,
  k61: 29.9000,
  k62: 31.7000,
  k63: 33.5000,
  k64: 35.3000,
  k65: 37.1000,
  k66: 38.9000,
  k67: 40.7000,
  k68: 42.5000,
  k69: 44.3000,
  k70: 46.1000,
  k71: 47.9000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_087_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_087_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_087_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_087_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_087_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_087_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_087_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_087_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_087_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_087_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_087_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_087_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
