import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 069 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_069_META = {
  id: 'surge_069',
  regionId: 'TAS' as V1029CresRegionId,
  primaryChannel: 'remote' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'recovering' as V1029CresAdaptationBand,
  seed: 63380,
} as const;

const V1029_CRES_SURGE_SCENARIO_069_COEF = {
  k0: 27.7000,
  k1: 84.6000,
  k2: 41.8000,
  k3: 98.7000,
  k4: 55.9000,
  k5: 13.1000,
  k6: 70.0000,
  k7: 27.2000,
  k8: 84.1000,
  k9: 41.3000,
  k10: 98.2000,
  k11: 55.4000,
  k12: 12.6000,
  k13: 69.5000,
  k14: 26.7000,
  k15: 83.6000,
  k16: 40.8000,
  k17: 97.7000,
  k18: 54.9000,
  k19: 12.1000,
  k20: 69.0000,
  k21: 26.2000,
  k22: 83.1000,
  k23: 40.3000,
  k24: 97.2000,
  k25: 54.4000,
  k26: 11.6000,
  k27: 68.5000,
  k28: 25.7000,
  k29: 82.6000,
  k30: 39.8000,
  k31: 96.7000,
  k32: 53.9000,
  k33: 11.1000,
  k34: 68.0000,
  k35: 25.2000,
  k36: 82.1000,
  k37: 39.3000,
  k38: 96.2000,
  k39: 53.4000,
  k40: 10.6000,
  k41: 67.5000,
  k42: 24.7000,
  k43: 81.6000,
  k44: 38.8000,
  k45: 95.7000,
  k46: 52.9000,
  k47: 10.1000,
  k48: 67.0000,
  k49: 24.2000,
  k50: 81.1000,
  k51: 38.3000,
  k52: 95.2000,
  k53: 52.4000,
  k54: 9.6000,
  k55: 66.5000,
  k56: 23.7000,
  k57: 80.6000,
  k58: 37.8000,
  k59: 94.7000,
  k60: 51.9000,
  k61: 9.1000,
  k62: 66.0000,
  k63: 23.2000,
  k64: 80.1000,
  k65: 37.3000,
  k66: 94.2000,
  k67: 51.4000,
  k68: 8.6000,
  k69: 65.5000,
  k70: 22.7000,
  k71: 79.6000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_069_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_069_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_069_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_069_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_069_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_069_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_069_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_069_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_069_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_069_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_069_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_069_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
