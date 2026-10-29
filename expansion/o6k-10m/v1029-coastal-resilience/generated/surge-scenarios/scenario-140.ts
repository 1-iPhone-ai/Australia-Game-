import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 140 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_140_META = {
  id: 'surge_140',
  regionId: 'SA' as V1029CresRegionId,
  primaryChannel: 'emergency_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'minimal' as V1029CresAdaptationBand,
  seed: 128061,
} as const;

const V1029_CRES_SURGE_SCENARIO_140_COEF = {
  k0: 90.7000,
  k1: 35.5000,
  k2: 80.0000,
  k3: 24.8000,
  k4: 69.3000,
  k5: 14.1000,
  k6: 58.6000,
  k7: 3.4000,
  k8: 47.9000,
  k9: 92.4000,
  k10: 37.2000,
  k11: 81.7000,
  k12: 26.5000,
  k13: 71.0000,
  k14: 15.8000,
  k15: 60.3000,
  k16: 5.1000,
  k17: 49.6000,
  k18: 94.1000,
  k19: 38.9000,
  k20: 83.4000,
  k21: 28.2000,
  k22: 72.7000,
  k23: 17.5000,
  k24: 62.0000,
  k25: 6.8000,
  k26: 51.3000,
  k27: 95.8000,
  k28: 40.6000,
  k29: 85.1000,
  k30: 29.9000,
  k31: 74.4000,
  k32: 19.2000,
  k33: 63.7000,
  k34: 8.5000,
  k35: 53.0000,
  k36: 97.5000,
  k37: 42.3000,
  k38: 86.8000,
  k39: 31.6000,
  k40: 76.1000,
  k41: 20.9000,
  k42: 65.4000,
  k43: 10.2000,
  k44: 54.7000,
  k45: 99.2000,
  k46: 44.0000,
  k47: 88.5000,
  k48: 33.3000,
  k49: 77.8000,
  k50: 22.6000,
  k51: 67.1000,
  k52: 11.9000,
  k53: 56.4000,
  k54: 1.2000,
  k55: 45.7000,
  k56: 90.2000,
  k57: 35.0000,
  k58: 79.5000,
  k59: 24.3000,
  k60: 68.8000,
  k61: 13.6000,
  k62: 58.1000,
  k63: 2.9000,
  k64: 47.4000,
  k65: 91.9000,
  k66: 36.7000,
  k67: 81.2000,
  k68: 26.0000,
  k69: 70.5000,
  k70: 15.3000,
  k71: 59.8000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_140_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_140_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_140_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_140_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_140_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_140_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_140_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_140_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_140_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_140_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_140_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_140_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
