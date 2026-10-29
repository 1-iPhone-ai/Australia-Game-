import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 170 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_170_META = {
  id: 'surge_170',
  regionId: 'QLD' as V1029CresRegionId,
  primaryChannel: 'emergency_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'minimal' as V1029CresAdaptationBand,
  seed: 155391,
} as const;

const V1029_CRES_SURGE_SCENARIO_170_COEF = {
  k0: 44.3000,
  k1: 30.2000,
  k2: 16.1000,
  k3: 2.0000,
  k4: 87.6000,
  k5: 73.5000,
  k6: 59.4000,
  k7: 45.3000,
  k8: 31.2000,
  k9: 17.1000,
  k10: 3.0000,
  k11: 88.6000,
  k12: 74.5000,
  k13: 60.4000,
  k14: 46.3000,
  k15: 32.2000,
  k16: 18.1000,
  k17: 4.0000,
  k18: 89.6000,
  k19: 75.5000,
  k20: 61.4000,
  k21: 47.3000,
  k22: 33.2000,
  k23: 19.1000,
  k24: 5.0000,
  k25: 90.6000,
  k26: 76.5000,
  k27: 62.4000,
  k28: 48.3000,
  k29: 34.2000,
  k30: 20.1000,
  k31: 6.0000,
  k32: 91.6000,
  k33: 77.5000,
  k34: 63.4000,
  k35: 49.3000,
  k36: 35.2000,
  k37: 21.1000,
  k38: 7.0000,
  k39: 92.6000,
  k40: 78.5000,
  k41: 64.4000,
  k42: 50.3000,
  k43: 36.2000,
  k44: 22.1000,
  k45: 8.0000,
  k46: 93.6000,
  k47: 79.5000,
  k48: 65.4000,
  k49: 51.3000,
  k50: 37.2000,
  k51: 23.1000,
  k52: 9.0000,
  k53: 94.6000,
  k54: 80.5000,
  k55: 66.4000,
  k56: 52.3000,
  k57: 38.2000,
  k58: 24.1000,
  k59: 10.0000,
  k60: 95.6000,
  k61: 81.5000,
  k62: 67.4000,
  k63: 53.3000,
  k64: 39.2000,
  k65: 25.1000,
  k66: 11.0000,
  k67: 96.6000,
  k68: 82.5000,
  k69: 68.4000,
  k70: 54.3000,
  k71: 40.2000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_170_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_170_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_170_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_170_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_170_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_170_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_170_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_170_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_170_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_170_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_170_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_170_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
