import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 059 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_059_META = {
  id: 'surge_059',
  regionId: 'WA' as V1029CresRegionId,
  primaryChannel: 'remote' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'recovering' as V1029CresAdaptationBand,
  seed: 54270,
} as const;

const V1029_CRES_SURGE_SCENARIO_059_COEF = {
  k0: 76.4000,
  k1: 19.9000,
  k2: 63.1000,
  k3: 6.6000,
  k4: 49.8000,
  k5: 93.0000,
  k6: 36.5000,
  k7: 79.7000,
  k8: 23.2000,
  k9: 66.4000,
  k10: 9.9000,
  k11: 53.1000,
  k12: 96.3000,
  k13: 39.8000,
  k14: 83.0000,
  k15: 26.5000,
  k16: 69.7000,
  k17: 13.2000,
  k18: 56.4000,
  k19: 99.6000,
  k20: 43.1000,
  k21: 86.3000,
  k22: 29.8000,
  k23: 73.0000,
  k24: 16.5000,
  k25: 59.7000,
  k26: 3.2000,
  k27: 46.4000,
  k28: 89.6000,
  k29: 33.1000,
  k30: 76.3000,
  k31: 19.8000,
  k32: 63.0000,
  k33: 6.5000,
  k34: 49.7000,
  k35: 92.9000,
  k36: 36.4000,
  k37: 79.6000,
  k38: 23.1000,
  k39: 66.3000,
  k40: 9.8000,
  k41: 53.0000,
  k42: 96.2000,
  k43: 39.7000,
  k44: 82.9000,
  k45: 26.4000,
  k46: 69.6000,
  k47: 13.1000,
  k48: 56.3000,
  k49: 99.5000,
  k50: 43.0000,
  k51: 86.2000,
  k52: 29.7000,
  k53: 72.9000,
  k54: 16.4000,
  k55: 59.6000,
  k56: 3.1000,
  k57: 46.3000,
  k58: 89.5000,
  k59: 33.0000,
  k60: 76.2000,
  k61: 19.7000,
  k62: 62.9000,
  k63: 6.4000,
  k64: 49.6000,
  k65: 92.8000,
  k66: 36.3000,
  k67: 79.5000,
  k68: 23.0000,
  k69: 66.2000,
  k70: 9.7000,
  k71: 52.9000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_059_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_059_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_059_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_059_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_059_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_059_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_059_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_059_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_059_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_059_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_059_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_059_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
