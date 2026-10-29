import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 099 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_099_META = {
  id: 'surge_099',
  regionId: 'WA' as V1029CresRegionId,
  primaryChannel: 'remote' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'recovering' as V1029CresAdaptationBand,
  seed: 90710,
} as const;

const V1029_CRES_SURGE_SCENARIO_099_COEF = {
  k0: 81.0000,
  k1: 79.3000,
  k2: 77.6000,
  k3: 75.9000,
  k4: 74.2000,
  k5: 72.5000,
  k6: 70.8000,
  k7: 69.1000,
  k8: 67.4000,
  k9: 65.7000,
  k10: 64.0000,
  k11: 62.3000,
  k12: 60.6000,
  k13: 58.9000,
  k14: 57.2000,
  k15: 55.5000,
  k16: 53.8000,
  k17: 52.1000,
  k18: 50.4000,
  k19: 48.7000,
  k20: 47.0000,
  k21: 45.3000,
  k22: 43.6000,
  k23: 41.9000,
  k24: 40.2000,
  k25: 38.5000,
  k26: 36.8000,
  k27: 35.1000,
  k28: 33.4000,
  k29: 31.7000,
  k30: 30.0000,
  k31: 28.3000,
  k32: 26.6000,
  k33: 24.9000,
  k34: 23.2000,
  k35: 21.5000,
  k36: 19.8000,
  k37: 18.1000,
  k38: 16.4000,
  k39: 14.7000,
  k40: 13.0000,
  k41: 11.3000,
  k42: 9.6000,
  k43: 7.9000,
  k44: 6.2000,
  k45: 4.5000,
  k46: 2.8000,
  k47: 1.1000,
  k48: 99.1000,
  k49: 97.4000,
  k50: 95.7000,
  k51: 94.0000,
  k52: 92.3000,
  k53: 90.6000,
  k54: 88.9000,
  k55: 87.2000,
  k56: 85.5000,
  k57: 83.8000,
  k58: 82.1000,
  k59: 80.4000,
  k60: 78.7000,
  k61: 77.0000,
  k62: 75.3000,
  k63: 73.6000,
  k64: 71.9000,
  k65: 70.2000,
  k66: 68.5000,
  k67: 66.8000,
  k68: 65.1000,
  k69: 63.4000,
  k70: 61.7000,
  k71: 60.0000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_099_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_099_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_099_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_099_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_099_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_099_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_099_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_099_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_099_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_099_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_099_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_099_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
