import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 030 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_030_META = {
  id: 'surge_030',
  regionId: 'NT' as V1029CresRegionId,
  primaryChannel: 'emergency_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'minimal' as V1029CresAdaptationBand,
  seed: 27851,
} as const;

const V1029_CRES_SURGE_SCENARIO_030_COEF = {
  k0: 28.2000,
  k1: 21.7000,
  k2: 15.2000,
  k3: 8.7000,
  k4: 2.2000,
  k5: 95.4000,
  k6: 88.9000,
  k7: 82.4000,
  k8: 75.9000,
  k9: 69.4000,
  k10: 62.9000,
  k11: 56.4000,
  k12: 49.9000,
  k13: 43.4000,
  k14: 36.9000,
  k15: 30.4000,
  k16: 23.9000,
  k17: 17.4000,
  k18: 10.9000,
  k19: 4.4000,
  k20: 97.6000,
  k21: 91.1000,
  k22: 84.6000,
  k23: 78.1000,
  k24: 71.6000,
  k25: 65.1000,
  k26: 58.6000,
  k27: 52.1000,
  k28: 45.6000,
  k29: 39.1000,
  k30: 32.6000,
  k31: 26.1000,
  k32: 19.6000,
  k33: 13.1000,
  k34: 6.6000,
  k35: 0.1000,
  k36: 93.3000,
  k37: 86.8000,
  k38: 80.3000,
  k39: 73.8000,
  k40: 67.3000,
  k41: 60.8000,
  k42: 54.3000,
  k43: 47.8000,
  k44: 41.3000,
  k45: 34.8000,
  k46: 28.3000,
  k47: 21.8000,
  k48: 15.3000,
  k49: 8.8000,
  k50: 2.3000,
  k51: 95.5000,
  k52: 89.0000,
  k53: 82.5000,
  k54: 76.0000,
  k55: 69.5000,
  k56: 63.0000,
  k57: 56.5000,
  k58: 50.0000,
  k59: 43.5000,
  k60: 37.0000,
  k61: 30.5000,
  k62: 24.0000,
  k63: 17.5000,
  k64: 11.0000,
  k65: 4.5000,
  k66: 97.7000,
  k67: 91.2000,
  k68: 84.7000,
  k69: 78.2000,
  k70: 71.7000,
  k71: 65.2000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_030_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_030_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_030_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_030_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_030_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_030_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_030_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_030_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_030_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_030_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_030_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_030_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
