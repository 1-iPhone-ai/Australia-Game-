import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 056 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_056_META = {
  id: 'surge_056',
  regionId: 'NSW' as V1029CresRegionId,
  primaryChannel: 'aged_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'moderate' as V1029CresAdaptationBand,
  seed: 51537,
} as const;

const V1029_CRES_SURGE_SCENARIO_056_COEF = {
  k0: 61.1000,
  k1: 30.4000,
  k2: 99.4000,
  k3: 68.7000,
  k4: 38.0000,
  k5: 7.3000,
  k6: 76.3000,
  k7: 45.6000,
  k8: 14.9000,
  k9: 83.9000,
  k10: 53.2000,
  k11: 22.5000,
  k12: 91.5000,
  k13: 60.8000,
  k14: 30.1000,
  k15: 99.1000,
  k16: 68.4000,
  k17: 37.7000,
  k18: 7.0000,
  k19: 76.0000,
  k20: 45.3000,
  k21: 14.6000,
  k22: 83.6000,
  k23: 52.9000,
  k24: 22.2000,
  k25: 91.2000,
  k26: 60.5000,
  k27: 29.8000,
  k28: 98.8000,
  k29: 68.1000,
  k30: 37.4000,
  k31: 6.7000,
  k32: 75.7000,
  k33: 45.0000,
  k34: 14.3000,
  k35: 83.3000,
  k36: 52.6000,
  k37: 21.9000,
  k38: 90.9000,
  k39: 60.2000,
  k40: 29.5000,
  k41: 98.5000,
  k42: 67.8000,
  k43: 37.1000,
  k44: 6.4000,
  k45: 75.4000,
  k46: 44.7000,
  k47: 14.0000,
  k48: 83.0000,
  k49: 52.3000,
  k50: 21.6000,
  k51: 90.6000,
  k52: 59.9000,
  k53: 29.2000,
  k54: 98.2000,
  k55: 67.5000,
  k56: 36.8000,
  k57: 6.1000,
  k58: 75.1000,
  k59: 44.4000,
  k60: 13.7000,
  k61: 82.7000,
  k62: 52.0000,
  k63: 21.3000,
  k64: 90.3000,
  k65: 59.6000,
  k66: 28.9000,
  k67: 97.9000,
  k68: 67.2000,
  k69: 36.5000,
  k70: 5.8000,
  k71: 74.8000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_056_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_056_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_056_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_056_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_056_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_056_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_056_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_056_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_056_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_056_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_056_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_056_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
