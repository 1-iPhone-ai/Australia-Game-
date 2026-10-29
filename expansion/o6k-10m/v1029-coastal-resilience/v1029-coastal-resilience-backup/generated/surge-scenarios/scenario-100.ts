import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 100 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_100_META = {
  id: 'surge_100',
  regionId: 'SA' as V1029CresRegionId,
  primaryChannel: 'emergency_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'minimal' as V1029CresAdaptationBand,
  seed: 91621,
} as const;

const V1029_CRES_SURGE_SCENARIO_100_COEF = {
  k0: 86.1000,
  k1: 75.8000,
  k2: 65.5000,
  k3: 55.2000,
  k4: 44.9000,
  k5: 34.6000,
  k6: 24.3000,
  k7: 14.0000,
  k8: 3.7000,
  k9: 93.1000,
  k10: 82.8000,
  k11: 72.5000,
  k12: 62.2000,
  k13: 51.9000,
  k14: 41.6000,
  k15: 31.3000,
  k16: 21.0000,
  k17: 10.7000,
  k18: 0.4000,
  k19: 89.8000,
  k20: 79.5000,
  k21: 69.2000,
  k22: 58.9000,
  k23: 48.6000,
  k24: 38.3000,
  k25: 28.0000,
  k26: 17.7000,
  k27: 7.4000,
  k28: 96.8000,
  k29: 86.5000,
  k30: 76.2000,
  k31: 65.9000,
  k32: 55.6000,
  k33: 45.3000,
  k34: 35.0000,
  k35: 24.7000,
  k36: 14.4000,
  k37: 4.1000,
  k38: 93.5000,
  k39: 83.2000,
  k40: 72.9000,
  k41: 62.6000,
  k42: 52.3000,
  k43: 42.0000,
  k44: 31.7000,
  k45: 21.4000,
  k46: 11.1000,
  k47: 0.8000,
  k48: 90.2000,
  k49: 79.9000,
  k50: 69.6000,
  k51: 59.3000,
  k52: 49.0000,
  k53: 38.7000,
  k54: 28.4000,
  k55: 18.1000,
  k56: 7.8000,
  k57: 97.2000,
  k58: 86.9000,
  k59: 76.6000,
  k60: 66.3000,
  k61: 56.0000,
  k62: 45.7000,
  k63: 35.4000,
  k64: 25.1000,
  k65: 14.8000,
  k66: 4.5000,
  k67: 93.9000,
  k68: 83.6000,
  k69: 73.3000,
  k70: 63.0000,
  k71: 52.7000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_100_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_100_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_100_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_100_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_100_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_100_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_100_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_100_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_100_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_100_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_100_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_100_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
