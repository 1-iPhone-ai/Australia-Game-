import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 082 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_082_META = {
  id: 'surge_082',
  regionId: 'QLD' as V1029CresRegionId,
  primaryChannel: 'littoral_zone' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'elevated' as V1029CresAdaptationBand,
  seed: 75223,
} as const;

const V1029_CRES_SURGE_SCENARIO_082_COEF = {
  k0: 94.0000,
  k1: 39.1000,
  k2: 83.9000,
  k3: 29.0000,
  k4: 73.8000,
  k5: 18.9000,
  k6: 63.7000,
  k7: 8.8000,
  k8: 53.6000,
  k9: 98.4000,
  k10: 43.5000,
  k11: 88.3000,
  k12: 33.4000,
  k13: 78.2000,
  k14: 23.3000,
  k15: 68.1000,
  k16: 13.2000,
  k17: 58.0000,
  k18: 3.1000,
  k19: 47.9000,
  k20: 92.7000,
  k21: 37.8000,
  k22: 82.6000,
  k23: 27.7000,
  k24: 72.5000,
  k25: 17.6000,
  k26: 62.4000,
  k27: 7.5000,
  k28: 52.3000,
  k29: 97.1000,
  k30: 42.2000,
  k31: 87.0000,
  k32: 32.1000,
  k33: 76.9000,
  k34: 22.0000,
  k35: 66.8000,
  k36: 11.9000,
  k37: 56.7000,
  k38: 1.8000,
  k39: 46.6000,
  k40: 91.4000,
  k41: 36.5000,
  k42: 81.3000,
  k43: 26.4000,
  k44: 71.2000,
  k45: 16.3000,
  k46: 61.1000,
  k47: 6.2000,
  k48: 51.0000,
  k49: 95.8000,
  k50: 40.9000,
  k51: 85.7000,
  k52: 30.8000,
  k53: 75.6000,
  k54: 20.7000,
  k55: 65.5000,
  k56: 10.6000,
  k57: 55.4000,
  k58: 0.5000,
  k59: 45.3000,
  k60: 90.1000,
  k61: 35.2000,
  k62: 80.0000,
  k63: 25.1000,
  k64: 69.9000,
  k65: 15.0000,
  k66: 59.8000,
  k67: 4.9000,
  k68: 49.7000,
  k69: 94.5000,
  k70: 39.6000,
  k71: 84.4000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_082_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_082_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_082_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_082_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_082_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_082_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_082_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_082_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_082_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_082_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_082_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_082_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
