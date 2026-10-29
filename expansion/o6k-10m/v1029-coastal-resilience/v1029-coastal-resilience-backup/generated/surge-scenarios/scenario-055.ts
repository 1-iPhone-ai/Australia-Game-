import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 055 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_055_META = {
  id: 'surge_055',
  regionId: 'ACT' as V1029CresRegionId,
  primaryChannel: 'specialist_referral' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'minimal' as V1029CresAdaptationBand,
  seed: 50626,
} as const;

const V1029_CRES_SURGE_SCENARIO_055_COEF = {
  k0: 56.0000,
  k1: 33.9000,
  k2: 11.8000,
  k3: 89.4000,
  k4: 67.3000,
  k5: 45.2000,
  k6: 23.1000,
  k7: 1.0000,
  k8: 78.6000,
  k9: 56.5000,
  k10: 34.4000,
  k11: 12.3000,
  k12: 89.9000,
  k13: 67.8000,
  k14: 45.7000,
  k15: 23.6000,
  k16: 1.5000,
  k17: 79.1000,
  k18: 57.0000,
  k19: 34.9000,
  k20: 12.8000,
  k21: 90.4000,
  k22: 68.3000,
  k23: 46.2000,
  k24: 24.1000,
  k25: 2.0000,
  k26: 79.6000,
  k27: 57.5000,
  k28: 35.4000,
  k29: 13.3000,
  k30: 90.9000,
  k31: 68.8000,
  k32: 46.7000,
  k33: 24.6000,
  k34: 2.5000,
  k35: 80.1000,
  k36: 58.0000,
  k37: 35.9000,
  k38: 13.8000,
  k39: 91.4000,
  k40: 69.3000,
  k41: 47.2000,
  k42: 25.1000,
  k43: 3.0000,
  k44: 80.6000,
  k45: 58.5000,
  k46: 36.4000,
  k47: 14.3000,
  k48: 91.9000,
  k49: 69.8000,
  k50: 47.7000,
  k51: 25.6000,
  k52: 3.5000,
  k53: 81.1000,
  k54: 59.0000,
  k55: 36.9000,
  k56: 14.8000,
  k57: 92.4000,
  k58: 70.3000,
  k59: 48.2000,
  k60: 26.1000,
  k61: 4.0000,
  k62: 81.6000,
  k63: 59.5000,
  k64: 37.4000,
  k65: 15.3000,
  k66: 92.9000,
  k67: 70.8000,
  k68: 48.7000,
  k69: 26.6000,
  k70: 4.5000,
  k71: 82.1000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_055_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_055_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_055_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_055_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_055_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_055_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_055_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_055_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_055_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_055_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_055_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_055_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
