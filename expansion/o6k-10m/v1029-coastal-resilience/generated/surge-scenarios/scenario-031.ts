import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 031 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_031_META = {
  id: 'surge_031',
  regionId: 'ACT' as V1029CresRegionId,
  primaryChannel: 'primary_access' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'moderate' as V1029CresAdaptationBand,
  seed: 28762,
} as const;

const V1029_CRES_SURGE_SCENARIO_031_COEF = {
  k0: 33.3000,
  k1: 18.2000,
  k2: 3.1000,
  k3: 87.7000,
  k4: 72.6000,
  k5: 57.5000,
  k6: 42.4000,
  k7: 27.3000,
  k8: 12.2000,
  k9: 96.8000,
  k10: 81.7000,
  k11: 66.6000,
  k12: 51.5000,
  k13: 36.4000,
  k14: 21.3000,
  k15: 6.2000,
  k16: 90.8000,
  k17: 75.7000,
  k18: 60.6000,
  k19: 45.5000,
  k20: 30.4000,
  k21: 15.3000,
  k22: 0.2000,
  k23: 84.8000,
  k24: 69.7000,
  k25: 54.6000,
  k26: 39.5000,
  k27: 24.4000,
  k28: 9.3000,
  k29: 93.9000,
  k30: 78.8000,
  k31: 63.7000,
  k32: 48.6000,
  k33: 33.5000,
  k34: 18.4000,
  k35: 3.3000,
  k36: 87.9000,
  k37: 72.8000,
  k38: 57.7000,
  k39: 42.6000,
  k40: 27.5000,
  k41: 12.4000,
  k42: 97.0000,
  k43: 81.9000,
  k44: 66.8000,
  k45: 51.7000,
  k46: 36.6000,
  k47: 21.5000,
  k48: 6.4000,
  k49: 91.0000,
  k50: 75.9000,
  k51: 60.8000,
  k52: 45.7000,
  k53: 30.6000,
  k54: 15.5000,
  k55: 0.4000,
  k56: 85.0000,
  k57: 69.9000,
  k58: 54.8000,
  k59: 39.7000,
  k60: 24.6000,
  k61: 9.5000,
  k62: 94.1000,
  k63: 79.0000,
  k64: 63.9000,
  k65: 48.8000,
  k66: 33.7000,
  k67: 18.6000,
  k68: 3.5000,
  k69: 88.1000,
  k70: 73.0000,
  k71: 57.9000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_031_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_031_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_031_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_031_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_031_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_031_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_031_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_031_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_031_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_031_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_031_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_031_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
