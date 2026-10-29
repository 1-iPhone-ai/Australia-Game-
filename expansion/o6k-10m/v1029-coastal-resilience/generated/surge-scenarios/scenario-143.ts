import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 143 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_143_META = {
  id: 'surge_143',
  regionId: 'ACT' as V1029CresRegionId,
  primaryChannel: 'telehealth' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'critical' as V1029CresAdaptationBand,
  seed: 130794,
} as const;

const V1029_CRES_SURGE_SCENARIO_143_COEF = {
  k0: 6.3000,
  k1: 25.0000,
  k2: 43.7000,
  k3: 62.4000,
  k4: 81.1000,
  k5: 0.1000,
  k6: 18.8000,
  k7: 37.5000,
  k8: 56.2000,
  k9: 74.9000,
  k10: 93.6000,
  k11: 12.6000,
  k12: 31.3000,
  k13: 50.0000,
  k14: 68.7000,
  k15: 87.4000,
  k16: 6.4000,
  k17: 25.1000,
  k18: 43.8000,
  k19: 62.5000,
  k20: 81.2000,
  k21: 0.2000,
  k22: 18.9000,
  k23: 37.6000,
  k24: 56.3000,
  k25: 75.0000,
  k26: 93.7000,
  k27: 12.7000,
  k28: 31.4000,
  k29: 50.1000,
  k30: 68.8000,
  k31: 87.5000,
  k32: 6.5000,
  k33: 25.2000,
  k34: 43.9000,
  k35: 62.6000,
  k36: 81.3000,
  k37: 0.3000,
  k38: 19.0000,
  k39: 37.7000,
  k40: 56.4000,
  k41: 75.1000,
  k42: 93.8000,
  k43: 12.8000,
  k44: 31.5000,
  k45: 50.2000,
  k46: 68.9000,
  k47: 87.6000,
  k48: 6.6000,
  k49: 25.3000,
  k50: 44.0000,
  k51: 62.7000,
  k52: 81.4000,
  k53: 0.4000,
  k54: 19.1000,
  k55: 37.8000,
  k56: 56.5000,
  k57: 75.2000,
  k58: 93.9000,
  k59: 12.9000,
  k60: 31.6000,
  k61: 50.3000,
  k62: 69.0000,
  k63: 87.7000,
  k64: 6.7000,
  k65: 25.4000,
  k66: 44.1000,
  k67: 62.8000,
  k68: 81.5000,
  k69: 0.5000,
  k70: 19.2000,
  k71: 37.9000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_143_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_143_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_143_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_143_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_143_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_143_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_143_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_143_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_143_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_143_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_143_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_143_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
