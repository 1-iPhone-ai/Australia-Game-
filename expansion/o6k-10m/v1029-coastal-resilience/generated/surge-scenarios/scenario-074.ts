import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 074 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_074_META = {
  id: 'surge_074',
  regionId: 'QLD' as V1029CresRegionId,
  primaryChannel: 'rural_clinic' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'recovering' as V1029CresAdaptationBand,
  seed: 67935,
} as const;

const V1029_CRES_SURGE_SCENARIO_074_COEF = {
  k0: 53.2000,
  k1: 67.1000,
  k2: 81.0000,
  k3: 94.9000,
  k4: 9.1000,
  k5: 23.0000,
  k6: 36.9000,
  k7: 50.8000,
  k8: 64.7000,
  k9: 78.6000,
  k10: 92.5000,
  k11: 6.7000,
  k12: 20.6000,
  k13: 34.5000,
  k14: 48.4000,
  k15: 62.3000,
  k16: 76.2000,
  k17: 90.1000,
  k18: 4.3000,
  k19: 18.2000,
  k20: 32.1000,
  k21: 46.0000,
  k22: 59.9000,
  k23: 73.8000,
  k24: 87.7000,
  k25: 1.9000,
  k26: 15.8000,
  k27: 29.7000,
  k28: 43.6000,
  k29: 57.5000,
  k30: 71.4000,
  k31: 85.3000,
  k32: 99.2000,
  k33: 13.4000,
  k34: 27.3000,
  k35: 41.2000,
  k36: 55.1000,
  k37: 69.0000,
  k38: 82.9000,
  k39: 96.8000,
  k40: 11.0000,
  k41: 24.9000,
  k42: 38.8000,
  k43: 52.7000,
  k44: 66.6000,
  k45: 80.5000,
  k46: 94.4000,
  k47: 8.6000,
  k48: 22.5000,
  k49: 36.4000,
  k50: 50.3000,
  k51: 64.2000,
  k52: 78.1000,
  k53: 92.0000,
  k54: 6.2000,
  k55: 20.1000,
  k56: 34.0000,
  k57: 47.9000,
  k58: 61.8000,
  k59: 75.7000,
  k60: 89.6000,
  k61: 3.8000,
  k62: 17.7000,
  k63: 31.6000,
  k64: 45.5000,
  k65: 59.4000,
  k66: 73.3000,
  k67: 87.2000,
  k68: 1.4000,
  k69: 15.3000,
  k70: 29.2000,
  k71: 43.1000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_074_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_074_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_074_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_074_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_074_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_074_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_074_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_074_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_074_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_074_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_074_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_074_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
