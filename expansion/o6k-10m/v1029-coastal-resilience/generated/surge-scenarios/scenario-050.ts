import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 050 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_050_META = {
  id: 'surge_050',
  regionId: 'QLD' as V1029CresRegionId,
  primaryChannel: 'emergency_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'minimal' as V1029CresAdaptationBand,
  seed: 46071,
} as const;

const V1029_CRES_SURGE_SCENARIO_050_COEF = {
  k0: 30.5000,
  k1: 51.4000,
  k2: 72.3000,
  k3: 93.2000,
  k4: 14.4000,
  k5: 35.3000,
  k6: 56.2000,
  k7: 77.1000,
  k8: 98.0000,
  k9: 19.2000,
  k10: 40.1000,
  k11: 61.0000,
  k12: 81.9000,
  k13: 3.1000,
  k14: 24.0000,
  k15: 44.9000,
  k16: 65.8000,
  k17: 86.7000,
  k18: 7.9000,
  k19: 28.8000,
  k20: 49.7000,
  k21: 70.6000,
  k22: 91.5000,
  k23: 12.7000,
  k24: 33.6000,
  k25: 54.5000,
  k26: 75.4000,
  k27: 96.3000,
  k28: 17.5000,
  k29: 38.4000,
  k30: 59.3000,
  k31: 80.2000,
  k32: 1.4000,
  k33: 22.3000,
  k34: 43.2000,
  k35: 64.1000,
  k36: 85.0000,
  k37: 6.2000,
  k38: 27.1000,
  k39: 48.0000,
  k40: 68.9000,
  k41: 89.8000,
  k42: 11.0000,
  k43: 31.9000,
  k44: 52.8000,
  k45: 73.7000,
  k46: 94.6000,
  k47: 15.8000,
  k48: 36.7000,
  k49: 57.6000,
  k50: 78.5000,
  k51: 99.4000,
  k52: 20.6000,
  k53: 41.5000,
  k54: 62.4000,
  k55: 83.3000,
  k56: 4.5000,
  k57: 25.4000,
  k58: 46.3000,
  k59: 67.2000,
  k60: 88.1000,
  k61: 9.3000,
  k62: 30.2000,
  k63: 51.1000,
  k64: 72.0000,
  k65: 92.9000,
  k66: 14.1000,
  k67: 35.0000,
  k68: 55.9000,
  k69: 76.8000,
  k70: 97.7000,
  k71: 18.9000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_050_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_050_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_050_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_050_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_050_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_050_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_050_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_050_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_050_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_050_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_050_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_050_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
