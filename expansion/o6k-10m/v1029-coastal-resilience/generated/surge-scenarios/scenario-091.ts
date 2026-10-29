import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 091 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_091_META = {
  id: 'surge_091',
  regionId: 'WA' as V1029CresRegionId,
  primaryChannel: 'primary_access' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'moderate' as V1029CresAdaptationBand,
  seed: 83422,
} as const;

const V1029_CRES_SURGE_SCENARIO_091_COEF = {
  k0: 40.2000,
  k1: 7.6000,
  k2: 74.7000,
  k3: 42.1000,
  k4: 9.5000,
  k5: 76.6000,
  k6: 44.0000,
  k7: 11.4000,
  k8: 78.5000,
  k9: 45.9000,
  k10: 13.3000,
  k11: 80.4000,
  k12: 47.8000,
  k13: 15.2000,
  k14: 82.3000,
  k15: 49.7000,
  k16: 17.1000,
  k17: 84.2000,
  k18: 51.6000,
  k19: 19.0000,
  k20: 86.1000,
  k21: 53.5000,
  k22: 20.9000,
  k23: 88.0000,
  k24: 55.4000,
  k25: 22.8000,
  k26: 89.9000,
  k27: 57.3000,
  k28: 24.7000,
  k29: 91.8000,
  k30: 59.2000,
  k31: 26.6000,
  k32: 93.7000,
  k33: 61.1000,
  k34: 28.5000,
  k35: 95.6000,
  k36: 63.0000,
  k37: 30.4000,
  k38: 97.5000,
  k39: 64.9000,
  k40: 32.3000,
  k41: 99.4000,
  k42: 66.8000,
  k43: 34.2000,
  k44: 1.6000,
  k45: 68.7000,
  k46: 36.1000,
  k47: 3.5000,
  k48: 70.6000,
  k49: 38.0000,
  k50: 5.4000,
  k51: 72.5000,
  k52: 39.9000,
  k53: 7.3000,
  k54: 74.4000,
  k55: 41.8000,
  k56: 9.2000,
  k57: 76.3000,
  k58: 43.7000,
  k59: 11.1000,
  k60: 78.2000,
  k61: 45.6000,
  k62: 13.0000,
  k63: 80.1000,
  k64: 47.5000,
  k65: 14.9000,
  k66: 82.0000,
  k67: 49.4000,
  k68: 16.8000,
  k69: 83.9000,
  k70: 51.3000,
  k71: 18.7000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_091_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_091_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_091_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_091_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_091_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_091_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_091_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_091_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_091_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_091_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_091_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_091_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
