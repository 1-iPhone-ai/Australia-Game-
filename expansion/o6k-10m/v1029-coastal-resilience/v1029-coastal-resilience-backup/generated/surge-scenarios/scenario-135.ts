import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 135 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_135_META = {
  id: 'surge_135',
  regionId: 'ACT' as V1029CresRegionId,
  primaryChannel: 'specialist_referral' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'minimal' as V1029CresAdaptationBand,
  seed: 123506,
} as const;

const V1029_CRES_SURGE_SCENARIO_135_COEF = {
  k0: 65.2000,
  k1: 53.0000,
  k2: 40.8000,
  k3: 28.6000,
  k4: 16.4000,
  k5: 4.2000,
  k6: 91.7000,
  k7: 79.5000,
  k8: 67.3000,
  k9: 55.1000,
  k10: 42.9000,
  k11: 30.7000,
  k12: 18.5000,
  k13: 6.3000,
  k14: 93.8000,
  k15: 81.6000,
  k16: 69.4000,
  k17: 57.2000,
  k18: 45.0000,
  k19: 32.8000,
  k20: 20.6000,
  k21: 8.4000,
  k22: 95.9000,
  k23: 83.7000,
  k24: 71.5000,
  k25: 59.3000,
  k26: 47.1000,
  k27: 34.9000,
  k28: 22.7000,
  k29: 10.5000,
  k30: 98.0000,
  k31: 85.8000,
  k32: 73.6000,
  k33: 61.4000,
  k34: 49.2000,
  k35: 37.0000,
  k36: 24.8000,
  k37: 12.6000,
  k38: 0.4000,
  k39: 87.9000,
  k40: 75.7000,
  k41: 63.5000,
  k42: 51.3000,
  k43: 39.1000,
  k44: 26.9000,
  k45: 14.7000,
  k46: 2.5000,
  k47: 90.0000,
  k48: 77.8000,
  k49: 65.6000,
  k50: 53.4000,
  k51: 41.2000,
  k52: 29.0000,
  k53: 16.8000,
  k54: 4.6000,
  k55: 92.1000,
  k56: 79.9000,
  k57: 67.7000,
  k58: 55.5000,
  k59: 43.3000,
  k60: 31.1000,
  k61: 18.9000,
  k62: 6.7000,
  k63: 94.2000,
  k64: 82.0000,
  k65: 69.8000,
  k66: 57.6000,
  k67: 45.4000,
  k68: 33.2000,
  k69: 21.0000,
  k70: 8.8000,
  k71: 96.3000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_135_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_135_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_135_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_135_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_135_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_135_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_135_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_135_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_135_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_135_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_135_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_135_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
