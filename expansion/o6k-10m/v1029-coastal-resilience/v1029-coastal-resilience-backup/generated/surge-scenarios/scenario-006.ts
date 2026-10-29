import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 006 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_006_META = {
  id: 'surge_006',
  regionId: 'NT' as V1029CresRegionId,
  primaryChannel: 'aged_care' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'moderate' as V1029CresAdaptationBand,
  seed: 5987,
} as const;

const V1029_CRES_SURGE_SCENARIO_006_COEF = {
  k0: 5.5000,
  k1: 6.0000,
  k2: 6.5000,
  k3: 7.0000,
  k4: 7.5000,
  k5: 8.0000,
  k6: 8.5000,
  k7: 9.0000,
  k8: 9.5000,
  k9: 10.0000,
  k10: 10.5000,
  k11: 11.0000,
  k12: 11.5000,
  k13: 12.0000,
  k14: 12.5000,
  k15: 13.0000,
  k16: 13.5000,
  k17: 14.0000,
  k18: 14.5000,
  k19: 15.0000,
  k20: 15.5000,
  k21: 16.0000,
  k22: 16.5000,
  k23: 17.0000,
  k24: 17.5000,
  k25: 18.0000,
  k26: 18.5000,
  k27: 19.0000,
  k28: 19.5000,
  k29: 20.0000,
  k30: 20.5000,
  k31: 21.0000,
  k32: 21.5000,
  k33: 22.0000,
  k34: 22.5000,
  k35: 23.0000,
  k36: 23.5000,
  k37: 24.0000,
  k38: 24.5000,
  k39: 25.0000,
  k40: 25.5000,
  k41: 26.0000,
  k42: 26.5000,
  k43: 27.0000,
  k44: 27.5000,
  k45: 28.0000,
  k46: 28.5000,
  k47: 29.0000,
  k48: 29.5000,
  k49: 30.0000,
  k50: 30.5000,
  k51: 31.0000,
  k52: 31.5000,
  k53: 32.0000,
  k54: 32.5000,
  k55: 33.0000,
  k56: 33.5000,
  k57: 34.0000,
  k58: 34.5000,
  k59: 35.0000,
  k60: 35.5000,
  k61: 36.0000,
  k62: 36.5000,
  k63: 37.0000,
  k64: 37.5000,
  k65: 38.0000,
  k66: 38.5000,
  k67: 39.0000,
  k68: 39.5000,
  k69: 40.0000,
  k70: 40.5000,
  k71: 41.0000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_006_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_006_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_006_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_006_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_006_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_006_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_006_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_006_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_006_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_006_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_006_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_006_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
