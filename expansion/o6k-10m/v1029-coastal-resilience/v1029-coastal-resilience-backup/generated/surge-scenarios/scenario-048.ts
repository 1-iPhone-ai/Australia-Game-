import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 048 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_048_META = {
  id: 'surge_048',
  regionId: 'NSW' as V1029CresRegionId,
  primaryChannel: 'regional' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'critical' as V1029CresAdaptationBand,
  seed: 44249,
} as const;

const V1029_CRES_SURGE_SCENARIO_048_COEF = {
  k0: 20.3000,
  k1: 58.4000,
  k2: 96.5000,
  k3: 34.9000,
  k4: 73.0000,
  k5: 11.4000,
  k6: 49.5000,
  k7: 87.6000,
  k8: 26.0000,
  k9: 64.1000,
  k10: 2.5000,
  k11: 40.6000,
  k12: 78.7000,
  k13: 17.1000,
  k14: 55.2000,
  k15: 93.3000,
  k16: 31.7000,
  k17: 69.8000,
  k18: 8.2000,
  k19: 46.3000,
  k20: 84.4000,
  k21: 22.8000,
  k22: 60.9000,
  k23: 99.0000,
  k24: 37.4000,
  k25: 75.5000,
  k26: 13.9000,
  k27: 52.0000,
  k28: 90.1000,
  k29: 28.5000,
  k30: 66.6000,
  k31: 5.0000,
  k32: 43.1000,
  k33: 81.2000,
  k34: 19.6000,
  k35: 57.7000,
  k36: 95.8000,
  k37: 34.2000,
  k38: 72.3000,
  k39: 10.7000,
  k40: 48.8000,
  k41: 86.9000,
  k42: 25.3000,
  k43: 63.4000,
  k44: 1.8000,
  k45: 39.9000,
  k46: 78.0000,
  k47: 16.4000,
  k48: 54.5000,
  k49: 92.6000,
  k50: 31.0000,
  k51: 69.1000,
  k52: 7.5000,
  k53: 45.6000,
  k54: 83.7000,
  k55: 22.1000,
  k56: 60.2000,
  k57: 98.3000,
  k58: 36.7000,
  k59: 74.8000,
  k60: 13.2000,
  k61: 51.3000,
  k62: 89.4000,
  k63: 27.8000,
  k64: 65.9000,
  k65: 4.3000,
  k66: 42.4000,
  k67: 80.5000,
  k68: 18.9000,
  k69: 57.0000,
  k70: 95.1000,
  k71: 33.5000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_048_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_048_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_048_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_048_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_048_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_048_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_048_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_048_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_048_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_048_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_048_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_048_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
