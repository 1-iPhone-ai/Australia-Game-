import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 052 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_052_META = {
  id: 'surge_052',
  regionId: 'SA' as V1029CresRegionId,
  primaryChannel: 'littoral_zone' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'elevated' as V1029CresAdaptationBand,
  seed: 47893,
} as const;

const V1029_CRES_SURGE_SCENARIO_052_COEF = {
  k0: 40.7000,
  k1: 44.4000,
  k2: 48.1000,
  k3: 51.8000,
  k4: 55.5000,
  k5: 59.2000,
  k6: 62.9000,
  k7: 66.6000,
  k8: 70.3000,
  k9: 74.0000,
  k10: 77.7000,
  k11: 81.4000,
  k12: 85.1000,
  k13: 88.8000,
  k14: 92.5000,
  k15: 96.2000,
  k16: 0.2000,
  k17: 3.9000,
  k18: 7.6000,
  k19: 11.3000,
  k20: 15.0000,
  k21: 18.7000,
  k22: 22.4000,
  k23: 26.1000,
  k24: 29.8000,
  k25: 33.5000,
  k26: 37.2000,
  k27: 40.9000,
  k28: 44.6000,
  k29: 48.3000,
  k30: 52.0000,
  k31: 55.7000,
  k32: 59.4000,
  k33: 63.1000,
  k34: 66.8000,
  k35: 70.5000,
  k36: 74.2000,
  k37: 77.9000,
  k38: 81.6000,
  k39: 85.3000,
  k40: 89.0000,
  k41: 92.7000,
  k42: 96.4000,
  k43: 0.4000,
  k44: 4.1000,
  k45: 7.8000,
  k46: 11.5000,
  k47: 15.2000,
  k48: 18.9000,
  k49: 22.6000,
  k50: 26.3000,
  k51: 30.0000,
  k52: 33.7000,
  k53: 37.4000,
  k54: 41.1000,
  k55: 44.8000,
  k56: 48.5000,
  k57: 52.2000,
  k58: 55.9000,
  k59: 59.6000,
  k60: 63.3000,
  k61: 67.0000,
  k62: 70.7000,
  k63: 74.4000,
  k64: 78.1000,
  k65: 81.8000,
  k66: 85.5000,
  k67: 89.2000,
  k68: 92.9000,
  k69: 96.6000,
  k70: 0.6000,
  k71: 4.3000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_052_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_052_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_052_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_052_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_052_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_052_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_052_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_052_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_052_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_052_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_052_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_052_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
