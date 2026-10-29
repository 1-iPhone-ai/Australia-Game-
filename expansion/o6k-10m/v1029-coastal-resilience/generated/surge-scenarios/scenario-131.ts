import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 131 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_131_META = {
  id: 'surge_131',
  regionId: 'WA' as V1029CresRegionId,
  primaryChannel: 'primary_access' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'moderate' as V1029CresAdaptationBand,
  seed: 119862,
} as const;

const V1029_CRES_SURGE_SCENARIO_131_COEF = {
  k0: 44.8000,
  k1: 67.0000,
  k2: 89.2000,
  k3: 11.7000,
  k4: 33.9000,
  k5: 56.1000,
  k6: 78.3000,
  k7: 0.8000,
  k8: 23.0000,
  k9: 45.2000,
  k10: 67.4000,
  k11: 89.6000,
  k12: 12.1000,
  k13: 34.3000,
  k14: 56.5000,
  k15: 78.7000,
  k16: 1.2000,
  k17: 23.4000,
  k18: 45.6000,
  k19: 67.8000,
  k20: 90.0000,
  k21: 12.5000,
  k22: 34.7000,
  k23: 56.9000,
  k24: 79.1000,
  k25: 1.6000,
  k26: 23.8000,
  k27: 46.0000,
  k28: 68.2000,
  k29: 90.4000,
  k30: 12.9000,
  k31: 35.1000,
  k32: 57.3000,
  k33: 79.5000,
  k34: 2.0000,
  k35: 24.2000,
  k36: 46.4000,
  k37: 68.6000,
  k38: 90.8000,
  k39: 13.3000,
  k40: 35.5000,
  k41: 57.7000,
  k42: 79.9000,
  k43: 2.4000,
  k44: 24.6000,
  k45: 46.8000,
  k46: 69.0000,
  k47: 91.2000,
  k48: 13.7000,
  k49: 35.9000,
  k50: 58.1000,
  k51: 80.3000,
  k52: 2.8000,
  k53: 25.0000,
  k54: 47.2000,
  k55: 69.4000,
  k56: 91.6000,
  k57: 14.1000,
  k58: 36.3000,
  k59: 58.5000,
  k60: 80.7000,
  k61: 3.2000,
  k62: 25.4000,
  k63: 47.6000,
  k64: 69.8000,
  k65: 92.0000,
  k66: 14.5000,
  k67: 36.7000,
  k68: 58.9000,
  k69: 81.1000,
  k70: 3.6000,
  k71: 25.8000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_131_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_131_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_131_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_131_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_131_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_131_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_131_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_131_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_131_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_131_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_131_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_131_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
