import { V1029_CRES_clamp, V1029_CRES_adaptationBandFromScore } from '../../engine/coastal-resilience-utils.ts';
import type {
  V1029CresAdaptationBand,
  V1029CresRegionId,
  V1029CresSurgeSnapshot,
  V1029CresCoastalAdaptationChannel,
} from '../../types/core.ts';

/** Generated surge scenario 132 — storm_surge/king_tide/erosion handoff matrix. */
export const V1029_CRES_SURGE_SCENARIO_132_META = {
  id: 'surge_132',
  regionId: 'SA' as V1029CresRegionId,
  primaryChannel: 'littoral_zone' as V1029CresCoastalAdaptationChannel,
  adaptationBand: 'elevated' as V1029CresAdaptationBand,
  seed: 120773,
} as const;

const V1029_CRES_SURGE_SCENARIO_132_COEF = {
  k0: 49.9000,
  k1: 63.5000,
  k2: 77.1000,
  k3: 90.7000,
  k4: 4.6000,
  k5: 18.2000,
  k6: 31.8000,
  k7: 45.4000,
  k8: 59.0000,
  k9: 72.6000,
  k10: 86.2000,
  k11: 0.1000,
  k12: 13.7000,
  k13: 27.3000,
  k14: 40.9000,
  k15: 54.5000,
  k16: 68.1000,
  k17: 81.7000,
  k18: 95.3000,
  k19: 9.2000,
  k20: 22.8000,
  k21: 36.4000,
  k22: 50.0000,
  k23: 63.6000,
  k24: 77.2000,
  k25: 90.8000,
  k26: 4.7000,
  k27: 18.3000,
  k28: 31.9000,
  k29: 45.5000,
  k30: 59.1000,
  k31: 72.7000,
  k32: 86.3000,
  k33: 0.2000,
  k34: 13.8000,
  k35: 27.4000,
  k36: 41.0000,
  k37: 54.6000,
  k38: 68.2000,
  k39: 81.8000,
  k40: 95.4000,
  k41: 9.3000,
  k42: 22.9000,
  k43: 36.5000,
  k44: 50.1000,
  k45: 63.7000,
  k46: 77.3000,
  k47: 90.9000,
  k48: 4.8000,
  k49: 18.4000,
  k50: 32.0000,
  k51: 45.6000,
  k52: 59.2000,
  k53: 72.8000,
  k54: 86.4000,
  k55: 0.3000,
  k56: 13.9000,
  k57: 27.5000,
  k58: 41.1000,
  k59: 54.7000,
  k60: 68.3000,
  k61: 81.9000,
  k62: 95.5000,
  k63: 9.4000,
  k64: 23.0000,
  k65: 36.6000,
  k66: 50.2000,
  k67: 63.8000,
  k68: 77.4000,
  k69: 91.0000,
  k70: 4.9000,
  k71: 18.5000,
} as const;

export function V1029_CRES_SURGE_SCENARIO_132_evaluate(turn: number): {
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1029_CRES_SURGE_SCENARIO_132_COEF) as Array<
    keyof typeof V1029_CRES_SURGE_SCENARIO_132_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1029_CRES_SURGE_SCENARIO_132_COEF[keys[j]] * ((turn + j) % 17);
  }
  const seaLevelExposureIndex = V1029_CRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const adaptationBufferDelayTurns = V1029_CRES_clamp(2 + (acc % 11), 1, 18);
  const adaptationScore = V1029_CRES_clamp(90 - seaLevelExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1029_CRES_adaptationBandFromScore(adaptationScore) !== 'depleted';
  return { seaLevelExposureIndex, adaptationBufferDelayTurns, adaptationScore, stable };
}

export function V1029_CRES_SURGE_SCENARIO_132_snapshot(turn: number): V1029CresSurgeSnapshot {
  const r = V1029_CRES_SURGE_SCENARIO_132_evaluate(turn);
  return {
    scenarioId: V1029_CRES_SURGE_SCENARIO_132_META.id,
    regionId: V1029_CRES_SURGE_SCENARIO_132_META.regionId,
    coastalAdaptationChannel: V1029_CRES_SURGE_SCENARIO_132_META.primaryChannel,
    adaptationBand: V1029_CRES_SURGE_SCENARIO_132_META.adaptationBand,
    seaLevelExposureIndex: r.seaLevelExposureIndex,
    adaptationBufferDelayTurns: r.adaptationBufferDelayTurns,
    adaptationScore: r.adaptationScore,
    adaptationBand: V1029_CRES_adaptationBandFromScore(r.adaptationScore),
  };
}

export function V1029_CRES_SURGE_SCENARIO_132_regressionAssert(turn: number): boolean {
  const r = V1029_CRES_SURGE_SCENARIO_132_evaluate(turn);
  return typeof r.seaLevelExposureIndex === 'number' && r.adaptationScore <= 100;
}
