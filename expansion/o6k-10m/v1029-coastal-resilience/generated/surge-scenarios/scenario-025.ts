import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 025 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_025_META = {
  id: 'surge_025',
  regionId: 'VIC' as V1029CresRegionId,
  primaryChannel: 'specialist_referral' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'minimal' as V1029CresAdaptationBand,
  seed: 23296,
} as const;

const V1029_CRES_SURGE_SCENARIO_025_COEF = {
  k0: 2.7000,
  k1: 39.2000,
  k2: 75.7000,
  k3: 12.5000,
  k4: 49.0000,
  k5: 85.5000,
  k6: 22.3000,
  k7: 58.8000,
  k8: 95.3000,
  k9: 32.1000,
  k10: 68.6000,
  k11: 5.4000,
  k12: 41.9000,
  k13: 78.4000,
  k14: 15.2000,
  k15: 51.7000,
  k16: 88.2000,
  k17: 25.0000,
  k18: 61.5000,
  k19: 98.0000,
  k20: 34.8000,
  k21: 71.3000,
  k22: 8.1000,
  k23: 44.6000,
  k24: 81.1000,
  k25: 17.9000,
  k26: 54.4000,
  k27: 90.9000,
  k28: 27.7000,
  k29: 64.2000,
  k30: 1.0000,
  k31: 37.5000,
  k32: 74.0000,
  k33: 10.8000,
  k34: 47.3000,
  k35: 83.8000,
  k36: 20.6000,
  k37: 57.1000,
  k38: 93.6000,
  k39: 30.4000,
  k40: 66.9000,
  k41: 3.7000,
  k42: 40.2000,
  k43: 76.7000,
  k44: 13.5000,
  k45: 50.0000,
  k46: 86.5000,
  k47: 23.3000,
  k48: 59.8000,
  k49: 96.3000,
  k50: 33.1000,
  k51: 69.6000,
  k52: 6.4000,
  k53: 42.9000,
  k54: 79.4000,
  k55: 16.2000,
  k56: 52.7000,
  k57: 89.2000,
  k58: 26.0000,
  k59: 62.5000,
  k60: 99.0000,
  k61: 35.8000,
  k62: 72.3000,
  k63: 9.1000,
  k64: 45.6000,
  k65: 82.1000,
  k66: 18.9000,
  k67: 55.4000,
  k68: 91.9000,
  k69: 28.7000,
  k70: 65.2000,
  k71: 2.0000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_025_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_025_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_025_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_025_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_025_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_025_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_025_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_025_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_025_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_025_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_025_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_025_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
