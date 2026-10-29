import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 044 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_044_META = {
  id: 'surge_044',
  regionId: 'SA' as V1029CresRegionId,
  primaryChannel: 'rural_clinic' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'recovering' as V1029CresAdaptationBand,
  seed: 40605,
} as const;

const V1029_CRES_SURGE_SCENARIO_044_COEF = {
  k0: 99.6000,
  k1: 72.4000,
  k2: 45.2000,
  k3: 18.0000,
  k4: 90.5000,
  k5: 63.3000,
  k6: 36.1000,
  k7: 8.9000,
  k8: 81.4000,
  k9: 54.2000,
  k10: 27.0000,
  k11: 99.5000,
  k12: 72.3000,
  k13: 45.1000,
  k14: 17.9000,
  k15: 90.4000,
  k16: 63.2000,
  k17: 36.0000,
  k18: 8.8000,
  k19: 81.3000,
  k20: 54.1000,
  k21: 26.9000,
  k22: 99.4000,
  k23: 72.2000,
  k24: 45.0000,
  k25: 17.8000,
  k26: 90.3000,
  k27: 63.1000,
  k28: 35.9000,
  k29: 8.7000,
  k30: 81.2000,
  k31: 54.0000,
  k32: 26.8000,
  k33: 99.3000,
  k34: 72.1000,
  k35: 44.9000,
  k36: 17.7000,
  k37: 90.2000,
  k38: 63.0000,
  k39: 35.8000,
  k40: 8.6000,
  k41: 81.1000,
  k42: 53.9000,
  k43: 26.7000,
  k44: 99.2000,
  k45: 72.0000,
  k46: 44.8000,
  k47: 17.6000,
  k48: 90.1000,
  k49: 62.9000,
  k50: 35.7000,
  k51: 8.5000,
  k52: 81.0000,
  k53: 53.8000,
  k54: 26.6000,
  k55: 99.1000,
  k56: 71.9000,
  k57: 44.7000,
  k58: 17.5000,
  k59: 90.0000,
  k60: 62.8000,
  k61: 35.6000,
  k62: 8.4000,
  k63: 80.9000,
  k64: 53.7000,
  k65: 26.5000,
  k66: 99.0000,
  k67: 71.8000,
  k68: 44.6000,
  k69: 17.4000,
  k70: 89.9000,
  k71: 62.7000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_044_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_044_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_044_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_044_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_044_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_044_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_044_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_044_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_044_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_044_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_044_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_044_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
